import { apiHandler, validateAuthentication } from "@/utils/api";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import ProjetosSolarMarket from "../../projects.json";
// import Users from "../../users.json";
import { z } from "zod";
import { hashSync } from "bcrypt";
import { roles } from "@/utils/constants";
import { escape, uniq } from "lodash";
import { decode } from "iconv-lite";
import connectToDatabase from "@/services/mongoclient";
import { ObjectId } from "mongodb";

import Inverters from "../../utils/pvinverters.json";
type GetResponse = {
  data: any;
};

// Método para requisições GET
// const createUsers: NextApiHandler<GetResponse> = async (req, res) => {
//   const formattedUsers = Users.map((user) => {
//     const adminRoles = ["Administrador", "SUPORTE A VENDAS"];
//     const comissoes = {
//       "PROMOTOR DE VENDAS INDIVIDUAL SENIOR": {
//         semRepresentante: 4,
//         comRepresentante: 2,
//       },
//       "PROMOTOR DE VENDAS INDIVIDUAL JUNIOR": {
//         semRepresentante: 1.5,
//         comRepresentante: 1,
//       },
//       "VENDEDOR INTERNO - AMPÈRE ENERGIAS": {
//         semRepresentante: 2,
//         comRepresentante: 1,
//       },
//       "INSIDE SALES": {
//         semRepresentante: 0.3,
//         comRepresentante: 0.3,
//       },
//     };
//     const object = {
//       nome: user.nome,
//       telefone: user.telefone,
//       email: user.email,
//       senha: hashSync("123456", 10),
//       avatar_url: user.foto,
//       visibilidade: adminRoles.includes(user.papel.nome) ? "GERAL" : "PRÓPRIA",
//       funisVisiveis: adminRoles.includes(user.papel.nome)
//         ? "TODOS"
//         : user.papel.nome == "INSIDE SALES"
//         ? [1, 2]
//         : [1],
//       grupoPermissaoId: adminRoles.includes(user.papel.nome) ? 1 : 2,
//       comissao: comissoes[user.comissao?.nome]
//         ? comissoes[user.comissao?.nome]
//         : {
//             semRepresentante: 1.5,
//             comRepresentante: 1,
//           },
//       permissoes: adminRoles.includes(user.papel.nome)
//         ? roles[0].permissoes
//         : roles[1].permissoes,
//     };
//     return object;
//   });
//   // const { id } = req.query;
//   // if (id) {
//   //   const user = users.find((user) => user.id == Number(id));
//   //   if (!user)
//   //     throw new createHttpError.NotFound(
//   //       `Usuário com id ${id} não encontrado.`
//   //     );
//   //   res.status(200).json({ data: user });
//   // } else {
//   //   res.status(200).json({ data: users });
//   // }
//   res.status(200).json({ data: formattedUsers });
// };
const createClients: NextApiHandler<GetResponse> = async (req, res) => {
  // const formattedProjects = ProjetosSolarMarket.map((projeto) => {
  //   return {
  //     "NOME DO PROJETO": projeto.nome,
  //     EFETIVADO: projeto.propostaDataEfetivacao
  //       ? "VENDA FECHADA"
  //       : "NÃO FECHADA",
  //     "DATA EFETIVAÇÃO": projeto.propostaDataEfetivacao,
  //     "DATA DE CRIAÇÃO": projeto.dataInsercao,
  //     RESPONSÁVEL: projeto.responsavel,
  //     REPRESENTANTE: projeto.representante,
  //     "LINK DA PROPOSTA": projeto.propostaLinkPDF,
  //     "NOME DO CLIENTE": projeto.clienteNome,
  //     "EMPRESA DO CLIENTE (SE HOUVER)": projeto["Cliente - Empresa"],
  //     "CPF OU CNPJ": projeto.clienteCPF_CNPJ,
  //     EMAIL: projeto.clienteEmail,
  //     TELEFONE: projeto.clienteTelefone,
  //     CEP: projeto.clienteCEP,
  //     ESTADO: projeto.clienteEstado,
  //     CIDADE: projeto.clienteCidade,
  //     ENDEREÇO: projeto.clienteEndereco,
  //     BAIRRO: projeto.clienteBairro,
  //     "NÚMERO DA RESIDÊNCIA": projeto.clienteNumeroRes,
  //     "COMPLEMENTO DE ENDEREÇO": projeto.clienteComplemento,
  //     "VALOR DA PROPOSTA": projeto.propostaValorProposta,
  //     "POTÊNCIA PICO DA PROPOSTA": projeto.propostaPotenciaPico,
  //     "VALOR DA FATURA DE ENERGIA": projeto["VALOR DA CONTA"],
  //   };
  // });
  // const { id } = req.query;
  // if (id) {
  //   const user = users.find((user) => user.id == Number(id));
  //   if (!user)
  //     throw new createHttpError.NotFound(
  //       `Usuário com id ${id} não encontrado.`
  //     );
  //   res.status(200).json({ data: user });
  // } else {
  //   res.status(200).json({ data: users });
  // }
  // const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  // const projectsCollection = db.collection("projects");
  // const updatePipeline = [
  //   {
  //     $set: { "funis.$[elem].etapaId": 7 },
  //   },
  //   {
  //     arrayFilters: [{ "elem.id": 1 }],
  //   },
  // ];
  // const updateResponse = await projectsCollection.updateOne(
  //   {
  //     _id: new ObjectId("64a7f322dd3653cc70d8faed"),
  //   },
  //   ...updatePipeline
  // );
  // const formattedKits = Kits.map((kit) => {
  //   const formattedInvArr = kit.inversores.map((inverter) => {
  //     const invInfo = Inverters.find((inv) => inv.id == inverter.id);
  //     return {
  //       ...inverter,
  //       potenciaNominal: invInfo ? invInfo.potenciaNominal : 0,
  //     };
  //   });
  //   return {
  //     ...kit,
  //     inversores: formattedInvArr,
  //   };
  // });
  res.json({ data: "TESTE" });
  // const kits = await kitsCollection.find({}).toArray();
};

const userSchema = z.object({
  nome: z.string({ required_error: "Preencha um nome para o usuário." }),
  email: z
    .string({ required_error: "Preencha um email para o usuário." })
    .email({ message: "Preencha um email válido." }),
  role: z.string({ required_error: "Preencha uma função para o usuário." }),
});

export default apiHandler({
  GET: createClients,
});
