import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import { IProposeInfo, IProposeOeMInfo } from "@/utils/models";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";

type PostResponse = {
  data: IProposeInfo | IProposeOeMInfo;
  message: string;
};

const proposeSchema = z.union([
  z.object({
    nome: z.string({
      required_error: "Por favor, preencha o nome da proposta",
      invalid_type_error: "Nome da proposta em formato inválido.",
    }),
    template: z.union([
      z.literal("TEMPLATE SIMPLES", {
        required_error: "Por favor, forneça o template da proposta.",
      }),
      z.literal("TEMPLATE O&M", {
        required_error: "Por favor, forneça o template da proposta.",
      }),
      z.literal("TEMPLATE PARCEIRA BYD", {
        required_error: "Por favor, forneça o template da proposta.",
      }),
    ]),
    projeto: z.object({
      nome: z.string({
        required_error: "Por favor, forneça o nome do projeto.",
      }),
      id: z.string({ required_error: "Por favor, preencha o id do projeto." }),
    }),
    premissas: z.object({
      consumoEnergiaMensal: z.number({
        required_error:
          "Por favor, forneça o valor de consumo mensal do cliente em kWh.",
      }),
      distribuidora: z.union(
        [z.literal("CEMIG D"), z.literal("EQUATORIAL GO")],
        {
          required_error: "Por favor, forneça a distribuidora do cliente.",
          invalid_type_error: "Tipo inválido para distribuidora de rede.",
        }
      ),
      subgrupo: z.union(
        [z.literal("RESIDENCIAL"), z.literal("COMERCIAL"), z.literal("RURAL")],
        {
          required_error: "Por favor, forneça a distribuidora do cliente.",
          invalid_type_error: "Tipo inválido para distribuidora de rede.",
        }
      ),
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
        [
          z.literal("Monofásico"),
          z.literal("Bifásico"),
          z.literal("Trifásico"),
        ],
        {
          required_error: "Por favor, forneça o tipo de ligação do cliente.",
          invalid_type_error: "Tipo inválido para ligação de rede.",
        }
      ),
      fatorSimultaneidade: z
        .number({
          required_error: "Por favor, preencha o fator de simultaneidade.",
        })
        .min(0, "Por favor, preencha um fator de simultaneidade de no mínimo.")
        .max(
          100,
          "Por favor, preencha um valor de no máximo 100 para o fator de simultaneidade."
        ),
      tipoEstrutura: z.union(
        [
          z.literal("Carport"),
          z.literal("Cerâmico"),
          z.literal("Fibrocimento"),
          z.literal("Laje"),
          z.literal("Metálico"),
          z.literal("Zipado"),
          z.literal("Solo"),
          z.literal("Sem estrutura"),
        ],
        {
          required_error: "Por favor, preencha o tipo de estrutura.",
          invalid_type_error: "Tipo inválido de estrutura",
        }
      ),
      distancia: z.number({
        required_error:
          "Por favor, preencha a distância até da matriz (Ituiutaba) até o local de instalação do cliente.",
      }),
      orientacao: z.string({
        required_error: "Por favor, preencha a orientação..",
      }),
    }),
    kit: z.object({
      kitId: z.string({ required_error: "Por favor, forneça o ID do kit." }),
      nome: z.string({ required_error: "Por favor, forneça o nome do kit." }),
      topologia: z.string({
        required_error: "Por favor, forneça a topologia do kit.",
      }),
      tipo: z
        .union([z.literal("TRADICIONAL"), z.literal("PROMOCIONAL")], {
          required_error: "Por favor, preencha o tipo do kit.",
          invalid_type_error: "Tipo inválido do kit.",
        })
        .optional(),
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
            required_error:
              "Modelo de um dos módulos faltando, contate o Volts.",
          }),
          qtde: z.number({
            required_error:
              "Quantidade de um dos módulos faltando, contate o Volts.",
          }),
          potencia: z.number({
            required_error:
              "Potência de um dos módulos faltando, contate o Volts.",
          }),
          garantia: z
            .number({
              required_error:
                "Garantia de um dos módulos faltando, contate o Volts.",
            })
            .optional(),
        })
      ),
      inversores: z.array(
        z.object({
          id: z.union([z.string(), z.number()], {
            required_error:
              "ID de um dos inversores faltando, contate o Volts.",
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
          garantia: z
            .number({
              required_error:
                "Garantia de um dos inversores faltando, contate o Volts.",
            })
            .optional(),
          potenciaNominal: z.number({
            required_error:
              "Potência nominal de um dos inversores faltando, contate o Volts.",
          }),
        })
      ),
      fornecedor: z.string({
        required_error:
          "Fornecedor do kit faltando, por favor, contate o Volts.",
      }),
      preco: z.number({
        required_error: "Preço do kit faltando, por favor, contate o Volts.",
      }),
    }),
    precificacao: z.object({
      kit: z.object({
        margemLucro: z.number(),
        imposto: z.number(),
        custo: z.number(),
        vendaProposto: z.number(),
        vendaFinal: z.number(),
      }),
      instalacao: z
        .object({
          margemLucro: z.number(),
          imposto: z.number(),
          custo: z.number(),
          vendaProposto: z.number(),
          vendaFinal: z.number(),
        })
        .optional(),
      maoDeObra: z
        .object({
          margemLucro: z.number(),
          imposto: z.number(),
          custo: z.number(),
          vendaProposto: z.number(),
          vendaFinal: z.number(),
        })
        .optional(),
      projeto: z
        .object({
          margemLucro: z.number(),
          imposto: z.number(),
          custo: z.number(),
          vendaProposto: z.number(),
          vendaFinal: z.number(),
        })
        .optional(),
      venda: z
        .object({
          margemLucro: z.number(),
          imposto: z.number(),
          custo: z.number(),
          vendaProposto: z.number(),
          vendaFinal: z.number(),
        })
        .optional(),
      padrao: z
        .object({
          margemLucro: z.number(),
          imposto: z.number(),
          custo: z.number(),
          vendaProposto: z.number(),
          vendaFinal: z.number(),
        })
        .optional(),
      estrutura: z
        .object({
          margemLucro: z.number(),
          imposto: z.number(),
          custo: z.number(),
          vendaProposto: z.number(),
          vendaFinal: z.number(),
        })
        .optional(),
      extra: z
        .object({
          margemLucro: z.number(),
          imposto: z.number(),
          custo: z.number(),
          vendaProposto: z.number(),
          vendaFinal: z.number(),
        })
        .optional(),
    }),
    linkArquivo: z.string().optional(),
    potenciaPico: z.number({
      required_error: "Por favor, forneça a potência pico da proposta.",
    }),
    valorProposta: z.number({
      required_error: "Por favor, forneça o valor do proposta.",
    }),
  }),
  z.object({
    nome: z.string({
      required_error: "Por favor, preencha o nome da proposta",
      invalid_type_error: "Nome da proposta em formato inválido.",
    }),
    template: z.union([
      z.literal("TEMPLATE SIMPLES", {
        required_error: "Por favor, forneça o template da proposta.",
      }),
      z.literal("TEMPLATE O&M", {
        required_error: "Por favor, forneça o template da proposta.",
      }),
      z.literal("TEMPLATE PARCEIRA BYD", {
        required_error: "Por favor, forneça o template da proposta.",
      }),
    ]),
    projeto: z.object({
      nome: z.string({
        required_error: "Por favor, forneça o nome do projeto.",
      }),
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
      distancia: z.number({
        required_error: "Por favor, forneça a distância até o projeto.",
      }),
      qtdeModulos: z.number({
        required_error: "Por favor, forneça a quantidade de módulos.",
      }),
      potModulos: z.number({
        required_error: "Por favor, forneça a potência dos módulos.",
      }),
      eficienciaAtual: z.number({
        required_error: "Por favor, forneça a eficiência atual do sistema.",
      }),
    }),
    precificacao: z.object({
      manutencaoSimples: z.object({
        vendaProposto: z.number(),
        vendaFinal: z.number(),
      }),
      planoSol: z.object({
        vendaProposto: z.number(),
        vendaFinal: z.number(),
      }),
      planoSolPlus: z.object({
        vendaProposto: z.number(),
        vendaFinal: z.number(),
      }),
    }),
    linkArquivo: z.string().optional(),
    potenciaPico: z.number({
      required_error: "Por favor, forneça a potência pico da proposta.",
    }),
  }),
]);

const createPropose: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);
  const session = await getSession({ req: req });
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("proposes");
  console.log(req.body);
  const propose = proposeSchema.parse(req.body);

  const dbRes = await collection.insertOne({
    ...propose,
    autor: {
      nome: session?.user.name,
      id: session?.user.id,
    },
    dataInsercao: new Date().toISOString(),
  });

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
  const { projectId, id } = req.query;
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("proposes");
  if (typeof id === "string") {
    const propose = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $addFields: {
            projetoId: { $toObjectId: "$projeto.id" },
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "projetoId",
            foreignField: "_id",
            as: "infoProjeto",
          },
        },
      ])
      .toArray();
    // console.log(proposes);
    const formattedObj = {
      ...propose[0],
      infoProjeto: propose[0].infoProjeto[0],
    };
    res.status(200).json(formattedObj);
  }
  // else {
  //   throw new createHttpError.BadRequest("ID de proposta inválido.");
  // }
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
  }
  // else {
  //   throw new createHttpError.BadRequest("ID de proposta inválido.");
  // }
};
type PutResponse = {
  message: string;
};
const updatePropose: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(
    req,
    "projetos",
    "serResponsavel",
    true
  );
  const { responsible, id } = req.query;
  const { changes } = req.body;
  console.log("CHANGES", changes);
  if (
    !session.user.permissoes.propostas.editar &&
    responsible != session.user.id
  ) {
    throw new createHttpError.Unauthorized(
      "Somente o responsável ou administradores podem alterar essa proposta."
    );
  }

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("proposes");
  if (typeof id != "string") throw createHttpError.BadRequest("ID inválido.");
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
    res.status(201).json({ message: "Proposta alterada com sucesso." });
  }
};
export default apiHandler({
  GET: getProposes,
  POST: createPropose,
  PUT: updatePropose,
});
