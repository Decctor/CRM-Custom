import {
  phases,
  proposeVoltageOptions,
  structureTypes,
} from "@/utils/constants";
import { IProject, IProposeInfo } from "@/utils/models";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";

type SizingProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<number>>;
};
function Sizing({
  proposeInfo,
  setProposeInfo,
  project,
  moveToNextStage,
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
          premissas: { ...prev.premissas, distancia: data.data },
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
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-2">
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
          </div>
          <div className="flex w-full items-center gap-2">
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
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">
                Fator de simultaneidade
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
          <div className="flex w-full items-center gap-2">
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
          <div className="flex w-full flex-col self-center lg:w-[50%] ">
            <p className="text-md font-light text-gray-500">
              Tipo de estrutura
            </p>
            <select
              value={proposeInfo.premissas.tipoEstrutura}
              onChange={(e) =>
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
