import connectToDatabase from "@/services/mongoclient";
import { apiHandler, validateAuthorization } from "@/utils/api";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";

type PutResponse = {
  data: string;
};
const editProject: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(
    req,
    "projetos",
    "serResponsavel",
    true
  );
  const { id, responsible } = req.query;
  const { pipeline } = req.body;

  if (
    !session.user.permissoes.projetos.editar &&
    responsible != session.user.id
  ) {
    throw new createHttpError.Unauthorized(
      "Somente o responsável ou administradores poderem alterar esse projeto."
    );
  }
  if (!id || typeof id != "string")
    throw new createHttpError.BadRequest(
      "ID do objeto de alteração é inválido."
    );
  if (!pipeline)
    throw new createHttpError.BadRequest(
      "Pipeline de alterações é não especificada."
    );
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projects");

  const dbResponse = await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    ...pipeline
  );
  res.json({ data: "Alterações bem sucedidas." });
};
export default apiHandler({
  PUT: editProject,
});
