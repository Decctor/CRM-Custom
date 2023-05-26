import connectToDatabase from "@/services/mongoclient";
import { apiHandler, validateAuthentication } from "@/utils/api";
import { IKit } from "@/utils/models";
import { NextApiHandler } from "next";

type PostResponse = {
  data: IKit[] | IKit;
};
const queryKits: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("kits");
  const { pipeline } = req.body;
  console.log(pipeline);
  const arrOfKits = await collection.aggregate(pipeline).toArray();
  res.status(200).json({ data: arrOfKits });
};

export default apiHandler({
  POST: queryKits,
});

// {
//   $match: {
//     $expr: {
//       $gt: [
//         {
//           $reduce: {
//             input: "$modulos",
//             initialValue: 0,
//             in: {
//               $add: [
//                 "$$value",
//                 {
//                   $multiply: ["$$this.potencia", "$$this.qtde"],
//                 },
//               ],
//             },
//           },
//         },
//         param, // seu parâmetro X aqui
//       ],
//     },
//   },
// },
