import connectToDatabase from "@/services/mongoclient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import { INotification } from "@/utils/models";
import {
  Notification,
  createNotificationSchema,
} from "@/utils/schemas/project.schema";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

type PostResponse = {
  data: Notification;
  message: string;
};

const createNotification: NextApiHandler<PostResponse> = async (req, res) => {
  // await validateAuthentication(req);
  const notification = createNotificationSchema.parse(req.body);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("notifications");
  try {
    let newNotification = await collection.insertOne({
      ...notification,
      dataInsercao: new Date().toISOString(),
    });
    res.status(201).json({
      data: notification,
      message: "Notificação criada com successo !",
    });
  } catch (error) {
    throw new createHttpError.InternalServerError("Houve um erro ao inserir ");
  }
};

type GetResponse = {
  data: INotification[];
};
const getNotifications: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { recipient } = req.query;

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("notifications");
  const notifications = await collection
    .aggregate([
      {
        $match: {
          "destinatario.id": recipient,
        },
      },
      {
        $sort: {
          dataLeitura: 1,
          dataInsercao: -1,
        },
      },
    ])
    .toArray();
  res.status(200).json({ data: notifications });
};

type PatchResponse = {
  data: string;
};
const setNotificationAsRead: NextApiHandler<PatchResponse> = async (
  req,
  res
) => {
  // await validateAuthentication(req);
  const { id } = req.query;
  if (typeof id != "string")
    throw new createHttpError.BadRequest("ID inválido.");
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("notifications");
  console.log(id);
  const dbResponse = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { dataLeitura: new Date().toISOString() },
    }
  );
  if (dbResponse.matchedCount >= 1)
    res.status(201).json({ data: "Notificação atualizada com sucesso." });
  else
    throw new createHttpError.BadRequest(
      "Nenhuma notificação encontrada com esse ID."
    );
};
export default apiHandler({
  POST: createNotification,
  GET: getNotifications,
  PATCH: setNotificationAsRead,
});
