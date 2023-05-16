import {
  apiHandler,
  validateAuthentication,
  validateAuthorization,
} from "../../../utils/api";
import { NextApiHandler } from "next";
import connectToDatabase from "../../../services/mongoclient";
import { IUsuario } from "../../../utils/models";
import { z } from "zod";
import { hashSync } from "bcrypt";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { userInfo } from "os";

// POST RESPONSE
type PostResponse = {
  data: IUsuario;
  message: string;
};
const userSchema = z.object({
  nome: z
    .string({ required_error: "Por favor, preencha o nome do usuário" })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." }),
  telefone: z.string().optional(),
  email: z
    .string({ required_error: "Por favor, preencha o email do usuário." })
    .email("Por favor, preencha um email válido."),
  senha: z.string({
    required_error: "Por favor, preencha a senha do usuário.",
  }),
  visibilidade: z.union([
    z.literal("PRÓPRIA"),
    z.literal("GERAL"),
    z.array(z.string()),
  ]), // z.string().or(z.string().array())
  funisVisiveis: z.union([
    z.array(z.number()),
    z.array(z.never()),
    z.literal("TODOS"),
  ]),
  grupoPermissaoId: z
    .number({ required_error: "Grupo de permissão necessário." })
    .or(z.string({ required_error: "Grupo de permissão necessário." })),
  comissao: z
    .object({
      id: z.number(),
      nome: z.string(),
    })
    .nullable(),
  permissoes: z.object({
    usuarios: z.object({
      visualizar: z.boolean(),
      editar: z.boolean(),
    }),
    comissoes: z.object({
      visualizarComissaoResponsavel: z.boolean(),
      editarComissaoResponsavel: z.boolean(),
      visualizarComissaoRepresentante: z.boolean(),
      editarComissaoRepresentante: z.boolean(),
    }),
    dimensionamento: z.object({
      editarPremissas: z.boolean(),
      editarFatorDeGeracao: z.boolean(),
      editarInclinacao: z.boolean(),
      editarDesvio: z.boolean(),
      editarDesempenho: z.boolean(),
      editarSombreamento: z.boolean(),
    }),
    kits: z.object({
      visualizar: z.boolean(),
      editar: z.boolean(),
    }),
    propostas: z.object({
      visualizarPrecos: z.boolean(),
      editarPrecos: z.boolean(),
      visualizarMargem: z.boolean(),
      editarMargem: z.boolean(),
    }),
    projetos: z.object({
      serResponsavel: z.boolean(),
      editar: z.boolean(),
      visualizarDocumentos: z.boolean(),
      editarDocumentos: z.boolean(),
    }),
    clientes: z.object({
      serRepresentante: z.boolean(),
      editar: z.boolean(),
    }),
  }),
});
const createUser: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthorization(req, "usuarios", "editar", true);
  const user = userSchema.parse(req.body);
  const { senha: password } = user;
  let hashedPassword = hashSync(password, 10);

  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("users");
  const existingUserInDn = await collection.findOne({ email: user.email });
  if (existingUserInDn) {
    throw new createHttpError.BadRequest("Usuário já existente.");
  }

  let newUser = await collection.insertOne({ ...user, senha: hashedPassword });
  console.log(newUser);
  res.status(201).json({ data: user, message: "Usuário adicionado!" });
};

// GET RESPONSE
type GetResponse = {
  data: IUsuario[] | IUsuario;
};
const getUsers: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthorization(req, "usuarios", "visualizar", true);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("users");
  const { id } = req.query;
  if (id && typeof id === "string") {
    const user = await collection.findOne({ _id: new ObjectId(id) });
    res.status(200).json({ data: user });
  } else {
    const users = await collection.find({}).toArray();
    res.status(200).json({ data: users });
  }
};

// PUT RESPONSE
type PutResponse = {
  data: string;
  message: string;
};
const editUserSchema = z.object({
  _id: z.string().optional(),
  nome: z
    .string({ required_error: "Por favor, preencha o nome do usuário" })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." })
    .optional(),
  telefone: z.string().optional(),
  email: z
    .string({ required_error: "Por favor, preencha o email do usuário." })
    .email("Por favor, preencha um email válido.")
    .optional(),
  senha: z
    .string({
      required_error: "Por favor, preencha a senha do usuário.",
    })
    .optional(),
  avatar_url: z.string().optional(),
  visibilidade: z
    .union([z.literal("PRÓPRIA"), z.literal("GERAL"), z.array(z.string())])
    .optional(), // z.string().or(z.string().array())
  funisVisiveis: z
    .union([z.array(z.number()), z.literal("TODOS")], {
      required_error:
        "Por favor, especifique a quais funis o usuário terá acesso.",
    })
    .optional(),
  grupoPermissaoId: z
    .number({ required_error: "Grupo de permissão necessário." })
    .or(z.string({ required_error: "Grupo de permissão necessário." }))
    .optional(),
  comissao: z
    .object({
      id: z.number(),
      nome: z.string(),
    })
    .nullable()
    .optional(),
  permissoes: z.object({
    usuarios: z
      .object({
        visualizar: z.boolean(),
        editar: z.boolean(),
      })
      .optional(),
    comissoes: z
      .object({
        visualizarComissaoResponsavel: z.boolean(),
        editarComissaoResponsavel: z.boolean(),
        visualizarComissaoRepresentante: z.boolean(),
        editarComissaoRepresentante: z.boolean(),
      })
      .optional(),
    dimensionamento: z
      .object({
        editarPremissas: z.boolean(),
        editarFatorDeGeracao: z.boolean(),
        editarInclinacao: z.boolean(),
        editarDesvio: z.boolean(),
        editarDesempenho: z.boolean(),
        editarSombreamento: z.boolean(),
      })
      .optional(),
    kits: z
      .object({
        visualizar: z.boolean(),
        editar: z.boolean(),
      })
      .optional(),
    propostas: z
      .object({
        visualizarPrecos: z.boolean(),
        editarPrecos: z.boolean(),
        visualizarMargem: z.boolean(),
        editarMargem: z.boolean(),
      })
      .optional(),
    projetos: z
      .object({
        serResponsavel: z.boolean(),
        editar: z.boolean(),
        visualizarDocumentos: z.boolean(),
        editarDocumentos: z.boolean(),
      })
      .optional(),
    clientes: z
      .object({
        serRepresentante: z.boolean(),
        editar: z.boolean(),
      })
      .optional(),
  }),
});

const editUser: NextApiHandler<PutResponse> = async (req, res) => {
  await validateAuthorization(req, "usuarios", "editar", true);
  const { id } = req.query;
  if (!id && typeof id !== "string")
    throw new createHttpError.BadRequest(
      "ID do objeto de alteração não especificado."
    );
  if (!req.body.changes)
    throw new createHttpError.BadRequest(
      "Mudanças não especificadas na requisição."
    );
  const user = editUserSchema.parse(req.body.changes);
  const db = await connectToDatabase(process.env.MONGODB_URI, "main");
  const collection = db.collection("users");
  let changes;
  if (req.body.changePassword && user.senha) {
    let hashedPassword = hashSync(user.senha, 10);
    changes = { ...user, senha: hashedPassword };
  } else {
    changes = { ...user };
  }
  delete changes._id;
  if (typeof id === "string")
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...changes } }
    );
  res
    .status(201)
    .json({ data: "OK", message: "Usuário alterado com sucesso." });
};

export default apiHandler({
  POST: createUser,
  GET: getUsers,
  PUT: editUser,
});
