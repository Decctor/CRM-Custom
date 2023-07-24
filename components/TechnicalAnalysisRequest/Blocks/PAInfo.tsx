import SelectInput from "@/components/Inputs/SelectInput";
import TextInput from "@/components/Inputs/TextInput";
import { ITechnicalAnalysis } from "@/utils/models";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
type PAInfoProps = {
  requestInfo: ITechnicalAnalysis;
  setRequestInfo: React.Dispatch<React.SetStateAction<ITechnicalAnalysis>>;
  goToNextStage: () => void;
};
function PAInfo({ requestInfo, setRequestInfo, goToNextStage }: PAInfoProps) {
  const [paHolder, setPaHolder] = useState({
    type: undefined,
    amperage: "NÃO DEFINIDO",
    code: "",
  });
  const [paArr, setPaArr] = useState<
    {
      tipoDisjuntor: string;
      amperagem: string;
      numeroMedidor: string;
    }[]
  >([]);
  function addPA() {
    if (!paHolder.type) {
      toast.error("Preencha o tipo do padrão.");
      return;
    }
    if (paHolder.code.trim().length < 5) {
      toast.error("Preencha um número válido para o medidor.");
    }
    var paArrCopy = [...paArr];
    paArrCopy.push({
      tipoDisjuntor: paHolder.type,
      amperagem: paHolder.amperage,
      numeroMedidor: paHolder.code,
    });
    setPaArr(paArrCopy);
    setPaHolder({
      type: undefined,
      amperage: "NÃO DEFINIDO",
      code: "",
    });
    toast.success("Padrão adicionado!", { duration: 1000 });
  }
  function validateFields() {
    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] px-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
        DADOS DO PADRÃO
      </span>

      <div className="flex w-full grow flex-col gap-2">
        <p className="text-center text-xs italic text-gray-500">
          Você agora pode adicionar múltiplos padrões, em caso de caixa
          conjugada.
        </p>
        <p className="text-center text-sm font-medium text-gray-500">
          Preencha as informações e clique em{" "}
          <strong className="font-bold text-green-500">adicionar (+)</strong>.
        </p>
        <div className="flex w-full flex-col items-end gap-2 lg:flex-row">
          <div className="w-full lg:w-[30%]">
            <SelectInput
              width="100%"
              label="TIPO DO DISJUNTOR"
              options={[
                { id: 1, label: "MONOFÁSICO", value: "MONOFÁSICO" },
                { id: 2, label: "BIFÁSICO", value: "BIFÁSICO" },
                { id: 3, label: "TRIFÁSICO", value: "TRIFÁSICO" },
                { id: 4, label: "PADRÃO CONJUGADO", value: "PADRÃO CONJUGADO" },
              ]}
              value={paHolder.type}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) =>
                setPaHolder((prev) => ({ ...prev, type: value }))
              }
              onReset={() =>
                setPaHolder((prev) => ({ ...prev, type: undefined }))
              }
            />
          </div>
          <div className="w-full lg:w-[30%]">
            <SelectInput
              width="100%"
              label="AMPERAGEM"
              options={[
                { id: 1, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                { id: 2, label: "40A", value: "40A" },
                { id: 3, label: "50A", value: "50A" },
                { id: 4, label: "60A", value: "60A" },
                { id: 5, label: "63A", value: "63A" },
                { id: 6, label: "70A", value: "70A" },
                { id: 7, label: "90A", value: "90A" },
                { id: 8, label: "100A", value: "100A" },
                { id: 9, label: "200A", value: "200A" },
                {
                  id: 10,
                  label: "PADRÃO CONJUGADO",
                  value: "PADRÃO CONJUGADO",
                },
              ]}
              value={paHolder.amperage}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) =>
                setPaHolder((prev) => ({ ...prev, amperage: value }))
              }
              onReset={() =>
                setPaHolder((prev) => ({ ...prev, amperage: "NÃO DEFINIDO" }))
              }
            />
          </div>
          <div className="w-full lg:w-[30%]">
            <TextInput
              width="100%"
              label="NÚMERO DO MEDIDOR"
              value={paHolder.code}
              handleChange={(value) =>
                setPaHolder((prev) => ({ ...prev, code: value }))
              }
              placeholder="Digite aqui o número do medidor..."
            />
          </div>
          <div className="mb-4 mt-2 flex w-full items-center justify-center text-green-500 lg:mt-0 lg:w-[10%]">
            <p
              onClick={addPA}
              className="cursor-pointer text-lg text-green-500 duration-300 ease-in-out hover:scale-125"
            >
              <AiOutlinePlus />
            </p>
          </div>
        </div>
        {paArr.map((item, index) => (
          <div key={index} className="my-1 flex items-center gap-2">
            <p className="w-[30%] text-center text-xs font-bold">
              {item.tipoDisjuntor}
            </p>
            <p className="w-[30%] text-center text-xs font-bold">
              {item.amperagem}
            </p>
            <p className="w-[30%] text-center text-xs font-bold">
              {item.numeroMedidor}
            </p>
            <div className="flex w-[10%] items-center justify-center">
              <button
                onClick={() => {
                  let arr = paArr;
                  arr.splice(index, 1);
                  setPaArr([...arr]);
                }}
                className="text-lg text-red-300 duration-300 ease-in-out hover:scale-110 hover:text-red-500"
              >
                <AiFillDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex w-full items-end justify-end bg-[#fff]">
        <button
          onClick={() => {
            if (validateFields()) {
              goToNextStage();
            }
          }}
          className=" rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default PAInfo;
