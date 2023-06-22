import { apiHandler } from "@/utils/api";
import { leadLoseJustification } from "@/utils/constants";
import axios from "axios";
import dayjs from "dayjs";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";

type PostResponse = {
  data: string;
  message: string;
};

const updateOportunity: NextApiHandler<PostResponse> = async (req, res) => {
  const { oportunityId, operation, lossReason } = req.body;
  console.log(req.body);
  if (!oportunityId) {
    throw new createHttpError.BadRequest("ID da oportunidade não fornecido.");
  }
  if (operation == "PERDER") {
    if (!lossReason) {
      throw new createHttpError.BadRequest("Razão da perda não fornecida");
    }
    const lossReasonInObject =
      leadLoseJustification[lossReason as keyof typeof leadLoseJustification];
    if (!lossReasonInObject)
      throw new createHttpError.BadRequest("Razão da perda inválida.");

    const usableLossReasonRDObject = lossReasonInObject.deal_lost_reason;
    await axios.put(
      `https://crm.rdstation.com/api/v1/deals/${oportunityId}?token=${process.env.RD_TOKEN}`,
      {
        win: false,
        deal_lost_reason: {
          ...usableLossReasonRDObject,
          created_at: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          updated_at: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        },
      }
    );
    console.log("LOSS OBJECT", usableLossReasonRDObject);
    res.status(201).json({
      data: "Projeto perdido.",
      message: "Projeto perdido.",
    });
  }
  if (operation == "GANHAR") {
    await axios.put(
      `https://crm.rdstation.com/api/v1/deals/${oportunityId}?token=${process.env.RD_TOKEN}`,
      {
        win: true,
      }
    );
    res.status(201).json({
      data: "Projeto ganho com sucesso!",
      message: "Projeto ganho com sucesso!",
    });
  }
  if (operation == "RESETAR") {
    await axios.put(
      `https://crm.rdstation.com/api/v1/deals/${oportunityId}?token=${process.env.RD_TOKEN}`,
      {
        win: null,
        deal_lost_reason: null,
      }
    );
    res.status(201).json({
      data: "Projeto resetado.",
      message: "Projeto resetado.",
    });
  }
  if (!["PERDER", "GANHAR", "RESETAR"].includes(operation)) {
    throw new createHttpError.BadRequest("Operação inválida.");
  }
};

export default apiHandler({
  POST: updateOportunity,
});
