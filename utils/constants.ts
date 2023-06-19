import { Funnel } from "./models";
export const fileTypes = {
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
      { id: 8, nome: "Contrato Assinado" },
    ],
  },
  {
    id: 2,
    nome: "INSIDE SALES (TESTE)",
    modo: "REPRESENTANTE",
    etapas: [
      { id: 1, nome: "Para Atender" },
      { id: 2, nome: "Para Qualificar" },
      { id: 3, nome: "Criação de Proposta" },
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
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
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
];
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
    margemPadrao: 12,
    comissaoPadraoRepresentante: 4,
    comissaoSemResponsavel: 4,
    comissaoComResponsavel: 2,
  },
];
export const customersNich = [
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  { label: "RESIDENCIAL", value: "RESIDENCIAL" },
  { label: "COMERCIAL", value: "COMERCIAL" },
  { label: "RURAL", value: "RURAL" },
  { label: "INDUSTRIAL", value: "INDUSTRIAL" },
];
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

export const proposeTemplates = [
  { label: "TEMPLATE SIMPLES", value: "TEMPLATE SIMPLES" },
] as const;
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
