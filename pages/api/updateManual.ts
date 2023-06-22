import connectToDatabase from "@/services/mongoclient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const testCollection = db.collection("test");
  console.log("REQ BODY", req.body);
  console.log("REQ", req);
  const body = req.body;
  const response = await testCollection.insertOne(body);
  res.json(response);
}
