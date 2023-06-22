import connectToDatabase from "@/services/mongoclient";
import { apiHandler } from "@/utils/api";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";

type PostResponse = {
  data: string;
  message: string;
};
const collectLead: NextApiHandler<PostResponse> = async (req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const testCollection = db.collection("test");
  const { body } = req;
  if (body.leads) {
    const lead = body.leads[0];
    if (!lead) throw new createHttpError.BadRequest("Nenhum lead encontrado.");
    const leadObj = {
      id: "2911004942",
      email: "wesleyadm2019@gmail.com",
      name: "WESLEY RODRIGUES DE MOURA",
      company: null,
      job_title: null,
      bio: null,
      public_url:
        "http://app.rdstation.com.br/leads/public/8b4d2932-6299-4cc3-8e3e-f07cdc087c05",
      created_at: "2023-06-11T18:43:11.862-03:00",
      opportunity: "true",
      number_conversions: "2",
      user: null,
      first_conversion: {
        content: {
          event_type: "CONVERSION",
          event_identifier: "btn-whatsapp-home",
          identificador: "btn-whatsapp-home",
          event_timestamp: "2023-06-11T21:43:11Z",
          conversion_url: "https://ampereenergias.com.br/lp/",
          conversion_domain: "ampereenergias.com.br",
          google_analytics_client_id: "614371553.1686519762",
          conversion_identifier: "btn-whatsapp-home",
          traffic_source:
            "encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiZ2NsaWQ9RUFJYUlRb2JDaE1JbGZxTDRlaTdfd0lWUmVWY0NoMzJud3dBRUFBWUFTQUFFZ0sxRF9EX0J3RSIsImV4dHJhX3BhcmFtcyI6e319LCJjdXJyZW50X3Nlc3Npb24iOnsidmFsdWUiOiJnY2xpZD1FQUlhSVFvYkNoTUlsZnFMNGVpN193SVZSZVZjQ2gzMm53d0FFQUFZQVNBQUVnSzFEX0RfQndFIiwiZXh0cmFfcGFyYW1zIjp7fX0sImNyZWF0ZWRfYXQiOjE2ODY1MTk3NjIyNDV9",
          email_lead: "wesleyadm2019@gmail.com",
          user_agent:
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
          device: "smartphone",
          asset_id: 4530090,
          conversion_payload:
            '{"redirect_to":"https://wa.me/553437007001?text=Vim+pelo+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es."}',
          __cdp__original_event: {
            event_batch_uuid: "2cdf9eb8-ea79-44c0-a717-22f9719d9630",
            event_batch_index: 0,
            event_identifier: "btn-whatsapp-home",
            event_uuid: "4956ffd0-438c-405f-b788-82ab1d1c483b",
            event_family: "CDP",
            event_type: "CONVERSION",
            payload: {
              client_tracking_id: "",
              conversion_url: "https://ampereenergias.com.br/lp/",
              conversion_domain: "ampereenergias.com.br",
              google_analytics_client_id: "614371553.1686519762",
              conversion_identifier: "btn-whatsapp-home",
              internal_source: "12",
              c_utmz: "",
              traffic_source:
                "encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiZ2NsaWQ9RUFJYUlRb2JDaE1JbGZxTDRlaTdfd0lWUmVWY0NoMzJud3dBRUFBWUFTQUFFZ0sxRF9EX0J3RSIsImV4dHJhX3BhcmFtcyI6e319LCJjdXJyZW50X3Nlc3Npb24iOnsidmFsdWUiOiJnY2xpZD1FQUlhSVFvYkNoTUlsZnFMNGVpN193SVZSZVZjQ2gzMm53d0FFQUFZQVNBQUVnSzFEX0RfQndFIiwiZXh0cmFfcGFyYW1zIjp7fX0sImNyZWF0ZWRfYXQiOjE2ODY1MTk3NjIyNDV9",
              privacy_data: {
                browser: "",
              },
              name: "WESLEY RODRIGUES DE MOURA",
              email: "wesleyadm2019@gmail.com",
              mobile_phone: "+55 (34) 99334-1711",
              user_agent:
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
              device: "smartphone",
              asset_id: 4530090,
              conversion_payload:
                '{"redirect_to":"https://wa.me/553437007001?text=Vim+pelo+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es."}',
            },
            event_timestamp: "2023-06-11T21:43:11Z",
          },
          Nome: "WESLEY RODRIGUES DE MOURA",
          Celular: "+55 (34) 99334-1711",
          UF: null,
        },
        created_at: "2023-06-11T18:43:11.901-03:00",
        cumulative_sum: "1",
        source: "btn-whatsapp-home",
        conversion_origin: {
          source: "Google",
          medium: "cpc",
          value: null,
          campaign: "(not set)",
          channel: "Paid Search",
        },
      },
      last_conversion: {
        content: {
          identificador: "Formulário - LP",
          traffic_source:
            "encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiZ2NsaWQ9RUFJYUlRb2JDaE1JbGZxTDRlaTdfd0lWUmVWY0NoMzJud3dBRUFBWUFTQUFFZ0sxRF9EX0J3RSIsImV4dHJhX3BhcmFtcyI6e319LCJjdXJyZW50X3Nlc3Npb24iOnsidmFsdWUiOiJnY2xpZD1FQUlhSVFvYkNoTUlsZnFMNGVpN193SVZSZVZjQ2gzMm53d0FFQUFZQVNBQUVnSzFEX0RfQndFIiwiZXh0cmFfcGFyYW1zIjp7fX0sImNyZWF0ZWRfYXQiOjE2ODY1MTk3NjIyNDV9",
          post_id: "9",
          form_id: "450515f",
          referer_title: "Orçamento – Ampère Energias",
          queried_id: "9",
          form_fields_nome: "WESLEY RODRIGUES DE MOURA",
          form_fields_WhatsApp: "34993341711",
          form_fields_cidade: "Itumbiara GO ",
          form_fields_conta: "700",
          form_url: "https://ampereenergias.com.br/lp/",
          page_title: "Orçamento – Ampère Energias – Ampère Energias",
          email_lead: "wesleyadm2019@gmail.com",
          UF: null,
        },
        created_at: "2023-06-11T18:44:10.437-03:00",
        cumulative_sum: "2",
        source: "Formulário - LP",
        conversion_origin: {
          source: "Google",
          medium: "cpc",
          value: null,
          campaign: "(not set)",
          channel: "Paid Search",
        },
      },
      custom_fields: {},
      website: null,
      personal_phone: null,
      mobile_phone: "+55 (34) 99334-1711",
      city: null,
      state: null,
      tags: null,
      lead_stage: "Lead",
      last_marked_opportunity_date: "2023-06-12T09:46:14.862-03:00",
      uuid: "8b4d2932-6299-4cc3-8e3e-f07cdc087c05",
      fit_score: "d",
      interest: 0,
    };
    const formattedLeadObj = {
      nome: lead.name,
      telefone: lead.mobile_phone,
      email: lead.email,
    };
    const response = await testCollection.insertOne({
      objeto: lead,
      formatado: formattedLeadObj,
    });
    res.status(201).json({
      data: "Lead cadastrado com sucesso.",
      message: "Lead cadastrado com sucesso.",
    });
  } else {
    throw new createHttpError.BadRequest("Lista de leads não fornecida.");
  }
};

export default apiHandler({
  POST: collectLead,
});
