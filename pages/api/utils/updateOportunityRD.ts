import { apiHandler } from "@/utils/api";
import { leadLoseJustification, opportunityReceivers } from "@/utils/constants";
import { stateCities } from "@/utils/estados_cidades";
import {
  calculateStringSimilarity,
  formatToCEP,
  formatToCPForCNPJ,
  formatToPhone,
} from "@/utils/methods";
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

type GetResponse = {
  data: any;
};

function getRepresentativeByCustomField(custom_fieldArr: any) {
  console.log("CUSTOM FIELD", custom_fieldArr);
  var insiderAlias = custom_fieldArr.find(
    (fieldObj: any) => fieldObj.custom_field_id == "64a31fb2918d6d00254552fd"
  )
    ? custom_fieldArr.find(
        (fieldObj: any) =>
          fieldObj.custom_field_id == "64a31fb2918d6d00254552fd"
      ).value
    : undefined;
  console.log(insiderAlias);
  if (!insiderAlias) return undefined;
  const insider = opportunityReceivers.find(
    (opReceiver) => opReceiver.alias == insiderAlias
  );
  if (!insider) return undefined;
  return {
    id: insider.id,
    nome: insider.nome,
  };
}
function getIndicatorByCustomField(custom_fieldArr: any) {
  const indicatorCustomField = custom_fieldArr.find(
    (fieldObj: any) => fieldObj.custom_field_id == "64d2a55aec06320018eec599"
  );
  if (!indicatorCustomField) return undefined;
  const indicatorName = Array.isArray(indicatorCustomField.value)
    ? indicatorCustomField.value[0]
    : indicatorCustomField.value;
  if (!indicatorName) return undefined;
  return indicatorName;
}
function getCity(leadCity: string) {
  var allCities: string[] = [];
  Object.values(stateCities).map((arr) => {
    allCities = allCities.concat(arr);
  });
  const matchingCity = allCities.find(
    (city) => calculateStringSimilarity(leadCity.toUpperCase(), city) > 80
  );
  return matchingCity;
}
function getUF(city?: string | null, uf?: string | null) {
  if (!city && !uf) return undefined;
  if (city && !uf) {
    var rightUF: string | undefined = undefined;
    Object.keys(stateCities).map((state) => {
      // @ts-ignore
      const foundOnCurrentState = stateCities[state as string].some(
        (x: any) => calculateStringSimilarity(city.toUpperCase(), x) > 80
      );
      if (foundOnCurrentState) rightUF = state;
    });
    return rightUF;
  }
  if (!city && uf) {
    const ufs = Object.keys(stateCities);
    const matchingUF = ufs.find((iUf) =>
      calculateStringSimilarity(uf.toUpperCase(), iUf)
    );
    return matchingUF;
  }
  if (city && uf) {
    const ufs = Object.keys(stateCities);
    const matchingUF = ufs.find((iUf) =>
      calculateStringSimilarity(uf.toUpperCase(), iUf)
    );
    return matchingUF;
  }
}
const getOpportunity: NextApiHandler<GetResponse> = async (req, res) => {
  const { queryId } = req.query;
  if (!queryId) throw new createHttpError.BadGateway("ID inválido.");
  const { data: opportunityInfo }: any = await axios.get(
    `https://crm.rdstation.com/api/v1/deals/${queryId}?token=${process.env.RD_TOKEN}`
  );
  const { data: contactInfo }: any = await axios.get(
    `https://crm.rdstation.com/api/v1/deals/${queryId}/contacts?token=${process.env.RD_TOKEN}`
  );
  console.log("INFORMAÇÕES DA OPORTUNIDADE", opportunityInfo);
  console.log("INFO CONTATO", contactInfo);
  // console.log("INFO CONTATO", contactInfo);
  // const opportunityInfo = {
  //   _id: "64aeb81426f4f9000ccd8409",
  //   id: "64aeb81426f4f9000ccd8409",
  //   name: "LUCAS ERP TESTE",
  //   amount_montly: 0,
  //   amount_unique: 0,
  //   amount_total: 0,
  //   best_moment_to_touch: false,
  //   closed_at: null,
  //   created_at: "2023-07-12T11:26:28.866-03:00",
  //   updated_at: "2023-07-12T14:12:32.313-03:00",
  //   deal_lost_reason_id: null,
  //   prediction_date: null,
  //   win: null,
  //   rating: 1,
  //   hold: null,
  //   interactions: 3,
  //   last_note_content: null,
  //   deal_source_id: null,
  //   campaign_id: "649db598fa5f050001fd2816",
  //   stop_time_limit: {
  //     expiration_date_time: "2023-07-14T14:12:32.313-03:00",
  //     expired: false,
  //     expired_days: 0,
  //   },
  //   from_rdsm_integration: true,
  //   errors: {},
  //   c_cf_errors: {},
  //   contact_errors: {},
  //   user: {
  //     _id: "649c71814ba3f000266e2dd8",
  //     id: "649c71814ba3f000266e2dd8",
  //     name: "Lucas Fernandes",
  //   },
  //   campaign: {
  //     _id: "649db598fa5f050001fd2816",
  //     id: "649db598fa5f050001fd2816",
  //     name: "Entrega de Leads RD CRM",
  //   },
  //   deal_stage: {
  //     _id: "649c763d8a4e9d002444731e",
  //     id: "649c763d8a4e9d002444731e",
  //     name: "Criação de Proposta",
  //     nickname: "CDP",
  //     deal_pipeline_id: "649c763d8a4e9d002444731b",
  //   },
  //   deal_stage_histories: [
  //     {
  //       _id: "64aeb81426f4f9000ccd8415",
  //       id: "64aeb81426f4f9000ccd8415",
  //       deal_stage_id: "649c763d8a4e9d002444731c",
  //       start_date: "2023-07-12T11:26:28.861-03:00",
  //       end_date: "2023-07-12T11:26:34.955-03:00",
  //     },
  //     {
  //       _id: "64aeb81426f4f9000ccd8417",
  //       id: "64aeb81426f4f9000ccd8417",
  //       deal_stage_id: "649c763d8a4e9d002444731c",
  //       start_date: "2023-07-12T11:26:28.866-03:00",
  //       end_date: "2023-07-12T11:26:34.955-03:00",
  //     },
  //     {
  //       _id: "64aeb81a7b00f0000d5c7105",
  //       id: "64aeb81a7b00f0000d5c7105",
  //       deal_stage_id: "649c763d8a4e9d002444731e",
  //       start_date: "2023-07-12T11:26:34.955-03:00",
  //       end_date: null,
  //     },
  //   ],
  //   deal_custom_fields: [
  //     {
  //       value: "GABRIEL EMANUEL",
  //       created_at: null,
  //       updated_at: "2023-07-12T15:25:30.079-03:00",
  //       custom_field_id: "64a31fb2918d6d00254552fd",
  //       custom_field: {
  //         _id: "64a31fb2918d6d00254552fd",
  //         allow_new: false,
  //         created_at: "2023-07-03T16:21:22.642-03:00",
  //         for: "deal",
  //         instance_id: "63ce9e3edb1b67000b6cc791",
  //         label: "INSIDER",
  //         opts: ["LEANDRO VIALI", "GABRIEL EMANUEL", "YASMIM ARAUJO"],
  //         order: 1,
  //         required: false,
  //         type: "option",
  //         unique: false,
  //         updated_at: "2023-07-03T16:21:22.642-03:00",
  //         visible: true,
  //       },
  //     },
  //   ],
  //   previous_task: {
  //     _id: "64aeb81c23868a0001224496",
  //     id: "64aeb81c23868a0001224496",
  //     done_date: "2023-07-12T14:12:32.228-03:00",
  //     hour: "23:26",
  //     subject: "NOVO LEAD",
  //     type: "call",
  //     user_ids: ["649c71814ba3f000266e2dd8"],
  //     done_by: {
  //       _id: "649c71814ba3f000266e2dd8",
  //       id: "649c71814ba3f000266e2dd8",
  //       name: "Lucas Fernandes",
  //     },
  //   },
  //   deal_products: [],
  // };
  // const contactInfo = {
  //   total: 1,
  //   has_more: false,
  //   contacts: [
  //     {
  //       id: "64aeb81426f4f9000ccd8414",
  //       _id: "64aeb81426f4f9000ccd8414",
  //       name: "LUCAS ERP TESTE",
  //       title: null,
  //       notes: null,
  //       emails: [
  //         {
  //           _id: "64aee986b38d22000d6b3193",
  //           created_at: null,
  //           email: "adriano@email.com",
  //           updated_at: null,
  //         },
  //       ],
  //       birthday: null,
  //       facebook: null,
  //       linkedin: null,
  //       skype: null,
  //       organization_id: null,
  //       contact_custom_fields: [
  //         {
  //           _id: "64aee986b38d22000d6b3189",
  //           created_at: null,
  //           custom_field_id: "649db83995ab7f000f5eccac",
  //           updated_at: null,
  //           value: "Residencial",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b318a",
  //           created_at: null,
  //           custom_field_id: "649db8c9b3a95800146e7c4b",
  //           updated_at: null,
  //           value: "de R$ 2.001 até R$ 5.000",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b318b",
  //           created_at: null,
  //           custom_field_id: "64abf94d0a5197002667c18e",
  //           updated_at: null,
  //           value: "",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b318c",
  //           created_at: null,
  //           custom_field_id: "64abf46554aae00029356257",
  //           updated_at: null,
  //           value: "14663243681",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b318d",
  //           created_at: null,
  //           custom_field_id: "64abf979de15d8001724ce19",
  //           updated_at: null,
  //           value: "RUA A",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b318e",
  //           created_at: null,
  //           custom_field_id: "64abf9910a5197000d67c4cd",
  //           updated_at: null,
  //           value: "CENTRO",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b318f",
  //           created_at: null,
  //           custom_field_id: "64abf9a753fc95000d23515e",
  //           updated_at: null,
  //           value: "999",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b3190",
  //           created_at: null,
  //           custom_field_id: "64abf90af8614e00186721b3",
  //           updated_at: null,
  //           value: "38307102",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b3191",
  //           created_at: null,
  //           custom_field_id: "64abf9ca53fc95001d23504c",
  //           updated_at: null,
  //           value: "ITUIUTABA",
  //         },
  //         {
  //           _id: "64aee986b38d22000d6b3192",
  //           created_at: null,
  //           custom_field_id: "64abf9b575f44e002340354b",
  //           updated_at: null,
  //           value: "MG",
  //         },
  //       ],
  //       created_at: "2023-07-12T11:26:28.950-03:00",
  //       updated_at: "2023-07-12T14:57:26.049-03:00",
  //       phones: [
  //         {
  //           phone: "34 9999 9999",
  //           type: "work",
  //           whatsapp: true,
  //           whatsapp_url_web:
  //             "https://web.whatsapp.com/send?phone=553499999999&text",
  //           whatsapp_full_internacional: "+553499999999",
  //           created_at: null,
  //           updated_at: null,
  //         },
  //       ],
  //       legal_bases: [],
  //     },
  //   ],
  // };
  const responseObj = {
    nome: opportunityInfo.name,
    cpfCnpj: contactInfo.contacts[0]?.contact_custom_fields?.find(
      (customField: any) =>
        customField.custom_field_id == "64abf46554aae00029356257"
    )?.value
      ? formatToCPForCNPJ(
          contactInfo.contacts[0]?.contact_custom_fields?.find(
            (customField: any) =>
              customField.custom_field_id == "64abf46554aae00029356257"
          )?.value
        )
      : undefined,
    telefonePrimario: contactInfo.contacts[0]?.phones[0]?.phone
      ? formatToPhone(contactInfo.contacts[0]?.phones[0]?.phone)
      : null,
    email: contactInfo?.contacts[0]?.emails[0]?.email,
    cep: contactInfo?.contacts[0]?.contact_custom_fields.find(
      (customField: any) =>
        customField.custom_field_id == "64abf90af8614e00186721b3"
    )?.value
      ? formatToCEP(
          contactInfo.contacts[0].contact_custom_fields.find(
            (customField: any) =>
              customField.custom_field_id == "64abf90af8614e00186721b3"
          ).value
        )
      : undefined,
    bairro: contactInfo?.contacts[0]?.contact_custom_fields.find(
      (customField: any) =>
        customField.custom_field_id == "64abf9910a5197000d67c4cd"
    )?.value,
    logradouro: contactInfo?.contacts[0]?.contact_custom_fields.find(
      (customField: any) =>
        customField.custom_field_id == "64abf979de15d8001724ce19"
    )?.value,
    numeroOuIdentificador: contactInfo?.contacts[0]?.contact_custom_fields.find(
      (customField: any) =>
        customField.custom_field_id == "64abf9a753fc95000d23515e"
    )?.value,
    representante: opportunityInfo.deal_custom_fields
      ? getRepresentativeByCustomField(opportunityInfo.deal_custom_fields)
      : undefined,
    cidade: contactInfo?.contacts[0]?.contact_custom_fields.find(
      (customField: any) =>
        customField.custom_field_id == "64abf9ca53fc95001d23504c"
    )?.value
      ? getCity(
          contactInfo?.contacts[0]?.contact_custom_fields
            .find(
              (customField: any) =>
                customField.custom_field_id == "64abf9ca53fc95001d23504c"
            )
            ?.value.toUpperCase()
        )
      : undefined,
    uf: contactInfo?.contacts[0]?.contact_custom_fields?.find(
      (customField: any) =>
        customField.custom_field_id == "64abf9b575f44e002340354b"
    )?.value
      ? getUF(
          contactInfo?.contacts[0]?.contact_custom_fields.find(
            (customField: any) =>
              customField.custom_field_id == "64abf9ca53fc95001d23504c"
          )?.value,
          contactInfo?.contacts[0]?.contact_custom_fields.find(
            (customField: any) =>
              customField.custom_field_id == "64abf9b575f44e002340354b"
          )?.value
        )
      : undefined,
    indicador: getIndicatorByCustomField(opportunityInfo.deal_custom_fields),
  };
  res.json({ data: responseObj });
};
export default apiHandler({
  POST: updateOportunity,
  GET: getOpportunity,
});
