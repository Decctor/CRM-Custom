import { apiHandler, validateAuthentication } from "@/utils/api";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
const users = [
  {
    id: 1,
    nome: "Lucas",
    email: "email@teste.com",
    role: "Teste",
  },
];

type GetResponse = {
  data: typeof users | (typeof users)[number];
};

// Método para requisições GET
const getUser: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req);
  const { id } = req.query;
  if (id) {
    const user = users.find((user) => user.id == Number(id));
    if (!user)
      throw new createHttpError.NotFound(
        `Usuário com id ${id} não encontrado.`
      );
    res.status(200).json({ data: user });
  } else {
    res.status(200).json({ data: users });
  }
};

type PostResponse = {
  data: (typeof users)[number];
  message: string;
};

const userSchema = z.object({
  nome: z.string({ required_error: "Preencha um nome para o usuário." }),
  email: z
    .string({ required_error: "Preencha um email para o usuário." })
    .email({ message: "Preencha um email válido." }),
  role: z.string({ required_error: "Preencha uma função para o usuário." }),
});

// Método para requisições POST
const createUser: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req);

  const data = userSchema.parse(req.body);

  const newUser = { ...data, id: users.length + 1 };
  users.push(newUser);
  res
    .status(201)
    .json({ data: newUser, message: "Usuário criado com sucesso!" });
};
export default apiHandler({
  GET: getUser,
  POST: createUser,
});
