import SelectInput from "@/components/Inputs/SelectInput";
import { ITechnicalAnalysis, aditionalServicesType } from "@/utils/models";
import React from "react";
import { toast } from "react-hot-toast";

type AdditionalServicesInfoProps = {
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
function AdditionalServicesInfo({
  requestInfo,
  setRequestInfo,
  files,
  setFiles,
  goToNextStage,
  goToPreviousStage,
}: AdditionalServicesInfoProps) {
  function validateFields() {
    if (!requestInfo.casaDeMaquinas) {
      toast.error(
        "Preencha sobre a necessidade de construção de uma casa de máquinas."
      );
      return false;
    }
    if (!requestInfo.alambrado) {
      toast.error(
        "Preencha sobre a necessidade de construção de um alambrado."
      );
      return false;
    }
    if (!requestInfo.britagem) {
      toast.error("Preencha sobre a necessidade de uma operação de britagem.");
      return false;
    }
    if (!requestInfo.construcaoBarracao) {
      toast.error("Preencha sobre a necessidade de construção de um barracão.");
      return false;
    }
    if (!requestInfo.instalacaoRoteador) {
      toast.error("Preencha sobre a necessidade de instalação de roteador");
      return false;
    }
    if (!requestInfo.redeReligacao) {
      toast.error(
        "Preencha sobre a necessidade de execução da rede de religação da fazenda."
      );
      return false;
    }
    if (!requestInfo.limpezaLocalUsinaSolo) {
      toast.error(
        "Preencha sobre a necessidade de execução de limpeza do local da usina de solo."
      );
      return false;
    }
    if (!requestInfo.terraplanagemUsinaSolo) {
      toast.error(
        "Preencha sobre a necessidade de execução de terraplanagem do local da usina de solo."
      );
      return false;
    }
    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] px-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#fbcb83]">
        SERIVÇOS ADICIONAIS
      </span>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"CASA DE MÁQUINAS"}
              editable={true}
              value={requestInfo.casaDeMaquinas}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, casaDeMaquinas: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  casaDeMaquinas: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"ALAMBRADO"}
              editable={true}
              value={requestInfo.alambrado}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, alambrado: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  alambrado: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"BRITAGEM"}
              editable={true}
              value={requestInfo.britagem}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, britagem: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  britagem: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"CONSTRUÇÃO DE BARRACÃO"}
              editable={true}
              value={requestInfo.construcaoBarracao}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, construcaoBarracao: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  construcaoBarracao: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"INSTALAÇÃO DE ROTEADOR"}
              editable={true}
              value={requestInfo.instalacaoRoteador}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, instalacaoRoteador: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  instalacaoRoteador: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"REDE DE RELIGAÇÃO DA FAZENDA"}
              editable={true}
              value={requestInfo.redeReligacao}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, redeReligacao: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  redeReligacao: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"LIMPEZA DO LOCAL DA USINA DE SOLO"}
              editable={true}
              value={requestInfo.limpezaLocalUsinaSolo}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, limpezaLocalUsinaSolo: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  limpezaLocalUsinaSolo: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"TERRAPLANAGEM PARA USINA DE SOLO"}
              editable={true}
              value={requestInfo.terraplanagemUsinaSolo}
              options={[
                {
                  id: 1,
                  label: "SIM - RESPONSABILIDADE AMPÈRE",
                  value: "SIM - RESPONSABILIDADE AMPÈRE",
                },
                {
                  id: 2,
                  label: "SIM - RESPONSABILIDADE CLIENTE",
                  value: "SIM - RESPONSABILIDADE CLIENTE",
                },
                { id: 3, label: "NÃO", value: "NÃO" },
              ]}
              handleChange={(value) =>
                setRequestInfo({
                  ...requestInfo,
                  terraplanagemUsinaSolo: value,
                })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  terraplanagemUsinaSolo: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full justify-between">
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
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default AdditionalServicesInfo;
