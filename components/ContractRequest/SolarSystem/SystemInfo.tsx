import { getPeakPotByModules } from "@/utils/methods";
import { IContractRequest, IProposeInfo } from "@/utils/models";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaSolarPanel } from "react-icons/fa";
import { ImPower, ImPriceTag } from "react-icons/im";
import { TbTopologyFullHierarchy } from "react-icons/tb";
type SystemInfoProps = {
  requestInfo: IContractRequest;
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>;
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  kit: IProposeInfo["kit"];
};
function SystemInfo({
  requestInfo,
  setRequestInfo,
  goToPreviousStage,
  goToNextStage,
  kit,
}: SystemInfoProps) {
  return (
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
        DADOS DO SISTEMA
      </span>
      <div className="flex w-full grow flex-col items-center">
        <h1 className="italic text-gray-500">
          O kit a ser utilizado na solicitação de contrato é aquele vinculado a
          proposta. Segue informações sobre esse kit abaixo:
        </h1>
        <div
          className={
            "relative mt-2 flex h-[500px] w-full flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg lg:h-[400px] lg:w-[350px]"
          }
        >
          <h1 className="text-center text-lg font-medium text-gray-800">
            {kit?.nome}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-start gap-2">
              <ImPower style={{ color: "rgb(239,68,68)", fontSize: "20px" }} />
              <p className="text-xs font-thin text-gray-600">
                {requestInfo.potPico
                  ? requestInfo.potPico.toLocaleString("pt-br", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 2,
                    })
                  : getPeakPotByModules(kit?.modulos).toLocaleString("pt-br", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 2,
                    })}{" "}
                kWp
              </p>
            </div>
            {kit?.tipo == "PROMOCIONAL" ? (
              <div className="flex items-center justify-end gap-2 rounded border border-green-500 p-1">
                <ImPriceTag
                  style={{ color: "rgb(34,197,94)", fontSize: "15px" }}
                />
                <p className="text-xs font-thin text-green-500">PROMOCIONAL</p>
              </div>
            ) : null}
          </div>
          <div className="flex w-full items-center justify-center py-4">
            <FaSolarPanel style={{ color: "green", fontSize: "56px" }} />
          </div>
          <div className="flex w-full items-start justify-center">
            <div className="flex  flex-col items-center">
              <p className="font-medium text-blue-800">TOPOLOGIA</p>
              <div className="flex items-center gap-2">
                <TbTopologyFullHierarchy
                  style={{ color: "#FFD200", fontSize: "25px" }}
                />{" "}
                <p className="text-xs font-light text-gray-500">
                  {kit?.topologia}
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <h1 className="text-center font-medium text-gray-600">
              INVERSORES
            </h1>
            {kit?.inversores.map((inverter) => (
              <div className="flex w-full items-center justify-between text-xs font-thin text-gray-600">
                <h1>
                  {inverter.fabricante}-{inverter.modelo}
                </h1>
                <h1>x{inverter.qtde}</h1>
              </div>
            ))}
          </div>
          <div className="flex w-full flex-col">
            <h1 className="text-center font-medium text-gray-600">MÓDULOS</h1>
            {kit?.modulos.map((module) => (
              <div className="flex w-full items-center justify-between text-xs font-thin text-gray-600">
                <h1>
                  {module.fabricante}-{module.modelo}
                </h1>
                <h1>x{module.qtde}</h1>
              </div>
            ))}
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
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default SystemInfo;
