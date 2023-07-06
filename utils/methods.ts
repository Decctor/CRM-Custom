import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  IClient,
  IKit,
  IProject,
  IProposeInfo,
  IProposeOeMInfo,
  IRepresentative,
  IResponsible,
  ISession,
  InverterType,
  ModuleType,
} from "./models";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Modules from "../utils/pvmodules.json";
import genFactors from "../utils/generationFactors.json";
type ViaCEPSuccessfulReturn = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};
export function isFile(variable: any): variable is File {
  return variable instanceof File;
}
export function getPeakPotByModules(modules: ModuleType[] | undefined) {
  if (modules) {
    var peakPotSum = 0;
    for (let i = 0; i < modules.length; i++) {
      peakPotSum = peakPotSum + modules[i].qtde * modules[i].potencia;
    }
    return peakPotSum / 1000;
  } else {
    return 0;
  }
}
export function getModulesQty(modules: ModuleType[] | undefined) {
  if (modules) {
    var totalModulesQty = 0;
    for (let i = 0; i < modules.length; i++) {
      totalModulesQty = totalModulesQty + modules[i].qtde;
    }
    return totalModulesQty;
  } else {
    return 0;
  }
}
export function getEstimatedGen(
  peakPower: number,
  city: string | undefined | null,
  uf: string | undefined | null
): number {
  if (!city || !uf) return 127 * peakPower;
  const cityFactors = genFactors[city as keyof typeof genFactors];
  const genFactor = cityFactors.fatorGen;
  if (!genFactor) return 127 * peakPower;
  else return genFactor * peakPower;
}
export async function getCEPInfo(
  cep: string
): Promise<ViaCEPSuccessfulReturn | null> {
  try {
    const { data } = await axios.get(
      `https://viacep.com.br/ws/${cep.replace("-", "")}/json/`
    );
    if (data.erro) throw new Error("Erro");
    return data;
  } catch (error) {
    toast.error("Erro ao buscar informações à partir do CEP.");
    return null;
  }
}
export function formatToCPForCNPJ(value: string): string {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
export function formatToCEP(value: string): string {
  let cep = value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
export function formatToPhone(value: string): string {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

export function formatDate(value: any) {
  return new Date(value).toISOString().slice(0, 10);
}
export function formatUpdateSetObject(changes: object) {
  var setObj: any = {};
  console.log(changes);
  Object.entries(changes).forEach((entry) => {
    if (typeof entry[1] == "object") {
      // console.log("PELO IF");
      const tag = entry[0];
      // Object.keys(entry[1]).forEach((x) => {
      //   console.log(`${tag}.${x}`);
      // });
      Object.entries(entry[1]).forEach((insideEntry) => {
        // console.log({ [`${tag}.${insideEntry[0]}`]: insideEntry[1] });
        setObj[`${tag}.${insideEntry[0]}`] = insideEntry[1];
      });
    } else {
      const tag = entry[0];
      const value = entry[1];
      setObj[tag] = value;
    }
  });
  return setObj;
}
export function getInverterStr(
  inverters: InverterType[],
  kitType: string | undefined
) {
  var str = "";
  if (kitType == "PROMOCIONAL") {
    for (let i = 0; i < inverters.length; i++) {
      if (i < inverters.length - 1) {
        str = str + `${inverters[i].qtde}x ${inverters[i].modelo} & `;
      } else {
        str = str + `${inverters[i].qtde}x ${inverters[i].modelo}`;
      }
    }
  } else {
    for (let i = 0; i < inverters.length; i++) {
      if (i < inverters.length - 1) {
        str =
          str +
          `${inverters[i].qtde}x ${inverters[i].fabricante} (${inverters[i].modelo}) & `;
      } else {
        str =
          str +
          `${inverters[i].qtde}x ${inverters[i].fabricante} (${inverters[i].modelo})`;
      }
    }
  }
  return str;
}
export function getModulesStr(
  modules: ModuleType[],
  kitType: string | undefined
) {
  var str = "";
  if (kitType == "PROMOCIONAL") {
    for (let i = 0; i < modules.length; i++) {
      if (i < modules.length - 1) {
        str =
          str +
          `${modules[i].qtde}x PAINÉIS PROMOCIONAIS DE ${modules[i].potencia}W & `;
      } else {
        str =
          str +
          `${modules[i].qtde}x PAINÉIS PROMOCIONAIS DE ${modules[i].potencia}W`;
      }
    }
  } else {
    for (let i = 0; i < modules.length; i++) {
      if (i < modules.length - 1) {
        str =
          str +
          `${modules[i].qtde}x ${modules[i].fabricante} (${modules[i].potencia}W) & `;
      } else {
        str =
          str +
          `${modules[i].qtde}x ${modules[i].fabricante} (${modules[i].potencia}W)`;
      }
    }
  }

  return str;
}
export function getProposeObject(
  project: IProject,
  propose: IProposeInfo,
  seller: string | null
) {
  const obj = {
    title: propose.projeto.nome,
    fontSize: 10,
    textColor: "#333333",
    data: {
      idProposta: `#${project._id}}`,
      vendedor: seller,
      nomeCliente: project.cliente?.nome,
      cpfCnpj: project.cliente?.cpfCnpj,
      cidade: `${project.cliente?.cidade} - ${project.cliente?.uf}`,
      enderecoCliente: `${project.cliente?.endereco}`,
      potPico: propose.potenciaPico?.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      consumoMedio: propose.premissas.consumoEnergiaMensal,
      gastoMensalAtual: `R$ ${(
        propose.premissas.consumoEnergiaMensal * propose.premissas.tarifaEnergia
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      gastoAnualAtual: `R$ ${(
        propose.premissas.consumoEnergiaMensal *
        propose.premissas.tarifaEnergia *
        12
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      gasto25AnosAtual: `R$ ${(
        propose.premissas.consumoEnergiaMensal *
        propose.premissas.tarifaEnergia *
        12 *
        25
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      geracaoEstimada: getEstimatedGen(
        getPeakPotByModules(propose.kit?.modulos),
        project.cliente?.cidade,
        project.cliente?.uf
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      economiaEstimada: `R$ ${(
        getEstimatedGen(
          getPeakPotByModules(propose.kit?.modulos),
          project.cliente?.cidade,
          project.cliente?.uf
        ) * propose.premissas.tarifaEnergia
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      economiaEstimada25anos: `R$ ${(
        getEstimatedGen(
          getPeakPotByModules(propose.kit?.modulos),
          project.cliente?.cidade,
          project.cliente?.uf
        ) *
        propose.premissas.tarifaEnergia *
        25 *
        12
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      inversores: getInverterStr(
        propose.kit?.inversores ? propose.kit?.inversores : [],
        propose?.kit?.tipo
      ),
      garantiaInversores: propose.kit?.inversores
        ? `${Math.max(...propose.kit.inversores.map((x) => x.garantia))} anos`
        : "10 anos",
      garantiaModulos: propose.kit?.modulos
        ? `${Math.max(...propose.kit.modulos.map((x) => x.garantia))} anos`
        : "10 anos",
      modulos: getModulesStr(
        propose.kit?.modulos ? propose.kit?.modulos : [],
        propose.kit?.tipo
      ),
      valorProposta: `R$ ${propose.valorProposta?.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
  };
  const arr = [
    {
      id: "727",
      fabricante: "BYD",
      modelo: "MLK-36-540",
      qtde: 21,
      potencia: 540,
      garantia: 10,
    },
    {
      id: "727",
      fabricante: "BYD",
      modelo: "MLK-36-540",
      qtde: 21,
      potencia: 540,
      garantia: 15,
    },
  ];
  // const obj = {
  //   title: propose.projeto.nome,
  //   fontSize: 10,
  //   textColor: "#333333",
  //   data: {
  //     idProposta: project._id,
  //     nomeCliente: project.cliente?.nome,
  //     cpfCnpjCliente: project.cliente?.cpfCnpj,
  //     cidadeUfCliente: `${project.cliente?.cidade} - ${project.cliente?.uf}`,
  //     enderecoCliente: `${project.cliente?.endereco}`,
  //     nomeVendedor: project.responsavel.nome,
  //     potPico: propose.potenciaPico,
  //     consumoMedio: propose.premissas.consumoEnergiaMensal,
  //     gastoMensalAtual:
  //       propose.premissas.consumoEnergiaMensal *
  //       propose.premissas.tarifaEnergia,
  //     gastoAnualAtual: `R$ ${(
  //       propose.premissas.consumoEnergiaMensal *
  //       propose.premissas.tarifaEnergia *
  //       12
  //     ).toLocaleString("pt-br", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     })}`,
  //     gasto25AnosAtual: `R$ ${(
  //       propose.premissas.consumoEnergiaMensal *
  //       propose.premissas.tarifaEnergia *
  //       12 *
  //       25
  //     ).toLocaleString("pt-br", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     })}`,
  //     qtdeModulos: getModulesQty(propose.kit?.modulos),
  //     geracaoEstimada: getEstimatedGen(
  //       getPeakPotByModules(propose.kit?.modulos),
  //       project.cliente?.cidade,
  //       project.cliente?.uf
  //     ).toLocaleString("pt-br", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }),
  //     precoFinal: `R$ ${propose.valorProposta?.toLocaleString("pt-br", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     })}`,

  //     inversores: getInverterStr(
  //       propose.kit?.inversores ? propose.kit?.inversores : []
  //     ),
  //     qtdeInversores: "Quantidade de Inversores",
  //     modulos: getModulesStr(propose.kit?.modulos ? propose.kit?.modulos : []),
  //   },
  // };
  return obj;
}
function getIdealPowerGeneration(
  peakPower: number,
  city: string | undefined | null,
  uf: string | undefined | null
): number {
  if (!city || !uf) return peakPower * 127;
  const cityFactors = genFactors[city as keyof typeof genFactors];
  if (!cityFactors) return peakPower * 127;
  return cityFactors.fatorGen * peakPower;
}
export function getProposeOeMObject(
  project: IProject,
  propose: IProposeOeMInfo,
  sellerPhone: string | null
) {
  const obj = {
    title: propose.projeto.nome,
    fontSize: 10,
    textColor: "#333333",
    data: {
      nomeCidade: propose.projeto.nome,
      cidade: project.cliente?.cidade,
      dataProposta: new Date().toLocaleDateString("pt-br"),
      vendedor: project.responsavel.nome,
      telefoneVendedor: sellerPhone,
      qtdepotModulos: `${propose.premissas.qtdeModulos} - ${propose.premissas.potModulos}W`,
      potPico: `${propose.potenciaPico?.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} kWp`,
      eficienciaAtual: `${propose.premissas.eficienciaAtual}%`,
      perdaFinanceira: `R$ ${(
        12 *
        (1 - propose.premissas.eficienciaAtual / 100) *
        getIdealPowerGeneration(
          propose.potenciaPico ? propose.potenciaPico : 0,
          project.cliente?.cidade,
          project.cliente?.uf
        ) *
        propose.premissas.tarifaEnergia
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      precoManutencaoSimples: `R$ ${propose.precificacao?.manutencaoSimples.vendaFinal.toLocaleString(
        "pt-br",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`,
      precoPlanoSol: `R$ ${propose.precificacao?.planoSol.vendaFinal.toLocaleString(
        "pt-br",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`,
      precoPlanoSolMais: `R$ ${propose.precificacao?.planoSolPlus.vendaFinal.toLocaleString(
        "pt-br",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`,
    },
  };
  return obj;
}
export function useKitQueryPipelines(
  type: "TODOS OS KITS" | "KITS POR PREMISSA",
  payload: any
) {
  switch (type) {
    case "TODOS OS KITS":
      return [
        {
          $match: {
            ativo: true,
          },
        },
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $sort: {
            dataInsercao: -1,
          },
        },
      ];
    case "KITS POR PREMISSA":
      return [
        {
          $match: {
            ativo: true,
          },
        },
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $match: {
            $and: [
              { potPico: { $gte: payload.min } },
              { potPico: { $lte: payload.max } },
            ],
          },
        },
        {
          $sort: {
            dataInsercao: -1,
          },
        },
      ];
    default:
      return [
        {
          $match: {
            ativo: true,
          },
        },
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $sort: {
            dataInsercao: -1,
          },
        },
      ];
  }
}
export function checkQueryEnableStatus(session: ISession | null, queryId: any) {
  if (session?.user && typeof queryId === "string") {
    return true;
  } else {
    return false;
  }
}
// Hooks
export function useRepresentatives(): UseQueryResult<IRepresentative[], Error> {
  return useQuery({
    queryKey: ["representatives"],
    queryFn: async (): Promise<IRepresentative[]> => {
      try {
        const { data } = await axios.get("/api/representatives");
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    onError(err) {
      console.log("ERRO ONERROR", err);
      return err;
    },
    refetchOnWindowFocus: false,
  });
}
export function useProject(
  projectId: string,
  enabled: boolean
): UseQueryResult<IProject, Error> {
  return useQuery<IProject, Error>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/projects?id=${projectId}`);

        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          throw error;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          throw error;
        }
        throw error;
      }
    },
    enabled: enabled && !!projectId,
  });
}
export function useClient(
  clientId: string,
  enabled: boolean
): UseQueryResult<IClient, Error> {
  return useQuery<IClient, Error>({
    queryKey: ["client", clientId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/clients?id=${clientId}`);
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    enabled: enabled && !!clientId,
  });
}
export function useResponsibles(): UseQueryResult<IResponsible[], Error> {
  return useQuery({
    queryKey: ["responsibles"],
    queryFn: async (): Promise<IResponsible[]> => {
      try {
        const { data } = await axios.get("/api/responsibles");
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    cacheTime: 300000,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
export function useResponsibleInfo(
  responsibleId: string | undefined
): IResponsible | null {
  const { data: responsible } = useQuery({
    queryKey: ["responsible", responsibleId],
    queryFn: async (): Promise<IResponsible | null> => {
      try {
        const { data } = await axios.get(
          `/api/responsibles?id=${responsibleId}`
        );
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return null;
      }
    },
    refetchOnWindowFocus: false,
    cacheTime: 300000,
    staleTime: 0,
    enabled: !!responsibleId,
  });

  if (responsible) return responsible;
  else return null;
}
export function useKits(onlyActive?: boolean): UseQueryResult<IKit[], Error> {
  return useQuery({
    queryKey: ["kits"],
    queryFn: async (): Promise<IKit[]> => {
      try {
        var url;
        if (onlyActive) url = "/api/kits/active=true";
        else url = "/api/kits";
        const { data } = await axios.get(url);
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
}
export function useClients(
  representative: string | null | undefined
): UseQueryResult<IClient[], Error> {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<IClient[]> => {
      try {
        const { data } = await axios.get(
          `/api/clients?representative=${representative}`
        );
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
}

export function useProjects(
  funnel: number | null,
  responsible: string | null,
  after: string | undefined,
  before: string | undefined,
  session: ISession | null
): UseQueryResult<IProject[], Error> {
  return useQuery({
    queryKey: ["projects", funnel, responsible, after, before],
    queryFn: async (): Promise<IProject[]> => {
      try {
        const { data } = await axios.get(
          `/api/projects?responsible=${responsible}&funnel=${funnel}&after=${after}&before=${before}`
        );
        return data.data;
      } catch (error) {
        toast.error(
          "Erro ao buscar informações desse cliente. Por favor, tente novamente mais tarde."
        );
        return [];
      }
    },
    enabled: !!session?.user,
  });
}

//
function getLevenshteinDistance(string1: string, string2: string): number {
  const matrix = Array(string1.length + 1)
    .fill(null)
    .map(() => Array(string2.length + 1).fill(null));

  for (let i = 0; i <= string1.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= string2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= string1.length; i++) {
    for (let j = 1; j <= string2.length; j++) {
      const indicator = string1[i - 1] === string2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + indicator
      );
    }
  }

  return matrix[string1.length][string2.length];
}
export function calculateStringSimilarity(
  string1: string,
  string2: string
): number {
  const maxLength = Math.max(string1.length, string2.length);
  const distance = getLevenshteinDistance(string1, string2);
  const similarity = (maxLength - distance) / maxLength;
  const similarityPercentage = similarity * 100;

  return similarityPercentage;
}
