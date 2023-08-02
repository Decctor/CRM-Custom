import createHttpError from "http-errors";

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { Method } from "axios";
import { ZodError } from "zod";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { IUsuario } from "./models";

interface ErrorResponse {
  error: {
    message: string;
    err?: any;
  };
  status?: number;
}
type ApiMethodHandlers = {
  [key in Uppercase<Method>]?: NextApiHandler;
};

// Validação de sessão para rotas autenticadas
export async function validateAuthentication(req: NextApiRequest) {
  const sessionToken = await getToken({
    req,
    secret: process.env.SECRET_NEXT_AUTH,
    raw: true,
  });
  if (!sessionToken)
    throw new createHttpError.Unauthorized(
      `Rota não acessível a usuários não autenticados.`
    );
  return sessionToken;
}
// Validação de niveis de autorização para rotas
export async function validateAuthorization<
  T extends keyof IUsuario["permissoes"],
  K extends keyof IUsuario["permissoes"][T]
>(req: NextApiRequest, field: T, permission: K, validate: any) {
  const session = await getSession({ req: req });

  if (session) {
    console.log("PERMISSAO", session.user.permissoes[field][permission]);
    if (session.user.permissoes[field][permission] == validate) return session;
    else
      throw new createHttpError.Unauthorized(
        `Nível de autorização insuficiente.`
      );
  } else {
    throw new createHttpError.Unauthorized(
      `Nível de autorização insuficiente.`
    );
  }
}
// Criando o handler de erros
function errorHandler(err: unknown, res: NextApiResponse<ErrorResponse>) {
  console.log("ERRO", err);
  if (createHttpError.isHttpError(err) && err.expose) {
    // Lidar com os erros lançados pelo módulo http-errors
    return res.status(err.statusCode).json({ error: { message: err.message } });
  } else if (err instanceof ZodError) {
    // Lidar com erros vindo de uma validação Zod
    return res.status(400).json({ error: { message: err.errors[0].message } });
  } else {
    // Erro de servidor padrão 500
    return res.status(500).json({
      error: { message: "Oops, algo deu errado!", err: err },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    });
  }
}

export function apiHandler(handler: ApiMethodHandlers) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const method = req.method
        ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
        : undefined;

      // validando se o handler suporta o metodo HTTP requisitado
      if (!method)
        throw new createHttpError.MethodNotAllowed(
          `Método não especificado no caminho: ${req.url}`
        );

      const methodHandler = handler[method];
      if (!methodHandler)
        throw new createHttpError.MethodNotAllowed(
          `O método ${req.method} não permitido para o caminho ${req.url}`
        );

      // Se passou pelas validações, chamar o handler
      await methodHandler(req, res);
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
