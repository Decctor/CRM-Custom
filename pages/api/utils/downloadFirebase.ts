import { NextApiHandler } from "next";
import getBucket from "../../../services/firebaseBucket";
import { apiHandler } from "@/utils/api";
type GetResponse = {
  data: any;
};

const getDistance: NextApiHandler<GetResponse> = async (req, res) => {
  const { filePath } = req.query;
  if (typeof filePath === "string") {
    try {
      const bucket = await getBucket();
      const file = bucket.file(filePath);
      const stream = file.createReadStream();
      stream.pipe(res);
    } catch (error) {
      throw "Houve um erro no download do arquivo.";
    }
  }
};
export default apiHandler({
  GET: getDistance,
});
export const config = {
  api: {
    responseLimit: false,
  },
};
