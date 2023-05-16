import NewKit from "@/components/Modals/NewKit";
import { Sidebar } from "@/components/Sidebar";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { useKits } from "@/utils/methods";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { TbTopologyFullHierarchy } from "react-icons/tb";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaSolarPanel } from "react-icons/fa";
import { ModuleType } from "@/utils/models";
import Modules from "../../utils/pvmodules.json";
import { ImPower, ImPriceTag } from "react-icons/im";
import LoadingPage from "@/components/utils/LoadingPage";
import NotAuthorizedPage from "@/components/utils/NotAuthorizedPage";
function Kits() {
  const { data: session, status } = useSession({ required: true });

  const { data: kits = [], status: kitsStatus } = useKits();
  const [newKitModalIsOpen, setNewKitModalIsOpen] = useState(false);
  console.log(kits);

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
  if (status == "loading") return <LoadingPage />;
  if (session.user.permissoes.kits.visualizar)
    return (
      <div className="flex h-full">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex flex-col items-center justify-between border-b border-[#fead61] pb-2 xl:flex-row">
            <h1 className="flex font-['Roboto'] text-2xl font-bold text-[#fead61]">
              KITS
            </h1>
            {session?.user.permissoes.kits.editar ? (
              <button
                onClick={() => setNewKitModalIsOpen(true)}
                className="rounded bg-[#15599a] p-2 text-sm font-bold text-white"
              >
                NOVO KIT
              </button>
            ) : null}
          </div>
          <div className="flex grow flex-wrap justify-around gap-3 p-3">
            {kitsStatus == "loading" ? <LoadingComponent /> : null}
            {kitsStatus == "success"
              ? kits.map((kit, index) => (
                  <div
                    key={index}
                    className="flex h-[400px] w-[350px] flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg"
                  >
                    <h1 className="text-center text-lg font-medium text-gray-800">
                      {kit.nome}
                    </h1>
                    <p className="text-center text-xs text-gray-400">
                      {kit.categoria}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex w-1/2 items-center justify-start gap-2">
                        <ImPower
                          style={{ color: "rgb(239,68,68)", fontSize: "20px" }}
                        />
                        <p className="text-xs font-thin text-gray-600">
                          {getPeakPotByModules(kit.modulos)} kWp
                        </p>
                      </div>
                      <div className="flex w-1/2 items-center justify-end gap-2">
                        <ImPriceTag
                          style={{ color: "rgb(34,197,94)", fontSize: "20px" }}
                        />
                        <p className="text-xs font-thin text-gray-600">
                          R${" "}
                          {kit.preco.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-center py-4">
                      <FaSolarPanel
                        style={{ color: "green", fontSize: "56px" }}
                      />
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
                      <h1 className="text-center font-medium text-gray-600">
                        INVERSORES
                      </h1>
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
                      <h1 className="text-center font-medium text-gray-600">
                        MÓDULOS
                      </h1>
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
                ))
              : null}
            {kitsStatus == "error" ? (
              <div className="flex w-full grow items-center justify-center">
                <p className="font-medium text-red-400">
                  Parece que ocorreu um erro no carregamento dos kits. Por
                  favor, tente novamente mais tarde.
                </p>
              </div>
            ) : null}
          </div>
        </div>
        {newKitModalIsOpen ? (
          <NewKit
            isOpen={newKitModalIsOpen}
            setModalIsOpen={setNewKitModalIsOpen}
          />
        ) : null}
      </div>
    );
  if (!session.user.permissoes.kits.visualizar) return <NotAuthorizedPage />;
}

export default Kits;
