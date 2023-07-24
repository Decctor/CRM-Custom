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
  ITechnicalAnalysis,
  InverterType,
  ModuleType,
} from "./models";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Modules from "../utils/pvmodules.json";
import genFactors from "../utils/generationFactors.json";
import { orientations, phases } from "./constants";
import dayjs from "dayjs";
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
  uf: string | undefined | null,
  orientation?: (typeof orientations)[number]
): number {
  if (!city || !uf) return 127 * peakPower;
  const cityFactors = genFactors[city as keyof typeof genFactors];
  var genFactor;
  if (orientation) genFactor = cityFactors[orientation];
  else genFactor = cityFactors.fatorGen;
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
export function getProposeObject(
  project: IProject,
  propose: IProposeInfo,
  seller?: {
    name: string;
    phone: string;
  }
) {
  const obj = {
    title: propose.projeto.nome,
    fontSize: 10,
    textColor: "#333333",
    data: {
      idProposta: `#${project._id}`,
      dataEmissao: dayjs().format("DD/MM/YYYY"),
      vendedor: seller?.name,
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
        ? `${Math.max(
            ...propose.kit.inversores.map((x) => (x.garantia ? x.garantia : 0))
          )} anos`
        : "10 anos",
      garantiaModulos: propose.kit?.modulos
        ? `${Math.max(
            ...propose.kit.modulos.map((x) => (x.garantia ? x.garantia : 0))
          )} anos`
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
  return obj;
}
export function getProposeBYDObject(
  project: IProject,
  propose: IProposeInfo,
  seller?: {
    name: string;
    phone: string;
  }
) {
  const paybackTable = getBillAndPaybackProgression({
    city: project.cliente?.cidade ? project.cliente?.cidade : "ITUIUTABA",
    orientation: propose.premissas.orientacao,
    avgConsumption: propose.premissas.consumoEnergiaMensal,
    investment: propose.valorProposta ? propose.valorProposta : 0,
    kwhPrice: propose.premissas.tarifaEnergia,
    modulesPot: propose.kit?.modulos[0].potencia
      ? propose.kit?.modulos[0].potencia
      : 0,
    modulesQty: propose.kit?.modulos[0].qtde ? propose.kit?.modulos[0].qtde : 0,
    phase: propose.premissas.fase ? propose.premissas.fase : "Bifásico",
    simultaneity: propose.premissas.fatorSimultaneidade,
    startMonth: new Date().getMonth() + 2,
    startYear: new Date().getFullYear(),
    tusd: propose.premissas.tarifaTUSD,
  });
  const monthsTillNewPositivePayback = paybackTable.filter(
    (obj) => obj["PAYBACK (NOVA LEI)"] < 0
  ).length;
  console.log(paybackTable);
  const years = Math.floor(monthsTillNewPositivePayback / 12);
  const months = monthsTillNewPositivePayback % 12;
  const paybackText =
    months > 0 ? `${years} anos e ${months} meses` : `${years} anos`;
  const arrOfNewBillProgression = paybackTable.map(
    (obj) => obj["VALOR FATURA (NOVA LEI)"]
  );

  const newBillAvgValue = getAverageValue(arrOfNewBillProgression);
  console.log("MÉDIO", newBillAvgValue);
  const obj = {
    title: propose.projeto.nome,
    fontSize: 10,
    textColor: "#333333",
    data: {
      idProposta: `#${project._id}`,
      vendedor: seller?.name,
      telefoneVendedor: seller?.phone,
      nomeCliente: project.cliente?.nome,
      cpfCnpj: project.cliente?.cpfCnpj,
      cidade: `${project.cliente?.cidade} - ${project.cliente?.uf}`,
      enderecoCliente: `${project.cliente?.endereco}`,
      potPico: `${propose.potenciaPico?.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} kWp`,
      consumoMedio: `${propose.premissas.consumoEnergiaMensal} kWh/mês`,
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
      geracaoEstimada: `${getEstimatedGen(
        getPeakPotByModules(propose.kit?.modulos),
        project.cliente?.cidade,
        project.cliente?.uf
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} kWh/mês`,
      novoGastoMensal: `R$ ${Number(newBillAvgValue).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      payback: paybackText,
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
        ? `${Math.max(
            ...propose.kit.inversores.map((x) => (x.garantia ? x.garantia : 0))
          )} ANOS`
        : "10 ANOS",
      garantiaModulos: propose.kit?.modulos
        ? `${Math.max(
            ...propose.kit.modulos.map((x) => (x.garantia ? x.garantia : 0))
          )} ANOS`
        : "10 ANOS",
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
export function getProposeOeMObject(
  project: IProject,
  propose: IProposeOeMInfo,
  seller?: {
    name: string;
    phone: string;
  }
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
      telefoneVendedor: `${seller?.name} - ${seller?.phone}`,
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
  representative: string | null | undefined,
  enabled: boolean
): UseQueryResult<IClient[], Error> {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<IClient[]> => {
      try {
        console.log("REPRESENTANTE QUERY", representative);
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
    enabled: enabled,
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
export function useTechnicalAnalysis(
  projectCode: string | null | undefined,
  enabled: boolean,
  status?: "CONCLUIDO" | "TODOS"
): UseQueryResult<ITechnicalAnalysis[], Error> {
  return useQuery({
    queryKey: ["technicalAnalysis", projectCode],
    queryFn: async (): Promise<ITechnicalAnalysis[]> => {
      try {
        const { data } = await axios.get(
          `/api/ampereIntegration/technicalAnalysis?projectIdentifier=${projectCode}&status=${status}`
        );
        return data.data;
      } catch (error) {
        toast.error("Erro ao buscar análises técnicas desse projeto.");
        return [];
      }
    },
    enabled: enabled,
    retry: false,
    refetchOnWindowFocus: false,
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
type getBillAndPaybackProgressionParams = {
  city: string;
  orientation: (typeof orientations)[number];
  avgConsumption: number;
  modulesPot: number;
  modulesQty: number;
  simultaneity: number;
  kwhPrice: number;
  tusd: number;
  startYear: number;
  startMonth: number;
  investment: number;
  phase: (typeof phases)[number]["value"];
};
function getBillAndPaybackProgression({
  city,
  orientation,
  avgConsumption,
  modulesPot,
  modulesQty,
  simultaneity,
  kwhPrice,
  tusd,
  startYear,
  startMonth,
  investment,
  phase,
}: getBillAndPaybackProgressionParams) {
  const disponibilityByType = {
    Monofásico: 30,
    Bifásico: 50,
    Trifásico: 100,
  } as const;
  const publicIlumination = 20;
  const savingsRates = 0.0067;
  const cityFactors = genFactors[city as keyof typeof genFactors];
  const factor = cityFactors[orientation];
  const consumption = [
    { mes: 1, valor: avgConsumption },
    { mes: 2, valor: avgConsumption },
    { mes: 3, valor: avgConsumption },
    { mes: 4, valor: avgConsumption },
    { mes: 5, valor: avgConsumption },
    { mes: 6, valor: avgConsumption },
    { mes: 7, valor: avgConsumption },
    { mes: 8, valor: avgConsumption },
    { mes: 9, valor: avgConsumption },
    { mes: 10, valor: avgConsumption },
    { mes: 11, valor: avgConsumption },
    { mes: 12, valor: avgConsumption },
  ];
  const generation = Array.from({ length: 12 }, () => 1).map((x) =>
    Number(((factor * modulesPot * modulesQty) / 1000).toFixed(2))
  );

  const instantConsumption = consumption.map((obj, index) => {
    let consumption =
      generation[index] > obj.valor * (simultaneity / 100)
        ? obj.valor * (simultaneity / 100)
        : generation[index];
    return consumption;
  });
  const netMonth = generation.map((geracao, index) =>
    Number((geracao - consumption[index].valor).toFixed(2))
  );
  const progressaoKWH = {
    2023: kwhPrice,
    2024: kwhPrice * 1.05,
    2025: kwhPrice * 1.05 ** 2,
    2026: kwhPrice * 1.05 ** 3,
    2027: kwhPrice * 1.05 ** 4,
    2028: kwhPrice * 1.05 ** 5,
    2029: kwhPrice * 1.05 ** 6,
  } as const;
  const progressaoFioB = {
    2023: (tusd / kwhPrice) * 0.15 * progressaoKWH[2023],
    2024: (tusd / kwhPrice) * 0.3 * progressaoKWH[2024],
    2025: (tusd / kwhPrice) * 0.45 * progressaoKWH[2025],
    2026: (tusd / kwhPrice) * 0.6 * progressaoKWH[2026],
    2027: (tusd / kwhPrice) * 0.75 * progressaoKWH[2027],
    2028: (tusd / kwhPrice) * 0.9 * progressaoKWH[2028],
    2029: (tusd / kwhPrice) * 1 * progressaoKWH[2029],
  } as const;
  var meses;
  meses =
    (new Date(2029, 12, 31).getFullYear() -
      new Date(startYear, startMonth, 1).getFullYear()) *
    12;
  meses -= new Date(startYear, startMonth, 1).getMonth();
  meses += new Date(2029, 12, 31).getMonth();
  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

  var tabelaFinal = [];

  var saldoCumulado = 0;
  var saldoCumuladoDireitoAdquirido = 0;
  var anoComparacao = startYear;
  var mesComparacao = startMonth;
  var saldoPassado = 0;
  var saldoPassadoDireitoAdquirido = 0;
  var poupanca = -investment;
  var payback = -investment;
  var paybackDireitoAdquirido = -investment;
  for (let i = 0; i <= meses; i++) {
    var saldoPassado = saldoCumulado;
    var saldoPassadoDireitoAdquirido = saldoCumuladoDireitoAdquirido;

    var liquidoMesComparacao = netMonth[mesComparacao - 1];
    var injetadoMesComparacao =
      generation[mesComparacao - 1] - instantConsumption[mesComparacao - 1];

    var usoConcessionariaMesComparacao =
      consumption[mesComparacao - 1].valor -
      instantConsumption[mesComparacao - 1];

    var saldoParaAdicionarDireitoAdquirido =
      injetadoMesComparacao +
      disponibilityByType[phase] -
      usoConcessionariaMesComparacao;

    saldoCumulado =
      saldoCumulado + netMonth[mesComparacao - 1] > 0
        ? saldoCumulado + netMonth[mesComparacao - 1]
        : 0;

    saldoCumuladoDireitoAdquirido =
      saldoCumuladoDireitoAdquirido + saldoParaAdicionarDireitoAdquirido > 0
        ? saldoCumuladoDireitoAdquirido + saldoParaAdicionarDireitoAdquirido
        : 0;
    var compensacaoSeComUsoDeSaldo =
      saldoPassado <= 0
        ? injetadoMesComparacao
        : saldoPassado + injetadoMesComparacao < usoConcessionariaMesComparacao
        ? saldoPassado + injetadoMesComparacao
        : usoConcessionariaMesComparacao;
    var compensacao =
      liquidoMesComparacao >= 0
        ? usoConcessionariaMesComparacao
        : compensacaoSeComUsoDeSaldo > 0
        ? compensacaoSeComUsoDeSaldo
        : 0;

    var fioB =
      compensacao *
      progressaoFioB[anoComparacao as keyof typeof progressaoFioB];
    var outrosCustos =
      compensacao >= usoConcessionariaMesComparacao
        ? fioB
        : fioB +
          (usoConcessionariaMesComparacao - compensacao) *
            progressaoKWH[anoComparacao as keyof typeof progressaoFioB];

    var custoDisponibilidade =
      disponibilityByType[phase] *
      progressaoKWH[anoComparacao as keyof typeof progressaoFioB];

    var valorFatura =
      custoDisponibilidade > outrosCustos
        ? custoDisponibilidade + publicIlumination
        : outrosCustos + publicIlumination;
    var valorFaturaDireitoAdquirido =
      saldoParaAdicionarDireitoAdquirido > 0
        ? custoDisponibilidade + publicIlumination
        : saldoParaAdicionarDireitoAdquirido + saldoPassadoDireitoAdquirido >= 0
        ? custoDisponibilidade + publicIlumination
        : Math.abs(
            saldoParaAdicionarDireitoAdquirido + saldoPassadoDireitoAdquirido
          ) *
            progressaoKWH[anoComparacao as keyof typeof progressaoFioB] +
          publicIlumination +
          custoDisponibilidade;

    var economia =
      consumption[mesComparacao - 1].valor *
        progressaoKWH[anoComparacao as keyof typeof progressaoFioB] +
      publicIlumination -
      valorFatura;
    var economiaDireitoAdquirido =
      consumption[mesComparacao - 1].valor *
        progressaoKWH[anoComparacao as keyof typeof progressaoFioB] +
      publicIlumination -
      valorFaturaDireitoAdquirido;

    payback = payback + economia;
    paybackDireitoAdquirido =
      paybackDireitoAdquirido + economiaDireitoAdquirido;
    if (i > 0) poupanca = poupanca + (savingsRates / 100) * -poupanca;
    if (custoDisponibilidade > outrosCustos)
      saldoCumulado = saldoCumulado + disponibilityByType[phase];

    tabelaFinal.push({
      ANO: anoComparacao,
      MÊS: mesComparacao,
      TAG:
        mesComparacao >= 10
          ? `${mesComparacao}/${anoComparacao}`
          : `0${mesComparacao}/${anoComparacao}`,
      "SALDO ACUMULADO (NOVA LEI)": Number(saldoCumulado.toFixed(2)),
      "SALDO ACUMULADO (DIREITO ADQUIRIDO)": Number(
        saldoCumuladoDireitoAdquirido.toFixed(2)
      ),
      "VALOR FATURA (NOVA LEI)": Number(valorFatura.toFixed(2)),
      "VALOR FATURA (DIREITO ADQUIRIDO)": Number(
        valorFaturaDireitoAdquirido.toFixed(2)
      ),

      "PAYBACK (NOVA LEI)": Number(payback.toFixed(2)),
      "PAYBACK (DIREITO ADQUIRIDO)": Number(paybackDireitoAdquirido.toFixed(2)),
      "INVESTIMENTO POUPANÇA": poupanca,
    });

    if (mesComparacao + 1 > 12) {
      mesComparacao = 1;
      anoComparacao = anoComparacao + 1;
    } else {
      mesComparacao = mesComparacao + 1;
    }
  }
  return tabelaFinal;
}
export function getMostFrequent(arr: any[]) {
  const hashmap = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(hashmap).reduce((a, b) =>
    hashmap[a] > hashmap[b] ? a : b
  );
}
export function getAverageValue(arr: number[]) {
  const sum = arr.reduce((a, b) => a + b, 0);
  const avg = sum / arr.length || 0;
  return avg;
}
