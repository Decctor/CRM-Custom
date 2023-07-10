import { ObjectId } from "mongodb";
import {
  creditors,
  customersAcquisitionChannels,
  customersNich,
  distributorsOptions,
  maritalStatus,
  orientations,
  phases,
  projectTypes,
  proposeTemplates,
  proposeVoltageOptions,
  signMethods,
  structureTypes,
  subgroupsOptions,
} from "./constants";
import { PricesObj, PricesPromoObj } from "./pricing/methods";
type Etiqueta = {
  id: number;
  nome: string;
  cor: string;
};
export type Funnel = {
  id: number;
  nome: string;
  modo: "RESPONSÁVEL" | "REPRESENTANTE";
  etapas: { id: number; nome: string }[];
};
export interface IMessage {
  text: string;
  color: string;
}
export interface Comissao {
  semRepresentante: number;
  comRepresentante: number;
}
export type InverterType = {
  id: string | number;
  fabricante: string;
  modelo: string;
  qtde: number;
  garantia?: number;
  potenciaNominal: number;
};
export type ModuleType = {
  id: string | number;
  fabricante: string;
  modelo: string;
  qtde: number;
  potencia: number;
  garantia?: number;
};
type StructureComponent = {
  insumo: string;
  tipo: string;
  qtde: number;
  medida: string;
};
export interface IKit {
  _id?: string;
  nome: string;
  categoria: "ON-GRID" | "OFF-GRID" | "BOMBA SOLAR";
  tipo: "TRADICIONAL" | "PROMOCIONAL";
  topologia: "INVERSOR" | "MICRO-INVERSOR";
  potPico?: number;
  preco: number;
  ativo: boolean;
  fornecedor: string;
  estruturasCompativeis: string[];
  incluiEstrutura: boolean;
  incluiTransformador: boolean;
  inversores: InverterType[];
  modulos: ModuleType[];
  dataInsercao?: string;
}
export interface IUsuario {
  _id?: ObjectId | string;
  nome: string;
  telefone?: string;
  email: string;
  senha: string;
  avatar_url?: string;
  visibilidade: "GERAL" | "PRÓPRIA" | string[];
  funisVisiveis: number[] | "TODOS";
  grupoPermissaoId: string | number;
  comissao: Comissao | null;
  permissoes: {
    usuarios: {
      visualizar: boolean; // visualizar área de usuário em auth/users
      editar: boolean; // criar usuários e editar informações de usuários em auth/users
    };
    comissoes: {
      visualizar: boolean; // visualizar comissões de todos os usuários
      editar: boolean; // editar comissões de todos os usuários
    };
    kits: {
      visualizar: boolean; // visualizar área de kits e kits possíveis
      editar: boolean; // editar e criar kits
    };
    propostas: {
      visualizar: boolean; // visualizar área de controle de propostas
      editar: boolean; // criar propostas em qualquer projeto e editar propostas de outros usuários
    };
    projetos: {
      serResponsavel: boolean; // habilitado a ser responsável de projetos
      editar: boolean; // editar informações de todos os projetos
    };
    clientes: {
      serRepresentante: boolean; // habilitado a ser representante de clientes
      editar: boolean; // editar informações de todos os clientes
    };
    precos: {
      visualizar: boolean; // visualizar precificacao geral, com custos, impostos, lucro e afins de propostas e kits
      editar: boolean; // editar precificacao de propostas
    };
  };
  dataInsercao?: string;
}
export interface ISession {
  user: {
    /** The user's postal address. */
    id: string;
    name: string;
    email: string;
    image?: string;
    visibilidade: "GERAL" | "PRÓPRIA" | string[];
    funisVisiveis: number[] | "TODOS";
    comissao: Comissao | null;
    permissoes: {
      usuarios: {
        visualizar: boolean; // visualizar área de usuário em auth/users
        editar: boolean; // criar usuários e editar informações de usuários em auth/users
      };
      comissoes: {
        visualizar: boolean; // visualizar comissões de todos os usuários
        editar: boolean; // editar comissões de todos os usuários
      };
      kits: {
        visualizar: boolean; // visualizar área de kits e kits possíveis
        editar: boolean; // editar e criar kits
      };
      propostas: {
        visualizar: boolean; // visualizar área de controle de propostas
        editar: boolean; // criar propostas em qualquer projeto e editar propostas de outros usuários
      };
      projetos: {
        serResponsavel: boolean; // habilitado a ser responsável de projetos
        editar: boolean; // editar informações de todos os projetos
      };
      clientes: {
        serRepresentante: boolean; // habilitado a ser representante de clientes
        editar: boolean; // editar informações de todos os clientes
      };
      precos: {
        visualizar: boolean; // visualizar precificacao geral, com custos, impostos, lucro e afins de propostas e kits
        editar: boolean; // editar precificacao de propostas
      };
    };
  };
}
export interface IRepresentative {
  nome: string;
  id: string;
  _id?: string;
}
export interface IResponsible {
  nome: string;
  id: string;
  avatar_url?: string;
  telefone?: string;
  _id?: string;
}
export type aditionalServicesType = {
  padrao?: number;
  estrutura?: number;
  outros?: number;
};
export interface IProject {
  _id?: string;
  nome: string;
  tipoProjeto: (typeof projectTypes)[number]["value"];
  identificador: string;
  idOportunidade?: string;
  responsavel: {
    nome: string;
    id: string;
  };
  representante: {
    nome: string;
    id: string;
  };
  clienteId: string;
  cliente?: IClient; // ajustar pós criação da interface de Cliente
  proposta?: IProposeInfo[];
  propostaAtiva?: string;
  titularInstalacao?: string;
  numeroInstalacaoConcessionaria?: string;
  tipoTitular?: "PESSOA FISICA" | "PESSOA JURIDICA";
  tipoLigacao?: "EXISTENTE" | "NOVA";
  tipoInstalacao?: "URBANO" | "RURAL";
  credor?: (typeof creditors)[number]["value"];
  servicosAdicionais?: aditionalServicesType;
  anexos?: {
    documentoComFoto?: string;
    iptu?: string;
    contaDeEnergia?: string;
  };
  descricao?: string;
  etiquetasIds?: number[];
  funis?: { id: number; etapaId: number }[];
  notas?: { id: number; data: Date; usuario: string; mensagem: string }[];
  atividades?: ProjectActivity[];
  dataInsercao?: string;
  dataPerda?: string;
  motivoPerda?: string;
  efetivacao?: boolean;
  dataEfetivacao?: string;
  idSolicitacaoContrato?: string;
}
export interface IClient {
  _id?: string;
  representante: {
    id: string;
    nome: string;
  } | null;
  nome: string;
  cpfCnpj: string;
  telefonePrimario: string;
  telefoneSecundario?: string;
  email: string;
  cep: string;
  bairro: string;
  endereco: string;
  numeroOuIdentificador: string;
  complemento?: string;
  uf: "MG" | "GO" | null;
  cidade?: string | null;
  dataNascimento?: string;
  rg?: string;
  estadoCivil?: (typeof maritalStatus)[number]["value"];
  profissao?: string;
  ondeTrabalha?: string;
  canalVenda?: (typeof customersAcquisitionChannels)[number]["value"] | null;
  dataInsercao?: Date | null;
  projetos?: IProject[];
}

export interface IProposeInfo {
  _id?: string;
  nome?: string;
  template?: (typeof proposeTemplates)[number]["value"];
  projeto: {
    nome?: string;
    id?: string;
  };
  autor?: {
    nome?: string;
    id?: string;
  };
  premissas: {
    consumoEnergiaMensal: number;
    fatorSimultaneidade: number;
    distribuidora: (typeof distributorsOptions)[number]["value"];
    subgrupo?: (typeof subgroupsOptions)[number]["value"];
    tarifaEnergia: number;
    tarifaTUSD: number;
    tensaoRede: (typeof proposeVoltageOptions)[number]["value"] | string;
    fase: (typeof phases)[number]["value"] | string;
    tipoEstrutura: (typeof structureTypes)[number]["value"];
    orientacao: (typeof orientations)[number];
    distancia: number;
  };
  kit?: {
    kitId: string;
    tipo?: "TRADICIONAL" | "PROMOCIONAL";
    nome: string;
    topologia: string;
    modulos: ModuleType[];
    inversores: InverterType[];
    preco: number;
  };
  precificacao?: PricesObj | PricesPromoObj;
  infoProjeto?: IProject;
  linkArquivo?: string;
  potenciaPico?: number;
  valorProposta?: number;
  dataInsercao?: string;
  aceite?: boolean;
  dataEfetivacao?: string;
  idSolicitacaoContrato?: string;
}
export interface IProposeOeMInfo {
  _id?: string;
  nome?: string;
  template?: (typeof proposeTemplates)[number]["value"];
  projeto: {
    nome?: string;
    id?: string;
  };
  autor?: {
    nome?: string;
    id?: string;
  };
  premissas: {
    consumoEnergiaMensal: number;
    tarifaEnergia: number;
    distancia: number;
    qtdeModulos: number;
    potModulos: number;
    eficienciaAtual: number;
  };
  precificacao?: {
    manutencaoSimples: {
      vendaProposto: number;
      vendaFinal: number;
    };
    planoSol: {
      vendaProposto: number;
      vendaFinal: number;
    };
    planoSolPlus: {
      vendaProposto: number;
      vendaFinal: number;
    };
  };
  infoProjeto?: IProject;
  linkArquivo?: string;
  potenciaPico?: number;
  idPlanoEscolhido?: number;
  valorProposta?: number;
  dataInsercao?: string;
  aceite?: boolean;
  dataEfetivacao?: string;
  idSolicitacaoContrato?: string;
}
export interface IContractRequest {
  nomeVendedor?: string;
  nomeDoProjeto: string;
  telefoneVendedor: string;
  tipoDeServico: (typeof projectTypes)[number]["value"];
  nomeDoContrato: string;
  telefone: string;
  cpf_cnpj: string;
  rg: string;
  dataDeNascimento?: string | null;
  cep: string;
  cidade?: string | null;
  uf: "MG" | "GO" | null;
  enderecoCobranca: string;
  numeroResCobranca: string;
  bairro: string;
  pontoDeReferencia: string;
  segmento?: (typeof customersNich)[number]["value"];
  formaAssinatura?: (typeof signMethods)[number]["value"];
  codigoSVB: string;
  estadoCivil?: (typeof maritalStatus)[number]["value"] | null;
  email: string;
  profissao: string;
  ondeTrabalha: string;
  possuiDeficiencia: "NÃO" | "SIM";
  qualDeficiencia: string;
  canalVenda?: (typeof customersAcquisitionChannels)[number]["value"] | null;
  nomeIndicador: string;
  telefoneIndicador: string;
  comoChegouAoCliente: string;
  nomeContatoJornadaUm: string;
  telefoneContatoUm: string;
  nomeContatoJornadaDois: string;
  telefoneContatoDois: string;
  cuidadosContatoJornada: string;
  nomeTitularProjeto?: string;
  tipoDoTitular?: "PESSOA FISICA" | "PESSOA JURIDICA" | null;
  tipoDaLigacao?: "NOVA" | "EXISTENTE" | null;
  tipoDaInstalacao?: "URBANO" | "RURAL" | null;
  cepInstalacao: string;
  enderecoInstalacao: string;
  numeroResInstalacao?: string;
  numeroInstalacao?: string;
  bairroInstalacao: string;
  cidadeInstalacao?: string | null;
  ufInstalacao: "MG" | "GO" | null;
  pontoDeReferenciaInstalacao: string;
  loginCemigAtende: string;
  senhaCemigAtende: string;
  latitude: string;
  longitude: string;
  potPico?: number;
  geracaoPrevista?: number;
  topologia?: "INVERSOR" | "MICRO-INVERSOR" | null;
  marcaInversor: string;
  qtdeInversor: string;
  potInversor: string;
  marcaModulos: string;
  qtdeModulos: string | number;
  potModulos: string | null;
  tipoEstrutura: (typeof structureTypes)[number]["value"] | null;
  materialEstrutura?: "MADEIRA" | "FERRO" | null;
  estruturaAmpere?: "SIM" | "NÃO";
  responsavelEstrutura?: "NÃO SE APLICA" | "AMPERE" | "CLIENTE";
  formaPagamentoEstrutura?: string | null;
  valorEstrutura?: number | null;
  possuiOeM?: "SIM" | "NÃO";
  planoOeM?:
    | "PLANO SOL +"
    | "MANUTENÇÃO SIMPLES"
    | "NÃO SE APLICA"
    | "PLANO SOL";
  clienteSegurado?: "SIM" | "NÃO";
  tempoSegurado?: string;
  formaPagamentoOeMOuSeguro?: string;
  valorOeMOuSeguro?: number | null;
  aumentoDeCarga?: "SIM" | "NÃO" | null;
  caixaConjugada?: "SIM" | "NÃO" | null;
  tipoDePadrao?: string | null;
  aumentoDisjuntor?: "SIM" | "NÃO" | null;
  respTrocaPadrao?: "NÃO SE APLICA" | "AMPERE" | "CLIENTE" | null;
  formaPagamentoPadrao?: string | null;
  valorPadrao?: number | null;
  nomePagador: string;
  contatoPagador: string;
  necessidaInscricaoRural?: "SIM" | "NÃO" | null;
  inscriçãoRural: string;
  cpf_cnpjNF: string;
  localEntrega?: string | null;
  entregaIgualCobranca?: "NÃO" | "SIM" | "NÃO SE APLICA" | null;
  restricoesEntrega?: string | null;
  valorContrato: number | null;
  origemRecurso?: "FINANCIAMENTO" | "CAPITAL PRÓPRIO" | null;
  numParcelas: number | null;
  valorParcela: number | null;
  credor: (typeof creditors)[number]["value"] | null;
  nomeGerente: string;
  contatoGerente: string;
  necessidadeNFAdiantada?: "SIM" | "NÃO" | null;
  necessidadeCodigoFiname?: "SIM" | "NÃO" | null;
  formaDePagamento: string | null;
  descricaoNegociacao: string;
  possuiDistribuicao: "SIM" | "NÃO" | null;
  realizarHomologacao?: boolean;
  obsComercial?: string;
  distribuicoes: { numInstalacao: string; excedente?: number }[];
  links?: { title: string; link: string; format: string }[] | null;
}
export type ProjectActivity = {
  _id?: string;
  projetoId?: string;
  titulo: string;
  categoria: "ATIVIDADE" | null;
  tipo: "LIGAÇÃO" | "REUNIÃO" | "VISITA TÉCNICA";
  dataVencimento?: string;
  observacoes: string;
  dataInsercao?: string;
  dataConclusao?: string;
  responsavelId?: string;
  status?: "VERDE" | "LARANJA" | "VERMELHO";
};
export type ProjectNote = {
  _id?: string;
  projetoId?: string;
  categoria: "ANOTAÇÃO" | null;
  anotacao: string;
  dataInsercao?: string;
  responsavelId?: string;
};
export type ProjectUpdateLog = {
  _id?: string;
  projetoId: string;
  autor: {
    id: string;
    nome: string;
  };
  alteracoes: {
    [key: string]: string;
  };
};
export interface INotification {
  remetenteId: string;
  remetenteNome: string;
  destinatarioId: string;
  projetoReferencia?: string;
  mensagem: string;
  dataLeitura?: string;
  dataInsercao?: string;
}
