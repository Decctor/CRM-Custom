import { IContractRequest } from "@/utils/models";
import { getOeMPrices } from "@/utils/pricing/methods";
import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";

type OeMPlansInfo = {
  requestInfo: IContractRequest;
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>;
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  modulesQty: number;
  distance: number;
  activePlanId?: number;
};

function OeMPlansInfo({
  requestInfo,
  setRequestInfo,
  goToPreviousStage,
  goToNextStage,
  modulesQty,
  distance,
  activePlanId,
}: OeMPlansInfo) {
  const [pricing, setPricing] = useState(getOeMPrices(modulesQty, distance));

  // Nos casos em que houver um plano selecionado, captar nova escolha e atualizar informações da proposta.

  return (
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
        PLANO INTEGRADO DE OPERAÇÃO E MANUTENÇÃO
      </span>
      <p className="text-center text-sm italic text-gray-500">
        Escolha, se houver, o plano de Operação & Manutenção incluso no projeto.
      </p>
      <div className="flex grow flex-wrap items-start justify-around gap-2 py-2">
        <div
          onClick={() => {
            setRequestInfo((prev) => ({
              ...prev,
              possuiOeM: "SIM",
              planoOeM: "MANUTENÇÃO SIMPLES",
              valorOeMOuSeguro: pricing.manutencaoSimples.vendaFinal,
            }));
            goToNextStage();
          }}
          className={`flex h-fit min-h-[450px] ${
            activePlanId == 1 || requestInfo.planoOeM == "MANUTENÇÃO SIMPLES"
              ? "bg-green-200"
              : ""
          }  w-[350px] cursor-pointer flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50`}
        >
          <h1 className="text-center text-lg font-medium text-gray-800">
            MANUTENÇÃO SIMPLES
          </h1>
          <div className="flex grow flex-col gap-4">
            <h1 className="text-center text-xs font-medium text-[#fead61]">
              ITENS DO PLANO
            </h1>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-red-500">
                <AiFillCloseCircle />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  REAPERTO CONEXÕES ELÉTRICAS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-red-500">
                <AiFillCloseCircle />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS EQUIPAMENTOS
                  ELÉTRICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-red-500">
                <AiFillCloseCircle />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  LIMPEZA NOS MÓDULOS FOTOVOLTAICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  DISTRIBUIÇÃO DE CRÉDITOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-red-500">
                <AiFillCloseCircle />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-1">
            <h1 className="text-xs font-thin text-gray-800">
              VALOR DO SERVIÇO
            </h1>
            <div className="flex items-center justify-center gap-1 rounded border border-green-500 p-1">
              <MdAttachMoney
                style={{ color: "rgb(34,197,94)", fontSize: "20px" }}
              />
              <p className="text-lg font-medium text-gray-600">
                R${" "}
                {pricing?.manutencaoSimples.vendaFinal.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setRequestInfo((prev) => ({
              ...prev,
              possuiOeM: "SIM",
              planoOeM: "PLANO SOL",
              valorOeMOuSeguro: pricing.planoSol.vendaFinal,
            }));
            goToNextStage();
          }}
          className={`flex h-fit min-h-[450px] ${
            activePlanId == 2 || requestInfo.planoOeM == "PLANO SOL"
              ? "bg-green-200"
              : ""
          }  w-[350px] cursor-pointer flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50`}
        >
          <h1 className="text-center text-lg font-medium text-gray-800">
            PLANO SOL
          </h1>
          <div className="flex grow flex-col gap-4">
            <h1 className="text-center text-xs font-medium text-[#fead61]">
              ITENS DO PLANO
            </h1>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  REAPERTO CONEXÕES ELÉTRICAS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS EQUIPAMENTOS
                  ELÉTRICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  LIMPEZA NOS MÓDULOS FOTOVOLTAICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <h1 className="text-center text-xs font-medium text-blue-700">
                MANUTENÇÃO ADICIONAL DURANTE O PLANO POR 50% DO VALOR DO
                CONTRATO
              </h1>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  DISTRIBUIÇÃO DE CRÉDITOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end gap-2 text-green-500">
                2x <BsPatchCheckFill />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-1">
            <h1 className="text-xs font-thin text-gray-800">
              VALOR DO SERVIÇO
            </h1>
            <div className="flex items-center justify-center gap-1 rounded border border-green-500 p-1">
              <MdAttachMoney
                style={{ color: "rgb(34,197,94)", fontSize: "20px" }}
              />
              <p className="text-lg font-medium text-gray-600">
                R${" "}
                {pricing?.planoSol.vendaFinal.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setRequestInfo((prev) => ({
              ...prev,
              possuiOeM: "SIM",
              planoOeM: "PLANO SOL +",
              valorOeMOuSeguro: pricing.planoSolPlus.vendaFinal,
            }));
            goToNextStage();
          }}
          className={`flex h-fit min-h-[450px] ${
            activePlanId == 3 || requestInfo.planoOeM == "PLANO SOL +"
              ? "bg-green-200"
              : ""
          }  w-[350px] cursor-pointer flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50`}
        >
          <h1 className="text-center text-lg font-medium text-gray-800">
            PLANO SOL+
          </h1>
          <div className="flex grow flex-col gap-4">
            <h1 className="text-center text-xs font-medium text-[#fead61]">
              ITENS DO PLANO
            </h1>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  REAPERTO CONEXÕES ELÉTRICAS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS EQUIPAMENTOS
                  ELÉTRICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  LIMPEZA NOS MÓDULOS FOTOVOLTAICOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                <BsPatchCheckFill />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <h1 className="text-center text-xs font-medium text-blue-700">
                MANUTENÇÃO ADICIONAL DURANTE O PLANO POR 70% DO VALOR DO
                CONTRATO
              </h1>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-[80%] items-center justify-center">
                <h1 className="text-center text-xs font-medium text-gray-500">
                  DISTRIBUIÇÃO DE CRÉDITOS
                </h1>
              </div>
              <div className="flex w-[20%] items-center justify-end text-green-500">
                ILIMITADO
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-1">
            <h1 className="text-xs font-thin text-gray-800">
              VALOR DO SERVIÇO
            </h1>
            <div className="flex items-center justify-center gap-1 rounded border border-green-500 p-1">
              <MdAttachMoney
                style={{ color: "rgb(34,197,94)", fontSize: "20px" }}
              />
              <p className="text-lg font-medium text-gray-600">
                R${" "}
                {pricing?.planoSolPlus.vendaFinal.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-wrap justify-between  gap-2">
        <button
          onClick={() => {
            goToPreviousStage();
          }}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          onClick={() => {
            goToNextStage();
          }}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir sem plano
        </button>
      </div>
    </div>
  );
}

export default OeMPlansInfo;
