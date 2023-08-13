import { IKit, IProject, IProposeInfo, ModuleType } from "@/utils/models";
import React, { useState } from "react";
import { AiFillCaretRight, AiOutlineShoppingCart } from "react-icons/ai";
import { FaSolarPanel } from "react-icons/fa";
import { ImPower, ImPriceTag } from "react-icons/im";
import { TbTopologyFullHierarchy } from "react-icons/tb";
import Modules from "../../utils/pvmodules.json";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { PricesObj, Pricing, getPrices } from "@/utils/pricing/methods";
import { MdAttachMoney } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import dayjs from "dayjs";
import { IoMdAdd } from "react-icons/io";
type KitCardProps = {
  kit: IKit;
  project: IProject;
  propose: IProposeInfo;
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
function ProposeKit({ kit, project, propose, handleSelect }: KitCardProps) {
  const { data: session } = useSession();
  const [pricing, setPricing] = useState(
    getPrices(
      project,
      {
        ...propose,
        kit: {
          kitId: kit._id ? kit._id : "",
          tipo: kit.tipo,
          nome: kit.nome,
          fornecedor: kit.fornecedor,
          topologia: kit.topologia,
          modulos: kit.modulos,
          inversores: kit.inversores,
          preco: kit.preco,
        },
        potenciaPico: getPeakPotByModules(kit.modulos),
      },
      null
    )
  );
  function getProposeExpectedPrice() {
    var finalProposePrice = 0;
    Object.keys(pricing).forEach((priceType) => {
      const cost = pricing[priceType as keyof Pricing]?.custo;

      const finalSellingPrice = pricing[priceType as keyof Pricing]?.vendaFinal
        ? pricing[priceType as keyof Pricing]?.vendaFinal
        : 0;
      if (finalSellingPrice)
        finalProposePrice = finalProposePrice + finalSellingPrice;
    });
    return finalProposePrice;
  }
  if (kit.nome == "PROMOCIONAL JUNHO 05 SÃO JOÃO")
    console.log("KIT05", pricing);
  return (
    <div className="relative flex h-[320px] min-h-[320px] w-[350px] flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg">
      <h1 className="text-center text-lg font-medium text-gray-800">
        {kit.nome}
      </h1>
      <p className="text-center text-xs text-gray-400">{kit.categoria}</p>
      <div className="flex w-full grow flex-col">
        <div className="my-1 flex items-center justify-between gap-2">
          <div className="flex  items-center justify-start gap-2">
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
            <div className="flex  items-center justify-end gap-1">
              <MdAttachMoney style={{ color: "#fead61", fontSize: "20px" }} />

              <p className="text-xs font-thin text-gray-600">
                R${" "}
                {kit.preco.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          ) : null}
          <div className="flex  items-center justify-end gap-2">
            <ImPriceTag style={{ color: "rgb(34,197,94)", fontSize: "20px" }} />

            <p className="text-xs font-thin text-gray-600">
              R${" "}
              {getProposeExpectedPrice().toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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
                style={{ color: "#fbcb83", fontSize: "25px" }}
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
        <div className="text-md p-1  text-gray-700">
          <strong className="text-green-500">
            {(
              getProposeExpectedPrice() /
              (getPeakPotByModules(kit.modulos) * 1000)
            ).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
          </strong>
          R$/Wp
        </div>
        {kit.dataInsercao ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BsFillCalendarCheckFill />
            <p>{dayjs(kit.dataInsercao).format("DD/MM/YYYY")}</p>
          </div>
        ) : null}

        <button
          onClick={() => handleSelect(kit)}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#fbcb83] p-1 text-[#fbcb83] hover:bg-[#fbcb83] hover:text-white"
        >
          <IoMdAdd />
        </button>
      </div>
    </div>
  );
}

export default ProposeKit;
