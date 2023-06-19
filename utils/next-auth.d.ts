import NextAuth from "next-auth";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      name: string;
      email: string;
      image: string;
      visibilidade: "GERAL" | "PRÓPRIA" | string[];
      funisVisiveis: number[] | "TODOS";
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
}
