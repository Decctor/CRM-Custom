import { IKit, ModuleType } from "@/utils/models";
import React from "react";
import { AiFillCaretRight, AiOutlineShoppingCart } from "react-icons/ai";
import { FaSolarPanel } from "react-icons/fa";
import { ImPower, ImPriceTag } from "react-icons/im";
import { TbTopologyFullHierarchy } from "react-icons/tb";
import Modules from "../../utils/pvmodules.json";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useSession } from "next-auth/react";
type KitCardProps = {
  kit: IKit;
  handleSelect: (kit: IKit) => void;
};
function getPeakPotByModules(modules: ModuleType[]) {
  var peakPotSum = 0;
  for (let i = 0; i < modules.length; i++) {
    const moduleInfo = Modules.find((mod) => mod.id == modules[i].id);
    if (moduleInfo) {
      peakPotSum = peakPotSum + modules[i].qtde * moduleInfo.potencia;
    }
  }
  return peakPotSum / 1000;
}
function ProposeKit({ kit, handleSelect }: KitCardProps) {
  const { data: session } = useSession();
  return (
    <div className="flex min-h-[290px] w-[350px] flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg">
      <h1 className="text-center text-lg font-medium text-gray-800">
        {kit.nome}
      </h1>
      <p className="text-center text-xs text-gray-400">{kit.categoria}</p>
      <div className="flex items-center gap-2">
        <div className="flex w-1/2 items-center justify-start gap-2">
          <ImPower style={{ color: "rgb(239,68,68)", fontSize: "20px" }} />
          <p className="text-xs font-thin text-gray-600">
            {getPeakPotByModules(kit.modulos).toLocaleString("pt-br", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
            })}{" "}
            kWp
          </p>
        </div>
        {session?.user.permissoes.precos.visualizar ? (
          <div className="flex w-1/2 items-center justify-end gap-2">
            <ImPriceTag style={{ color: "rgb(34,197,94)", fontSize: "20px" }} />

            <p className="text-xs font-thin text-gray-600">
              R${" "}
              {kit.preco.toLocaleString("pt-br", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex w-full items-start">
        <div className="flex w-1/2 flex-col items-start">
          <p className="font-medium text-blue-800">TOPOLOGIA</p>
          <div className="flex items-center gap-2">
            <TbTopologyFullHierarchy
              style={{ color: "#FFD200", fontSize: "25px" }}
            />{" "}
            <p className="text-xs font-light text-gray-500">{kit.topologia}</p>
          </div>
        </div>
        <div className="flex w-1/2 flex-col items-end">
          <p className="font-medium text-blue-800">FORNECEDOR</p>
          <div className="flex items-center gap-2">
            <AiOutlineShoppingCart
              style={{ color: "#15599a", fontSize: "25px" }}
            />{" "}
            <p className="text-xs font-light text-gray-500">{kit.fornecedor}</p>
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
      <div className="flex w-full justify-end">
        <button
          onClick={() => handleSelect(kit)}
          className="rounded-full border border-[#15599a] p-1 text-[#15599a] hover:bg-[#15599a] hover:text-white"
        >
          <HiOutlineChevronRight />
        </button>
      </div>
    </div>
  );
}

export default ProposeKit;
