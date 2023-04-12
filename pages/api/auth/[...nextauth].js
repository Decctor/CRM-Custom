import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import connectToDatabase from "../../../services/mongoclient";
// Hash para senha padrão 123456789: $2b$10$zh5TZpnAZ9APevFJaYFIf.1DgkIuLfWlKrbXfS0Gdy0XxDSlSb74K

const fakeDb = [
  {
    nome: "Lucas Fernandes",
    email: "admin@email.com",
    senha: "$2b$10$zh5TZpnAZ9APevFJaYFIf.1DgkIuLfWlKrbXfS0Gdy0XxDSlSb74K",
    avatar_url: "https://avatars.githubusercontent.com/u/60222823?v=4",
  },
];
export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 5,
  },
  jwt: {
    maxAge: 60 * 60 * 5,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const db = await connectToDatabase(process.env.MONGODB_URI, "main");
        const collection = db.collection("users");
        const userInDb = await collection.findOne({ email: email });

        if (!userInDb)
          throw new createHttpError.BadRequest("Usuário não encontrado.");

        let compareResult = bcrypt.compareSync(password, userInDb.senha);
        if (!compareResult)
          throw new createHttpError.BadRequest("Senha incorreta.");

        const user = {
          id: userInDb._id,
          email: userInDb.email,
          name: userInDb.nome,
          image: userInDb.avatar_url,
          visibilidade: userInDb.visibilidade,
          permissoes: userInDb.permissoes,
        };
        // If no error and we have user data, return it
        if (user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("USER", user);
      // console.log("ACCOUNT", account);
      // console.log("PROFILE", profile);
      // console.log("EMAIL", email);
      // console.log("CREDENTIALS", credentials);
      return user;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      // console.log("SESSAO", session);
      // console.log("USER", user);
      // console.log("TOKEN", token);
      if (session?.user) {
        session.user.id = token.sub;
        session.user.visibilidade = token.visibilidade;
        session.user.permissoes = token.permissoes;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("USER", user);
      // console.log("ACCOUNT", account);
      // console.log("PROFILE", profile);
      // console.log(token);
      if (user) {
        token.visibilidade = user.visibilidade;
        token.permissoes = user.permissoes;
      }

      return token;
    },
  },
  secret: process.env.SECRET_NEXT_AUTH,
  pages: {
    signIn: "/auth/signin",
  },
};
export default NextAuth(authOptions);
