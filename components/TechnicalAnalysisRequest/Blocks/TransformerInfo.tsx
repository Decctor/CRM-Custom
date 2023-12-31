import NumberInput from "@/components/Inputs/NumberInput";
import SelectInput from "@/components/Inputs/SelectInput";
import { formatLongString } from "@/utils/methods";
import { ITechnicalAnalysis } from "@/utils/models";
import React from "react";
import { toast } from "react-hot-toast";
import { BsCheckCircleFill } from "react-icons/bs";
type TransformerInfoProps = {
  requestInfo: ITechnicalAnalysis;
  setRequestInfo: React.Dispatch<React.SetStateAction<ITechnicalAnalysis>>;
  goToNextStage: () => void;
  goToPreviousStage: () => void;
  files:
    | {
        [key: string]: {
          title: string;
          file: File | null | string;
        };
      }
    | undefined;
  setFiles: React.Dispatch<
    React.SetStateAction<
      | {
          [key: string]: {
            title: string;
            file: File | null | string;
          };
        }
      | undefined
    >
  >;
};
function TransformerInfo({
  requestInfo,
  setRequestInfo,
  files,
  setFiles,
  goToNextStage,
  goToPreviousStage,
}: TransformerInfoProps) {
  function validateFields() {
    if (!requestInfo.padraoTrafoAcoplados) {
      toast.error("Preencha sobre o acoplamentação de transformador e padrão.");
      return false;
    }
    if (!requestInfo.potTrafo || requestInfo.potTrafo <= 0) {
      toast.error("Preencha a potência do transformador.");
      return false;
    }
    if (!files?.fotoTrafo) {
      toast.error("Anexe uma foto do transformador do cliente.");
      return false;
    }
    if (!files?.fotoLocalizacaoTrafo) {
      toast.error("Anexe uma foto da localização do transformador.");
      return false;
    }
    if (!files?.fotoNumeroTrafo) {
      toast.error("Anexe uma foto do número do transformador.");
      return false;
    }
    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] px-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#fbcb83]">
        DADOS DO TRANSFORMADOR
      </span>

      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <SelectInput
              width="100%"
              label="TRANSFORMADOR E PADRÃO ACOPLADOS ?"
              value={requestInfo.padraoTrafoAcoplados}
              options={[
                { id: 1, label: "SIM", value: "SIM" },
                { id: 2, label: "NÃO", value: "NÃO" },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) =>
                setRequestInfo((prev) => ({
                  ...prev,
                  padraoTrafoAcoplados: value,
                }))
              }
              onReset={() =>
                setRequestInfo((prev) => ({
                  ...prev,
                  padraoTrafoAcoplados: undefined,
                }))
              }
            />
          </div>
          <div className="w-full lg:w-1/2">
            <NumberInput
              width="100%"
              label="POTÊNCIA DO TRANSFORMADOR"
              placeholder="Preencha aqui a potência do transformador..."
              value={requestInfo.potTrafo ? requestInfo.potTrafo : null}
              handleChange={(value) =>
                setRequestInfo((prev) => ({ ...prev, potTrafo: value }))
              }
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 grid-rows-3 gap-2 lg:grid-cols-3 lg:grid-rows-1">
          <div className="flex w-full flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label
                className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                htmlFor="laudo"
              >
                FOTO DO TRANSFORMADOR
              </label>
              {files?.fotoTrafo ? (
                <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
              ) : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files?.fotoTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.fotoTrafo.file != "string"
                        ? files.fotoTrafo.file?.name
                        : formatLongString(files.fotoTrafo.file, 35)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setFiles({
                    ...files,
                    fotoTrafo: {
                      title: "FOTO DO TRANSFORMADOR",
                      file: e.target.files ? e.target.files[0] : null,
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label
                className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                htmlFor="laudo"
              >
                FOTO DA LOCALIZAÇÃO DO TRANSFORMADOR
              </label>
              {files?.fotoLocalizacaoTrafo ? (
                <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
              ) : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files?.fotoLocalizacaoTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.fotoLocalizacaoTrafo.file != "string"
                        ? files.fotoLocalizacaoTrafo.file?.name
                        : formatLongString(files.fotoLocalizacaoTrafo.file, 35)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setFiles({
                    ...files,
                    fotoLocalizacaoTrafo: {
                      title: "FOTO DA LOCALIZAÇÃO DO TRANSFORMADOR",
                      file: e.target.files ? e.target.files[0] : null,
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label
                className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                htmlFor="laudo"
              >
                FOTO DO NÚMERO DO TRANSFORMADOR
              </label>
              {files?.fotoNumeroTrafo ? (
                <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
              ) : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files?.fotoNumeroTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.fotoNumeroTrafo.file != "string"
                        ? files.fotoNumeroTrafo.file?.name
                        : formatLongString(files.fotoNumeroTrafo.file, 35)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setFiles({
                    ...files,
                    fotoNumeroTrafo: {
                      title: "FOTO DO NÚMERO DO TRANSFORMADOR",
                      file: e.target.files ? e.target.files[0] : null,
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full items-end justify-between bg-[#fff]">
        <button
          onClick={() => goToPreviousStage()}
          className="rounded p-2 font-bold text-gray-500 duration-300 ease-in-out hover:scale-105"
        >
          Voltar
        </button>
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

export default TransformerInfo;
