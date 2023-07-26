import {
  distributorsOptions,
  energyTariffs,
  orientations,
  phases,
  proposeVoltageOptions,
  structureTypes,
  subgroupsOptions,
} from "@/utils/constants";
import { IProject, IProposeInfo, ITechnicalAnalysis } from "@/utils/models";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCheck } from "react-icons/ai";
import { MdAssessment, MdAttachMoney, MdEngineering } from "react-icons/md";

type SizingProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<number>>;
  technicalAnalysis?: ITechnicalAnalysis[];
  selectedAnalysis: ITechnicalAnalysis | null;
  setSelectedAnalysis: React.Dispatch<
    React.SetStateAction<ITechnicalAnalysis | null>
  >;
};
function Sizing({
  proposeInfo,
  setProposeInfo,
  project,
  moveToNextStage,
  technicalAnalysis,
  selectedAnalysis,
  setSelectedAnalysis,
}: SizingProps) {
  const [validationMsg, setValidationMsg] = useState({ text: "", color: "" });

  const { data } = useQuery({
    queryKey: ["distance", proposeInfo.projeto.id],
    queryFn: async (): Promise<number> => {
      try {
        const { data } = await axios.get(
          `/api/utils/distance?destination=${`${project.cliente?.cidade}, ${project.cliente?.uf}, BRASIL`}&origin=${"ITUIUTABA, MG, BRASIL"}`
        );
        setProposeInfo((prev) => ({
          ...prev,
          premissas: { ...prev.premissas, distancia: Math.ceil(data.data) },
        }));
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
        return 0;
      }
    },
    enabled: !!project.cliente,
    refetchOnWindowFocus: false,
  });

  function handleProceed() {
    if (proposeInfo.premissas.consumoEnergiaMensal <= 0) {
      setValidationMsg({
        text: "Por favor, preencha um valor de consumo válido.",
        color: "text-red-500",
      });
      return;
    }
    if (proposeInfo.premissas.tarifaEnergia <= 0) {
      setValidationMsg({
        text: "Por favor, preencha um valor de tarifa válido.",
        color: "text-red-500",
      });
      return;
    }
    if (proposeInfo.premissas.tarifaTUSD <= 0) {
      setValidationMsg({
        text: "Por favor, preencha um valor de tarifa TUSD válido.",
        color: "text-red-500",
      });
      return;
    }
    moveToNextStage(2);
  }
  // useEffect(() => {
  //   if (project.cliente) {
  //     const distributor =
  //       project?.cliente?.uf == "MG" ? "CEMIG D" : "EQUATORIAL GO";
  //     const subgroup = proposeInfo.premissas.subgrupo;
  //     console.log(energyTariffs[distributor]);
  //     console.log(subgroup);
  //     setProposeInfo((prev) => ({
  //       ...prev,
  //       premissas: {
  //         ...prev.premissas,
  //         distribuidora: distributor,
  //         tarifaEnergia: tariff,
  //         tarifaTUSD: tusd,
  //       },
  //     }));
  //   }
  // }, [project]);
  console.log("SIZING", proposeInfo);
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-center">
            <h1 className="text-center font-medium italic text-[#fead61]">
              Nessa etapa, por favor preencha informações que nos possibilitarão
              a realizar uma análise primária das necessidades e especificidades
              técnicas do projeto.
            </h1>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">
                Consumo médio mensal (kWh)
              </p>
              <input
                type="number"
                value={proposeInfo.premissas.consumoEnergiaMensal.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      consumoEnergiaMensal: Number(e.target.value),
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">
                Fator de simultaneidade (%)
              </p>
              <input
                type="number"
                value={proposeInfo.premissas.fatorSimultaneidade.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      fatorSimultaneidade: Number(e.target.value),
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
          </div>
          <h1 className="justify-center text-center text-sm font-bold text-[#15599a]">
            TARIFAS
          </h1>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full grow flex-col gap-1">
              <p className="text-md font-light text-gray-500">Concessionária</p>
              <select
                value={proposeInfo.premissas.distribuidora}
                onChange={({ target }) => {
                  var value = target.value as keyof typeof energyTariffs;
                  const tariff = proposeInfo.premissas.subgrupo
                    ? energyTariffs[value][proposeInfo.premissas.subgrupo]
                        .tarifa
                    : 0;
                  const tusd = proposeInfo.premissas.subgrupo
                    ? energyTariffs[value as keyof typeof energyTariffs][
                        proposeInfo.premissas.subgrupo
                      ].tusd
                    : 0;
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      distribuidora: value,
                      tarifaEnergia: tariff,
                      tarifaTUSD: tusd,
                    },
                  }));
                }}
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              >
                {distributorsOptions.map((distOption, index) => (
                  <option key={index} value={distOption.value}>
                    {distOption.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full grow flex-col gap-1">
              <p className="text-md font-light text-gray-500">Subgrupo</p>
              <select
                value={
                  proposeInfo.premissas.subgrupo
                    ? proposeInfo.premissas.subgrupo
                    : "NÃO DEFINIDO"
                }
                onChange={({ target }) => {
                  if (target.value != "NÃO DEFINIDO") {
                    const value =
                      target.value as (typeof subgroupsOptions)[number]["value"];
                    const tariff =
                      energyTariffs[proposeInfo.premissas.distribuidora][value]
                        .tarifa;
                    const tusd =
                      energyTariffs[proposeInfo.premissas.distribuidora][value]
                        .tusd;
                    setProposeInfo((prev) => ({
                      ...prev,
                      premissas: {
                        ...prev.premissas,
                        subgrupo: value,
                        tarifaEnergia: tariff,
                        tarifaTUSD: tusd,
                      },
                    }));
                  } else {
                    setProposeInfo((prev) => ({
                      ...prev,
                      premissas: {
                        ...prev.premissas,
                        subgrupo: undefined,
                        tarifaEnergia: 0,
                        tarifaTUSD: 0,
                      },
                    }));
                  }
                }}
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              >
                {subgroupsOptions.map((subgroup, index) => (
                  <option key={index} value={subgroup.value}>
                    {subgroup.label}
                  </option>
                ))}
                <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
              </select>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">Tarifa (R$)</p>
              <input
                type="number"
                value={proposeInfo.premissas.tarifaEnergia.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      tarifaEnergia: Number(e.target.value),
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">
                TUSD Fio B (R$/kWh)
              </p>
              <input
                type="number"
                value={proposeInfo.premissas.tarifaTUSD.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      tarifaTUSD: Number(e.target.value),
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
          </div>
          <h1 className="justify-center text-center text-sm font-bold text-[#15599a]">
            ESPECIFICIDADES DA REDE
          </h1>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">Tensão da Rede</p>
              <select
                value={proposeInfo.premissas.tensaoRede}
                onChange={({ target }) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      tensaoRede: target.value,
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              >
                {proposeVoltageOptions.map((voltageOption, index) => (
                  <option key={index} value={voltageOption.value}>
                    {voltageOption.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">Fase</p>
              <select
                value={proposeInfo.premissas.fase}
                onChange={(e) =>
                  // @ts-ignore
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      fase: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              >
                {phases.map((phase, index) => (
                  <option key={index} value={phase.value}>
                    {phase.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h1 className="justify-center text-center text-sm font-bold text-[#15599a]">
            ESPECIFICIDADES DA INSTALAÇÃO
          </h1>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col lg:w-1/3">
              <p className="text-md font-light text-gray-500">
                Tipo de estrutura
              </p>
              <select
                value={proposeInfo.premissas.tipoEstrutura}
                onChange={(e) =>
                  // @ts-ignore
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      tipoEstrutura: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              >
                {structureTypes.map((type, index) => (
                  <option key={index} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full flex-col lg:w-1/3">
              <p className="text-md font-light text-gray-500">Orientação</p>
              <select
                value={proposeInfo.premissas.orientacao}
                onChange={(e) => {
                  const value = e.target.value as (typeof orientations)[number];
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      orientacao: value,
                    },
                  }));
                }}
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              >
                {orientations.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-1/3">
              <p className="text-md font-light text-gray-500">Distância (km)</p>
              <input
                type="number"
                value={proposeInfo.premissas.distancia.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      distancia: Number(e.target.value),
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
          </div>
          {technicalAnalysis ? (
            <>
              <h1 className="justify-center text-center text-sm font-bold text-[#15599a]">
                AVALIAÇÕES TÉCNICAS VINCULADAS AO PROJETO
              </h1>
              <div className="flex w-full flex-wrap items-center justify-center gap-2">
                {technicalAnalysis.map((analysis, index) => (
                  <div
                    onClick={() => {
                      if (selectedAnalysis?._id == analysis._id)
                        setSelectedAnalysis(null);
                      else setSelectedAnalysis(analysis);
                    }}
                    key={index}
                    className={`${
                      selectedAnalysis?._id == analysis._id
                        ? "bg-green-200"
                        : " "
                    } flex h-[300px] max-h-[300px] w-[400px] cursor-pointer flex-col items-center rounded border border-gray-200 p-2 shadow-lg duration-300 ease-in-out hover:scale-[1.02]`}
                  >
                    <div className="flex w-full flex-col items-center">
                      <MdAssessment
                        style={{ color: "#fead61", fontSize: "35px" }}
                      />
                      <h1 className="text-center text-lg font-medium">
                        {analysis.nomeDoCliente}
                      </h1>
                    </div>
                    <div className="flex w-full grow flex-col items-center overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-300">
                      <h1 className="mb-1 mt-2 text-xs font-medium text-gray-500">
                        CUSTOS PREVISTOS
                      </h1>
                      {analysis.custosAdicionais &&
                      analysis.custosAdicionais.length > 0 ? (
                        analysis.custosAdicionais.map((cost) => (
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                              <MdAttachMoney style={{ color: "green" }} />
                              <h1 className="text-center text-sm font-medium text-blue-500">
                                {cost.descricao}
                              </h1>
                            </div>
                            <div className="flex items-center justify-between gap-2 ">
                              <h1 className="text-sm text-gray-500">
                                {cost.qtde}x
                              </h1>
                              <h1 className="text-sm font-medium text-green-500">
                                R${" "}
                                {cost.valor.toLocaleString("pt-br", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </h1>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs italic text-gray-500">
                          Sem custos adicionais previstos...
                        </p>
                      )}
                      <div className="flex w-full grow flex-col">
                        <h1 className="mb-1 mt-2 text-center text-xs font-medium text-gray-500">
                          CONCLUSÃO DA AVALIAÇÃO
                        </h1>
                        <h1 className="text-center text-xs font-medium italic text-gray-800">
                          {analysis.respostaConclusao
                            ? analysis.respostaConclusao
                            : "Nenhuma conclusão preenchida para essa análise."}
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-1">
        {validationMsg.text ? (
          <p className={`text-sm ${validationMsg.color} italic`}>
            {validationMsg.text}
          </p>
        ) : null}
        <button
          onClick={handleProceed}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </>
  );
}

export default Sizing;
