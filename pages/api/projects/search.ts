import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
type GetResponse = {};
const getProjects: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projects");
  const { searchParam } = req.query;
  console.log(searchParam);
  if (searchParam && typeof searchParam === "string") {
    const projects = await collection
      .aggregate([
        {
          $match: {
            $or: [
              { nome: { $regex: searchParam } },
              { nome: { $regex: searchParam.toUpperCase() } },
              { identificador: { $regex: searchParam } },
            ],
          },
        },
        {
          $project: {
            nome: 1,
            responsavel: 1,
          },
        },
      ])
      .toArray();
    console.log(projects);
    if (projects.length == 0)
      throw new createHttpError.BadRequest(
        "Nenhum projeto encontrado com esse parâmetro."
      );
    res.status(200).json({ data: projects });
  }
};
export default apiHandler({
  GET: getProjects,
});
