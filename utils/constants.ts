import { Funnel } from "./models";

export const funnels: Funnel[] = [
  {
    id: 1,
    nome: "VENDAS",
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
    nome: "TESTE",
    etapas: [
      { id: 1, nome: "Para Atender" },
      { id: 2, nome: "Para Qualificar" },
      { id: 3, nome: "Criação de Proposta" },
    ],
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
        visualizarComissaoResponsavel: true,
        editarComissaoResponsavel: true,
        visualizarComissaoRepresentante: true,
        editarComissaoRepresentante: true,
      },
      dimensionamento: {
        editarPremissas: true,
        editarFatorDeGeracao: true,
        editarInclinacao: true,
        editarDesvio: true,
        editarDesempenho: true,
        editarSombreamento: true,
      },
      kits: {
        visualizar: true,
        editar: true,
      },
      propostas: {
        visualizarPrecos: true,
        editarPrecos: true,
        visualizarMargem: true,
        editarMargem: true,
      },
      projetos: {
        serResponsavel: true,
        editar: true,
        visualizarDocumentos: true,
        editarDocumentos: true,
      },
      clientes: {
        serRepresentante: true,
        editar: true,
      },
    },
  },
  {
    id: 2,
    role: "Promotor de Vendas",
    permissoes: {
      usuarios: {
        visualizar: false,
        editar: false,
      },
      comissoes: {
        visualizarComissaoResponsavel: false,
        editarComissaoResponsavel: false,
        visualizarComissaoRepresentante: false,
        editarComissaoRepresentante: false,
      },
      dimensionamento: {
        editarPremissas: false,
        editarFatorDeGeracao: false,
        editarInclinacao: false,
        editarDesvio: false,
        editarDesempenho: false,
        editarSombreamento: false,
      },
      kits: {
        visualizar: true,
        editar: false,
      },
      propostas: {
        visualizarPrecos: false,
        editarPrecos: false,
        visualizarMargem: false,
        editarMargem: false,
      },
      projetos: {
        serResponsavel: true,
        editar: false,
        visualizarDocumentos: true,
        editarDocumentos: false,
      },
      clientes: {
        serRepresentante: true,
        editar: false,
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
