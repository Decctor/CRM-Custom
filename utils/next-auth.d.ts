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
}
