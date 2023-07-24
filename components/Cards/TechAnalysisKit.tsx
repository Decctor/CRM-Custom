import { IKit, ModuleType } from "@/utils/models";
import dayjs from "dayjs";
import React from "react";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { ImPower } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import Modules from "../../utils/pvmodules.json";
import { TbTopologyFullHierarchy } from "react-icons/tb";
import { AiOutlineShoppingCart } from "react-icons/ai";
type TechAnalysisKitProps = {
  kit: IKit;
  handleSelect: (kit: IKit) => void;
};
function getPeakPotByModules(modules: ModuleType[]) {
  var peakPotSum = 0;
  for (let i = 0; i < modules.length; i++) {
    const moduleInfo = Modules.find((mod) => mod.id == modules[i].id);

    peakPotSum = peakPotSum + modules[i].qtde * modules[i].potencia;
  }
  return peakPotSum / 1000;
}
function TechAnalysisKit({ kit, handleSelect }: TechAnalysisKitProps) {
  return (
    <div className="relative flex h-[320px] min-h-[320px] w-[350px] flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg">
      <h1 className="text-center text-lg font-medium text-gray-800">
        {kit.nome}
      </h1>
      <p className="text-center text-xs text-gray-400">{kit.categoria}</p>
      <div className="flex w-full grow flex-col">
        <div className="my-1 flex items-center justify-center gap-2">
          <div className="flex  items-center justify-center gap-2">
            <ImPower style={{ color: "rgb(239,68,68)", fontSize: "20px" }} />
            <p className="text-xs font-thin text-gray-600">
              {getPeakPotByModules(kit.modulos).toLocaleString("pt-br", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
              })}{" "}
              kWp
            </p>
          </div>
        </div>
        <div className="flex w-full items-start">
          <div className="flex w-1/2 flex-col items-start">
            <p className="font-medium text-blue-800">TOPOLOGIA</p>
            <div className="flex items-center gap-2">
              <TbTopologyFullHierarchy
                style={{ color: "#FFD200", fontSize: "25px" }}
              />{" "}
              <p className="text-xs font-light text-gray-500">
                {kit.topologia}
              </p>
            </div>
          </div>
          <div className="flex w-1/2 flex-col items-end">
            <p className="font-medium text-blue-800">FORNECEDOR</p>
            <div className="flex items-center gap-2">
              <AiOutlineShoppingCart
                style={{ color: "#15599a", fontSize: "25px" }}
              />{" "}
              <p className="text-xs font-light text-gray-500">
                {kit.fornecedor}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <h1 className="text-center font-medium text-gray-600">INVERSORES</h1>
          {kit.inversores.map((inverter) => (
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
          {kit.modulos.map((module) => (
            <div className="flex w-full items-center justify-between text-xs font-thin text-gray-600">
              <h1>
                {module.fabricante}-{module.modelo}
              </h1>
              <h1>x{module.qtde}</h1>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        {kit.dataInsercao ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BsFillCalendarCheckFill />
            <p>{dayjs(kit.dataInsercao).format("DD/MM/YYYY")}</p>
          </div>
        ) : null}

        <button
          onClick={() => handleSelect(kit)}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#15599a] p-1 text-[#15599a] hover:bg-[#15599a] hover:text-white"
        >
          <IoMdAdd />
        </button>
      </div>
    </div>
  );
}

export default TechAnalysisKit;
