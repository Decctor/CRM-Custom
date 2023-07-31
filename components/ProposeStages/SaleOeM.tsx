import { IProject, IProposeOeMInfo } from "@/utils/models";
import { getOeMPrices } from "@/utils/pricing/methods";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import EditOeMPriceModal from "../ProposeUtilBlocks/EditPriceOeMModal";

type SaleOeMProps = {
  proposeInfo: IProposeOeMInfo;
  project: IProject;
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeOeMInfo>>;
  moveToPreviousStage: React.Dispatch<React.SetStateAction<null>>;
  moveToNextStage: React.Dispatch<React.SetStateAction<null>>;
};
type EditPriceModalState = {
  isOpen: boolean;
  priceTag: string | null;
};
function SaleOeM({
  proposeInfo,
  setProposeInfo,
  project,
  moveToPreviousStage,
  moveToNextStage,
}: SaleOeMProps) {
  const { data: session } = useSession();
  const [pricing, setPricing] = useState(
    getOeMPrices(
      proposeInfo.premissas.qtdeModulos,
      proposeInfo.premissas.distancia
    )
  );
  const [editPriceModal, setEditPriceModal] = useState<EditPriceModalState>({
    isOpen: false,
    priceTag: null,
  });
  function handleProceed() {
    setProposeInfo((prev) => ({
      ...prev,
      precificacao: pricing,
    }));
    moveToNextStage(null);
  }
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <h1 className="text-center font-Raleway font-bold text-gray-800">
          PLANOS DE O&M
        </h1>
      </div>
      <div className="flex grow items-start justify-around gap-2 py-2">
        <div
          className={
            "flex h-[450px]  w-[350px] flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg"
          }
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
                {pricing.manutencaoSimples.vendaFinal.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {session?.user.permissoes.precos.editar ? (
                <button
                  onClick={() =>
                    setEditPriceModal({
                      isOpen: true,
                      priceTag: "manutencaoSimples",
                    })
                  }
                  className="text-md text-gray-400 hover:text-[#fead61]"
                >
                  <AiFillEdit />
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div
          className={
            "flex h-[450px]  w-[350px] flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg"
          }
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
                {pricing.planoSol.vendaFinal.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {session?.user.permissoes.precos.editar ? (
                <button
                  onClick={() =>
                    setEditPriceModal({ isOpen: true, priceTag: "planoSol" })
                  }
                  className="text-md text-gray-400 hover:text-[#fead61]"
                >
                  <AiFillEdit />
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div
          className={
            "flex h-[450px]  w-[350px] flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg"
          }
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
                {pricing.planoSolPlus.vendaFinal.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {session?.user.permissoes.precos.editar ? (
                <button
                  onClick={() =>
                    setEditPriceModal({
                      isOpen: true,
                      priceTag: "planoSolPlus",
                    })
                  }
                  className="text-md text-gray-400 hover:text-[#fead61]"
                >
                  <AiFillEdit />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <button
          onClick={() => moveToPreviousStage(null)}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          onClick={handleProceed}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
      {editPriceModal.isOpen && editPriceModal.priceTag ? (
        <EditOeMPriceModal
          pricing={pricing}
          setPricing={setPricing}
          priceType={editPriceModal.priceTag}
          closeModal={() =>
            setEditPriceModal((prev) => ({ ...prev, isOpen: false }))
          }
        />
      ) : null}
    </>
  );
}

export default SaleOeM;
