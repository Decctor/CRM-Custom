import { Funnel } from "./models";

export const customersAcquisitionChannels = [
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  {
    label: "CALCULADORA SOLAR",
    value: "CALCULADORA SOLAR",
  },
  { label: "GOOGLE ADS", value: "GOOGLE ADS" },
  { label: "FACEBOOK ADS", value: "FACEBOOK ADS" },
  { label: "INDICAÇÃO", value: "INDICAÇÃO" },
  { label: "PASSIVO", value: "PASSIVO" },
  { label: "PROSPECÇÃO ATIVA", value: "PROSPECÇÃO ATIVA" },
];
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
      tabelaVenda: {
        visualizarItens: true,
        habitarDesabilitarItens: true,
        editarQuantidades: true,
        adicionarItens: true,
        visualizarPrecos: true,
        visualizarMargem: true,
        editarMargem: true,
      },
      projetos: {
        serResponsavel: true,
        editarResponsavel: true,
        visualizarDocumentos: true,
        editarDocumentos: true,
      },
      clientes: {
        serRepresentante: true,
        editarRepresentante: true,
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
