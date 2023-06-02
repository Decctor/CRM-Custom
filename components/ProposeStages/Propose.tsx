import { IProject, IProposeInfo, ModuleType } from "@/utils/models";
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
type ProposeProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<number>>;
};

function Propose({ proposeInfo, project, setProposeInfo }: ProposeProps) {
  const [saveAsActive, setSaveAsActive] = useState<boolean>(false);
  async function handleDownload() {
    const obj = getProposeObject(project, proposeInfo);
    const response = await axios.post("/api/utils/proposePdf", obj, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `PROPOSTA.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
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
        const { data } = await axios.post("/api/proposes", proposeInfo);
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
      <div className="flex grow items-center justify-center">
        {proposeCreationLoading ? (
          <div className="flex min-h-[350px] w-[400px] items-center justify-center">
            <LoadingComponent />
          </div>
        ) : null}
        {proposeCreationSuccess ? (
          <div className="flex min-h-[350px] w-[400px] flex-col items-center justify-center gap-2">
            <button
              onClick={handleDownload}
              className="rounded bg-blue-400 p-1 font-medium text-white"
            >
              BAIXAR PROPOSTA
            </button>
            <Link href={`/projeto/id/${project._id}`}>
              <p className="text-sm italic text-gray-500 underline">
                Voltar a área de controle do projeto.
              </p>
            </Link>
          </div>
        ) : null}
        {!proposeCreationSuccess && !proposeCreationLoading ? (
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
                options={proposeTemplates.map((proposeTemplate, index) => ({
                  ...proposeTemplate,
                  id: index + 1,
                }))}
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
