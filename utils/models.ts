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
    tabelaVenda: {
      visualizarItens: boolean;
      habitarDesabilitarItens: boolean;
      editarQuantidades: boolean;
      adicionarItens: boolean;
      visualizarPrecos: boolean;
      visualizarMargem: boolean;
      editarMargem: boolean;
    };
    projetos: {
      serResponsavel: boolean;
      editarResponsavel: boolean;
      visualizarDocumentos: boolean;
      editarDocumentos: boolean;
    };
    clientes: {
      serRepresentante: boolean;
      editarRepresentante: boolean;
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
  dataInsercao: Date;
  dataConclusao?: Date;
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
  cidade: string;
  dataNascimento?: string;
  rg?: string;
  estadoCivil?: string;
  profissao?: string;
  ondeTrabalha?: string;
  canalVenda?: string;
  dataInsercao?: Date | null;
  projetos?: IProject[];
}
