import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import { creditors } from "@/utils/constants";
import { formatUpdateSetObject } from "@/utils/methods";
import { IProject } from "@/utils/models";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

type PostResponse = {
  data: IProject;
  message: string;
};

const projectSchema = z.object({
  nome: z
    .string({
      required_error:
        "Por favor, preencha o nome para identificação do projeto.",
    })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." }),
  responsavel: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: "Por favor, especifique o responsável." }
  ),
  representante: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: "Por favor, especifique o representante." }
  ),
  clienteId: z.string({
    required_error: "Por favor, especifique o ID do cliente.",
  }),
  descricao: z.string().optional(),
  funis: z.array(z.object({ id: z.number(), etapaId: z.number() }), {
    required_error: "Por favor, vincule um funil a esse projeto.",
  }),
});

const createProject: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthorization(req, "projetos", "serResponsavel", true);

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projects");
  const project = projectSchema.parse(req.body);

  const lastInsertedIdentificator = await collection
    .aggregate([
      {
        $project: {
          identificador: 1,
        },
      },
      {
        $sort: {
          identificador: -1,
        },
      },
      {
        $limit: 1,
      },
    ])
    .toArray();

  const identificador = lastInsertedIdentificator[0]
    ? lastInsertedIdentificator[0].identificador + 1
    : 1;

  let dbRes = await collection.insertOne({
    ...project,
    identificador: identificador,
    dataInsercao: new Date().toISOString(),
  });
  res.status(201).json({
    data: {
      ...project,
      identificador: identificador,
      dataInsercao: new Date().toISOString(),
    },
    message: "Projeto criado com sucesso.",
  });
};

type GetResponse = {
  data: IProject[] | IProject;
};

const getProjects: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projects");
  const { id, responsible, funnel, after, before } = req.query;
  if (id && typeof id === "string") {
    const project = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $addFields: {
            objectId: { $toObjectId: "$clienteId" },
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "objectId",
            foreignField: "_id",
            as: "cliente",
          },
        },
      ])
      .toArray();
    if (project.length == 0)
      throw new createHttpError.BadRequest("ID de projeto inválido.");
    const formattedObj = { ...project[0], cliente: project[0].cliente[0] };
    res.status(200).json({ data: formattedObj });
  } else {
    var queryParam = {};
    if (typeof responsible != "string") throw "ID de responsável inválido.";
    if (funnel != "null" && responsible != "null") {
      queryParam = {
        "responsavel.id": responsible,
        "funis.id": Number(funnel),
      };
    }
    if (funnel != "null" && responsible == "null") {
      queryParam = {
        "funis.id": Number(funnel),
      };
    }
    if (funnel == "null" && responsible != "null") {
      queryParam = {
        "responsavel.id": responsible,
      };
    }
    if (after != "undefined" && before != "undefined") {
      queryParam = {
        ...queryParam,
        $and: [
          {
            dataInsercao: {
              $gte: after,
            },
          },
          { dataInsercao: { $lte: before } },
        ],
      };
    }
    const projects = await collection
      .aggregate([
        {
          $match: { ...queryParam },
        },
        {
          $addFields: {
            objectId: { $toObjectId: "$clienteId" },
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "objectId",
            foreignField: "_id",
            as: "cliente",
          },
        },
      ])
      .toArray();
    res.status(200).json({ data: projects });
  }
};

type PutResponse = {
  data: IProject;
  message: string;
};
const editProjectSchema = z.object({
  nome: z
    .string({
      required_error:
        "Por favor, preencha o nome para identificação do projeto.",
    })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." })
    .optional(),
  responsavel: z
    .object(
      {
        nome: z.string(),
        id: z.string(),
      },
      { required_error: "Por favor, especifique o responsável." }
    )
    .optional(),
  representante: z
    .object(
      {
        nome: z.string(),
        id: z.string(),
      },
      { required_error: "Por favor, especifique o representante." }
    )
    .optional(),
  clienteId: z
    .string({
      required_error: "Por favor, especifique o ID do cliente.",
    })
    .optional(),
  propostaAtiva: z.string().optional(),
  titularInstalacao: z.string().optional(),
  numeroInstalacaoConcessionaria: z.string().optional(),
  tipoTitular: z
    .union([z.literal("PESSOA FISICA"), z.literal("PESSOA JURIDICA")])
    .optional(),
  tipoLigacao: z.union([z.literal("EXISTENTE"), z.literal("NOVA")]).optional(),
  tipoInstalacao: z.union([z.literal("URBANO"), z.literal("RURAL")]).optional(),
  credor: z.string().optional(),
  servicosAdicionais: z
    .object({
      padrao: z.number().optional().nullable(),
      outros: z.number().optional().nullable(),
    })
    .optional(),
  anexos: z
    .object({
      documentoComFoto: z.string().optional().nullable(),
      iptu: z.string().optional().nullable(),
      contaDeEnergia: z.string().optional().nullable(),
    })
    .optional(),
  descricao: z.string().optional(),
  funis: z
    .array(z.object({ id: z.number(), etapaId: z.number() }), {
      required_error: "Por favor, vincule um funil a esse projeto.",
    })
    .optional(),
});
const editProjects: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(
    req,
    "projetos",
    "serResponsavel",
    true
  );

  const { id, responsavel } = req.query;

  if (
    !session.user.permissoes.projetos.editar &&
    responsavel != session.user.id
  ) {
    throw new createHttpError.Unauthorized(
      "Somente o responsável ou administradores podem alterar esse cliente."
    );
  }
  if (!id && typeof id !== "string")
    throw new createHttpError.BadRequest(
      "ID do objeto de alteração não especificado."
    );
  if (!req.body.changes)
    throw new createHttpError.BadRequest(
      "Mudanças não especificadas na requisição."
    );
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projects");

  const changes = editProjectSchema.parse(req.body.changes);
  // var setObj: any = {};
  // console.log(changes);
  // Object.entries(changes).forEach((entry) => {
  //   if (typeof entry[1] == "object") {
  //     console.log("PELO IF");
  //     const tag = entry[0];
  //     // Object.keys(entry[1]).forEach((x) => {
  //     //   console.log(`${tag}.${x}`);
  //     // });
  //     Object.entries(entry[1]).forEach((insideEntry) => {
  //       console.log({ [`${tag}.${insideEntry[0]}`]: insideEntry[1] });
  //       setObj[`${tag}.${insideEntry[0]}`] = insideEntry[1];
  //     });
  //   } else {
  //     console.log("PELO ELSE");
  //     const tag = entry[0];
  //     console.log(tag);
  //   }
  // });

  const setObj = formatUpdateSetObject(changes);

  if (typeof id === "string") {
    const data = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { ...setObj },
      },
      {
        returnNewDocument: true,
      }
    );
    // console.log(data.value);
    res
      .status(201)
      .json({ data: data.value, message: "Projeto alterado com sucesso." });
  }
};
export default apiHandler({
  POST: createProject,
  GET: getProjects,
  PUT: editProjects,
});
