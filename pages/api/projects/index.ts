import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
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
    ? lastInsertedIdentificator[0].identificador
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
  console.log(req.query);
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
    const formattedObj = { ...project[0], cliente: project[0].cliente[0] };
    res.status(200).json({ data: formattedObj });
  } else {
    console.log;
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
    console.log("QUERY PARAM", queryParam);
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
  titularInstalacao: z.string().optional(),
  tipoTitular: z
    .union([z.literal("PESSOA FISICA"), z.literal("PESSOA JURIDICA")])
    .optional(),
  tipoLigacao: z.union([z.literal("EXISTENTE"), z.literal("NOVA")]).optional(),
  tipoInstalacao: z.union([z.literal("URBANO"), z.literal("RURAL")]).optional(),
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
  console.log(changes);
  if (typeof id === "string") {
    const data = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { ...changes },
      },
      {
        returnNewDocument: true,
      }
    );
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
