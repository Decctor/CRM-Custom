import { ObjectId } from "mongodb";
import {
  creditors,
  phases,
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
  id: number;
  nome: string;
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
  topologia: "INVERSOR" | "MICRO-INVERSOR";
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
      editar: boolean; // editar informações de usuários em auth/users
    };
    comissoes: {
      visualizarComissaoResponsavel: boolean; // visualizar comissões dos responsáveis de todos os projetos
      editarComissaoResponsavel: boolean; // editar comissões dos responsáveis de todos os projetos
      visualizarComissaoRepresentante: boolean; // visualizar comissões dos representante de todos os projetos
      editarComissaoRepresentante: boolean; // editar comissões dos representante de todos os projetos
    };
    dimensionamento: {
      // a definir necessidade desse campo de autorizações
      editarPremissas: boolean;
      editarFatorDeGeracao: boolean;
      editarInclinacao: boolean;
      editarDesvio: boolean;
      editarDesempenho: boolean;
      editarSombreamento: boolean;
    };
    kits: {
      visualizar: boolean; // visualizar área de kits e kits possíveis
      editar: boolean; // editar e criar kits
    };
    propostas: {
      visualizarPrecos: boolean; // visualizar o detalhamento de custos
      editarPrecos: boolean; // editar custo dos itens que compoe o preço de uma proposta
      visualizarMargem: boolean; // visualizar margem de lucro de propostas
      editarMargem: boolean; // editar margem de lucro de propostas
    };
    projetos: {
      serResponsavel: boolean; // habilitado a ser responsável de projetos
      editar: boolean; // editar informações de todos os projetos
      visualizarDocumentos: boolean; // visualizar documentos anexados de todos os projetos
      editarDocumentos: boolean; // editar documentos anexados de todos os projetos
    };
    clientes: {
      serRepresentante: boolean; // habilitado a ser representante de clientes
      editar: boolean; // editar informações de todos os clientes
    };
  };
}
export interface ISession {
  user: {
    /** The user's postal address. */
    id: string;
    name: string;
    email: string;
    visibilidade: "GERAL" | "PRÓPRIA" | string[];
    funisVisiveis: number[] | "TODOS";
    permissoes: {
      usuarios: {
        visualizar: boolean;
        editar: boolean;
      };
      comissoes: {
        // avaliar necessidade desse objeto de permissões, possivelmente remodelar
        visualizarComissaoResponsavel: boolean;
        editarComissaoResponsavel: boolean;
        visualizarComissaoRepresentante: boolean;
        editarComissaoRepresentante: boolean;
      };
      dimensionamento: {
        // avaliar necessidade desse objeto de permissões
        editarPremissas: boolean;
        editarFatorDeGeracao: boolean;
        editarInclinacao: boolean;
        editarDesvio: boolean;
        editarDesempenho: boolean;
        editarSombreamento: boolean;
      };
      kits: {
        visualizar: boolean;
        editar: boolean;
      };
      propostas: {
        visualizarPrecos: boolean;
        editarPrecos: boolean;
        visualizarMargem: boolean; // avaliar necessidade
        editarMargem: boolean; // avaliar necessidade
      };
      projetos: {
        serResponsavel: boolean;
        editar: boolean;
        visualizarDocumentos: boolean; // avaliar necessidade
        editarDocumentos: boolean; // avaliar necessidade
      };
      clientes: {
        serRepresentante: boolean;
        editar: boolean;
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
  _id?: string;
}
export interface IProject {
  _id?: string;
  nome: string;
  identificador: number;
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
  dataInsercao: string;
  dataConclusao?: string;
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
