import { IKit, ModuleType } from "@/utils/models";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaSolarPanel } from "react-icons/fa";
import { ImPower, ImPriceTag } from "react-icons/im";
import { MdAttachMoney } from "react-icons/md";
import { TbTopologyFullHierarchy } from "react-icons/tb";
import Modules from "../../utils/pvmodules.json";
import { useSession } from "next-auth/react";
import { HiBadgeCheck } from "react-icons/hi";
type KitCardProps = {
  kit: IKit;
  handleClick: () => void;
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
function Kit({ kit, handleClick }: KitCardProps) {
  const { data: session } = useSession();
  return (
    <div
      onClick={() => handleClick()}
      className={
        "relative flex h-[500px] w-full cursor-pointer  flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50 lg:h-[400px] lg:w-[350px]"
      }
    >
      {kit.ativo ? (
        <div className="absolute left-0 top-0">
          <HiBadgeCheck style={{ color: "#00b4d8", fontSize: "25px" }} />
        </div>
      ) : null}

      <h1 className="text-center text-lg font-medium text-gray-800">
        {kit.nome}
      </h1>
      <p className="text-center text-xs text-gray-400">{kit.categoria}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-start gap-2">
          <ImPower style={{ color: "rgb(239,68,68)", fontSize: "20px" }} />
          <p className="text-xs font-thin text-gray-600">
            {kit.potPico
              ? (kit.potPico / 1000).toLocaleString("pt-br", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 2,
                })
              : getPeakPotByModules(kit.modulos).toLocaleString("pt-br", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 2,
                })}{" "}
            kWp
          </p>
        </div>
        {kit.tipo == "PROMOCIONAL" ? (
          <div className="flex items-center justify-end gap-2 rounded border border-green-500 p-1">
            <ImPriceTag style={{ color: "rgb(34,197,94)", fontSize: "15px" }} />
            <p className="text-xs font-thin text-green-500">PROMOCIONAL</p>
          </div>
        ) : null}
        {session?.user.permissoes.precos.visualizar ? (
          <div className="flex items-center justify-end gap-2">
            <MdAttachMoney
              style={{ color: "rgb(34,197,94)", fontSize: "20px" }}
            />
            <p className="text-xs font-thin text-gray-600">
              R${" "}
              {kit.preco.toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex w-full items-center justify-center py-4">
        <FaSolarPanel style={{ color: "green", fontSize: "56px" }} />
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
    </div>
  );
}

export default Kit;
