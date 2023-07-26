import z, { TypeOf } from "zod";

const createProjectSchema = z.object({
  nome: z
    .string({
      required_error:
        "Por favor, preencha o nome para identificação do projeto.",
    })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." }),
  tipoProjeto: z.union(
    [z.literal("SISTEMA FOTOVOLTAICO"), z.literal("OPERAÇÃO E MANUTENÇÃO")],
    {
      required_error: "Por favor, preencha o tipo do projeto.",
      invalid_type_error: "Por favor, preencha um tipo válido de projeto.",
    }
  ),
  responsavel: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: "Por favor, especifique o responsável." }
  ),
  representante: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: "Por favor, especifique o representante." }
  ),
  clienteId: z.string({
    required_error: "Por favor, especifique o ID do cliente.",
  }),
  descricao: z.string().optional(),
  funis: z.array(z.object({ id: z.number(), etapaId: z.number() }), {
    required_error: "Por favor, vincule um funil a esse projeto.",
  }),
  idOportunidade: z.string().optional(),
});
export type CreateProject = TypeOf<typeof createProjectSchema>;

const getProjectSchema = z.object({
  nome: z
    .string({
      required_error:
        "Por favor, preencha o nome para identificação do projeto.",
    })
    .min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." }),
  tipoProjeto: z.union(
    [z.literal("SISTEMA FOTOVOLTAICO"), z.literal("OPERAÇÃO E MANUTENÇÃO")],
    {
      required_error: "Por favor, preencha o tipo do projeto.",
      invalid_type_error: "Por favor, preencha um tipo válido de projeto.",
    }
  ),
  responsavel: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: "Por favor, especifique o responsável." }
  ),
  representante: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: "Por favor, especifique o representante." }
  ),
  clienteId: z.string({
    required_error: "Por favor, especifique o ID do cliente.",
  }),
  propostaAtiva: z.string().optional(),
  titularInstalacao: z
    .string({
      invalid_type_error: "Tipo de dado inválido para titular da instalação.",
    })
    .optional(),
  numeroInstalacaoConcessionaria: z
    .string({
      invalid_type_error:
        "Tipo de dado inválido para número de instalação da concessionária.",
    })
    .optional(),
  tipoTitular: z
    .union([z.literal("PESSOA FISICA"), z.literal("PESSOA JURIDICA")])
    .optional(),
  tipoLigacao: z.union([z.literal("EXISTENTE"), z.literal("NOVA")]).optional(),
  tipoInstalacao: z.union([z.literal("URBANO"), z.literal("RURAL")]).optional(),
  credor: z.string().optional(),
  servicosAdicionais: z
    .object({
      padrao: z.number().optional().nullable(),
      estrutura: z.number().optional().nullable(),
      outros: z.number().optional().nullable(),
    })
    .optional(),
  anexos: z
    .object({
      documentoComFoto: z.string().optional().nullable(),
      iptu: z.string().optional().nullable(),
      contaDeEnergia: z.string().optional().nullable(),
      laudo: z.string().optional().nullable(),
    })
    .optional(),
  descricao: z.string().optional(),
  funis: z.array(z.object({ id: z.number(), etapaId: z.number() }), {
    required_error: "Por favor, vincule um funil a esse projeto.",
  }),
  dataPerda: z.string().optional(),
  motivoPerda: z.string().optional(),
  contratoSolicitado: z.boolean().optional(),
  dataSolicitacaoContrato: z.string().optional(),
  idSolicitacaoContrato: z.string().optional(),
  assinado: z.boolean().optional(),
  dataAssinatura: z.string().optional(),
});
export type Project = TypeOf<typeof getProjectSchema>;
