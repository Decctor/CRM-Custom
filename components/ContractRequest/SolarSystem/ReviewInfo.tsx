import DateInput from "@/components/Inputs/DateInput";
import NumberInput from "@/components/Inputs/NumberInput";
import SelectInput from "@/components/Inputs/SelectInput";
import TextInput from "@/components/Inputs/TextInput";
import {
  creditors,
  customersAcquisitionChannels,
  customersNich,
  paTypes,
  signMethods,
  structureTypes,
} from "@/utils/constants";
import { stateCities } from "@/utils/estados_cidades";
import {
  formatDate,
  formatToCEP,
  formatToCPForCNPJ,
  formatToPhone,
  getPeakPotByModules,
} from "@/utils/methods";
import { IContractRequest, IProposeInfo } from "@/utils/models";
import { getOeMPrices } from "@/utils/pricing/methods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaSolarPanel } from "react-icons/fa";
import { ImAttachment, ImPower, ImPriceTag } from "react-icons/im";
import { MdAttachMoney } from "react-icons/md";
import { TbTopologyFullHierarchy } from "react-icons/tb";
type ReviewInfoProps = {
  requestInfo: IContractRequest;
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>;
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  kit: IProposeInfo["kit"];
  modulesQty: number;
  distance: number;
  activePlanId?: number;
  projectId?: string;
  proposeInfo?: IProposeInfo;
};
function ReviewInfo({
  requestInfo,
  setRequestInfo,
  goToPreviousStage,
  goToNextStage,
  kit,
  modulesQty,
  distance,
  activePlanId,
  projectId,
  proposeInfo,
}: ReviewInfoProps) {
  const [pricing, setPricing] = useState(getOeMPrices(modulesQty, distance));
  const queryClient = useQueryClient();
  const {
    mutate: createContractRequest,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationKey: ["createContractRequest"],
    mutationFn: async () => {
      try {
        const { data } = await axios.post(
          `/api/ampereIntegration/contractRequest`,
          {
            ...requestInfo,
            idProjetoCRM: projectId,
          }
        );
        const { data: proposeUpdate } = await axios.put(
          `/api/proposes?id=${proposeInfo?._id}&responsible=${proposeInfo?.autor?.id}`,
          {
            changes: {
              aceite: true,
              dataEfetivacao: new Date().toISOString(),
              idSolicitacaoContrato: data.data,
            },
          }
        );
        await queryClient.invalidateQueries({
          queryKey: ["propose", proposeInfo?._id],
        });
        if (data.message) toast.success(data.message);
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
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-xl font-bold uppercase text-green-500">
        REVISÃO DAS INFORMAÇÕES
      </span>
      <div className="flex w-full grow flex-col">
        <div className="flex w-full flex-col  bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS PARA CONTRATO
          </span>
          <div className="flex flex-col flex-wrap justify-around gap-2 p-2 lg:grid lg:grid-cols-3">
            <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
              SOBRE O CLIENTE
            </h1>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"NOME/RAZÃO SOCIAL"}
                placeholder="Digite o nome do contrato."
                value={requestInfo.nomeDoContrato}
                editable={true}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    nomeDoContrato: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"TELEFONE"}
                editable={true}
                placeholder="Digite aqui o telefone do cliente."
                value={requestInfo.telefone}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    telefone: formatToPhone(value),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"CPF/CNPJ"}
                editable={true}
                value={requestInfo.cpf_cnpj}
                placeholder="Digite aqui o CPF ou CNPJ para o contrato."
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    cpf_cnpj: formatToCPForCNPJ(value),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"RG"}
                editable={true}
                placeholder="Digite aqui o RG do cliente."
                value={requestInfo.rg}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, rg: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <DateInput
                width={"450px"}
                label={"DATA DE NASCIMENTO"}
                editable={true}
                value={
                  requestInfo.dataDeNascimento
                    ? formatDate(requestInfo.dataDeNascimento)
                    : undefined
                }
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    dataDeNascimento: value,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
                label={"ESTADO CIVIL"}
                options={[
                  {
                    id: 1,
                    label: "CASADO(A)",
                    value: "CASADO(A)",
                  },
                  {
                    id: 2,
                    label: "SOLTEIRO(A)",
                    value: "SOLTEIRO(A)",
                  },
                  {
                    id: 3,
                    label: "UNIÃO ESTÁVEL",
                    value: "UNIÃO ESTÁVEL",
                  },
                  {
                    id: 4,
                    label: "DIVORCIADO(A)",
                    value: "DIVORCIADO(A)",
                  },
                  {
                    id: 5,
                    label: "VIUVO(A)",
                    value: "VIUVO(A)",
                  },
                  {
                    id: 6,
                    label: "NÃO DEFINIDO",
                    value: "NÃO DEFINIDO",
                  },
                ]}
                editable={true}
                value={requestInfo.estadoCivil}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, estadoCivil: value })
                }
                onReset={() => {
                  setRequestInfo((prev) => ({
                    ...prev,
                    estadoCivil: undefined,
                  }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"EMAIL"}
                editable={true}
                placeholder="Preencha aqui o email do cliente."
                value={requestInfo.email}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, email: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"PROFISSÃO"}
                editable={true}
                placeholder="Preencha aqui a profissão do cliente."
                value={requestInfo.profissao}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    profissao: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"ONDE TRABALHA"}
                placeholder="Preencha aqui onde o cliente trabalha."
                editable={true}
                value={requestInfo.ondeTrabalha}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, ondeTrabalha: value })
                }
              />
            </div>
            {requestInfo.tipoDeServico != "SISTEMA FOTOVOLTAICO" && (
              <div className="col-span-3 flex items-center justify-center">
                <SelectInput
                  label={"TIPO DO CLIENTE"}
                  width={"450px"}
                  editable={true}
                  value={requestInfo.tipoDoTitular}
                  handleChange={(value) =>
                    setRequestInfo({ ...requestInfo, tipoDoTitular: value })
                  }
                  options={[
                    {
                      id: 1,
                      label: "PESSOA FISICA",
                      value: "PESSOA FISICA",
                    },
                    {
                      id: 2,
                      label: "PESSOA JURIDICA",
                      value: "PESSOA JURIDICA",
                    },
                  ]}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setRequestInfo((prev) => ({
                      ...prev,
                      tipoDoTitular: null,
                    }));
                  }}
                />
              </div>
            )}
            <div className="col-span-3 flex items-center justify-center gap-2">
              <SelectInput
                width={"450px"}
                label={"POSSUI ALGUMA DEFICIÊNCIA"}
                editable={true}
                value={requestInfo.possuiDeficiencia}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    possuiDeficiencia: value,
                  })
                }
                options={[
                  {
                    id: 1,
                    label: "SIM",
                    value: "SIM",
                  },
                  {
                    id: 2,
                    label: "NÃO",
                    value: "NÃO",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    possuiDeficiencia: "NÃO",
                  }))
                }
              />
              {requestInfo.possuiDeficiencia == "SIM" && (
                <>
                  <TextInput
                    width={"450px"}
                    label={"SE SIM, QUAL ?"}
                    editable={true}
                    placeholder="Preencha aqui a deficiência do cliente em questão."
                    value={requestInfo.qualDeficiencia}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        qualDeficiencia: value,
                      })
                    }
                  />
                </>
              )}
            </div>
            <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
              ENDEREÇO
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <TextInput
                width={"450px"}
                label={"CEP"}
                editable={true}
                placeholder="Preencha aqui o CEP do cliente."
                value={requestInfo.cep}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    cep: formatToCEP(value),
                  })
                }
              />
              {/* <button
                    // onClick={() => findCPF("enderecoCobranca")}
                    className="flex h-[30px] items-center rounded bg-[#fead61] p-1"
                  >
                    <AiOutlineSearch />
                  </button> */}
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
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
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
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
                  setRequestInfo((prev) => ({ ...prev, uf: null }));
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"ENDEREÇO DE COBRANÇA"}
                placeholder="Preencha aqui o endereço de cobrança (correspondências) do cliente."
                editable={true}
                value={requestInfo.enderecoCobranca}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    enderecoCobranca: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"Nº"}
                placeholder="Preencha aqui o número/identificador do endereço de cobrança (correspondências) do cliente."
                value={requestInfo.numeroResCobranca}
                editable={true}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    numeroResCobranca: value,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"BAIRRO"}
                editable={true}
                placeholder="Preencha aqui o bairro do cliente."
                value={requestInfo.bairro}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    bairro: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                width={"450px"}
                label={"PONTO DE REFERÊNCIA"}
                placeholder="Preencha aqui o nome de um ponto de referência para o endereço do cliente."
                editable={true}
                value={requestInfo.pontoDeReferencia}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    pontoDeReferencia: value,
                  })
                }
              />
            </div>
            <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
              CONTRATO/VENDA
            </h1>
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
                label={"SEGMENTO"}
                value={requestInfo.segmento}
                editable={true}
                options={customersNich.map((nich, index) => {
                  return {
                    id: index + 1,
                    label: nich.label,
                    value: nich.value,
                  };
                })}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, segmento: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({
                    ...prev,
                    segmento: undefined,
                  }));
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
                label={"FORMA DE ASSINATURA"}
                editable={true}
                value={requestInfo.formaAssinatura}
                options={signMethods.map((method, index) => {
                  return {
                    id: index + 1,
                    label: method.label,
                    value: method.value,
                  };
                })}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, formaAssinatura: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({
                    ...prev,
                    formaAssinatura: undefined,
                  }));
                }}
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <SelectInput
                label={"CANAL DE VENDA"}
                editable={true}
                value={requestInfo.canalVenda}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, canalVenda: value })
                }
                options={customersAcquisitionChannels.map((value) => value)}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({
                    ...prev,
                    canalVenda: null,
                  }));
                }}
              />
            </div>
            {requestInfo.canalVenda == "INDICAÇÃO DE AMIGO" && (
              <div className="col-span-3 flex w-full flex-wrap items-center justify-center gap-2">
                <div className="flex  grow items-center justify-center">
                  <TextInput
                    width="100%"
                    label={"NOME INDICADOR"}
                    editable={true}
                    placeholder="Preencha aqui o nomo do indicador"
                    value={requestInfo.nomeIndicador}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        nomeIndicador: value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="flex grow items-center justify-center">
                  <TextInput
                    width="100%"
                    label={"TELEFONE INDICADOR"}
                    editable={true}
                    placeholder="Preencha aqui o contato do indicador."
                    value={requestInfo.telefoneIndicador}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        telefoneIndicador: formatToPhone(value),
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 flex w-full flex-col items-center self-center px-2">
            <span className="font-raleway text-center text-sm font-bold uppercase">
              COMO VOCÊ CHEGOU A ESSE CLIENTE?
            </span>
            <textarea
              placeholder={"Descreva aqui como esse cliente chegou até voce.."}
              value={requestInfo.comoChegouAoCliente}
              onChange={(e) =>
                setRequestInfo({
                  ...requestInfo,
                  comoChegouAoCliente: e.target.value,
                })
              }
              className="block h-[80px] w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mt-2 flex w-full flex-col items-center self-center px-2">
            <span className="font-raleway text-center text-sm font-bold uppercase">
              OBSERVAÇÃO ADICIONAL ACERCA DO SERVIÇO PRESTADO
            </span>
            <textarea
              placeholder={
                "Preencha aqui, se houver, observações acerca desse contrato. Peculiaridades desse serviço (ex: somente instalação/equipamentos), detalhes e esclarecimentos para financiamento, entre outras informações relevantes."
              }
              value={requestInfo.obsComercial}
              onChange={(e) =>
                setRequestInfo({
                  ...requestInfo,
                  obsComercial: e.target.value,
                })
              }
              className="block h-[80px] w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex w-full flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS PARA CONTATO
          </span>
          <div className="flex grow flex-col gap-2 p-2">
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="w-full">
                <TextInput
                  width="100%"
                  label={"NOME DO CONTATO 1"}
                  placeholder="Preencha aqui o nome do contato primário para a jornada do cliente."
                  editable={true}
                  value={requestInfo.nomeContatoJornadaUm}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      nomeContatoJornadaUm: value,
                    })
                  }
                />
              </div>
              <div className="w-full">
                <TextInput
                  width="100%"
                  label={"TELEFONE DO CONTATO 1"}
                  placeholder="Preencha aqui o telefone do contato primário para a jornada do cliente."
                  editable={true}
                  value={requestInfo.telefoneContatoUm}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      telefoneContatoUm: formatToPhone(value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="w-full">
                <TextInput
                  width="100%"
                  label={"NOME DO CONTATO 2"}
                  placeholder="Preencha aqui o nome do contato secundário para a jornada do cliente."
                  editable={true}
                  value={requestInfo.nomeContatoJornadaDois}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      nomeContatoJornadaDois: value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="w-full">
                <TextInput
                  width="100%"
                  label={"TELEFONE DO CONTATO 2"}
                  placeholder="Preencha aqui o telefone do contato secundário para a jornada do cliente."
                  editable={true}
                  value={requestInfo.telefoneContatoDois}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      telefoneContatoDois: formatToPhone(value),
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col items-center self-center px-2">
              <span className="font-raleway text-center text-sm font-bold uppercase">
                CUIDADOS PARA CONTATO COM O CLIENTE
              </span>
              <textarea
                placeholder={
                  "Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc..."
                }
                value={requestInfo.cuidadosContatoJornada}
                onChange={(e) =>
                  setRequestInfo({
                    ...requestInfo,
                    cuidadosContatoJornada: e.target.value,
                  })
                }
                className="block h-[80px] w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS PARA ENTRADA NA CONCESSIONÁRIA
          </span>
          <div className="flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
            <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
              INFORMAÇÕES DA INSTALAÇÃO DO CLIENTE
            </h1>
            <div className="col-span-3 flex w-full items-center justify-center gap-2">
              <TextInput
                label={"NOME DO TITULAR DO PROJETO"}
                placeholder="Preencha o nome do titular do projeto junto a concessionária."
                value={
                  requestInfo.nomeTitularProjeto
                    ? requestInfo.nomeTitularProjeto
                    : ""
                }
                editable={true}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    nomeTitularProjeto: value.toUpperCase(),
                  })
                }
              />

              <TextInput
                label={"Nº DA INSTALAÇÃO"}
                editable={true}
                placeholder="Preencha aqui o número de instalação junto a concessionária."
                value={
                  requestInfo.numeroInstalacao
                    ? requestInfo.numeroInstalacao
                    : ""
                }
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, numeroInstalacao: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                label={"TIPO DO TITULAR"}
                editable={true}
                value={requestInfo.tipoDoTitular}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, tipoDoTitular: value })
                }
                options={[
                  {
                    id: 1,
                    label: "PESSOA FISICA",
                    value: "PESSOA FISICA",
                  },
                  {
                    id: 2,
                    label: "PESSOA JURIDICA",
                    value: "PESSOA JURIDICA",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoDoTitular: undefined,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                label={"TIPO DA LIGAÇÃO"}
                editable={true}
                value={requestInfo.tipoDaLigacao}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, tipoDaLigacao: value })
                }
                options={[
                  {
                    id: 1,
                    label: "NOVA",
                    value: "NOVA",
                  },
                  {
                    id: 2,
                    label: "EXISTENTE",
                    value: "EXISTENTE",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoDaLigacao: undefined,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                label={"TIPO DA INSTALAÇÃO"}
                editable={true}
                value={requestInfo.tipoDaInstalacao}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, tipoDaInstalacao: value })
                }
                options={[
                  {
                    id: 1,
                    label: "RURAL",
                    value: "RURAL",
                  },
                  {
                    id: 2,
                    label: "URBANO",
                    value: "URBANO",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoDaInstalacao: undefined,
                  }))
                }
              />
            </div>
            <h1 className="col-span-3 pt-2 text-center font-bold text-[#fead61]">
              ENDEREÇO DA INSTALAÇÃO
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-2">
              <TextInput
                editable={true}
                label={"CEP INSTALAÇÃO"}
                placeholder="Preencha aqui o CEP do local de instalação do sistema."
                value={requestInfo.cepInstalacao}
                handleChange={(value) => {
                  //   if (value.length == 9) {
                  //     setAddressDataByCEP(value);
                  //   }
                  setRequestInfo({
                    ...requestInfo,
                    cepInstalacao: formatToCEP(value),
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                label={"ENDEREÇO DE INSTALAÇÃO"}
                editable={true}
                placeholder="Preencha aqui o endereço do local de instalação do sistema."
                value={requestInfo.enderecoInstalacao}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    enderecoInstalacao: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                label={"Nº"}
                editable={true}
                placeholder="Preencha o número/identificador do local de instalação do sistema."
                value={
                  requestInfo.numeroResInstalacao
                    ? requestInfo.numeroResInstalacao
                    : ""
                }
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, numeroResInstalacao: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                label={"BAIRRO"}
                placeholder="Preencha aqui o bairro do local de instalação do sistema."
                editable={true}
                value={requestInfo.bairroInstalacao}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    bairroInstalacao: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
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
                value={requestInfo.ufInstalacao}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, ufInstalacao: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({ ...prev, ufInstalacao: null }));
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                label={"CIDADE"}
                editable={true}
                value={requestInfo.cidadeInstalacao}
                options={
                  requestInfo.ufInstalacao
                    ? stateCities[requestInfo.ufInstalacao].map(
                        (city, index) => {
                          return {
                            id: index,
                            value: city,
                            label: city,
                          };
                        }
                      )
                    : null
                }
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, cidadeInstalacao: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    cidadeInstalacao: undefined,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextInput
                label={"PONTO DE REFERÊNCIA DA INSTALAÇÃO"}
                placeholder="Preencha aqui um ponto de referência do local de instalação."
                editable={true}
                value={requestInfo.pontoDeReferenciaInstalacao}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    pontoDeReferenciaInstalacao: value,
                  })
                }
              />
            </div>
            <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
              <TextInput
                label={"LATITUDE"}
                value={requestInfo.latitude}
                placeholder="Preencha aqui a latitude do local de instalação."
                editable={true}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, latitude: value })
                }
              />
              <TextInput
                label={"LONGITUDE"}
                editable={true}
                value={requestInfo.longitude}
                placeholder="Preencha aqui a longitude do local de instalação."
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, longitude: value })
                }
              />
            </div>

            <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
              INFORMAÇÕES DA CONTA DE CEMIG ATENDE
            </h1>
            <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
              <TextInput
                label={"LOGIN(CEMIG ATENDE)"}
                editable={true}
                placeholder="Preencha aqui o login do CEMIG ATENDE do cliente."
                value={requestInfo.loginCemigAtende}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, loginCemigAtende: value })
                }
              />
              <TextInput
                label={"SENHA(CEMIG ATENDE)"}
                placeholder="Preencha aqui a senha do CEMIG ATENDE do cliente."
                editable={true}
                value={requestInfo.senhaCemigAtende}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, senhaCemigAtende: value })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS DO SISTEMA
          </span>
          <div className="flex w-full grow flex-col items-center">
            <h1 className="italic text-gray-500">
              O kit a ser utilizado na solicitação de contrato é aquele
              vinculado a proposta. Segue informações sobre esse kit abaixo:
            </h1>
            <div
              className={
                "relative mt-2 flex h-[500px] w-full flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg lg:h-[400px] lg:w-[350px]"
              }
            >
              <h1 className="text-center text-lg font-medium text-gray-800">
                {kit?.nome}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center justify-start gap-2">
                  <ImPower
                    style={{ color: "rgb(239,68,68)", fontSize: "20px" }}
                  />
                  <p className="text-xs font-thin text-gray-600">
                    {requestInfo.potPico
                      ? requestInfo.potPico.toLocaleString("pt-br", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 2,
                        })
                      : getPeakPotByModules(kit?.modulos).toLocaleString(
                          "pt-br",
                          {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                    kWp
                  </p>
                </div>
                {kit?.tipo == "PROMOCIONAL" ? (
                  <div className="flex items-center justify-end gap-2 rounded border border-green-500 p-1">
                    <ImPriceTag
                      style={{ color: "rgb(34,197,94)", fontSize: "15px" }}
                    />
                    <p className="text-xs font-thin text-green-500">
                      PROMOCIONAL
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="flex w-full items-center justify-center py-4">
                <FaSolarPanel style={{ color: "green", fontSize: "56px" }} />
              </div>
              <div className="flex w-full items-start justify-center">
                <div className="flex  flex-col items-center">
                  <p className="font-medium text-blue-800">TOPOLOGIA</p>
                  <div className="flex items-center gap-2">
                    <TbTopologyFullHierarchy
                      style={{ color: "#FFD200", fontSize: "25px" }}
                    />{" "}
                    <p className="text-xs font-light text-gray-500">
                      {kit?.topologia}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col">
                <h1 className="text-center font-medium text-gray-600">
                  INVERSORES
                </h1>
                {kit?.inversores.map((inverter) => (
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
                {kit?.modulos.map((module) => (
                  <div className="flex w-full items-center justify-between text-xs font-thin text-gray-600">
                    <h1>
                      {module.fabricante}-{module.modelo}
                    </h1>
                    <h1>x{module.qtde}</h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS DA ESTRUTURA DE MONTAGEM
          </span>
          <div className="flex w-full grow flex-col items-center gap-2">
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <SelectInput
                label={"TIPO DA ESTRUTURA"}
                editable={true}
                options={structureTypes.map((type, index) => {
                  return {
                    id: index + 1,
                    label: type.label,
                    value: type.value,
                  };
                })}
                value={requestInfo.tipoEstrutura}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, tipoEstrutura: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({ ...prev, tipoEstrutura: null }));
                }}
                width="100%"
              />
              <SelectInput
                label={"MATERIAL DA ESTRUTURA"}
                editable={true}
                options={[
                  { id: 1, label: "MADEIRA", value: "MADEIRA" },
                  { id: 2, label: "FERRO", value: "FERRO" },
                ]}
                value={requestInfo.materialEstrutura}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, materialEstrutura: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    materialEstrutura: null,
                  }))
                }
                width="100%"
              />
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <SelectInput
                label={"NECESSÁRIO CONSTRUÇÃO OU ADEQUAÇÃO DE ESTRUTURA?"}
                editable={true}
                options={[
                  {
                    id: 1,
                    label: "NÃO",
                    value: "NÃO",
                  },
                  {
                    id: 2,
                    label: "SIM",
                    value: "SIM",
                  },
                ]}
                value={requestInfo.estruturaAmpere}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, estruturaAmpere: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({
                    ...prev,
                    estruturaAmpere: undefined,
                  }));
                }}
                width="100%"
              />
              <SelectInput
                label={"RESPONSÁVEL PELA ESTRUTURA"}
                editable={true}
                options={[
                  {
                    id: 1,
                    label: "AMPERE",
                    value: "AMPERE",
                  },
                  {
                    id: 2,
                    label: "CLIENTE",
                    value: "CLIENTE",
                  },
                  {
                    id: 3,
                    label: "NÃO SE APLICA",
                    value: "NÃO SE APLICA",
                  },
                ]}
                value={requestInfo.responsavelEstrutura}
                handleChange={(value) =>
                  setRequestInfo({
                    ...requestInfo,
                    responsavelEstrutura: value,
                  })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    responsavelEstrutura: undefined,
                  }))
                }
                width="100%"
              />
            </div>
            {requestInfo.responsavelEstrutura &&
              requestInfo.responsavelEstrutura != "NÃO SE APLICA" && (
                <>
                  <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
                    PAGAMENTO DA ESTRUTURA
                  </h1>
                  <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
                    <SelectInput
                      label={"FORMA DE PAGAMENTO"}
                      editable={true}
                      options={[
                        {
                          id: 1,
                          label: "INCLUSO NO FINANCIAMENTO",
                          value: "INCLUSO NO FINANCIAMENTO",
                        },
                        {
                          id: 2,
                          label: "DIRETO PRO FORNECEDOR",
                          value: "DIRETO PRO FORNECEDOR",
                        },
                        {
                          id: 3,
                          label: "A VISTA PARA AMPÈRE",
                          value: "A VISTA PARA AMPÈRE",
                        },
                        {
                          id: 4,
                          label: "NÃO SE APLICA",
                          value: "NÃO SE APLICA",
                        },
                      ]}
                      value={requestInfo.formaPagamentoEstrutura}
                      handleChange={(value) =>
                        setRequestInfo({
                          ...requestInfo,
                          formaPagamentoEstrutura: value,
                        })
                      }
                      selectedItemLabel="NÃO DEFINIDO"
                      onReset={() =>
                        setRequestInfo((prev) => ({
                          ...prev,
                          formaPagamentoEstrutura: null,
                        }))
                      }
                    />
                    <NumberInput
                      label={"VALOR DA ESTRUTURA"}
                      editable={true}
                      value={
                        requestInfo.valorEstrutura
                          ? requestInfo.valorEstrutura
                          : null
                      }
                      placeholder="Preencha aqui o valor da estrutura"
                      handleChange={(value) =>
                        setRequestInfo({
                          ...requestInfo,
                          valorEstrutura: Number(value),
                        })
                      }
                    />
                  </div>
                </>
              )}
          </div>
        </div>
        <div className="flex w-full flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            AUMENTO DE CARGA
          </span>
          <div className="flex w-full grow flex-col">
            <div className="mt-2 flex justify-center p-2">
              <SelectInput
                label={"HAVERÁ TROCA DE PADRÃO/AUMENTO DE CARGA?"}
                editable={true}
                options={[
                  {
                    id: 1,
                    label: "NÃO",
                    value: "NÃO",
                  },
                  {
                    id: 2,
                    label: "SIM",
                    value: "SIM",
                  },
                ]}
                value={requestInfo.aumentoDeCarga}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, aumentoDeCarga: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({ ...prev, aumentoDeCarga: null }))
                }
              />
            </div>
            {requestInfo.aumentoDeCarga == "SIM" ? (
              <div className="col-span-3 flex items-center justify-center">
                <SelectInput
                  label={"RESPONSÁVEL PELA TROCA"}
                  editable={true}
                  value={requestInfo.respTrocaPadrao}
                  handleChange={(value) =>
                    setRequestInfo({ ...requestInfo, respTrocaPadrao: value })
                  }
                  options={[
                    {
                      id: 1,
                      label: "AMPERE",
                      value: "AMPERE",
                    },
                    {
                      id: 2,
                      label: "CLIENTE",
                      value: "CLIENTE",
                    },
                    {
                      id: 3,
                      label: "NÃO SE APLICA",
                      value: "NÃO SE APLICA",
                    },
                  ]}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setRequestInfo((prev) => ({
                      ...prev,
                      respTrocaPadrao: null,
                    }));
                  }}
                />
              </div>
            ) : null}

            {requestInfo.aumentoDeCarga == "SIM" && (
              <div className="flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
                <div className="flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"TIPO DO PADRÃO"}
                    editable={true}
                    value={requestInfo.tipoDePadrao}
                    handleChange={(value) =>
                      setRequestInfo({ ...requestInfo, tipoDePadrao: value })
                    }
                    options={paTypes.map((type, index) => {
                      return {
                        id: index + 1,
                        label: type.label,
                        value: type.value,
                      };
                    })}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        tipoDePadrao: null,
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"HAVERÁ AUMENTO DO DISJUNTOR?"}
                    editable={true}
                    value={requestInfo.aumentoDisjuntor}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        aumentoDisjuntor: value,
                      })
                    }
                    options={[
                      {
                        id: 1,
                        label: "SIM",
                        value: "SIM",
                      },
                      {
                        id: 2,
                        label: "NÃO",
                        value: "NÃO",
                      },
                    ]}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        aumentoDisjuntor: null,
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"CAIXA CONJUGADA?"}
                    editable={true}
                    options={[
                      {
                        id: 1,
                        label: "NÃO",
                        value: "NÃO",
                      },
                      {
                        id: 2,
                        label: "SIM",
                        value: "SIM",
                      },
                    ]}
                    value={requestInfo.caixaConjugada}
                    handleChange={(value) =>
                      setRequestInfo({ ...requestInfo, caixaConjugada: value })
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        caixaConjugada: null,
                      }));
                    }}
                  />
                </div>
                <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
                  PAGAMENTO
                </h1>
                <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
                  <SelectInput
                    width={"450px"}
                    label={"PAGAMENTO DO PADRÃO"}
                    editable={true}
                    value={requestInfo.formaPagamentoPadrao}
                    options={[
                      {
                        id: 1,
                        label: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                        value: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                      },
                      {
                        id: 2,
                        label: "CLIENTE PAGAR POR FORA",
                        value: "CLIENTE PAGAR POR FORA",
                      },
                      {
                        id: 2,
                        label: "INCLUSO NO CONTRATO",
                        value: "INCLUSO NO CONTRATO",
                      },
                      {
                        id: 3,
                        label: "NÃO HAVERA TROCA PADRÃO",
                        value: "NÃO HAVERA TROCA PADRÃO",
                      },
                    ]}
                    handleChange={(value) => {
                      setRequestInfo({
                        ...requestInfo,
                        formaPagamentoPadrao: value,
                      });
                    }}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() =>
                      setRequestInfo((prev) => ({
                        ...prev,
                        formaPagamentoPadrao: null,
                      }))
                    }
                  />
                  <NumberInput
                    width={"450px"}
                    label={"VALOR DO PADRÃO"}
                    editable={true}
                    value={
                      requestInfo.valorPadrao ? requestInfo.valorPadrao : null
                    }
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        valorPadrao: Number(value),
                      })
                    }
                    placeholder="Preencha aqui o valor do padrão."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            PLANO INTEGRADO DE OPERAÇÃO E MANUTENÇÃO
          </span>
          <p className="text-center text-sm italic text-gray-500">
            Escolha, se houver, o plano de Operação & Manutenção incluso no
            projeto.
          </p>
          <div className="flex grow flex-wrap items-start justify-around gap-2 py-2">
            <div
              onClick={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  possuiOeM: "SIM",
                  planoOeM: "MANUTENÇÃO SIMPLES",
                  valorOeMOuSeguro: pricing.manutencaoSimples.vendaFinal,
                }));
              }}
              className={`flex h-fit min-h-[450px] ${
                activePlanId == 1 ||
                requestInfo.planoOeM == "MANUTENÇÃO SIMPLES"
                  ? "bg-green-200"
                  : ""
              }  w-[350px] cursor-pointer flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50`}
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
                  <div className="flex w-[20%] items-center justify-end text-red-500">
                    <AiFillCloseCircle />
                  </div>
                </div>
                <div className="flex w-full items-center">
                  <div className="flex w-[80%] items-center justify-center">
                    <h1 className="text-center text-xs font-medium text-gray-500">
                      REAPERTO CONEXÕES ELÉTRICAS
                    </h1>
                  </div>
                  <div className="flex w-[20%] items-center justify-end text-red-500">
                    <AiFillCloseCircle />
                  </div>
                </div>
                <div className="flex w-full items-center">
                  <div className="flex w-[80%] items-center justify-center">
                    <h1 className="text-center text-xs font-medium text-gray-500">
                      ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS
                      EQUIPAMENTOS ELÉTRICOS
                    </h1>
                  </div>
                  <div className="flex w-[20%] items-center justify-end text-red-500">
                    <AiFillCloseCircle />
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
                    {pricing?.manutencaoSimples.vendaFinal.toLocaleString(
                      "pt-br",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  possuiOeM: "SIM",
                  planoOeM: "PLANO SOL",
                  valorOeMOuSeguro: pricing.planoSol.vendaFinal,
                }));
              }}
              className={`flex h-fit min-h-[450px] ${
                activePlanId == 2 || requestInfo.planoOeM == "PLANO SOL"
                  ? "bg-green-200"
                  : ""
              }  w-[350px] cursor-pointer flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50`}
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
                      ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS
                      EQUIPAMENTOS ELÉTRICOS
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
                    {pricing?.planoSol.vendaFinal.toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  possuiOeM: "SIM",
                  planoOeM: "PLANO SOL +",
                  valorOeMOuSeguro: pricing.planoSolPlus.vendaFinal,
                }));
              }}
              className={`flex h-fit min-h-[450px] ${
                activePlanId == 3 || requestInfo.planoOeM == "PLANO SOL +"
                  ? "bg-green-200"
                  : ""
              }  w-[350px] cursor-pointer flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50`}
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
                      ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS
                      EQUIPAMENTOS ELÉTRICOS
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
                    {pricing?.planoSolPlus.vendaFinal.toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS FINANCEIROS E NEGOCIAÇÃO
          </span>
          <div className="flex w-full grow flex-col">
            <div className="mt-2 flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
              <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
                DADOS DO PAGADOR
              </h1>
              <div className="flex items-center justify-center">
                <TextInput
                  width={"450px"}
                  label={"NOME DO PAGADOR"}
                  placeholder="Preencha aqui o nome da pessoa/empresa que realizará o pagamento"
                  editable={true}
                  value={requestInfo.nomePagador}
                  handleChange={(value) =>
                    setRequestInfo({ ...requestInfo, nomePagador: value })
                  }
                />
              </div>
              <div className="flex items-center justify-center">
                <TextInput
                  width={"450px"}
                  label={"CONTATO DO PAGADOR"}
                  placeholder="Preencha aqui o contato da pessoa que realizará o pagamento"
                  editable={true}
                  value={requestInfo.contatoPagador}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      contatoPagador: formatToPhone(value),
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-center">
                <TextInput
                  width={"450px"}
                  label={"CPF/CNPJ PARA NF"}
                  placeholder="Preencha aqui o CPF/CNPJ para faturamento do serviço/equipamentos."
                  editable={true}
                  value={requestInfo.cpf_cnpjNF}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      cpf_cnpjNF: formatToCPForCNPJ(value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col p-2">
              <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
                SOBRE N.F
              </h1>
              <div className="mt-2 flex flex-wrap justify-around gap-2">
                <SelectInput
                  width={"450px"}
                  label={"NECESSIDADE N.F ADIANTADA"}
                  editable={true}
                  value={requestInfo.necessidadeNFAdiantada}
                  options={[
                    {
                      id: 1,
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      id: 2,
                      label: "SIM",
                      value: "SIM",
                    },
                  ]}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      necessidadeNFAdiantada: value,
                    })
                  }
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setRequestInfo((prev) => ({
                      ...prev,
                      necessidadeNFAdiantada: null,
                    }));
                  }}
                />
                <SelectInput
                  width={"450px"}
                  label={"NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?"}
                  editable={true}
                  value={requestInfo.necessidaInscricaoRural}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      necessidaInscricaoRural: value,
                    })
                  }
                  options={[
                    {
                      id: 1,
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      id: 2,
                      label: "SIM",
                      value: "SIM",
                    },
                  ]}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setRequestInfo((prev) => ({
                      ...prev,
                      necessidaInscricaoRural: null,
                    }));
                  }}
                />
                {requestInfo.necessidaInscricaoRural == "SIM" && (
                  <TextInput
                    width={"450px"}
                    label={"INSCRIÇÃO RURAL"}
                    placeholder="Preencha aqui a inscrição rural do cliente."
                    editable={true}
                    value={requestInfo.inscriçãoRural}
                    handleChange={(value) =>
                      setRequestInfo({ ...requestInfo, inscriçãoRural: value })
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col p-2">
              <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
                SOBRE A ENTREGA
              </h1>
              <div className="mt-2 flex flex-col gap-2 lg:grid lg:grid-cols-2">
                <div className="col-span-2 flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"LOCAL DE ENTREGA"}
                    options={[
                      {
                        id: 1,
                        label: "MESMO DO PROJETO",
                        value: "MESMO DO PROJETO",
                      },
                      {
                        id: 2,
                        label:
                          "LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)",
                        value:
                          "LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)",
                      },
                      {
                        id: 3,
                        label:
                          "ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)",
                        value:
                          "ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)",
                      },
                    ]}
                    editable={true}
                    value={requestInfo.localEntrega}
                    handleChange={(value) =>
                      setRequestInfo({ ...requestInfo, localEntrega: value })
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        localEntrega: null,
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"END. ENTREGA IGUAL COBRANÇA?"}
                    editable={true}
                    value={requestInfo.entregaIgualCobranca}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        entregaIgualCobranca: value,
                      })
                    }
                    options={[
                      {
                        id: 1,
                        label: "SIM",
                        value: "SIM",
                      },
                      {
                        id: 2,
                        label: "NÃO",
                        value: "NÃO",
                      },
                    ]}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() =>
                      setRequestInfo((prev) => ({
                        ...prev,
                        entregaIgualCobranca: null,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"HÁ RESTRIÇÕES PARA ENTREGA?"}
                    editable={true}
                    value={requestInfo.restricoesEntrega}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        restricoesEntrega: value,
                      })
                    }
                    options={[
                      {
                        id: 1,
                        label: "SOMENTE HORARIO COMERCIAL",
                        value: "SOMENTE HORARIO COMERCIAL",
                      },
                      {
                        id: 2,
                        label: "NÃO HÁ RESTRIÇÕES",
                        value: "NÃO HÁ RESTRIÇÕES",
                      },
                      {
                        id: 3,
                        label: "CASA EM CONSTRUÇÃO",
                        value: "CASA EM CONSTRUÇÃO",
                      },
                      {
                        id: 4,
                        label: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
                        value: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
                      },
                    ]}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        restricoesEntrega: null,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col p-2">
              <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
                SOBRE O PAGAMENTO
              </h1>
              <div className="mt-2 flex flex-col gap-2 lg:grid lg:grid-cols-3">
                <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
                  <NumberInput
                    width={"450px"}
                    label={
                      "VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)"
                    }
                    editable={true}
                    value={requestInfo.valorContrato}
                    placeholder={
                      "Preencha aqui o valor do contrato (sem custos adicionais de estrutura/padrão/O&M, etc..."
                    }
                    handleChange={(value) =>
                      setRequestInfo((prev) => ({
                        ...prev,
                        valorContrato: Number(value),
                      }))
                    }
                  />
                  <SelectInput
                    width={"450px"}
                    label={"ORIGEM DO RECURSO"}
                    editable={true}
                    value={requestInfo.origemRecurso}
                    handleChange={(value) =>
                      setRequestInfo({ ...requestInfo, origemRecurso: value })
                    }
                    options={[
                      {
                        id: 1,
                        label: "FINANCIAMENTO",
                        value: "FINANCIAMENTO",
                      },
                      {
                        id: 2,
                        label: "CAPITAL PRÓPRIO",
                        value: "CAPITAL PRÓPRIO",
                      },
                    ]}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        origemRecurso: null,
                      }));
                    }}
                  />
                </div>
                {requestInfo.origemRecurso == "FINANCIAMENTO" && (
                  <div className="col-span-3 mt-2 flex flex-col gap-2 lg:grid lg:grid-cols-3">
                    <div className="flex items-center justify-center">
                      <SelectInput
                        width={"450px"}
                        label={"CREDOR"}
                        editable={true}
                        options={creditors.map((creditor, index) => {
                          return {
                            id: index + 1,
                            label: creditor.label,
                            value: creditor.value,
                          };
                        })}
                        value={requestInfo.credor}
                        handleChange={(value) =>
                          setRequestInfo({ ...requestInfo, credor: value })
                        }
                        selectedItemLabel="NÃO DEFINIDO"
                        onReset={() => {
                          setRequestInfo((prev) => ({ ...prev, credor: null }));
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <TextInput
                        width={"450px"}
                        label={"NOME DO GERENTE"}
                        placeholder="Preencha aqui o nome do gerente."
                        editable={true}
                        value={requestInfo.nomeGerente}
                        handleChange={(value) =>
                          setRequestInfo({ ...requestInfo, nomeGerente: value })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <TextInput
                        width={"450px"}
                        label={"CONTATO DO GERENTE"}
                        placeholder="Preencha aqui o contato de telefone do gerente."
                        editable={true}
                        value={requestInfo.contatoGerente}
                        handleChange={(value) =>
                          setRequestInfo({
                            ...requestInfo,
                            contatoGerente: formatToPhone(value),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <NumberInput
                    width={"450px"}
                    label={"SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?"}
                    placeholder="Preencha aqui o número de parcelas."
                    editable={true}
                    value={requestInfo.numParcelas}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        numParcelas: Number(value),
                        valorParcela: requestInfo.valorContrato
                          ? Number(
                              (
                                requestInfo.valorContrato / Number(value)
                              ).toFixed(2)
                            )
                          : 0,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-center">
                  <NumberInput
                    width={"450px"}
                    label={"VALOR DA PARCELA"}
                    placeholder="Preencha aqui o valor das parcelas."
                    editable={true}
                    value={requestInfo.valorParcela}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        valorParcela: Number(value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"NECESSIDADE CÓDIGO FINAME?"}
                    editable={true}
                    value={requestInfo.necessidadeCodigoFiname}
                    options={[
                      {
                        id: 1,
                        label: "NÃO",
                        value: "NÃO",
                      },
                      {
                        id: 2,
                        label: "SIM",
                        value: "SIM",
                      },
                    ]}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        necessidadeCodigoFiname: value,
                      })
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        necessidadeCodigoFiname: null,
                      }));
                    }}
                  />
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <SelectInput
                    width={"450px"}
                    label={"FORMA DE PAGAMENTO"}
                    editable={true}
                    options={[
                      {
                        id: 1,
                        label:
                          "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                        value:
                          "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                      },
                      {
                        id: 2,
                        label: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                        value: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                      },
                      {
                        id: 3,
                        label: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                        value: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                      },
                    ]}
                    value={requestInfo.formaDePagamento}
                    handleChange={(value) =>
                      setRequestInfo({
                        ...requestInfo,
                        formaDePagamento: value,
                      })
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setRequestInfo((prev) => ({
                        ...prev,
                        formaDePagamento: null,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 flex w-full flex-col items-center self-center px-2">
              <span className="font-raleway text-center text-sm font-bold uppercase">
                DESCRIÇÃO DA NEGOCIAÇÃO
              </span>
              <textarea
                placeholder={"Descreva aqui a negociação"}
                value={requestInfo.descricaoNegociacao}
                onChange={(e) =>
                  setRequestInfo({
                    ...requestInfo,
                    descricaoNegociacao: e.target.value,
                  })
                }
                className="block h-[80px] w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full grow flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">
            DISTRIBUIÇÃO DE CRÉDITOS
          </span>
          <div className="mt-2 flex justify-center p-2">
            <SelectInput
              label={"POSSUI DISTRIBUIÇÕES DE CRÉDITOS?"}
              value={requestInfo.possuiDistribuicao}
              editable={true}
              options={[
                {
                  id: 1,
                  label: "NÃO",
                  value: "NÃO",
                },
                {
                  id: 2,
                  label: "SIM",
                  value: "SIM",
                },
              ]}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, possuiDistribuicao: value })
              }
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  possuiDistribuicao: null,
                }));
              }}
            />
          </div>
          {requestInfo.possuiDistribuicao == "SIM" && (
            <>
              {/* <div className="mt-2 flex flex-col gap-2 p-2">
                <h1 className="font-raleway text-center font-bold">
                  ADICIONAR DISTRIBUIÇÃO:
                </h1>
                <div className="flex flex-col items-center justify-around lg:flex-row">
                  <TextInput
                    label={"Nº DA INSTALAÇÃO"}
                    editable={true}
                    value={creditDistHolder.numInstalacao}
                    placeholder="Preencha aqui o número da instalação."
                    handleChange={(value) =>
                      setCreditDistHolder({
                        ...creditDistHolder,
                        numInstalacao: value,
                      })
                    }
                  />
                  <NumberInput
                    label={"% EXCEDENTE"}
                    editable={true}
                    placeholder="Preencha aqui o valor do excedente para envio."
                    value={creditDistHolder.excedente}
                    handleChange={(value) =>
                      setCreditDistHolder({
                        ...creditDistHolder,
                        excedente: Number(value),
                      })
                    }
                  />
                  <button
                    onClick={addCreditDist}
                    className="rounded bg-[#fead61] p-1 font-bold hover:bg-[#15599a] hover:text-white"
                  >
                    ADICIONAR
                  </button>
                </div>
              </div> */}
              {requestInfo.distribuicoes?.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {requestInfo.distribuicoes.map((distribuicao, index) => (
                    <div key={index} className="flex flex-wrap justify-around">
                      <p className="text-sm font-bold text-gray-600">
                        INSTALAÇÃO Nº{distribuicao.numInstalacao}
                      </p>
                      <p className="text-sm font-bold text-gray-600">
                        {distribuicao.excedente}%
                      </p>
                      {/* <button
                        onClick={() => {
                          let distribuicoes = requestInfo.distribuicoes;
                          distribuicoes.splice(index, 1);
                          setRequestInfo({
                            ...requestInfo,
                            distribuicoes: distribuicoes,
                          });
                        }}
                        className="rounded bg-red-500 p-1"
                      >
                        <AiFillDelete />
                      </button> */}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex w-full grow flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DOCUMENTAÇÃO
          </span>
          <div className="flex w-full flex-col items-center">
            {requestInfo.links?.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2"
              >
                <p className="text-sm italic text-gray-500">
                  {file.title} ({file.format})
                </p>
                <ImAttachment />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex w-full flex-wrap justify-end  gap-2">
          {/* <button
            onClick={() => {
              goToPreviousStage();
            }}
            className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
          >
            Voltar
          </button> */}
          <button
            onClick={() => {
              createContractRequest();
            }}
            disabled={isLoading || isSuccess}
            className="rounded p-2 font-bold hover:bg-black hover:text-white"
          >
            {isLoading ? "Criando solicitação..." : null}
            {isSuccess ? "Criação concluida!" : null}
            {!isLoading && !isSuccess ? "Criar solicitação" : null}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewInfo;
