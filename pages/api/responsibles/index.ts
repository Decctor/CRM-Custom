import connectToDatabase from "@/services/mongoclient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import { IResponsible } from "@/utils/models";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";

type GetResponse = {
  data: IResponsible[] | IResponsible;
};

const getResponsibles: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("users");
  const { id } = req.query;
  if (id && typeof id === "string") {
    const dbResponse = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            "permissoes.projetos.serResponsavel": true,
          },
        },
        {
          $project: {
            _id: 1,
            nome: 1,
          },
        },
      ])
      .toArray();
    if (!dbResponse[0])
      throw new createHttpError.NotFound(
        "Nenhum responsável encontrado com esse ID."
      );
    const responsible = {
      id: dbResponse[0]._id,
      nome: dbResponse[0].nome,
    };

    res.status(200).json({ data: responsible });
  } else {
    const dbResponse = await collection
      .aggregate([
        {
          $match: {
            "permissoes.projetos.serResponsavel": true,
          },
        },
        {
          $project: { _id: 1, nome: 1 },
        },
      ])
      .toArray();
    const responsibles = dbResponse.map((resp: IResponsible) => {
      return {
        id: resp._id,
        nome: resp.nome,
      };
    });
    res.status(200).json({ data: responsibles });
  }
};

export default apiHandler({
  GET: getResponsibles,
});
