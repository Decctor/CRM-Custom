import connectToDatabase from "@/services/mongoclient";
import { opportunityReceivers } from "@/utils/constants";
import { formatToPhone } from "@/utils/methods";
import axios from "axios";
import { ObjectId } from "mongodb";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
type Response = {
  message: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // DB of projects
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const clientsCollection = db.collection("clients");
  const projectsCollection = db.collection("projects");
  const { data } = await axios.get(
    `https://crm.rdstation.com/api/v1/deals?token=${process.env.RD_TOKEN}&win=null&deal_stage_id=63ce9e60ce5a15002506d92b`
  );
  const insertClientObject = {
    representante: {
      nome: "Lucas Fernandes",
      id: "6463ccaa8c5e3e227af54d89",
    },
    nome: "",
    cpfCnpj: "",
    telefonePrimario: "",
    telefoneSecundario: "",
    email: "",
    cep: "",
    bairro: "",
    endereco: "",
    numeroOuIdentificador: "",
    complemento: "",
    uf: null,
    cidade: "",
  };
  // Formatting opportunities from RD to Client Model
  const formattedClientsArrFromOpportunities = data.deals.map(
    (opportunity: any) => {
      const clientModel = {
        representante: {
          nome: "Lucas Fernandes",
          id: "6463ccaa8c5e3e227af54d89",
        },
        idOportunidade: opportunity.id,
        nome: opportunity.name,
        cpfCnpj: "",
        telefonePrimario:
          opportunity.contacts && opportunity.contacts.length > 0
            ? opportunity.contacts[0].phones[0]
              ? formatToPhone(opportunity.contacts[0].phones[0].phone)
              : "N/A"
            : "N/A",
        telefoneSecundario: "",
        email:
          opportunity.contacts && opportunity.contacts.length > 0
            ? opportunity.contacts[0].emails[0]
              ? opportunity.contacts[0].emails[0].email
              : "N/A"
            : "N/A",
        cep: "",
        bairro: "",
        endereco: "",
        numeroOuIdentificador: "",
        complemento: "",
        uf: null,
        cidade: "",
        dataInsercao: new Date().toISOString(),
      };
      return clientModel;
    }
  );
  // Searching for existings clients with corresponding idOportunidade
  const arrOfOportunityIds = formattedClientsArrFromOpportunities.map(
    (opportunity: any) => opportunity.idOportunidade
  );
  const existingCorrespondingOpportunitiesInDB = await clientsCollection
    .aggregate([
      {
        $match: {
          idOportunidade: { $in: arrOfOportunityIds },
        },
      },
      {
        $project: {
          _id: 1,
          idOportunidade: 1,
        },
      },
    ])
    .toArray();
  const arrOfCorrespodingClientsIDsInDB =
    existingCorrespondingOpportunitiesInDB.map((x: any) => x.idOportunidade);
  // Filtering clients arr to be inserted
  const filteredClientsArrFromOpportunities =
    formattedClientsArrFromOpportunities.filter(
      (x: any) => !arrOfCorrespodingClientsIDsInDB.includes(x.idOportunidade)
    );
  if (filteredClientsArrFromOpportunities.length > 0) {
    // Getting last opportunity inside sales receiver to better distribute the leads

    const lastOpportunityReceiver = await clientsCollection
      .aggregate([
        {
          $match: {
            idOportunidade: { $ne: null },
          },
        },
        {
          $project: {
            "representante.id": 1,
            dataInsercao: 1,
          },
        },
        {
          $sort: {
            dataInsercao: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();

    var lastOpportunityReceiverIndex =
      lastOpportunityReceiver.length > 0
        ? opportunityReceivers
            .map((x) => x.id)
            .indexOf(lastOpportunityReceiver.representante.id) != -1
          ? opportunityReceivers
              .map((x) => x.id)
              .indexOf(lastOpportunityReceiver.representante.id)
          : 0
        : 0;
    filteredClientsArrFromOpportunities.forEach(async (opportunity: any) => {
      // Getting next opportunity receiver
      if (lastOpportunityReceiverIndex + 1 >= opportunityReceivers.length) {
        lastOpportunityReceiverIndex = 0;
      } else {
        lastOpportunityReceiverIndex = lastOpportunityReceiverIndex + 1;
      }
      console.log("INDEX DO RECEIVER", lastOpportunityReceiverIndex);
      const receiver = opportunityReceivers[lastOpportunityReceiverIndex]
        ? opportunityReceivers[lastOpportunityReceiverIndex]
        : opportunityReceivers[0];

      // Inserting client
      const clientDBResponse = await clientsCollection.insertOne({
        ...opportunity,
        representante: receiver,
      });
      // Inserting project with the corresponding clienteId
      const projectInsertObj = {
        nome: opportunity.nome,
        idOportunidade: opportunity.idOportunidade,
        responsavel: receiver,
        representante: receiver,
        clienteId: new ObjectId(clientDBResponse.insertedId).toString(),
        descricao: "",
        funis: [
          {
            id: 2,
            etapaId: 1,
          },
        ],
      };
      const projectDBResponse = await projectsCollection.insertOne(
        projectInsertObj
      );
      console.log(receiver.nome, projectDBResponse.insertedId);
    });
    res.json("DEU CERTO");
  } else {
    res.json({
      data: "Nenhum oportunidade disponível para criação.",
      message: "Nenhum oportunidade disponível para criação.",
    });
  }
}
