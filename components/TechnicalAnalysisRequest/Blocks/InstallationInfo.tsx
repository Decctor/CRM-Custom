import SelectInput from "@/components/Inputs/SelectInput";
import TextInput from "@/components/Inputs/TextInput";
import { formatLongString } from "@/utils/methods";
import { ITechnicalAnalysis } from "@/utils/models";
import React from "react";
import { toast } from "react-hot-toast";
import { BsCheckCircleFill } from "react-icons/bs";
type InstallationInfoProps = {
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
function InstallationInfo({
  requestInfo,
  setRequestInfo,
  files,
  setFiles,
  goToNextStage,
  goToPreviousStage,
}: InstallationInfoProps) {
  function validateFields() {
    if (requestInfo.distanciaModulosInversores.trim().length < 2) {
      toast.error(
        "Por favor, preencha a distância dos módulos até os inversores."
      );
      return false;
    }
    if (requestInfo.distanciaInversorPadrao.trim().length < 2) {
      toast.error(
        "Por favor, preencha a distância dos inversores até os padrão."
      );
      return false;
    }
    if (requestInfo.distanciaInversorRoteador.trim().length < 2) {
      toast.error(
        "Por favor, preencha a distância dos inversores até o roteador mais próximo."
      );
      return false;
    }
    if (requestInfo.distanciaSistemaQuadro.trim().length < 2) {
      toast.error(
        "Por favor, preencha a distância do sistema até o quadro de distribuição."
      );
      return false;
    }
    if (!files?.fotoFachada) {
      toast.error("Anexe uma foto da faixada da instalação.");
      return false;
    }
    if (!files?.fotoQuadroDistribuicao) {
      toast.error("Anexe uma foto do quadro de distribuição.");
    }
    if (requestInfo.tipoInversor == "INVERSOR" && !files?.fotoLocalInversor) {
      toast.error("Anexe uma foto do local para instalação do inversor.");
    }
    if (requestInfo.uf == "GO") {
      if (requestInfo.localAterramento.trim().length < 4) {
        toast.error("Preencha informações sobre o local de aterramento.");
        return false;
      }
      if (!files.fotoAterramento) {
        toast.error("Anexe uma foto do local de aterramento.");
        return false;
      }
    }
    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] px-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#fbcb83]">
        DADOS DA INSTALAÇÃO
      </span>

      <div className="flex w-full grow flex-col gap-2">
        <>
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
                value={requestInfo.distanciaSistemaQuadro}
                placeholder="Preencha aqui a distância aproximada do sistema ao quadro de distribuição"
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    distanciaSistemaQuadro: value,
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
          <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
            <div className="flex w-full flex-col items-center justify-center self-center">
              <div className="flex items-center gap-2">
                <label
                  className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                  htmlFor="laudo"
                >
                  FOTO DA FACHADA
                </label>
                {files?.fotoFachada ? (
                  <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
                ) : null}
              </div>
              <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                <div className="absolute">
                  {files?.fotoFachada ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">
                        {typeof files.fotoFachada.file != "string"
                          ? files.fotoFachada.file?.name
                          : formatLongString(files.fotoFachada.file, 35)}
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
                      fotoFachada: {
                        title: "FOTO DA FACHADA",
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
                  FOTO DO QUADRO DE DISTRIBUIÇÃO
                </label>
                {files?.fotoQuadroDistribuicao ? (
                  <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
                ) : null}
              </div>
              <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                <div className="absolute">
                  {files?.fotoQuadroDistribuicao ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">
                        {typeof files.fotoQuadroDistribuicao.file != "string"
                          ? files.fotoQuadroDistribuicao.file?.name
                          : formatLongString(
                              files.fotoQuadroDistribuicao.file,
                              35
                            )}
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
                      fotoQuadroDistribuicao: {
                        title: "FOTO DO QUADRO DE DISTRIBUIÇÃO",
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
          <div className="flex w-full items-center justify-center gap-2">
            {requestInfo.tipoInversor == "INVERSOR" ? (
              <div className="flex w-full grow flex-col items-center justify-center self-center">
                <div className="flex items-center gap-2">
                  <label
                    className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                    htmlFor="laudo"
                  >
                    FOTO DO LOCAL DO INVERSOR
                  </label>
                  {files?.fotoLocalInversor ? (
                    <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
                  ) : null}
                </div>
                <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                  <div className="absolute">
                    {files?.fotoLocalInversor ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-center font-normal text-gray-400">
                          {typeof files.fotoLocalInversor.file != "string"
                            ? files.fotoLocalInversor.file?.name
                            : formatLongString(
                                files.fotoLocalInversor.file,
                                35
                              )}
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
                        fotoLocalInversor: {
                          title: "FOTO DO LOCAL DO INVERSOR",
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
            ) : null}
            {requestInfo.uf == "GO" ? (
              <div className="flex w-full grow flex-col items-center justify-center self-center">
                <div className="flex items-center gap-2">
                  <label
                    className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                    htmlFor="laudo"
                  >
                    FOTO DO ATERRAMENTO
                  </label>
                  {files?.fotoAterramento ? (
                    <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
                  ) : null}
                </div>
                <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                  <div className="absolute">
                    {files?.fotoAterramento ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-center font-normal text-gray-400">
                          {typeof files.fotoAterramento.file != "string"
                            ? files.fotoAterramento.file?.name
                            : formatLongString(files.fotoAterramento.file, 35)}
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
                        fotoAterramento: {
                          title: "FOTO DO ATERRAMENTO",
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
            ) : null}
          </div>
        </>
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

export default InstallationInfo;
