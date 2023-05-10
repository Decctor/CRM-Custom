import { Sidebar } from "@/components/Sidebar";
import React, { useState } from "react";
import { IoMdOptions } from "react-icons/io";
import { MdAttachMoney, MdSell } from "react-icons/md";
import { SlEnergy } from "react-icons/sl";
import { ImFileEmpty } from "react-icons/im";
import TextInput from "@/components/Inputs/TextInput";
import System from "@/components/ProposeStages/System";
import Sizing from "@/components/ProposeStages/Sizing";
function PropostaPage() {
  const [proposeInfo, setProposeInfo] = useState({
    consumoEnergiaMensal: 0,
    tarifa: 0,
    tarifaTUSD: 0,
    tensao: "127/220V",
    fase: "Bifásico",
    fatorSimultaneidade: 0,
    regra: "Regra de Transição",
    sombreamento: "Nenhum",
    tipoTelhado: "Fibrocimento",
  });
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa]">
        <div className="flex h-[70px] w-full items-center justify-around bg-black">
          <div className="flex flex-col items-center">
            <h1 className="text-sm text-gray-400">CLIENTE</h1>
            <h1 className="font-bold text-white">MADALENA (MG-PRATA)</h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-sm text-gray-400">CÓD. DO PROJETO</h1>
            <h1 className="font-bold text-white">#1532</h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-sm text-gray-400">CÓD.PROPOSTA</h1>
            <h1 className="font-bold text-white">#1</h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-sm text-gray-400">RESPONSÁVEL</h1>
            <h1 className="font-bold text-white">LEONARDO VILARINHO</h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-sm text-gray-400">REPRESENTANTE</h1>
            <h1 className="font-bold text-white">LEANDRO VIALI</h1>
          </div>
        </div>
        <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
          <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-5 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-1">
            <div className="flex items-center justify-center gap-1 text-[#15599a]">
              <IoMdOptions style={{ fontSize: "23px" }} />
              <p className="text-sm font-bold lg:text-lg">DIMENSIONAMENTO</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <SlEnergy style={{ fontSize: "23px" }} />
              <p className="text-sm font-bold lg:text-lg">SISTEMA</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <MdSell style={{ fontSize: "23px" }} />
              <p className="text-sm font-bold lg:text-lg">VENDA</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <MdAttachMoney style={{ fontSize: "23px" }} />
              <p className="text-sm font-bold lg:text-lg">FINANCEIRO</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <ImFileEmpty style={{ fontSize: "23px" }} />
              <p className="text-sm font-bold lg:text-lg">PROPOSTA</p>
            </div>
          </div>
          {/* <div className="flex w-full flex-col gap-4 py-4 lg:flex-row">
            <div className="flex w-full flex-col gap-4">
              <h1 className="font-bold">UNIDADE GERADORA</h1>
              <div className="flex w-full items-center gap-2">
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">
                    Consumo médio mensal (kWh)
                  </p>
                  <input
                    type="number"
                    value={proposeInfo.consumoEnergiaMensal.toString()}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        consumoEnergiaMensal: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  />
                </div>
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">
                    Tarifa (R$)
                  </p>
                  <input
                    type="number"
                    value={proposeInfo.tarifa.toString()}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        tarifa: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">
                    TUSD Fio B (R$/kWh)
                  </p>
                  <input
                    type="number"
                    value={proposeInfo.tarifaTUSD.toString()}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        tarifaTUSD: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  />
                </div>
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">
                    Fator de simultaneidade
                  </p>
                  <input
                    type="number"
                    value={proposeInfo.tarifa.toString()}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        tarifa: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">
                    Tensão da Rede
                  </p>
                  <select
                    value={proposeInfo.tensao}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        tensao: e.target.value,
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  >
                    <option>127/220V</option>
                    <option>220/380V</option>
                    <option>277/480V</option>
                  </select>
                </div>
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">Fase</p>
                  <select
                    value={proposeInfo.fase}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        fase: e.target.value,
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  >
                    <option>Monofásico</option>
                    <option>Bifásico</option>
                    <option>Trifásico</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <h1 className="font-bold">CARACTERÍSTICAS</h1>
              <div className="flex w-full items-center gap-2">
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">
                    Tipo de telhado
                  </p>
                  <select
                    value={proposeInfo.tipoTelhado}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        tipoTelhado: e.target.value,
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  >
                    <option value="Carport">Carport</option>
                    <option value="Cerâmico">Cerâmico</option>
                    <option value="Fibrocimento">Fibrocimento</option>
                    <option value="Laje">Laje</option>
                    <option value="Shingle">Shingle</option>
                    <option value="Metálico">Metálico</option>
                    <option value="Zipado">Zipado</option>
                    <option value="Solo">Solo</option>
                    <option value="Sem estrutura">Sem estrutura</option>
                  </select>
                </div>
                <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                  <p className="text-md font-light text-gray-500">
                    Sombreamento
                  </p>
                  <select
                    value={proposeInfo.sombreamento}
                    onChange={(e) =>
                      setProposeInfo((prev) => ({
                        ...prev,
                        sombreamento: e.target.value,
                      }))
                    }
                    className="w-full rounded-sm border border-gray-200 p-2 text-gray-500 outline-none"
                  >
                    <option value="Nenhum">Nenhum</option>
                    <option value="Pouco">Pouco</option>
                    <option value="Médio">Médio</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end px-1">
            <button className="rounded bg-gray-400 p-2 font-bold hover:bg-black hover:text-white">
              Prosseguir
            </button>
          </div> */}
          {/* <Sizing proposeInfo={proposeInfo} setProposeInfo={setProposeInfo}/> */}
          <System />
        </div>
      </div>
    </div>
  );
}

export default PropostaPage;
