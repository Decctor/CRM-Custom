import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  IClient,
  IKit,
  IProject,
  IProposeInfo,
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
export function getPeakPotByModules(modules: ModuleType[] | undefined) {
  if (modules) {
    var peakPotSum = 0;
    for (let i = 0; i < modules.length; i++) {
      const moduleInfo = Modules.find((mod) => mod.id == modules[i].id);
      if (moduleInfo) {
        peakPotSum = peakPotSum + modules[i].qtde * moduleInfo.potencia;
      }
    }
    return peakPotSum / 1000;
  } else {
    return 0;
  }
}
function getModulesQty(modules: ModuleType[] | undefined) {
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
function getEstimatedGen(
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
      console.log("PELO IF");
      const tag = entry[0];
      // Object.keys(entry[1]).forEach((x) => {
      //   console.log(`${tag}.${x}`);
      // });
      Object.entries(entry[1]).forEach((insideEntry) => {
        console.log({ [`${tag}.${insideEntry[0]}`]: insideEntry[1] });
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
function getInverterStr(inverters: InverterType[]) {
  var str = "";
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
  return str;
}
function getModulesStr(modules: ModuleType[]) {
  var str = "";
  for (let i = 0; i < modules.length; i++) {
    if (i < modules.length - 1) {
      str =
        str +
        `${modules[i].qtde}x ${modules[i].fabricante} (${modules[i].modelo}) & `;
    } else {
      str =
        str +
        `${modules[i].qtde}x ${modules[i].fabricante} (${modules[i].modelo})`;
    }
  }
  return str;
}
export function getProposeObject(project: IProject, propose: IProposeInfo) {
  const obj = {
    title: propose.projeto.nome,
    fontSize: 10,
    textColor: "#333333",
    data: {
      idProposta: project._id,
      nomeCliente: project.cliente?.nome,
      cpfCnpjCliente: project.cliente?.cpfCnpj,
      cidadeUfCliente: `${project.cliente?.cidade} - ${project.cliente?.uf}`,
      enderecoCliente: `${project.cliente?.endereco}`,
      nomeVendedor: project.responsavel.nome,
      potPico: propose.potenciaPico,
      consumoMedio: propose.premissas.consumoEnergiaMensal,
      gastoMensalAtual:
        propose.premissas.consumoEnergiaMensal *
        propose.premissas.tarifaEnergia,
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
      qtdeModulos: getModulesQty(propose.kit?.modulos),
      geracaoEstimada: getEstimatedGen(
        getPeakPotByModules(propose.kit?.modulos),
        project.cliente?.cidade,
        project.cliente?.uf
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      precoFinal: `R$ ${propose.valorProposta?.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,

      inversores: getInverterStr(
        propose.kit?.inversores ? propose.kit?.inversores : []
      ),
      qtdeInversores: "Quantidade de Inversores",
      modulos: getModulesStr(propose.kit?.modulos ? propose.kit?.modulos : []),
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
      ];
    case "KITS POR PREMISSA":
      return [
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
      ];
    default:
      return [
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
