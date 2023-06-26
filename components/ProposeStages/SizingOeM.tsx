import {
  phases,
  proposeVoltageOptions,
  structureTypes,
} from "@/utils/constants";
import { IProject, IProposeOeMInfo } from "@/utils/models";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import NumberInput from "../Inputs/NumberInput";

type SizingOeMProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeOeMInfo>>;
  proposeInfo: IProposeOeMInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<number>>;
};
function SizingOeM({
  proposeInfo,
  setProposeInfo,
  project,
  moveToNextStage,
}: SizingOeMProps) {
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
    if (proposeInfo.premissas.qtdeModulos <= 0) {
      setValidationMsg({
        text: "Por favor, preencha uma quantidade válida de módulos",
        color: "text-red-500",
      });
      return;
    }
    if (proposeInfo.premissas.potModulos <= 0) {
      setValidationMsg({
        text: "Por favor, preencha uma potência válida para os módulos",
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
          <div className="flex w-full items-center justify-center">
            <h1 className="text-center font-medium italic text-[#fead61]">
              Nessa etapa, por favor preencha informações que nos possibilitarão
              a realizar uma análise primária das necessidades e especificidades
              técnicas do projeto.
            </h1>
          </div>
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
                Quantidade de Módulos (UN)
              </p>
              <input
                type="number"
                value={proposeInfo.premissas.qtdeModulos.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      qtdeModulos: Number(e.target.value),
                    },
                    potenciaPico:
                      (prev.premissas.potModulos * Number(e.target.value)) /
                      1000,
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">
                Potência dos Módulos (W)
              </p>
              <input
                type="number"
                value={proposeInfo.premissas.potModulos.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      potModulos: Number(e.target.value),
                    },
                    potenciaPico:
                      (prev.premissas.qtdeModulos * Number(e.target.value)) /
                      1000,
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">
                Eficiência Atual (%)
              </p>
              <input
                type="number"
                value={proposeInfo.premissas.eficienciaAtual.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,
                    premissas: {
                      ...prev.premissas,
                      eficienciaAtual: Number(e.target.value),
                    },
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <p className="text-md font-light text-gray-500">
                Potência Pico (kWp)
              </p>
              <input
                type="number"
                value={proposeInfo.potenciaPico?.toString()}
                onChange={(e) =>
                  setProposeInfo((prev) => ({
                    ...prev,

                    potenciaPico: Number(e.target.value),
                  }))
                }
                className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
              />
            </div>
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

export default SizingOeM;
