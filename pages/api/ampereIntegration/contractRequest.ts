import connectToDatabase from "@/services/requestsMongoClient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import { calculateStringSimilarity } from "@/utils/methods";
import { NextApiHandler } from "next";

type PostResponse = {
  data: string;
  message: string;
};
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
const createRequest: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);
  const requestInfo = req.body;
  const db = await connectToDatabase(process.env.OPERATIONAL_MONGODB_URI);
  const collection = db.collection("contrato");
  if (!requestInfo) return "Solicitação de contrato vazia";
  //Fixing seller name for correct form in Sistema Ampere
  const requestSeller = requestInfo.nomeVendedor
    ? requestInfo.nome
    : "NÃO DEFINIDO";
  const correctSellerName = sellers.find(
    (x) => calculateStringSimilarity(requestSeller, x) > 80
  );
  const insertResponse = await collection.insertOne({
    ...requestInfo,
    nomeVendedor: correctSellerName,
  });
  if (insertResponse?.insertedId) {
    res.status(201).json({
      data: insertResponse.insertedId,
      message: "Solicitação de contrato criada com sucesso !",
    });
  } else {
    throw "Houve um erro na inserção da solicitação no banco de dados.";
  }
};

export default apiHandler({
  POST: createRequest,
});
