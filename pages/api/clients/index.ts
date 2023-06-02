import { NextApiHandler } from "next";
import { IClient } from "../../../utils/models";
import { z } from "zod";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import connectToDatabase from "@/services/mongoclient";
import { ObjectId } from "mongodb";
import createHttpError from "http-errors";
type PostResponse = {
  data: IClient;
  message: string;
};

const clientSchema = z.object({
  representante: z.object(
    {
      id: z.string(),
      nome: z.string(),
    },
    {
      required_error: "Por favor, especifique o representante.",
      invalid_type_error: "Por favor, especifique o representante.",
    }
  ),
  nome: z
    .string({ required_error: "Por favor, preencha o nome do cliente." })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." }),
  cpfCnpj: z.string({
    required_error: "Por favor, preencha o CPF ou CNPJ do cliente.",
  }),
  telefonePrimario: z.string({
    required_error: "Por favor, preencha o telefone do cliente.",
  }),
  telefoneSecundario: z.string().optional(),
  email: z.string({
    required_error: "Por favor, preencha o email do cliente.",
  }),

  cep: z.string({ required_error: "Por favor, preencha o CEP do cliente." }),
  bairro: z.string({
    required_error: "Por favor, preencha o bairro do cliente.",
  }),
  endereco: z.string({
    required_error: "Por favor, preencha o endereço do cliente.",
  }),
  numeroOuIdentificador: z.string({
    required_error:
      "Por favor, preencha o número ou código que identifique a residência.",
  }),
  complemento: z.string().optional(),
  uf: z.union([z.literal("MG"), z.literal("GO"), z.null()]),
  cidade: z.string({
    required_error: "Por favor, preencha a cidade do cliente.",
  }),
});

const createClient: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthorization(req, "clientes", "serRepresentante", true);
  const client = clientSchema.parse(req.body);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("clients");
  let dbRes = await collection.insertOne({
    ...client,
    dataInsercao: new Date().toISOString(),
  });

  res.status(201).json({
    data: { ...client, _id: dbRes.insertedId },
    message: "Cliente criado com sucesso.",
  });
};

type GetResponse = {
  data: IClient[] | IClient;
};

const getClients: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("clients");
  const { id, representative } = req.query;

  if (id && typeof id === "string") {
    const client = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $addFields: {
            stringId: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "stringId",
            foreignField: "clienteId",
            as: "projetos",
          },
        },
      ])
      .toArray();
    res.status(200).json({ data: client[0] });
  } else {
    var queryParam = {};
    if (typeof representative != "string")
      throw "ID de representante inválido.";
    if (representative != "null") {
      queryParam = {
        "representante.id": representative,
      };
    }
    const clients = await collection
      .aggregate([{ $match: { ...queryParam } }])
      .toArray();
    res.status(200).json({ data: clients });
  }
};

type PutResponse = {
  data: IClient;
  message: string;
};
const editClientSchema = z.object({
  representante: z
    .object(
      {
        id: z.string(),
        nome: z.string(),
      },
      {
        required_error: "Por favor, especifique o representante.",
        invalid_type_error: "Por favor, especifique o representante.",
      }
    )
    .optional(),
  nome: z
    .string({ required_error: "Por favor, preencha o nome do cliente." })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." })
    .optional(),
  cpfCnpj: z
    .string({
      required_error: "Por favor, preencha o CPF ou CNPJ do cliente.",
    })
    .optional(),
  telefonePrimario: z
    .string({
      required_error: "Por favor, preencha o telefone do cliente.",
    })
    .optional(),
  telefoneSecundario: z.string().optional(),
  email: z
    .string({ required_error: "Por favor, preencha o email do cliente." })
    .email({ message: "Por favor, preencha um email válido." })
    .optional(),
  cep: z
    .string({ required_error: "Por favor, preencha o CEP do cliente." })
    .optional(),
  bairro: z
    .string({
      required_error: "Por favor, preencha o bairro do cliente.",
    })
    .optional(),
  endereco: z
    .string({
      required_error: "Por favor, preencha o endereço do cliente.",
    })
    .optional(),
  numeroOuIdentificador: z
    .string({
      required_error:
        "Por favor, preencha o número ou código que identifique a residência.",
    })
    .optional(),
  complemento: z.string().optional(),
  uf: z.union([z.literal("MG"), z.literal("GO"), z.null()]).optional(),
  cidade: z
    .string({ required_error: "Por favor, preencha a cidade do cliente." })
    .optional(),
  dataNascimento: z.string().optional(),
  rg: z.string().optional(),
  estadoCivil: z.string().optional(),
  profissao: z.string().optional(),
  ondeTrabalha: z.string().optional(),
  canalVenda: z.string().optional(),
});

const editClients: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(
    req,
    "clientes",
    "serRepresentante",
    true
  );
  // if(session.user.id)
  const { id, representative } = req.query;
  if (
    !session.user.permissoes.clientes.editar &&
    representative != session.user.id
  ) {
    throw new createHttpError.Unauthorized(
      "Somente o representante ou administradores podem alterar esse cliente."
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
  const collection = db.collection("clients");
  const changes = editClientSchema.parse(req.body.changes);

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
      .json({ data: data.value, message: "Cliente alterado com sucesso." });
  }
};
export default apiHandler({
  POST: createClient,
  GET: getClients,
  PUT: editClients,
});
