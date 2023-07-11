import { apiHandler, validateAuthentication } from "@/utils/api";
import { NextApiHandler } from "next";
import query from "../kits/query";
import axios from "axios";

type PostResponse = {
  data: any;
};

const getPropose: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);
  const propose = req.body;
  const { templateId } = req.query;
  console.log("TEMPLATE", templateId);
  try {
    // Make the external request
    const response = await axios.post(
      `https://app.useanvil.com/api/v1/fill/${
        templateId ? templateId : "LPHl6ETXfSmY3QsHJqAW"
      }.pdf`,
      propose,
      {
        auth: {
          username: process.env.ANVIL_KEY ? process.env.ANVIL_KEY : "",
          password: "",
        },
        responseType: "arraybuffer",
      }
    );

    // Extract the relevant headers from the external response
    const {
      "content-type": contentType,
      "content-disposition": contentDisposition,
    } = response.headers;

    // Set the headers in the response to match the external response
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);

    res.send(response.data);
  } catch (error) {
    console.error("Error making the external request:", error);
    res.status(500).end();
  }

  //   // Generate PDF

  //   console.log(propose);
  //   const response = await axios.post(
  //     "https://app.useanvil.com/api/v1/fill/vkEqERFPJNqGM7mM1cVe.pdf",
  //     propose,
  //     {
  //       auth: {
  //         username: process.env.ANVIL_KEY ? process.env.ANVIL_KEY : "",
  //         password: "",
  //       },
  //     }
  //   );

  //   const stream = response.data.createReadStream();
  //   res.json(response.data);
};

export default apiHandler({
  POST: getPropose,
});
export const config = {
  api: {
    responseLimit: false,
  },
};
