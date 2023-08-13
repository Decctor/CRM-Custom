import {
  IProject,
  IProposeInfo,
  ITechnicalAnalysis,
  ModuleType,
} from "@/utils/models";
import Modules from "../../utils/pvmodules.json";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { getProposeObject } from "@/utils/methods";
import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
import { proposeTemplates } from "@/utils/constants";
import { ImPower, ImPriceTag } from "react-icons/im";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingComponent from "../utils/LoadingComponent";
import CheckboxInput from "../Inputs/CheckboxInput";
import Link from "next/link";
import {
  UploadResult,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/services/firebase";
import { FirebaseError } from "firebase/app";
import { template } from "lodash";
import JSZip from "jszip";
type ProposeProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToPreviousStage: React.Dispatch<React.SetStateAction<null>>;
  selectedAnalysis: ITechnicalAnalysis | null;
};

function Propose({
  proposeInfo,
  project,
  setProposeInfo,
  moveToPreviousStage,
  selectedAnalysis,
}: ProposeProps) {
  const [saveAsActive, setSaveAsActive] = useState<boolean>(false);
  async function handleProposeUpload(file: any) {
    const tag = `${proposeInfo.nome}${(Math.random() * 1000).toFixed(0)}`;
    try {
      let storageName = `crm/projetos/${project?.nome}/${tag}`;
      const fileRef = ref(storage, storageName);
      const res = await uploadBytes(fileRef, file).catch((err) => {
        if (err instanceof FirebaseError)
          switch (err.code) {
            case "storage/unauthorized":
              throw "Usuário não autorizado para upload de arquivos.";
            case "storage/canceled":
              throw "O upload de arquivos foi cancelado pelo usuário.";

            case "storage/retry-limit-exceeded":
              throw "Tempo de envio de arquivo excedido, tente novamente.";

            case "storage/invalid-checksum":
              throw "Ocorreu um erro na checagem do arquivo enviado, tente novamente.";

            case "storage/unknown":
              throw "Erro de origem desconhecida no upload de arquivos.";
          }
      });
      const uploadResult = res as UploadResult;
      if ("metadata" in uploadResult) {
        const url = await getDownloadURL(
          ref(storage, uploadResult.metadata.fullPath)
        );
        setProposeInfo((prev) => ({ ...prev, linkArquivo: url }));
        return url;
      }
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
  }
  async function handleDownload() {
    const { data } = await axios.get(
      `/api/responsibles?id=${project.responsavel.id}`
    );
    const seller = {
      name: data.data ? data.data.nome.toUpperCase() : null,
      phone: data.data ? data.data.telefone : null,
    };
    console.log("VENDEDOR", seller);
    const template = proposeTemplates.find(
      (proposeTemplate) => proposeTemplate.value == proposeInfo.template
    )
      ? proposeTemplates.find(
          (proposeTemplate) => proposeTemplate.value == proposeInfo.template
        )
      : proposeTemplates[0];
    console.log("TEMPLATE", template);
    // @ts-ignore
    const obj = template?.createProposeObj(project, proposeInfo, seller);
    const templateId = template?.templateId;
    const response = await axios.post(
      `/api/utils/proposePdf?templateId=${templateId}`,
      obj,
      {
        responseType: "blob",
      }
    );
    // Given that the API now returns zipped files for reduced size, we gotta decompress
    const zip = new JSZip();
    const unzippedFiles = await zip.loadAsync(response.data);
    const propose = await unzippedFiles
      .file("proposta.pdf")
      ?.async("arraybuffer");
    if (!propose) {
      toast.error("Erro ao descomprimir o arquivo da proposta.");
      throw "Erro ao descomprimir proposta.";
    }
    const url = window.URL.createObjectURL(new Blob([propose]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `PROPOSTA-${project.nome}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return new Blob([propose], {
      type: "application/pdf",
    });
  }
  const {
    mutate: createPropose,
    isLoading: proposeCreationLoading,
    isSuccess: proposeCreationSuccess,
    isError: proposeCreationError,
  } = useMutation({
    mutationKey: ["createPropose"],
    mutationFn: async (): Promise<IProject | Error> => {
      try {
        if (!proposeInfo.nome || proposeInfo.nome.length < 2) {
          throw { message: "Por favor, preencha o nome da proposta." };
        }
        if (!proposeInfo.template) {
          throw { message: "Por favor, preencha o nome da proposta." };
        }
        const fileToUpload = await handleDownload();
        const url = await handleProposeUpload(fileToUpload);
        console.log("PRE CRIAÇÃO", {
          ...proposeInfo,
          linkArquivo: url,
        });
        const { data } = await axios.post("/api/proposes", {
          ...proposeInfo,
          linkArquivo: url,
          idAnaliseTecnica: selectedAnalysis?._id,
        });
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          throw error;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          throw error;
        }
        throw error;
      }
    },
    onSuccess: async (data, variables, context) => {
      if (saveAsActive) {
        try {
          if (!(data instanceof Error)) {
            const { data: projectUpdate } = await axios.put(
              `/api/projects?id=${project._id}&responsavel=${project.responsavel?.id}`,
              {
                changes: {
                  propostaAtiva: data._id,
                },
              }
            );
          }
        } catch (error) {
          toast.error(
            "Não foi possível definir essa proposta como ativa. Tente novamente na área de controle do projeto."
          );
        }
      }
      console.log("ON SUCCESS DATA", data);
      toast.success("Proposta criada com sucesso.");
    },
  });

  return (
    <div className="flex min-h-[400px] w-full flex-col gap-2 py-4">
      {/* <div className="flex w-full items-center justify-center">
        <h1 className="text-center font-bold">PROPOSTA</h1>
      </div> */}
      <div className="flex grow flex-col items-center justify-center">
        {proposeCreationLoading ? (
          <div className="flex min-h-[350px] w-[400px] items-center justify-center">
            <LoadingComponent />
          </div>
        ) : null}
        {proposeCreationSuccess ? (
          <div className="flex min-h-[350px] w-full flex-col items-center justify-center gap-1 lg:w-[600px]">
            <p className="text-center font-bold text-[#fbcb83]">
              A proposta foi gerada com sucesso e vinculada ao projeto em
              questão.
            </p>
            <p className="text-center text-gray-500">
              Você pode voltar a acessá-la no futuro através da área de controle
              desse projeto
            </p>
            <p className="text-center text-gray-500">
              Se desejar voltar a área de controle:
            </p>
            <Link href={`/projeto/id/${project._id}`}>
              <p className="text-sm italic text-blue-300 underline hover:text-blue-500">
                Clique aqui
              </p>
            </Link>
          </div>
        ) : null}
        {!proposeCreationSuccess && !proposeCreationLoading ? (
          <>
            <div className="flex min-h-[350px] w-[400px] flex-col border border-gray-200 p-3">
              <h1 className="border-b border-gray-200 pb-2 text-center font-bold text-gray-700">
                PROPOSTA
              </h1>
              <div className="flex w-full items-center gap-2 p-3">
                <div className="flex w-1/2 items-center justify-center gap-2 rounded border border-gray-300 p-1">
                  <ImPower
                    style={{ color: "rgb(239,68,68)", fontSize: "20px" }}
                  />
                  <p className="text-xs font-thin text-gray-600">
                    {proposeInfo.potenciaPico} kWp
                  </p>
                </div>
                <div className="flex w-1/2 items-center justify-center gap-2 rounded border border-gray-300 p-1">
                  <ImPriceTag
                    style={{ color: "rgb(34,197,94)", fontSize: "20px" }}
                  />
                  <p className="text-xs font-thin text-gray-600">
                    R${" "}
                    {proposeInfo.valorProposta
                      ? proposeInfo.valorProposta.toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : null}
                  </p>
                </div>
              </div>
              <div className="flex w-full grow flex-col gap-2">
                <TextInput
                  label="NOME DA PROPOSTA"
                  value={proposeInfo.nome ? proposeInfo.nome : ""}
                  placeholder="Preencha aqui o nome da proposta..."
                  width="100%"
                  handleChange={(value) =>
                    setProposeInfo((prev) => ({ ...prev, nome: value }))
                  }
                />
                <SelectInput
                  label="TEMPLATE"
                  value={proposeInfo.template}
                  options={proposeTemplates
                    .filter((template) =>
                      template.applicableProjectTypes.includes(
                        // @ts-ignore
                        project.tipoProjeto
                      )
                    )
                    .map((temp, index) => {
                      return {
                        id: index + 1,
                        label: temp.label,
                        value: temp.value,
                      };
                    })}
                  handleChange={(value) =>
                    setProposeInfo((prev) => ({ ...prev, template: value }))
                  }
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() =>
                    setProposeInfo((prev) => ({ ...prev, template: undefined }))
                  }
                  width="100%"
                />
                <CheckboxInput
                  checked={saveAsActive}
                  labelFalse="NÃO SALVAR COMO ATIVA"
                  labelTrue="SALVAR COMO ATIVA"
                  handleChange={(value) => setSaveAsActive(value)}
                />
              </div>
              <button
                onClick={() => createPropose()}
                className="rounded border border-green-500 p-2 text-green-500 duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
              >
                GERAR PROPOSTA
              </button>
            </div>
            <div className="flex w-full items-center justify-between gap-2 px-1">
              <button
                onClick={() => moveToPreviousStage(null)}
                className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
              >
                Voltar
              </button>
            </div>
          </>
        ) : null}

        {/* <button
          onClick={handleDownload}
          className="rounded bg-blue-400 p-1 font-medium text-white"
        >
          DOWNLOAD
        </button> */}
      </div>
    </div>
  );
}

export default Propose;
