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

import LoadingPage from "@/components/utils/LoadingPage";
import NotAuthorizedPage from "@/components/utils/NotAuthorizedPage";
import Kit from "@/components/Cards/Kit";
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
            <div className="flex items-center gap-2">
              <h1 className="flex font-['Roboto'] text-2xl font-bold text-[#fead61]">
                KITS
              </h1>
              <h1 className="flex font-['Roboto'] text-2xl font-bold text-[#fead61]">
                ({kits.length})
              </h1>
            </div>

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
              ? kits.map((kit, index) => <Kit key={index} kit={kit} />)
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
