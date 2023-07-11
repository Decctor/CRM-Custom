import { apiHandler, validateAuthentication } from "@/utils/api";
import { NextApiHandler } from "next";
import query from "../kits/query";
import axios from "axios";
import AdmZip from "adm-zip";

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

    // Due to API size limits, gotta zip the pdf file to send it, and then unzip it in the front end
    var zip = new AdmZip();
    zip.addFile("proposta.pdf", response.data);
    const zipContent = zip.toBuffer();
    const fileName = "proposta.zip";
    const fileType = "application/zip";

    res.setHeader("Content-Type", fileType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.end(zipContent);
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
