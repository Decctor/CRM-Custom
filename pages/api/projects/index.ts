import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import { IProject } from "@/utils/models";
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
    dataInsercao: new Date(),
  });
  res.status(201).json({
    data: {
      ...project,
      identificador: identificador,
      dataInsercao: new Date(),
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
  const { id, responsible, funnel } = req.query;
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
    res.status(200).json({ data: project[0] });
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
export default apiHandler({
  POST: createProject,
  GET: getProjects,
});
