import connectToDatabase from "@/services/mongoclient";
import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "@/utils/api";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

type PutResponse = {
  data: string;
};
const updateFunnelSchema = z.object({
  updateObjId: z.string({
    required_error: "Por favor, forneça um ID para atualização.",
  }),
  funnelId: z.string({
    required_error: "Por favor, forneça o ID do funil a ser atualizado.",
  }),
  newStageId: z.string({
    required_error: "Por favor, forneça a nova etapa do funil.",
  }),
  responsibleId: z.string({
    required_error: "Por favor, forneça o ID do responsável pelo projeto.",
  }),
});

const updateObjFunnelStage: NextApiHandler<PutResponse> = async (req, res) => {
  console.log("CHAMADA DE ALTERAÇÂO DE FUNIL", req.body);
  const session = await validateAuthorization(
    req,
    "projetos",
    "serResponsavel",
    true
  );
  const { updateObjId, funnelId, newStageId, responsibleId } =
    updateFunnelSchema.parse(req.body);

  if (
    session.user.visibilidade != "GERAL" &&
    session.user.id != responsibleId
  ) {
    throw new createHttpError.Unauthorized(
      "Seu usuário não tem permissão para atualizar esse projeto."
    );
  }
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("projects");
  const updateResponse = await collection.updateOne(
    {
      _id: new ObjectId(updateObjId),
    },
    {
      $set: {
        [`funis.${funnelId}.etapaId`]: Number(newStageId),
      },
    }
  );
  res.status(201).json({ data: "Etapa alterada com sucesso." });
};

export default apiHandler({
  PUT: updateObjFunnelStage,
});
