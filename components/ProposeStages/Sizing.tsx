import { IProposeInfo } from "@/utils/models";
import React, { SetStateAction, useState } from "react";

type SizingProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  moveToNextStage: React.Dispatch<React.SetStateAction<number>>;
};
function Sizing({ proposeInfo, setProposeInfo, moveToNextStage }: SizingProps) {
  const [validationMsg, setValidationMsg] = useState({ text: "", color: "" });
  function handleProceed() {
    if (proposeInfo.consumoEnergiaMensal <= 0) {
      setValidationMsg({
        text: "Por favor, preencha um valor de consumo válido.",
        color: "text-red-500",
      });
      return;
    }
    if (proposeInfo.tarifa <= 0) {
      setValidationMsg({
        text: "Por favor, preencha um valor de tarifa válido.",
        color: "text-red-500",
      });
      return;
    }
    if (proposeInfo.tarifaTUSD <= 0) {
      setValidationMsg({
        text: "Por favor, preencha um valor de tarifa TUSD válido.",
        color: "text-red-500",
      });
      return;
    }
    moveToNextStage(2);
  }
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <div className="flex w-full flex-col gap-4">
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
              <p className="text-md font-light text-gray-500">Tarifa (R$)</p>
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
              <p className="text-md font-light text-gray-500">Tensão da Rede</p>
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
          <div className="flex w-full flex-col self-center lg:w-[50%] ">
            <p className="text-md font-light text-gray-500">Tipo de telhado</p>
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
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-1">
        {validationMsg.text ? (
          <p className={`text-sm ${validationMsg.color} italic`}>
            {validationMsg.text}
          </p>
        ) : null}
        <button
          onClick={handleProceed}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </>
  );
}

export default Sizing;
