import connectToDatabase from "@/services/requestsMongoClient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";

type GetResponse = {
  data: any;
};
const getTechnicalAnalysis: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { projectIdentifier } = req.query;
  if (!projectIdentifier || typeof projectIdentifier != "string")
    throw new createHttpError.BadRequest(
      "Identificador de projeto inválido ou não informado."
    );

  const db = await connectToDatabase(process.env.OPERATIONAL_MONGODB_URI);
  const collection = db.collection("visitaTecnica");

  const analysis = await collection
    .aggregate([
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
    ])
    .toArray();

  res.status(200).json({ data: analysis });
};

export default apiHandler({
  GET: getTechnicalAnalysis,
});
