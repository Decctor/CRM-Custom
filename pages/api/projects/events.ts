import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import { ProjectActivity, ProjectNote } from "@/utils/models";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

type PostResponse = {
  data: ProjectActivity | ProjectNote;
  message: string;
};

const eventSchema = z.union([
  z.object({
    projetoId: z.string({
      required_error: "ID de projeto não fornecido.",
      invalid_type_error: "Formato do ID do projeto inválido.",
    }),
    titulo: z
      .string({ required_error: "Por favor, forneça o título da atividade." })
      .min(5, "Por favor, dê um título de ao menos 5 letras à atividade."),
    categoria: z.literal("ATIVIDADE"),
    tipo: z.union(
      [z.literal("LIGAÇÃO"), z.literal("REUNIÃO"), z.literal("VISITA TÉCNICA")],
      {
        required_error: "Por favor, forneça o tipo da atividade.",
        invalid_type_error: "Tipo de atividade não válido.",
      }
    ),
    dataVencimento: z
      .string({
        required_error: "Por favor, forneça a data de vencimento da atividade.",
      })
      .datetime({ message: "Data de vencimento contém formato não válido." }),
    observacoes: z.string(),
    responsavelId: z.string({
      required_error: "ID do responsável não presente.",
    }),
  }),
  z.object({
    projetoId: z.string({
      required_error: "ID de projeto não fornecido.",
      invalid_type_error: "Formato do ID do projeto inválido.",
    }),
    categoria: z.literal("ANOTAÇÃO"),
    anotacao: z.string({
      required_error:
        "Por favor, preencha uma anotação ou atualização acerca do projeto.",
      invalid_type_error: "Formato da anotação não válido.",
    }),
    responsavelId: z.string({
      required_error: "ID do responsável não presente.",
    }),
  }),
]);

const createEvent: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projectsEvents");
  const event = eventSchema.parse(req.body);
  let dbRes = await collection.insertOne({
    ...event,
    dataInsercao: new Date().toISOString(),
  });
  const message = {
    ANOTAÇÃO: "Anotação criada com sucesso.",
    ATIVIDADE: "Atividade criada com sucesso.",
  };
  res.status(201).json({
    data: { ...event, dataInsercao: new Date().toISOString() },
    message: message[event.categoria],
  });
};

type GetResponse = {
  data: (ProjectActivity | ProjectNote)[];
};
const getEvents: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    throw "ID de projeto inválido.";
  }
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projectsEvents");
  const events = await collection
    .find({ projetoId: id })
    .sort({ dataInsercao: -1 })
    .toArray();
  res.status(200).json({ data: events });
};

type PutResponse = {
  data: string;
};
const eventEditSchema = z.union([
  z.object({
    projetoId: z
      .string({
        required_error: "ID de projeto não fornecido.",
        invalid_type_error: "Formato do ID do projeto inválido.",
      })
      .optional(),
    titulo: z
      .string({ required_error: "Por favor, forneça o título da atividade." })
      .min(5, "Por favor, dê um título de ao menos 5 letras à atividade.")
      .optional(),
    categoria: z.literal("ATIVIDADE").optional(),
    tipo: z
      .union(
        [
          z.literal("LIGAÇÃO"),
          z.literal("REUNIÃO"),
          z.literal("VISITA TÉCNICA"),
        ],
        {
          required_error: "Por favor, forneça o tipo da atividade.",
          invalid_type_error: "Tipo de atividade não válido.",
        }
      )
      .optional(),
    dataVencimento: z
      .string({
        required_error: "Por favor, forneça a data de vencimento da atividade.",
      })
      .datetime({ message: "Data de vencimento contém formato não válido." })
      .optional(),
    dataConclusao: z.string().nullable(),
    observacoes: z.string().optional(),
    responsavelId: z
      .string({
        required_error: "ID do responsável não presente.",
      })
      .nullable()
      .optional(),
  }),
  z.object({
    projetoId: z
      .string({
        required_error: "ID de projeto não fornecido.",
        invalid_type_error: "Formato do ID do projeto inválido.",
      })
      .optional(),
    categoria: z.literal("ANOTAÇÃO").optional(),
    anotacao: z
      .string({
        required_error:
          "Por favor, preencha uma anotação ou atualização acerca do projeto.",
        invalid_type_error: "Formato da anotação não válido.",
      })
      .optional(),
    responsavelId: z
      .string({
        required_error: "ID do responsável não presente.",
      })
      .optional(),
  }),
]);
const updateEvent: NextApiHandler<PutResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { id } = req.query;
  const changes = eventEditSchema.parse(req.body);
  console.log(changes);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projectsEvents");
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
    res.status(201).json({ data: "Alteração realizar com sucesso!" });
  } else {
    throw "Tipo de ID inválido.";
  }
};
export default apiHandler({
  POST: createEvent,
  GET: getEvents,
  PUT: updateEvent,
});
