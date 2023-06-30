import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import { IKit } from "@/utils/models";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { number, z } from "zod";

type PostResponse = {
  data: IKit;
  message: string;
};

const kitSchema = z.object({
  nome: z
    .string({ required_error: "Por favor, preencha o nome do kit." })
    .min(5, "Por favor, preencha um nome de ao menos 5 letras."),
  categoria: z.union(
    [z.literal("ON-GRID"), z.literal("OFF-GRID"), z.literal("BOMBA SOLAR")],
    {
      required_error: "Por favor, preencha a categoria do kit.",
      invalid_type_error: "Por favor, preencha um categoria válida.",
    }
  ),
  tipo: z.union([z.literal("TRADICIONAL"), z.literal("PROMOCIONAL")], {
    required_error: "Por favor, preencha a categoria do kit.",
    invalid_type_error: "Por favor, preencha um categoria válida.",
  }),
  topologia: z.union([z.literal("INVERSOR"), z.literal("MICRO-INVERSOR")], {
    required_error: "Por favor, preencha a topologia.",
    invalid_type_error: "Por favor, preencha uma topologia válida.",
  }),
  preco: z
    .number({ required_error: "Por favor, preencha o preço do kit." })
    .min(0, "O preço do kit deve ser maior do que 0."),
  ativo: z.boolean({
    required_error: "Por favor, preencha o status de ativação do kit.",
  }),
  fornecedor: z.string({
    required_error: "Por favor, preencha um fornecedor.",
    invalid_type_error: "Por favor, preencha um fornecedor válido.",
  }),
  estruturasCompativeis: z.array(z.string(), {
    required_error: "Por favor, preencha as estruturas compatíveis.",
    invalid_type_error: "Por favor, preencha as estruturas compatíveis.",
  }),
  incluiEstrutura: z.boolean({
    required_error: "Preencha sobre a inclusão de estrutura no kit.",
  }),
  incluiTransformador: z.boolean({
    required_error: "Preencha sobre a inclusão de transformador no kit.",
  }),
  inversores: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        fabricante: z.string(),
        modelo: z.string(),
        qtde: z.number(),
      })
    )
    .min(1, "Por favor, adicione ao menos um inversor."),
  modulos: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        fabricante: z.string(),
        modelo: z.string(),
        qtde: z.number(),
        potencia: z.number(),
      })
    )
    .min(1, "Por favor, adicione ao menos um módulo."),
});

const createKit: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthorization(req, "kits", "editar", true);

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("kits");
  console.log(req.body);
  const kit = kitSchema.parse(req.body);
  const dbRes = await collection.insertOne({
    ...kit,
    dataInsercao: new Date().toISOString(),
  });
  res.status(201).json({
    data: kit,
    message: "Kit adicionado com sucesso.",
  });
};

type GetResponse = {
  data: IKit[] | IKit;
};
const getKits: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthorization(req, "kits", "visualizar", true);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("kits");
  const { id, active } = req.query;
  const editKitsPermisson = session.user.permissoes.kits.editar;
  if (id && typeof id === "string") {
    const kit = await collection.findOne({ _id: new ObjectId(id) });
    res.status(200).json({ data: kit });
    return;
  }
  if (active == "true" || !editKitsPermisson) {
    const kits = await collection
      .aggregate([
        {
          $match: {
            ativo: true,
          },
        },
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $sort: {
            preco: -1,
          },
        },
      ])
      .toArray();
    res.status(200).json({ data: kits });
    return;
  } else {
    const kits = await collection
      .aggregate([
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $sort: {
            dataInsercao: -1,
          },
        },
      ])
      .toArray();
    res.status(200).json({ data: kits });
  }
};
type PutResponse = {
  data: string;
};
const updateKitSchema = z.object({
  nome: z
    .string({ required_error: "Por favor, preencha o nome do kit." })
    .min(5, "Por favor, preencha um nome de ao menos 5 letras.")
    .optional(),
  categoria: z
    .union(
      [z.literal("ON-GRID"), z.literal("OFF-GRID"), z.literal("BOMBA SOLAR")],
      {
        required_error: "Por favor, preencha a categoria do kit.",
        invalid_type_error: "Por favor, preencha um categoria válida.",
      }
    )
    .optional(),
  tipo: z
    .union([z.literal("TRADICIONAL"), z.literal("PROMOCIONAL")], {
      required_error: "Por favor, preencha a categoria do kit.",
      invalid_type_error: "Por favor, preencha um categoria válida.",
    })
    .optional(),
  topologia: z
    .union([z.literal("INVERSOR"), z.literal("MICRO-INVERSOR")], {
      required_error: "Por favor, preencha a topologia.",
      invalid_type_error: "Por favor, preencha uma topologia válida.",
    })
    .optional(),
  preco: z
    .number({ required_error: "Por favor, preencha o preço do kit." })
    .min(0, "O preço do kit deve ser maior do que 0.")
    .optional(),
  ativo: z
    .boolean({
      required_error: "Por favor, preencha o status de ativação do kit.",
    })
    .optional(),
  fornecedor: z
    .string({
      required_error: "Por favor, preencha um fornecedor.",
      invalid_type_error: "Por favor, preencha um fornecedor válido.",
    })
    .optional(),
  estruturasCompativeis: z
    .array(z.string(), {
      required_error: "Por favor, preencha as estruturas compatíveis.",
      invalid_type_error: "Por favor, preencha as estruturas compatíveis.",
    })
    .optional(),
  incluiEstrutura: z
    .boolean({
      required_error: "Preencha sobre a inclusão de estrutura no kit.",
    })
    .optional(),
  incluiTransformador: z
    .boolean({
      required_error: "Preencha sobre a inclusão de transformador no kit.",
    })
    .optional(),
  inversores: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        fabricante: z.string(),
        modelo: z.string(),
        qtde: z.number(),
      })
    )
    .min(1, "Por favor, adicione ao menos um inversor.")
    .optional(),
  modulos: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        fabricante: z.string(),
        modelo: z.string(),
        qtde: z.number(),
        potencia: z.number(),
      })
    )
    .min(1, "Por favor, adicione ao menos um módulo.")
    .optional(),
});
const updateKit: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(req, "kits", "editar", true);
  const { id } = req.query;
  if (typeof id != "string")
    throw new createHttpError.BadRequest("ID inválido.");

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("kits");
  const changes = updateKitSchema.parse(req.body);
  console.log(changes);
  const data = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    {
      $set: { ...changes },
    }
  );
  res.status(201).json({ data: "Kit atualizado com sucesso." });
};
export default apiHandler({
  POST: createKit,
  GET: getKits,
  PUT: updateKit,
});
