import connectToDatabase from "@/services/mongoclient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import { IProposeInfo } from "@/utils/models";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

type PostResponse = {
  data: IProposeInfo;
  message: string;
};

const proposeSchema = z.object({
  nome: z.string({
    required_error: "Por favor, preencha o nome da proposta",
    invalid_type_error: "Nome da proposta em formato inválido.",
  }),
  template: z.literal("TEMPLATE SIMPLES", {
    required_error: "Por favor, forneça o template da proposta.",
  }),
  projeto: z.object({
    nome: z.string({ required_error: "Por favor, forneça o nome do projeto." }),
    id: z.string({ required_error: "Por favor, preencha o id do projeto." }),
  }),
  premissas: z.object({
    consumoEnergiaMensal: z.number({
      required_error:
        "Por favor, forneça o valor de consumo mensal do cliente em kWh.",
    }),
    tarifaEnergia: z.number({
      required_error: "Por favor, forneça o valor da tarifa de energia.",
    }),
    tarifaTUSD: z.number({
      required_error: "Por favor, forneça o valor da tarifa TUSD de energia.",
    }),
    tensaoRede: z.union(
      [z.literal("127/220V"), z.literal("220/380V"), z.literal("277/480V")],
      {
        required_error: "Por favor, forneça a tensão de rede do cliente.",
        invalid_type_error: "Tipo inválido para tensão de rede.",
      }
    ),
    fase: z.union(
      [z.literal("Monofásico"), z.literal("Bifásico"), z.literal("Trifásico")],
      {
        required_error: "Por favor, forneça o tipo de ligação do cliente.",
        invalid_type_error: "Tipo inválido para ligação de rede.",
      }
    ),
    fatorSimultaneidade: z
      .number()
      .min(0, "Por favor, preencha um fator de simultaneidade de no mínimo.")
      .max(
        100,
        "Por favor, preencha um valor de no máximo 100 para o fator de simultaneidade."
      ),
    tipoEstrutura: z.string({
      required_error: "Por favor, preencha o tipo de estrutura.",
    }),
    distancia: z.number({
      required_error:
        "Por favor, preencha a distância até da matriz (Ituiutaba) até o local de instalação do cliente.",
    }),
  }),
  kit: z.object({
    kitId: z.string({ required_error: "Por favor, forneça o ID do kit." }),
    nome: z.string({ required_error: "Por favor, forneça o nome do kit." }),
    topologia: z.string({
      required_error: "Por vaor, forneça a topologia do kit.",
    }),
    modulos: z.array(
      z.object({
        id: z.union([z.string(), z.number()], {
          required_error: "ID de um dos módulos faltando, contate o Volts.",
        }),
        fabricante: z.string({
          required_error:
            "Fabricante de um dos módulos faltando, contate o Volts.",
        }),
        modelo: z.string({
          required_error: "Modelo de um dos módulos faltando, contate o Volts.",
        }),
        qtde: z.number({
          required_error:
            "Quantidade de um dos módulos faltando, contate o Volts.",
        }),
        potencia: z.number({
          required_error:
            "Potência de um dos módulos faltando, contate o Volts.",
        }),
      })
    ),
    inversores: z.array(
      z.object({
        id: z.union([z.string(), z.number()], {
          required_error: "ID de um dos inversores faltando, contate o Volts.",
        }),
        fabricante: z.string({
          required_error:
            "Fabricante de um dos inversores faltando, contate o Volts.",
        }),
        modelo: z.string({
          required_error:
            "Modelo de um dos inversores faltando, contate o Volts.",
        }),
        qtde: z.number({
          required_error:
            "Quantidade de um dos inversores faltando, contate o Volts.",
        }),
      })
    ),
    preco: z.number({
      required_error: "Preço do kit faltando, por favor, contate o Volts.",
    }),
  }),
  precificacao: z.object({
    instalacao: z.object({
      custo: z.number(),
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    maoDeObra: z.object({
      custo: z.number(),
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    projeto: z.object({
      custo: z.number(),
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    venda: z.object({
      custo: z.number(),
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
  }),
  potenciaPico: z.number({
    required_error: "Por favor, forneça a potência pico da proposta.",
  }),
  valorProposta: z.number({
    required_error: "Por favor, forneça o valor do proposta.",
  }),
});

const createPropose: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("proposes");
  const propose = proposeSchema.parse(req.body);
  console.log(propose);
  const dbRes = await collection.insertOne({
    ...propose,
    dataInsercao: new Date().toISOString(),
  });
  console.log(dbRes);
  res.status(201).json({
    data: {
      ...propose,
      dataInsercao: new Date().toISOString(),
      _id: dbRes.insertedId,
    },
    message: "Proposta criada com sucesso.",
  });
};
type GetResponse = {
  data: IProposeInfo[];
};
const getProposes: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { projectId } = req.query;
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("proposes");
  console.log(projectId);
  if (typeof projectId === "string") {
    const proposes = await collection
      .aggregate([
        {
          $match: {
            "projeto.id": projectId,
          },
        },
        {
          $sort: {
            dataInsercao: -1,
          },
        },
      ])
      .toArray();
    // console.log(proposes);
    res.status(200).json(proposes);
  } else {
    throw "ID inválido.";
  }
};
export default apiHandler({
  GET: getProposes,
  POST: createPropose,
});
