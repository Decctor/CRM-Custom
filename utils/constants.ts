import {
  getProposeBYDObject,
  getProposeObject,
  getProposeOeMObject,
} from "./methods";
import { Funnel } from "./models";
export const opportunityReceivers = [
  {
    id: "648b58b87eda10953a3df921",
    nome: "Leandro Viali",
    alias: "LEANDRO VIALI",
  },
  {
    id: "649447fa518686bf3b32aeaf",
    nome: "Gabriel Emanuel",
    alias: "GABRIEL EMANUEL",
  },
  {
    id: "6494484b518686bf3b32aeb0",
    nome: "Yasmim Araujo",
    alias: "YASMIM ARAUJO",
  },
  {
    id: "6494484b518686bf3b32aeb0",
    nome: "Lucas Fernandes",
    alias: "Lucas Fernandes",
  },
];
export const companySignerKeys = [
  {
    key: "8cb69cac-4044-48fd-8ada-1d699f64bd1d",
    email: "matheus.oliveira@ampereenergias.com.br",
    name: "Matheus de Lima Oliveira",
    documentation: "136.680.836-30",
    sign_as: "validator",
  },
  {
    key: "06d287f1-ae2a-4e01-ba10-4ca31c944dd2",
    email: "financeiro@ampereenergias.com.br",
    name: "Diogo Paulino Carvalho",
    documentation: "072.427.186-43",
    sign_as: "contractee",
  },
];
export const TechAnalysisSolicitationTypes = [
  "VISITA TÉCNICA REMOTA - URBANA",
  "VISITA TÉCNICA REMOTA - RURAL",
  "VISITA TÉCNICA IN LOCO - URBANA",
  "VISITA TÉCNICA IN LOCO - RURAL",
  "ALTERAÇÃO DE PROJETO",
  "AUMENTO DE SISTEMA AMPÈRE",
  "DESENHO PERSONALIZADO",
  "ORÇAMENTAÇÃO",
] as const;
type FileTypes = {
  [contentType: string]: {
    title: string;
    extension: string;
  };
};
export const fileTypes: FileTypes = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    title: "WORD",
    extension: ".docx",
  },
  "image/png": {
    title: "IMAGEM (.PNG)",
    extension: ".png",
  },
  "image/jpeg": {
    title: "IMAGEM(.JPEG)",
    extension: ".jpeg",
  },
  "image/tiff": {
    title: "IMAGEM(.TIFF)",
    extension: ".tiff",
  },
  "application/pdf": {
    title: "PDF",
    extension: ".pdf",
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    title: "EXCEL",
    extension: ".xlsx",
  },
  "text/xml": {
    title: "XML",
    extension: ".xml",
  },
  "video/mp4": {
    title: "MP4",
    extension: ".mp4",
  },
  "application/vnd.sealed.tiff": {
    title: "IMAGEM(.TIFF)",
    extension: ".tiff",
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    title: "IMAGEM(.JPG)",
    extension: ".jpg",
  },
};
export const funnels: Funnel[] = [
  {
    id: 1,
    nome: "VENDAS",
    modo: "RESPONSÁVEL",
    etapas: [
      { id: 1, nome: "Para Atender" },
      { id: 2, nome: "Para Qualificar" },
      { id: 3, nome: "Criação de Proposta" },
      { id: 4, nome: "Negociação" },
      { id: 5, nome: "Aprovação Técnica" },
      { id: 6, nome: "Liberação de Crédito" },
      { id: 7, nome: "Acompanhamento" },
      { id: 8, nome: "Contrato Solicitado" },
      { id: 9, nome: "Contrato Assinado" },
    ],
  },
  {
    id: 2,
    nome: "INSIDE SALES",
    modo: "REPRESENTANTE",
    etapas: [
      { id: 1, nome: "Primeiros contatos" },
      { id: 2, nome: "Identificação de interesse" },
      { id: 3, nome: "Qualificação" },
      { id: 4, nome: "Envio" },
    ],
  },
];
export const creditors = [
  {
    label: "BANCO DO BRASIL",
    value: "BANCO DO BRASIL",
  },
  {
    label: "BRADESCO",
    value: "BRADESCO",
  },
  {
    label: "BV FINANCEIRA",
    value: "BV FINANCEIRA",
  },
  {
    label: "CAIXA",
    value: "CAIXA",
  },
  {
    label: "COOPACREDI",
    value: "COOPACREDI",
  },
  {
    label: "CREDICAMPINA",
    value: "CREDICAMPINA",
  },
  {
    label: "CREDIPONTAL",
    value: "CREDIPONTAL",
  },
  {
    label: "SANTANDER",
    value: "SANTANDER",
  },
  {
    label: "SOL FÁCIL",
    value: "SOL FÁCIL",
  },
  {
    label: "SICRED",
    value: "SICRED",
  },
  {
    label: "SICOOB ARACOOP",
    value: "SICOOB ARACOOP",
  },
  {
    label: "SICOOB",
    value: "SICOOB",
  },
] as const;
export const customersAcquisitionChannels = [
  {
    id: 1,
    label: "NETWORK",
    value: "NETWORK",
  },
  {
    id: 2,
    label: "INSIDE SALES",
    value: "INSIDE SALES",
  },
  {
    id: 3,
    label: "INDICAÇÃO DE AMIGO",
    value: "INDICAÇÃO DE AMIGO",
  },
  {
    id: 4,
    label: "CALCULADORA SOLAR",
    value: "CALCULADORA SOLAR",
  },
  { id: 5, label: "GOOGLE ADS", value: "GOOGLE ADS" },
  { id: 6, label: "FACEBOOK ADS", value: "FACEBOOK ADS" },
  {
    id: 7,
    label: "PORTA A PORTA",
    value: "PORTA A PORTA",
  },
  {
    id: 8,
    label: "TELEVENDAS",
    value: "TELEVENDAS",
  },
  {
    id: 9,
    label: "EVENTO",
    value: "EVENTO",
  },
  {
    id: 10,
    label: "PASSIVO",
    value: "PASSIVO",
  },
  { id: 11, label: "PROSPECÇÃO ATIVA", value: "PROSPECÇÃO ATIVA" },
] as const;
export const roles = [
  {
    id: 1,
    role: "Administrador",
    permissoes: {
      usuarios: {
        visualizar: true,
        editar: true,
      },
      comissoes: {
        visualizar: true,
        editar: true,
      },
      kits: {
        visualizar: true,
        editar: true,
      },
      propostas: {
        visualizar: true,
        editar: true,
      },
      projetos: {
        serResponsavel: true,
        editar: true,
      },
      clientes: {
        serRepresentante: true,
        editar: true,
      },
      precos: {
        visualizar: true,
        editar: true,
      },
    },
  },
  {
    id: 2,
    role: "Promotor de Vendas",
    permissoes: {
      usuarios: {
        visualizar: false, // visualizar área de usuário em auth/users
        editar: false, // criar usuários e editar informações de usuários em auth/users
      },
      comissoes: {
        visualizar: false, // visualizar comissões de todos os usuários
        editar: false, // editar comissões de todos os usuários
      },
      kits: {
        visualizar: true, // visualizar área de kits e kits possíveis
        editar: false, // editar e criar kits
      },
      propostas: {
        visualizar: false, // visualizar área de controle de propostas
        editar: false, // criar propostas em qualquer projeto e editar propostas de outros usuários
      },
      projetos: {
        serResponsavel: true, // habilitado a ser responsável de projetos
        editar: false, // editar informações de todos os projetos
      },
      clientes: {
        serRepresentante: true, // habilitado a ser representante de clientes
        editar: false, // editar informações de todos os clientes
      },
      precos: {
        visualizar: false, // visualizar precificacao geral, com custos, impostos, lucro e afins de propostas e kits
        editar: false, // editar precificacao de propostas
      },
    },
  },
];
export const comissionTable = [
  {
    id: 1,
    nome: "VENDEDOR INTERNO",
    comissaoPadraoRepresentante: 4,
    semRepresentante: 4,
    comRepresentante: 2,
  },
];
export const signMethods = [
  {
    value: "FISICO",
    label: "FISICO",
  },
  {
    value: "DIGITAL",
    label: "DIGITAL",
  },
] as const;
export const paTypes = [
  {
    label: "MONO 40A",
    value: "MONO 40A",
  },
  {
    label: "MONO 63A",
    value: "MONO 63A",
  },
  {
    label: "BIFASICO 63A",
    value: "BIFASICO 63A",
  },
  {
    label: "BIFASICO 70A",
    value: "BIFASICO 70A",
  },
  {
    label: "BIFASICO 100A",
    value: "BIFASICO 100A",
  },
  {
    label: "BIFASICO 125A",
    value: "BIFASICO 125A",
  },
  {
    label: "BIFASICO 150A",
    value: "BIFASICO 150A",
  },
  {
    label: "BIFASICO 200A",
    value: "BIFASICO 200A",
  },
  {
    label: "TRIFASICO 63A",
    value: "TRIFASICO 63A",
  },
  {
    label: "TRIFASICO 100A",
    value: "TRIFASICO 100A",
  },
  {
    label: "TRIFASICO 125A",
    value: "TRIFASICO 125A",
  },
  {
    label: "TRIFASICO 150A",
    value: "TRIFASICO 150A",
  },
  {
    label: "TRIFASICO 200A",
    value: "TRIFASICO 200A",
  },
];
export const customersNich = [
  { label: "RESIDENCIAL", value: "RESIDENCIAL" },
  { label: "COMERCIAL", value: "COMERCIAL" },
  { label: "RURAL", value: "RURAL" },
  { label: "INDUSTRIAL", value: "INDUSTRIAL" },
] as const;
export const maritalStatus = [
  {
    id: 1,
    label: "SOLTEIRO(A)",
    value: "SOLTEIRO(A)",
  },
  {
    id: 2,
    label: "CASADO(A)",
    value: "CASADO(A)",
  },
  {
    id: 3,
    label: "UNIÃO ESTÁVEL",
    value: "UNIÃO ESTÁVEL",
  },
  {
    id: 4,
    label: "DIVORCIADO(A)",
    value: "DIVORCIADO(A)",
  },
  {
    id: 5,
    label: "VIUVO(A)",
    value: "VIUVO(A)",
  },
] as const;
export const leadscoreBranding = [
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];
export const leadscoreProduto = [
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];

export const structureTypes = [
  { label: "Carport", value: "Carport" },
  { label: "Cerâmico", value: "Cerâmico" },
  { label: "Fibrocimento", value: "Fibrocimento" },
  { label: "Laje", value: "Laje" },
  { label: "Metálico", value: "Metálico" },
  { label: "Zipado", value: "Zipado" },
  { label: "Solo", value: "Solo" },
  { label: "Sem estrutura", value: "Sem estrutura" },
] as const;

export const phases = [
  { label: "Monofásico", value: "Monofásico" },
  { label: "Bifásico", value: "Bifásico" },
  { label: "Trifásico", value: "Trifásico" },
] as const;
export const proposeVoltageOptions = [
  { label: "127/220V", value: "127/220V" },
  { label: "220/380V", value: "220/380V" },
  { label: "277/480V", value: "277/480V" },
] as const;
export const distributorsOptions = [
  { label: "CEMIG D", value: "CEMIG D" },
  { label: "EQUATORIAL GO", value: "EQUATORIAL GO" },
] as const;
export const subgroupsOptions = [
  { label: "RESIDENCIAL", value: "RESIDENCIAL" },
  { label: "COMERCIAL", value: "COMERCIAL" },
  { label: "RURAL", value: "RURAL" },
] as const;
export const energyTariffs = {
  "CEMIG D": {
    RESIDENCIAL: {
      tarifa: 0.95643,
      tusd: 0.24038,
    },
    COMERCIAL: {
      tarifa: 0.95643,
      tusd: 0.24038,
    },
    RURAL: {
      tarifa: 0.95643,
      tusd: 0.24038,
    },
  },
  "EQUATORIAL GO": {
    RESIDENCIAL: {
      tarifa: 0.83861,
      tusd: 0.17457,
    },
    COMERCIAL: {
      tarifa: 0.83861,
      tusd: 0.17457,
    },
    RURAL: {
      tarifa: 0.83861,
      tusd: 0.17457,
    },
  },
} as const;
export const orientations = [
  "LESTE",
  "NORDESTE",
  "NORTE",
  "NOROESTE",
  "OESTE",
  "SUDOESTE",
  "SUL",
  "SUDESTE",
] as const;
export const projectTypes = [
  { label: "SISTEMA FOTOVOLTAICO", value: "SISTEMA FOTOVOLTAICO" },
  { label: "OPERAÇÃO E MANUTENÇÃO", value: "OPERAÇÃO E MANUTENÇÃO" },
] as const;
export const oemPlans = [
  { label: "MANUTENÇÃO SIMPLES", value: "MANUTENÇÃO SIMPLES", id: 1 },
  { label: "PLANO SOL", value: "PLANO SOL", id: 2 },
  { label: "PLANO SOL+", value: "PLANO SOL+", id: 3 },
];
export const proposeTemplates = [
  {
    label: "TEMPLATE SIMPLES",
    value: "TEMPLATE SIMPLES",
    templateId: "LPHl6ETXfSmY3QsHJqAW",
    applicableProjectTypes: ["SISTEMA FOTOVOLTAICO"],
    createProposeObj: getProposeObject,
  },
  {
    label: "TEMPLATE PARCEIRA BYD",
    value: "TEMPLATE PARCEIRA BYD",
    templateId: "QMIYo5Aw51DGlb1n8dUp",
    applicableProjectTypes: ["SISTEMA FOTOVOLTAICO"],
    createProposeObj: getProposeBYDObject,
  },
  {
    label: "TEMPLATE O&M",
    value: "TEMPLATE O&M",
    templateId: "Cf2vPPIkSi7XEpuXV8Xv",
    applicableProjectTypes: ["OPERAÇÃO E MANUTENÇÃO"],
    createProposeObj: getProposeOeMObject,
  },
] as const;
export const leadLoseJustification = {
  "Demora no follow": {
    deal_lost_reason: {
      id: "63ce9e5fce5a15002506d8f9",
      _id: "63ce9e5fce5a15002506d8f9",
      name: "Demora no follow",
      // created_at: "2023-01-23T11:49:03.807-03:00",
      // updated_at: "2023-01-23T11:49:03.807-03:00",
    },
  },
  "Não gosto do produto/serviço": {
    deal_lost_reason: {
      id: "63ce9e5fce5a15002506d8fc",
      _id: "63ce9e5fce5a15002506d8fc",
      name: "Não gosto do produto/serviço",
      // created_at: "2023-01-23T11:49:03.889-03:00",
      // updated_at: "2023-01-23T11:49:03.889-03:00",
    },
  },
  "Cliente optou por não realizar o projeto": {
    deal_lost_reason: {
      id: "63ce9e5fce5a15002506d8fc",
      _id: "63ce9e5fce5a15002506d8fc",
      name: "Cliente optou por não realizar o projeto",
      // created_at: "2023-01-23T11:49:03.889-03:00",
      // updated_at: "2023-01-23T11:49:03.889-03:00",
    },
  },
  "Fechou com outra empresa": {
    deal_lost_reason: {
      id: "63ce9e5fce5a15002506d8fb",
      _id: "63ce9e5fce5a15002506d8fb",
      name: "Fechou com outra empresa",
      // created_at: "2023-01-23T11:49:03.879-03:00",
      // updated_at: "2023-01-23T11:49:03.879-03:00",
    },
  },
} as const;
export const firebaseServiceAccount = {
  type: "service_account",
  project_id: "sistemaampere",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};
