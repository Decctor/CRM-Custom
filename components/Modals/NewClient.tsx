import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import DropdownSelect from "../Inputs/DropdownSelect";
import TextInput from "../Inputs/TextInput";
import { ObjectId } from "mongodb";
import {
  formatToCEP,
  formatToCPForCNPJ,
  formatToPhone,
  getCEPInfo,
} from "@/utils/methods";
import { stateCities } from "../../utils/estados_cidades";
import { IRepresentative } from "@/utils/models";
import representatives from "@/pages/api/representatives";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

type NewClientModalProps = {
  representatives: IRepresentative[] | null;
  closeModal: () => void;
};
interface IClientInsertInfo {
  representante: {
    id: string;
    nome: string;
  } | null;
  nome: string;
  cpfCnpj: string;
  telefonePrimario: string;
  telefoneSecundario: string;
  email: string;
  cep: string;
  bairro: string;
  endereco: string;
  numeroOuIdentificador: string;
  complemento: string;
  uf: "MG" | "GO" | null;
  cidade: string;
}
function NewClientModal({ closeModal, representatives }: NewClientModalProps) {
  const queryClient = useQueryClient();
  const [clientInfo, setClientInfo] = useState<IClientInsertInfo>({
    representante: null,
    nome: "",
    cpfCnpj: "",
    telefonePrimario: "",
    telefoneSecundario: "",
    email: "",
    cep: "",
    bairro: "",
    endereco: "",
    numeroOuIdentificador: "",
    complemento: "",
    uf: null,
    cidade: "",
  });
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
        setClientInfo((prev) => ({
          ...prev,
          endereco: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf:
            addressInfo.uf == "MG" || addressInfo.uf == "GO"
              ? addressInfo.uf
              : null,
          cidade: addressInfo.localidade.toUpperCase(),
        }));
      }
    }, 1000);
  }
  const { mutate } = useMutation({
    mutationKey: ["newClient"],
    mutationFn: async () => {
      try {
        let { data } = await axios.post("/api/clients", {
          ...clientInfo,
        });
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        if (data.message) toast.success(data.message);
        setClientInfo({
          representante: null,
          nome: "",
          cpfCnpj: "",
          telefonePrimario: "",
          telefoneSecundario: "",
          email: "",
          cep: "",
          bairro: "",
          endereco: "",
          numeroOuIdentificador: "",
          complemento: "",
          uf: null,
          cidade: "",
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          return;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          return;
        }
      }
    },
  });

  return (
    <div
      id="defaultModal"
      className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]"
    >
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[93%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">
              NOVO CLIENTE
            </h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto border-b border-gray-200 py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:flex-row">
            <div className="flex w-full flex-col gap-2 px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:h-full lg:max-h-full lg:w-[60%] lg:overflow-y-auto">
              <div className="grid grid-cols-1 px-2">
                <div className="flex w-full flex-col gap-1">
                  <label
                    htmlFor="representante"
                    className="font-sans font-bold  text-[#353432]"
                  >
                    REPRESENTANTE
                  </label>
                  <DropdownSelect
                    selectedItemLabel="A SELECIONAR"
                    categoryName="REPRESENTANTE"
                    value={
                      clientInfo.representante
                        ? clientInfo.representante.id
                        : null
                    }
                    options={
                      representatives
                        ? representatives.map((representative) => {
                            return {
                              id: representative.id,
                              value: representative,
                              label: representative.nome,
                            };
                          })
                        : null
                    }
                    onChange={(selectedItem) =>
                      setClientInfo((prev) => ({
                        ...prev,
                        representante: selectedItem.value,
                      }))
                    }
                    onReset={() =>
                      setClientInfo((prev) => ({
                        ...prev,
                        representante: null,
                      }))
                    }
                    width="%100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
                <TextInput
                  label="NOME"
                  value={clientInfo.nome}
                  placeholder="Preencha aqui o nome do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({ ...prev, nome: value }))
                  }
                  width="100%"
                />
                <TextInput
                  label="CPF/CNPJ"
                  value={clientInfo.cpfCnpj}
                  placeholder="Preencha aqui o CPF ou CNPJ do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({
                      ...prev,
                      cpfCnpj: formatToCPForCNPJ(value),
                    }))
                  }
                  width="100%"
                />
              </div>
              <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
                <TextInput
                  label="TELEFONE PRIMÁRIO"
                  value={clientInfo.telefonePrimario}
                  placeholder="Preencha aqui o telefone primário do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({
                      ...prev,
                      telefonePrimario: formatToPhone(value),
                    }))
                  }
                  width="100%"
                />

                <TextInput
                  label="TELEFONE SECUNDÁRIO"
                  value={clientInfo.telefoneSecundario}
                  placeholder="Preencha aqui o telefone secundário do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({
                      ...prev,
                      telefoneSecundario: formatToPhone(value),
                    }))
                  }
                  width="100%"
                />
              </div>
              <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
                <TextInput
                  label="EMAIL"
                  value={clientInfo.email}
                  placeholder="Preencha aqui o email do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({ ...prev, email: value }))
                  }
                  width="100%"
                />

                <TextInput
                  label="CEP"
                  value={clientInfo.cep}
                  placeholder="Preencha aqui o CEP do cliente."
                  handleChange={(value) => {
                    if (value.length == 9) {
                      setAddressDataByCEP(value);
                    }
                    setClientInfo((prev) => ({
                      ...prev,
                      cep: formatToCEP(value),
                    }));
                  }}
                  width="100%"
                />
              </div>
              <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
                <DropdownSelect
                  selectedItemLabel="ESTADO"
                  categoryName="ESTADO"
                  value={
                    clientInfo.uf
                      ? Object.keys(stateCities).indexOf(clientInfo.uf) + 1
                      : null
                  }
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
                  onChange={(selectedItem) => {
                    if (
                      selectedItem.value == "MG" ||
                      selectedItem.value == "GO"
                    ) {
                      setClientInfo({ ...clientInfo, uf: selectedItem.value });
                    }
                  }}
                  onReset={() => {
                    setClientInfo((prev) => ({ ...prev, uf: null }));
                  }}
                  width="100%"
                />
                <DropdownSelect
                  selectedItemLabel="CIDADE"
                  categoryName="CIDADE"
                  value={
                    clientInfo.cidade && clientInfo.uf
                      ? stateCities[clientInfo.uf].indexOf(clientInfo.cidade)
                      : null
                  }
                  options={
                    clientInfo.uf
                      ? stateCities[clientInfo.uf].map((city, index) => {
                          return {
                            id: index,
                            value: city,
                            label: city,
                          };
                        })
                      : null
                  }
                  onChange={(selectedItem) =>
                    setClientInfo((prev) => ({
                      ...prev,
                      cidade: selectedItem.value,
                    }))
                  }
                  width="100%"
                  onReset={() => {
                    setClientInfo((prev) => ({ ...prev, cidade: "" }));
                  }}
                />
              </div>
              <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
                <TextInput
                  label="BAIRRO"
                  value={clientInfo.bairro}
                  placeholder="Preencha aqui o bairro do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({ ...prev, bairro: value }))
                  }
                  width="100%"
                />
                <TextInput
                  label="LOGRADOURO/RUA"
                  value={clientInfo.endereco}
                  placeholder="Preencha aqui o logradouro do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({ ...prev, endereco: value }))
                  }
                  width="100%"
                />
              </div>
              <div className="mb-2 grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
                <TextInput
                  label="NÚMERO/IDENTIFICADOR"
                  value={clientInfo.numeroOuIdentificador}
                  placeholder="Preencha aqui o número ou identificador da residência do cliente."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({
                      ...prev,
                      numeroOuIdentificador: value,
                    }))
                  }
                  width="100%"
                />
                <TextInput
                  label="COMPLEMENTO"
                  value={clientInfo.complemento}
                  placeholder="Preencha aqui algum complemento do endereço."
                  handleChange={(value) =>
                    setClientInfo((prev) => ({
                      ...prev,
                      complemento: value,
                    }))
                  }
                  width="100%"
                />
              </div>
            </div>
            <div className="flex w-full grow flex-col items-center lg:w-[40%]">
              <h1 className="w-full text-center font-sans text-xl font-bold text-[#353432]">
                CLIENTES SIMILARES
              </h1>
              <div className="flex grow items-center justify-center">
                <p className="italic text-[#353432]">
                  Nenhum cliente similar encontrado...
                </p>
              </div>
            </div>
          </div>
          <div className="my-2 flex w-full items-center justify-end px-4">
            <button
              onClick={() => mutate()}
              className="font-medium text-green-500 duration-300 ease-in-out hover:scale-110"
            >
              CRIAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewClientModal;
