import { ObjectId } from "mongodb";

type Etiqueta = {
  id: number;
  nome: string;
  cor: string;
};
export type Funnel = {
  id: number;
  nome: string;
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
};
type StructureComponent = {
  insumo: string;
  tipo: string;
  qtde: number;
  medida: string;
};
export interface IKit {
  _id?: ObjectId;
  nome: string;
  categoria: "ON-GRID" | "OFF-GRID" | "BOMBA SOLAR";
  topologia: "INVERSOR" | "MICRO-INVERSOR";
  preco: Number;
  ativo: boolean;
  fornecedor: string;
  estruturasCompativeis: string[];
  incluiEstrutura: boolean;
  incluiTranformador: boolean;
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
        visualizarComissaoResponsavel: boolean;
        editarComissaoResponsavel: boolean;
        visualizarComissaoRepresentante: boolean;
        editarComissaoRepresentante: boolean;
      };
      dimensionamento: {
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
        visualizarMargem: boolean;
        editarMargem: boolean;
      };
      projetos: {
        serResponsavel: boolean;
        editar: boolean;
        visualizarDocumentos: boolean;
        editarDocumentos: boolean;
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
  titularInstalacao?: string;
  tipoTitular?: "PESSOA FISICA" | "PESSOA JURIDICA";
  tipoLigacao?: "EXISTENTE" | "NOVA";
  tipoInstalacao?: "URBANO" | "RURAL";
  descricao?: string;
  etiquetasIds?: number[];
  funis?: { id: number; etapaId: number }[];
  notas?: { id: number; data: Date; usuario: string; mensagem: string }[];
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
  consumoEnergiaMensal: number;
  tarifa: number;
  tarifaTUSD: number;
  tensao: string;
  fase: string;
  fatorSimultaneidade: number;
  tipoTelhado: string;
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
};
export type ProjectNote = {
  _id?: string;
  projetoId?: string;
  categoria: "ANOTAÇÃO" | null;
  anotacao: string;
  dataInsercao?: string;
  responsavelId?: string;
};
