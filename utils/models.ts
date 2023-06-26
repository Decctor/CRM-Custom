import { ObjectId } from "mongodb";
import {
  creditors,
  phases,
  projectTypes,
  proposeTemplates,
  proposeVoltageOptions,
  structureTypes,
} from "./constants";
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
};
export type ModuleType = {
  id: string | number;
  fabricante: string;
  modelo: string;
  qtde: number;
  potencia: number;
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
export interface IProject {
  _id?: string;
  nome: string;
  tipoProjeto: (typeof projectTypes)[number]["value"];
  identificador: number;
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
  propostas?: IProposeInfo[];
  propostaAtiva?: string;
  titularInstalacao?: string;
  numeroInstalacaoConcessionaria?: string;
  tipoTitular?: "PESSOA FISICA" | "PESSOA JURIDICA";
  tipoLigacao?: "EXISTENTE" | "NOVA";
  tipoInstalacao?: "URBANO" | "RURAL";
  credor?: (typeof creditors)[number]["value"];
  servicosAdicionais?: {
    padrao?: number;
    outros?: number;
  };
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
  dataEfetivacao?: string;
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
  estadoCivil?: string;
  profissao?: string;
  ondeTrabalha?: string;
  canalVenda?: string;
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
    tarifaEnergia: number;
    tarifaTUSD: number;
    tensaoRede: (typeof proposeVoltageOptions)[number]["value"] | string;
    fase: (typeof phases)[number]["value"] | string;
    fatorSimultaneidade: number;
    tipoEstrutura: (typeof structureTypes)[number]["label"] | string;
    distancia: number;
  };
  kit?: {
    kitId: string;
    nome: string;
    topologia: string;
    modulos: ModuleType[];
    inversores: InverterType[];
    preco: number;
  };
  precificacao?: {
    kit: {
      margemLucro: number;
      imposto: number;
      custo: number;
      vendaProposto: number;
      vendaFinal: number;
    };
    instalacao: {
      margemLucro: number;
      imposto: number;
      custo: number;
      vendaProposto: number;
      vendaFinal: number;
    };
    maoDeObra: {
      margemLucro: number;
      imposto: number;
      custo: number;
      vendaProposto: number;
      vendaFinal: number;
    };
    projeto: {
      margemLucro: number;
      imposto: number;
      custo: number;
      vendaProposto: number;
      vendaFinal: number;
    };
    venda: {
      margemLucro: number;
      imposto: number;
      custo: number;
      vendaProposto: number;
      vendaFinal: number;
    };
  };
  infoProjeto?: IProject;
  linkArquivo?: string;
  potenciaPico?: number;
  valorProposta?: number;
  dataInsercao?: string;
  aceite?: boolean;
  dataEfetivacao?: string;
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
