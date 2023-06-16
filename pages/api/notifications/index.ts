import connectToDatabase from "@/services/mongoclient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import { INotification } from "@/utils/models";
import { NextApiHandler } from "next";
import { z } from "zod";

type PostResponse = {
  data: INotification;
  message: string;
};
const notificationSchema = z.object({
  remetenteId: z.union([
    z
      .string({ required_error: "Por favor, informe o ID do remetente." })
      .min(20, "ID de remetente inválido."),
    z.literal("SISTEMA"),
  ]),
  remetenteNome: z.union([
    z.string({ required_error: "Por favor, informe o nome do remetente." }),
    z.literal("SISTEMA"),
  ]),
  destinatarioId: z
    .string({ required_error: "Por favor, informe o ID do destinatário." })
    .min(20, "ID de destinatário inválido."),
  mensagem: z.string({
    required_error: "Por favor, forneça a mensagem da notificação.",
  }),
});

const createNotification: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);
  const notification = notificationSchema.parse(req.body);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("notifications");
  let newNotification = await collection.insertOne({
    ...notification,
    dataInsercao: new Date().toISOString(),
  });
  res
    .status(201)
    .json({ data: notification, message: "Notificação criada com successo !" });
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
    .find({
      destinatarioId: recipient,
    })
    .toArray();
  res.status(200).json({ data: notifications });
};
export default apiHandler({
  POST: createNotification,
  GET: getNotifications,
});
