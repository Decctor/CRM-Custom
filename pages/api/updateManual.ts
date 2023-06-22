import connectToDatabase from "@/services/mongoclient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const clientsCollection = db.collection("projects");
  const response = await clientsCollection.deleteMany({
    idOportunidade: { $ne: null },
  });
  res.json(response);
}
