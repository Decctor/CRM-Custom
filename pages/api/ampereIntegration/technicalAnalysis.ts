import connectToDatabase from "@/services/requestsMongoClient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import { calculateStringSimilarity } from "@/utils/methods";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";
import { pipeline } from "stream";
const sellers = [
  "ARTHUR CARVALHO",
  "ARTUR MILANE",
  "CARLOS MARQUES",
  "DEVISSON LIMA",
  "DIOMAR HONORIO",
  "GETULIO EDUARDO",
  "GLAIDSTONE JOSÉ",
  "JESSICA PARANAIBA",
  "JORGINHO HABIB",
  "JULIANO SILVA",
  "MATHEUS OLIVEIRA",
  "NEIDSON FILHO",
  "RAFAEL FEO",
  "ROMES ALVES",
  "RODRIGO MORAIS",
  "LUCIANO MUNIZ",
  "DIONISIO JUNIOR",
  "LEANDRO VIALI",
  "GUILHERME LIMA",
  "LUCIANO JORGE",
  "STENIO DE ASSIS",
  "RONIVALDO MARTINS",
  "DIOGO PAULINO",
  "ADRIANO ARANTES",
  "ARIÁDNNY APARECIDA",
  "DÁFINY VILLANO",
  "ARTHUR ALEXANDER",
  "FELIPE RIBEIRO",
  "ADAILSON COSTA",
  "LUCIANO LOPES",
  "RODRIGO DE MORAIS",
  "EURIPEDES JUNIOR",
  "FRANCO MUSTAFE",
  "ALLISSON OSCAR",
  "WILLIAM MENEZES",
  "MARIANA DE SOUZA",
  "CÉLIO JUNIOR",
  "THIAGO DE PAULA",
  "GLEITON RESENDE",
  "ANA PAULA PEREIRA",
  "GRASIELE DA SILVA",
  "MARCUS VINÍCIUS",
  "LEONARDO VILARINHO",
  "ROBERTH JUNQUEIRA GONÇALVES",
  "GABRIEL MARTINS",
  "LUCAS FERNANDES",
  "GABRIEL EMANUEL",
  "YASMIM ARAUJO",
  "RAILDO CARVALHO",
  "NÃO DEFINIDO",
];
type GetResponse = {
  data: any;
};
const getTechnicalAnalysis: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { projectIdentifier, status } = req.query;
  if (!projectIdentifier || typeof projectIdentifier != "string")
    throw new createHttpError.BadRequest(
      "Identificador de projeto inválido ou não informado."
    );
  const db = await connectToDatabase(process.env.OPERATIONAL_MONGODB_URI);
  const collection = db.collection("visitaTecnica");
  var pipeline;
  if (!status)
    if (status == "CONCLUIDO") {
      pipeline = [
        {
          $match: {
            status: "CONCLUIDO",
            codigoSVB: projectIdentifier,
          },
        },
        {
          $addFields: {
            diasDesdeConclusao: {
              $dateDiff: {
                startDate: { $toDate: "$dataDeConclusao" },
                endDate: { $toDate: new Date().toISOString() },
                unit: "day",
              },
            },
          },
        },
        {
          $match: {
            diasDesdeConclusao: { $lte: 30 },
          },
        },
      ];
    }
  if (status == "TODOS") {
    pipeline = [
      {
        $match: {
          codigoSVB: projectIdentifier,
        },
      },
    ];
  }
  if (!pipeline) return;

  const analysis = await collection.aggregate([...pipeline]).toArray();
  res.status(200).json({ data: analysis });
};
type PostResponse = {
  data: any;
  message: string;
};
const createTechnicalAnalysis: NextApiHandler<PostResponse> = async (
  req,
  res
) => {
  await validateAuthentication(req);

  const requestInfo = req.body;
  if (!requestInfo)
    throw new createHttpError.BadRequest(
      "Solicitação de Análise Técnica vazia."
    );
  const db = await connectToDatabase(process.env.OPERATIONAL_MONGODB_URI);
  const collection = db.collection("visitaTecnica");
  const requestSeller = requestInfo.nomeVendedor
    ? requestInfo.nomeVendedor.toUpperCase()
    : "NÃO DEFINIDO";
  const correctSellerName = sellers.find(
    (x) => calculateStringSimilarity(requestSeller, x) > 80
  );
  const insertResponse = await collection.insertOne({
    ...requestInfo,
    nomeVendedor: correctSellerName,
    dataDeAbertura: new Date().toISOString(),
  });
  if (insertResponse?.insertedId) {
    res.status(201).json({
      data: insertResponse.insertedId,
      message: "Solicitação de Análise Técnica criada com sucesso !",
    });
  } else {
    throw new createHttpError.InternalServerError(
      "Houve um erro na inserção da solicitação no banco de dados."
    );
  }
};

export default apiHandler({
  POST: createTechnicalAnalysis,
  GET: getTechnicalAnalysis,
});
