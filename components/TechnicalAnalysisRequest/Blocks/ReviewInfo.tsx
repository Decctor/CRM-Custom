import NumberInput from "@/components/Inputs/NumberInput";
import SelectInput from "@/components/Inputs/SelectInput";
import TextInput from "@/components/Inputs/TextInput";
import { storage } from "@/services/firebase";
import { fileTypes } from "@/utils/constants";
import { stateCities } from "@/utils/estados_cidades";
import { formatLongString, formatToCEP, formatToPhone } from "@/utils/methods";
import { ITechnicalAnalysis } from "@/utils/models";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  UploadResult,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsCheckCircleFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
type ReviewInfoProps = {
  requestInfo: ITechnicalAnalysis;
  setRequestInfo: React.Dispatch<React.SetStateAction<ITechnicalAnalysis>>;
  goToNextStage: () => void;
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
  projectId?: string;
};
function getJoinedSystemInfo({
  brand,
  qty,
  power,
}: {
  brand: string;
  qty: string;
  power: string;
}) {
  let splitBrand = brand.split("/");
  let splitQty = qty.split("/");
  let splitPower = power.split("/");
  let holder = [];
  for (let i = 0; i < splitBrand.length; i++) {
    const brandStr = splitBrand[i];
    const qtyStr = splitQty[i] ? splitQty[i] : "NÃO DEFINIDO";
    const powerStr = splitPower[i] ? splitPower[i] : "NÃO DEFINIDO";
    let str = `${qtyStr}x${brandStr}(${powerStr}W)`;
    holder.push(str);
  }
  return holder.join(" - ");
}
function getJoinedPAInfo({
  type,
  amperage,
  meterNumber,
}: {
  type: string;
  amperage: string;
  meterNumber: string;
}) {
  let splitType = type.split("/");
  let splitAmperage = amperage.split("/");
  let splitMeterNumber = meterNumber.split("/");
  let holder = [];
  for (let i = 0; i < splitType.length; i++) {
    const typeStr = splitType[i];
    const amperageStr = splitAmperage[i] ? splitAmperage[i] : "NÃO DEFINIDO";
    const meterNumberStr = splitMeterNumber[i]
      ? splitMeterNumber[i]
      : "NÃO DEFINIDO";

    let str = `${typeStr} de ${amperageStr} com Nº(${meterNumberStr})`;
    holder.push(str);
  }
  return holder;
}
function ReviewInfo({
  requestInfo,
  setRequestInfo,
  files,
  setFiles,
  goToNextStage,
  projectId,
}: ReviewInfoProps) {
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const {
    mutate: createTechAnalysisRequest,
    isLoading,
    isSuccess, //64adb93249f94d9354becb64
  } = useMutation({
    mutationKey: ["createTechAnalysisRequest"],
    mutationFn: async () => {
      try {
        const links = await uploadFiles();
        const { data } = await axios.post(
          `/api/ampereIntegration/technicalAnalysis`,
          {
            ...requestInfo,
            idProjetoCRM: projectId,
            links: links,
          }
        );
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
  // async function uploadFiles() {
  //   if (!files) return;
  //   try {
  //     setUploadingFiles(true);
  //     var links: { title: string; link: string; format: string }[] = [];
  //     Object.keys(files).forEach(async (key) => {
  //       const fileObj = files[key];
  //       const fileRef = ref(
  //         storage,
  //         `clientes/${requestInfo.nomeDoCliente}-${requestInfo.codigoSVB}/${
  //           fileObj.title
  //         }${(Math.random() * 10000).toFixed(0)}`
  //       );
  //       if (typeof fileObj.file == "string" || fileObj.file == null) return;
  //       // @ts-ignore
  //       const firebaseRes = await uploadBytes(fileRef, fileObj);
  //       const uploadResult = firebaseRes as UploadResult;
  //       let fileUrl = await getDownloadURL(
  //         ref(storage, firebaseRes.metadata.fullPath)
  //       );
  //       console.log("ARQUIVO", fileUrl);
  //       links.push({
  //         title: fileObj.title,
  //         link: fileUrl,
  //         format:
  //           uploadResult.metadata.contentType &&
  //           fileTypes[uploadResult.metadata.contentType]
  //             ? fileTypes[uploadResult.metadata.contentType].title
  //             : "INDEFINIDO",
  //       });
  //     });
  //     setRequestInfo((prev) => ({ ...prev, links: links }));
  //     setUploadingFiles(false);
  //     createTechAnalysisRequest();
  //     return links;
  //   } catch (error) {
  //     toast.error(
  //       "Houve um erro ao fazer upload dos arquivos, por favor, tente novamente."
  //     );
  //   }
  // }
  async function uploadFiles() {
    if (!files) return;

    try {
      setUploadingFiles(true);
      var links: { title: string; link: string; format: string }[] = [];

      // Create an array to store all the promises for file uploads
      const uploadPromises = Object.keys(files).map(async (key) => {
        const fileObj = files[key];
        var fileRef = ref(
          storage,
          `clientes/${requestInfo.nomeDoCliente}-${
            requestInfo.codigoSVB
          }/contaDeEnergia${(Math.random() * 10000).toFixed(0)}`
        );

        if (typeof fileObj.file == "string" || fileObj.file == null) return;
        const firebaseRes = await uploadBytes(fileRef, fileObj.file);
        const uploadResult = firebaseRes as UploadResult;
        const fileUrl = await getDownloadURL(
          ref(storage, firebaseRes.metadata.fullPath)
        );

        links.push({
          title: fileObj.title,
          link: fileUrl,
          format:
            uploadResult.metadata.contentType &&
            fileTypes[uploadResult.metadata.contentType]
              ? fileTypes[uploadResult.metadata.contentType].title
              : "INDEFINIDO",
        });
      });

      // Wait for all file upload promises to resolve
      await Promise.all(uploadPromises);

      setRequestInfo((prev) => ({ ...prev, links: links }));
      setUploadingFiles(false);

      // Return the links array after all files are uploaded
      return links;
    } catch (error) {
      toast.error(
        "Houve um erro ao fazer upload dos arquivos, por favor, tente novamente."
      );
    }
  }

  console.log(requestInfo);
  return (
    <div className="flex w-full grow flex-col bg-[#fff] px-2">
      <span className="py-2 text-center text-xl font-bold uppercase text-green-500">
        REVISÃO DAS INFORMAÇÕES
      </span>
      <div className="w-full grow flex-col">
        <div className="flex w-full flex-col  bg-[#fff] pb-2">
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
                    setRequestInfo((prev) => ({
                      ...prev,
                      nomeDoCliente: value,
                    }))
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
        </div>
        <div className="flex w-full flex-col  bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS DO SISTEMA
          </span>
          <p className="text-center text-lg italic text-gray-500">
            {getJoinedSystemInfo({
              brand: requestInfo.marcaModulos,
              qty: requestInfo.qtdeModulos,
              power: requestInfo.potModulos,
            })}
          </p>
        </div>
        <div className="flex w-full flex-col  bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS DO PADRÃO
          </span>
          <p className="text-center text-lg italic text-gray-500">
            {getJoinedPAInfo({
              type: requestInfo.tipoDisjuntor ? requestInfo.tipoDisjuntor : "",
              amperage: requestInfo.amperagem,
              meterNumber: requestInfo.numeroMedidor,
            })}
          </p>
        </div>
        <div className="flex w-full flex-col  bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS DO TRANSFORMADOR
          </span>
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
        </div>
        <div className="flex w-full flex-col  bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS DO ESTRUTURA
          </span>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="ESTRUTURA DE MONTAGEM"
                width="100%"
                value={requestInfo.estruturaMontagem}
                options={[
                  {
                    id: 1,
                    label: "TELHADO CONVENCIONAL",
                    value: "TELHADO CONVENCIONAL",
                  },
                  {
                    id: 2,
                    label: "BARRACÃO À CONSTRUIR",
                    value: "BARRACÃO À CONSTRUIR",
                  },
                  {
                    id: 3,
                    label: "ESTRUTURA DE SOLO",
                    value: "ESTRUTURA DE SOLO",
                  },
                  { id: 4, label: "BEZERREIRO", value: "BEZERREIRO" },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    estruturaMontagem: value,
                  }))
                }
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    estruturaMontagem: undefined,
                  }))
                }
              />
            </div>
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="TIPO DA ESTRUTURA"
                width="100%"
                value={requestInfo.tipoEstrutura}
                options={[
                  { id: 1, label: "MADEIRA", value: "MADEIRA" },
                  { id: 2, label: "FERRO", value: "FERRO" },
                  {
                    id: 3,
                    label: "ESTRUTURA DE SOLO",
                    value: "ESTRUTURA DE SOLO",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoEstrutura: value,
                  }))
                }
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoEstrutura: undefined,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="TIPO DA TELHA"
                width="100%"
                value={requestInfo.tipoTelha}
                options={[
                  { id: 1, label: "PORTUGUESA", value: "PORTUGUESA" },
                  { id: 2, label: "FRANCESA", value: "FRANCESA" },
                  { id: 3, label: "ROMANA", value: "ROMANA" },
                  { id: 4, label: "CIMENTO", value: "CIMENTO" },
                  { id: 5, label: "ETHERNIT", value: "ETHERNIT" },
                  { id: 6, label: "SANDUÍCHE", value: "SANDUÍCHE" },
                  { id: 7, label: "AMERICANA", value: "AMERICANA" },
                  { id: 8, label: "ZINCO", value: "ZINCO" },
                  { id: 9, label: "CAPE E BICA", value: "CAPE E BICA" },
                  {
                    id: 9,
                    label: "ESTRUTURA DE SOLO",
                    value: "ESTRUTURA DE SOLO",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoTelha: value,
                  }))
                }
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoTelha: undefined,
                  }))
                }
              />
            </div>
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="CLIENTE POSSUIU TELHAS RESERVAS ?"
                width="100%"
                value={requestInfo.telhasReservas}
                options={[
                  { id: 1, label: "SIM - MUITAS", value: "SIM - MUITAS" },
                  { id: 2, label: "SIM - POUCAS", value: "SIM - POUCAS" },
                  { id: 3, label: "NÃO", value: "NÃO" },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    telhasReservas: value,
                  }))
                }
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    telhasReservas: undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="LINK PARA FOTO DOS DRONES"
                width="100%"
                value={requestInfo.fotosDrone}
                placeholder="Preencha aqui o link para uma pasta na nuvem dos arquivos do drone."
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    fotosDrone: value,
                  }))
                }
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="ORIENTAÇÃO DOS MÓDULOS"
                width="100%"
                value={
                  requestInfo.orientacaoEstrutura
                    ? requestInfo.orientacaoEstrutura
                    : ""
                }
                placeholder="Preencha aqui a orientação dos módulos. (EX: 10° NORTE)"
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    orientacaoEstrutura: value,
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col  bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            DADOS DA INSTALAÇÃO
          </span>
          {requestInfo.tipoInversor == "INVERSOR" ? (
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="LOCAL DE MONTAGEM DO INVERSOR"
                  width="100%"
                  value={requestInfo.localInstalacaoInversor}
                  placeholder="Preencha aqui o local de instalação do inversor."
                  handleChange={(value) =>
                    setRequestInfo((prev) => ({
                      ...prev,
                      localInstalacaoInversor: value,
                    }))
                  }
                />
              </div>

              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="TIPO DE PAREDE PARA FIXAÇÃO DOS INVERSORES"
                  width="100%"
                  value={requestInfo.tipoFixacaoInversores}
                  options={[
                    { id: 1, label: "ALVENARIA", value: "ALVENARIA" },
                    { id: 2, label: "LANCE DE MURO", value: "LANCE DE MURO" },
                    { id: 3, label: "PILAR", value: "PILAR" },
                    {
                      id: 4,
                      label: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
                      value: "OUTRO(DESCREVA EM OBSERVAÇÕES)",
                    },
                  ]}
                  selectedItemLabel="NÃO DEFINIDO"
                  handleChange={(value) =>
                    setRequestInfo((prev) => ({
                      ...prev,
                      tipoFixacaoInversores: value,
                    }))
                  }
                  onReset={() =>
                    setRequestInfo((prev) => ({
                      ...prev,
                      tipoFixacaoInversores: undefined,
                    }))
                  }
                />
              </div>
            </div>
          ) : null}

          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="DISTÂNCIA DOS MÓDULOS ATÉ OS INVERSORES"
                width="100%"
                value={requestInfo.distanciaModulosInversores}
                placeholder="Preencha aqui a distância aproximada dos módulos aos inversores."
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    distanciaModulosInversores: value,
                  }))
                }
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="DISTÂNCIA DOS INVERSORES ATÉ O PADRÃO"
                width="100%"
                value={requestInfo.distanciaInversorPadrao}
                placeholder="Preencha aqui a distância aproximada dos inversores ao padrão."
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    distanciaInversorPadrao: value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="DISTÂNCIA APROXIMADA DOS INVERSORES AO ROTEADOR"
                width="100%"
                value={requestInfo.distanciaInversorRoteador}
                placeholder="Preencha aqui a distância aproximada dos inversores ao roteador."
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    distanciaInversorRoteador: value,
                  }))
                }
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="DISTÂNCIA APROX. DO SISTEMA AO QUADRO"
                width="100%"
                value={requestInfo.distanciaInversorPadrao}
                placeholder="Preencha aqui a distância aproximada do sistema ao quadro de distribuição"
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    distanciaInversorPadrao: value,
                  }))
                }
              />
            </div>
          </div>
          {requestInfo.uf == "GO" ? (
            <div className="flex w-full items-center justify-center self-center lg:w-1/2">
              <TextInput
                label="LOCAL DO ATERRAMENTO"
                width="100%"
                placeholder="Preencha aqui o local de aterramento..."
                value={requestInfo.localAterramento}
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    localAterramento: value,
                  }))
                }
              />
            </div>
          ) : null}
          <div className="mt-2 flex w-full flex-col items-center self-center px-2">
            <span className="font-raleway text-center text-sm font-bold uppercase">
              OBSERVAÇÃO SOBRE A INSTALAÇÃO
            </span>
            <textarea
              placeholder={
                "Preencha aqui, se houver, observações acerca da instalação/projeto do cliente. Particularidades da estrutura, de como será montado, do terreno e outros..."
              }
              value={requestInfo.obsInstalacao}
              onChange={(e) =>
                setRequestInfo({
                  ...requestInfo,
                  obsInstalacao: e.target.value,
                })
              }
              className="block h-[80px] w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
        </div>
        {requestInfo.tipoDeSolicitacao == "VISITA TÉCNICA REMOTA - RURAL" ? (
          <div className="flex w-full flex-col  bg-[#fff] pb-2">
            <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
              SERVIÇOS ADICIONAIS
            </span>
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
                    setRequestInfo({
                      ...requestInfo,
                      construcaoBarracao: value,
                    })
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
                    setRequestInfo({
                      ...requestInfo,
                      instalacaoRoteador: value,
                    })
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
                    setRequestInfo({
                      ...requestInfo,
                      limpezaLocalUsinaSolo: value,
                    })
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
        ) : null}

        <div className="w-fll flex flex-col bg-[#fff] pb-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
            ARQUIVOS
          </span>
          {files
            ? Object.keys(files).map((key, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2"
                  >
                    <p className="text-sm italic text-gray-500">
                      {files[key].title}
                    </p>
                    <ImAttachment />
                  </div>
                );
              })
            : null}
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
          disabled={isLoading || isSuccess || uploadingFiles}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
          onClick={() => {
            createTechAnalysisRequest();
          }}
        >
          {isLoading ? "Criando solicitação..." : null}
          {isSuccess ? "Criação concluida!" : null}
          {!isLoading && !isSuccess && !uploadingFiles
            ? "Criar solicitação"
            : null}
        </button>
      </div>
    </div>
  );
}

export default ReviewInfo;
