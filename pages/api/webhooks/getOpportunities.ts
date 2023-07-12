import connectToDatabase from "@/services/mongoclient";
import { apiHandler } from "@/utils/api";
import { stateCities } from "@/utils/estados_cidades";
import { calculateStringSimilarity, formatToPhone } from "@/utils/methods";
import axios from "axios";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";

type PostResponse = {
  data: string;
  message: string;
};
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
const collectLead: NextApiHandler<PostResponse> = async (req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const testCollection = db.collection("test");
  const usersCollection = db.collection("users");
  const clientsCollection = db.collection("clients");
  const projectsCollection = db.collection("projects");
  const { body } = req;
  if (body.leads) {
    const lead = body.leads[0];
    if (!lead) throw new createHttpError.BadRequest("Nenhum lead encontrado.");
    const leadObj = {
      id: "2967700569",
      email: "lucasfernandes@email.com",
      name: "NOVO TESTE ERP",
      company: null,
      job_title: null,
      bio: null,
      public_url:
        "http://app.rdstation.com.br/leads/public/79d87e7a-ecae-4945-96ec-91b42f42699f",
      created_at: "2023-07-11T16:39:06.166-03:00",
      opportunity: "false",
      number_conversions: "2",
      user: "amperemkt@gmail.com",
      first_conversion: {
        content: {
          event_type: "TASK_CREATED",
          event_identifier: "Tarefa criada no RD Station CRM",
          identificador: "Tarefa criada no RD Station CRM",
          event_timestamp: null,
          task_owner: "Matheus Oliveira",
          task_type: "call",
          created_at: "2023-07-11T19:39:09Z",
          due_date: "2023-07-12T07:39:00Z",
          task_title: "Tarefa criada no RD Station CRM",
          __cdp__original_event: {
            event_batch_uuid: "44e6816f-6d6d-45fe-a070-bf455f4b04a9",
            event_batch_index: 0,
            event_identifier: "Tarefa criada no RD Station CRM",
            event_uuid: "e680df2e-658e-4061-9f41-43660f11f1f2",
            event_type: "TASK_CREATED",
            event_family: "CDP",
            event_timestamp: null,
            payload: {
              task_owner: "Matheus Oliveira",
              task_type: "call",
              created_at: "2023-07-11T19:39:09Z",
              email: "lucasfernandes@email.com",
              due_date: "2023-07-12T07:39:00Z",
              name: "NOVO TESTE ERP",
              task_title: "Tarefa criada no RD Station CRM",
            },
          },
          email_lead: "lucasfernandes@email.com",
          Nome: "NOVO TESTE ERP",
          UF: null,
        },
        created_at: "2023-07-11T16:39:09.000-03:00",
        cumulative_sum: "1",
        source: "Tarefa criada no RD Station CRM",
        conversion_origin: {
          source: "unknown",
          medium: "unknown",
          value: null,
          campaign: "unknown",
          channel: "Unknown",
        },
      },
      last_conversion: {
        content: {
          event_type: "OPPORTUNITY_UPDATED",
          event_identifier: "Oportunidade atualizada no RD Station CRM",
          identificador: "Oportunidade atualizada no RD Station CRM",
          event_timestamp: null,
          funnel: "VENDAS",
          opportunity_title: "Oportunidade atualizada no RD Station CRM",
          owner: "amperemkt@gmail.com",
          opportunity_value: 0,
          mark_opportunity: false,
          funnel_stage: "Criação de Proposta",
          opportunity_url:
            "https://crm.rdstation.com/app/#/deals/64adafd6f7be470020761b33",
          updated_at: "2023-07-11T19:39:06Z",
          opportunity_origin: "Cliente Ativo",
          opportunity_score: 1,
          __cdp__original_event: {
            event_batch_uuid: "6337c357-5b63-4ef6-abde-586dac1cf5c8",
            event_batch_index: 0,
            event_identifier: "Oportunidade atualizada no RD Station CRM",
            event_uuid: "62aea966-be66-4e1c-ae10-e45d249c9ae0",
            event_type: "OPPORTUNITY_UPDATED",
            event_family: "CDP",
            event_timestamp: null,
            payload: {
              funnel: "VENDAS",
              name: "NOVO TESTE ERP",
              email: "lucasfernandes@email.com",
              opportunity_title: "Oportunidade atualizada no RD Station CRM",
              contact_owner_email: "amperemkt@gmail.com",
              opportunity_value: 0,
              mark_opportunity: false,
              funnel_stage: "Criação de Proposta",
              opportunity_url:
                "https://crm.rdstation.com/app/#/deals/64adafd6f7be470020761b33",
              updated_at: "2023-07-11T19:39:06Z",
              opportunity_origin: "Cliente Ativo",
              opportunity_score: 1,
            },
          },
          email_lead: "lucasfernandes@email.com",
          Nome: "NOVO TESTE ERP",
          UF: null,
        },
        created_at: "2023-07-11T16:39:10.684-03:00",
        cumulative_sum: "2",
        source: "Oportunidade atualizada no RD Station CRM",
        conversion_origin: {
          source: "unknown",
          medium: "unknown",
          value: null,
          campaign: "unknown",
          channel: "Unknown",
        },
      },
      custom_fields: {
        "Origem da Oportunidade no CRM (última atualização)": "Cliente Ativo",
        "Qualificação da Oportunidade no CRM (última atualização)": "1",
        "Etapa do funil de vendas no CRM (última atualização)":
          "Criação de Proposta",
        "Valor total da Oportunidade no CRM (última atualização)": "0.0",
        "Nome do responsável pela Oportunidade no CRM (última atualização)":
          "Matheus Oliveira",
        "Funil de vendas no CRM (última atualização)": "VENDAS",
      },
      website: null,
      personal_phone: "3499312321",
      mobile_phone: null,
      city: null,
      state: null,
      tags: [],
      lead_stage: "Lead",
      last_marked_opportunity_date: null,
      uuid: "79d87e7a-ecae-4945-96ec-91b42f42699f",
      fit_score: "d",
      interest: 0,
    };
    const existingLead = await projectsCollection.findOne({
      idOportunidade:
        lead.last_conversion?.content?.opportunity_url.split("deals/")[1],
    });
    if (existingLead)
      throw new createHttpError.BadRequest("ID de oportunidade já cadastrado.");
    // Getting responsible based on Lead responsible email
    const responsible = await usersCollection.aggregate([
      {
        $match: {
          email: lead.user,
        },
      },
      {
        $project: {
          nome: 1,
          email: 1,
        },
      },
    ]);
    const respObj = {
      nome: responsible?.nome ? responsible?.nome : "Lucas Fernandes",
      id: responsible._id ? responsible._id : "6463ccaa8c5e3e227af54d89",
    };
    // Extracting info into a insertable client object
    const insertClientObject = {
      representante: respObj,
      nome: lead.name,
      cpfCnpj: "",
      telefonePrimario: lead.personal_phone
        ? formatToPhone(lead.personal_phone)
        : "",
      telefoneSecundario: "",
      email: lead.email,
      cep: "",
      bairro: "",
      endereco: "",
      numeroOuIdentificador: "",
      complemento: "",
      uf: getUF(lead.city, undefined),
      cidade: lead.city ? getCity(lead.city) : undefined,
    };
    const clientResponse = await clientsCollection.insertOne({
      ...insertClientObject,
    });
    // Getting last inserted object identificator
    const lastInsertedIdentificator = await projectsCollection
      .aggregate([
        {
          $project: {
            identificador: 1,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();
    const lastIdentifierNumber = lastInsertedIdentificator[0]
      ? Number(lastInsertedIdentificator[0].identificador.split("-")[1])
      : 0;
    const newIdentifierNumber = lastIdentifierNumber + 1;
    const identifier = `CRM-${newIdentifierNumber}`;
    // Extracting info into a insertable project object
    const insertObj = {
      nome: lead.name,
      identificador: identifier,
      tipoProjeto: "SISTEMA FOTOVOLTAICO",
      responsavel: respObj,
      representante: respObj,
      clienteId: clientResponse.insertedId.toString(),
      descricao: "",
      funis: [
        {
          id: 1,
          etapaId: 3,
        },
      ],
      dataInsercao: new Date().toISOString(),
      idOportunidade:
        lead.last_conversion?.content?.opportunity_url.split("deals/")[1],
      idLead: lead.id,
    };
    const projectsResponse = await projectsCollection.insertOne({
      ...insertObj,
    });
    console.log("RESPOSTA PROJETO", projectsResponse);
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
