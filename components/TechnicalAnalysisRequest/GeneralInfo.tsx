import { ITechnicalAnalysis } from "@/utils/models";
import React from "react";
import TextInput from "../Inputs/TextInput";
import { formatToCEP, formatToPhone, getCEPInfo } from "@/utils/methods";
import { toast } from "react-hot-toast";
import SelectInput from "../Inputs/SelectInput";
import { stateCities } from "@/utils/estados_cidades";

type GeneralInfoProps = {
  requestInfo: ITechnicalAnalysis;
  setRequestInfo: React.Dispatch<React.SetStateAction<ITechnicalAnalysis>>;
  goToNextStage: () => void;
};
function GeneralInfo({
  goToNextStage,
  requestInfo,
  setRequestInfo,
}: GeneralInfoProps) {
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep);
    const toastID = toast.loading("Buscando informações sobre o CEP...", {
      duration: 2000,
    });
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID);
        toast.success("Dados do CEP buscados com sucesso.", {
          duration: 1000,
        });
        setRequestInfo((prev) => ({
          ...prev,
          logradouro: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf:
            addressInfo.uf == "MG" || addressInfo.uf == "GO"
              ? addressInfo.uf
              : undefined,
          cidade: addressInfo.localidade.toUpperCase(),
        }));
      }
    }, 1000);
  }
  function validateFields() {
    if (requestInfo.nomeDoCliente.trim().length < 3) {
      toast.error("Preencha um nome de ao menos 3 letras para o cliente.");
      return false;
    }
    if (requestInfo.telefoneDoCliente?.trim().length < 12) {
      toast.error("Preencha um telefone para o cliente.");
      return false;
    }
    if (requestInfo.cep.trim().length < 9) {
      toast.error("Preench um cep válido para o cliente.");
      return false;
    }
    if (!requestInfo.cidade) {
      toast.error("Preencha a cidade de instalação do cliente.");
      return false;
    }
    if (!requestInfo.uf) {
      toast.error("Preencha o estado da instalação do cliente.");
      return false;
    }
    if (requestInfo.bairro.trim().length < 3) {
      toast.error("Preencha um bairro de ao menos 3 letras.");
      return false;
    }
    if (requestInfo.logradouro.trim().length < 3) {
      toast.error("Preencha um logradouro de ao menos 3 letras.");
      return false;
    }
    if (requestInfo.numeroResidencia.trim().length == 0) {
      toast.error("Preencha o número da residência do cliente.");
    }
    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
        DADOS GERAIS
      </span>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <TextInput
              label={"NOME DO CLIENTE"}
              placeholder="Digite aqui o nome do cliente..."
              width={"100%"}
              value={requestInfo.nomeDoCliente}
              handleChange={(value) =>
                setRequestInfo((prev) => ({ ...prev, nomeDoCliente: value }))
              }
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <TextInput
              label={"TELEFONE DO CLIENTE"}
              placeholder="Digite o telefone do cliente..."
              width={"100%"}
              value={requestInfo.telefoneDoCliente}
              handleChange={(value) =>
                setRequestInfo({
                  ...requestInfo,
                  telefoneDoCliente: formatToPhone(value),
                })
              }
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="w-full lg:w-[450px]">
            <TextInput
              label={"CEP"}
              placeholder="Digite aqui o nome do cliente..."
              width={"100%"}
              value={requestInfo.cep}
              handleChange={(value) => {
                if (value.length == 9) {
                  setAddressDataByCEP(value);
                }
                setRequestInfo({
                  ...requestInfo,
                  cep: formatToCEP(value),
                });
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"CIDADE"}
              editable={true}
              value={requestInfo.cidade}
              options={
                requestInfo.uf
                  ? stateCities[requestInfo.uf].map((city, index) => {
                      return {
                        id: index,
                        value: city,
                        label: city,
                      };
                    })
                  : null
              }
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, cidade: value })
              }
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  cidade: undefined,
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <SelectInput
              width={"100%"}
              label={"UF"}
              editable={true}
              options={[
                {
                  id: 1,
                  label: "MG",
                  value: "MG",
                },
                {
                  id: 2,
                  label: "GO",
                  value: "GO",
                },
              ]}
              value={requestInfo.uf}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, uf: value })
              }
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => {
                setRequestInfo((prev) => ({ ...prev, uf: undefined }));
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <TextInput
              label={"BAIRRO"}
              placeholder="Digite aqui o bairro do cliente.."
              width={"100%"}
              value={requestInfo.bairro}
              handleChange={(value) =>
                setRequestInfo((prev) => ({ ...prev, bairro: value }))
              }
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-[50%]">
            <TextInput
              label={"LOGRADOURO"}
              placeholder="Digite o logradouro do cliente..."
              width={"100%"}
              value={requestInfo.logradouro}
              handleChange={(value) =>
                setRequestInfo({
                  ...requestInfo,
                  logradouro: value,
                })
              }
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="w-full lg:w-[450px]">
            <TextInput
              label={"NÚMERO OU IDENTIFICADOR"}
              placeholder="Digite aqui o número/identificador da residência..."
              width={"100%"}
              value={requestInfo.numeroResidencia}
              handleChange={(value) => {
                setRequestInfo({
                  ...requestInfo,
                  numeroResidencia: value,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full justify-end">
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

export default GeneralInfo;
