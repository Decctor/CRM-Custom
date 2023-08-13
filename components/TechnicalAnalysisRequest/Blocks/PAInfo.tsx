import SelectInput from "@/components/Inputs/SelectInput";
import TextInput from "@/components/Inputs/TextInput";
import { formatLongString } from "@/utils/methods";
import { ITechnicalAnalysis } from "@/utils/models";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
type PAInfoProps = {
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
function PAInfo({
  requestInfo,
  setRequestInfo,
  files,
  setFiles,
  goToNextStage,
  goToPreviousStage,
}: PAInfoProps) {
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
      return;
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
    if (paArr.length == 0) {
      toast.error("Por favor, adicione ao menos um padrão à lista.");
      return false;
    }

    var joinedCircuitBreakerType = paArr
      .flatMap((x) => x.tipoDisjuntor)
      .join("/");
    var joinedAmperage = paArr.flatMap((x) => x.amperagem).join("/");
    var joinedMeterNumber = paArr.flatMap((x) => x.numeroMedidor).join("/");
    setRequestInfo((prev) => ({
      ...prev,
      tipoDisjuntor: joinedCircuitBreakerType,
      amperagem: joinedAmperage,
      numeroMedidor: joinedMeterNumber,
    }));

    if (!requestInfo.ramalEntrada) {
      toast.error("Preencha o tipo de ramal de entrada.");
      return false;
    }
    if (!requestInfo.ramalSaida) {
      toast.error("Preencha o tipo de ramal de saída.");
      return false;
    }
    if (!requestInfo.tipoPadrao) {
      toast.error("Preencha o tipo do padrão.");
      return false;
    }
    if (!files?.fotoPadrao) {
      toast.error("Anexe uma foto do padrão do cliente.");
      return false;
    }
    if (!files.fotoDisjuntor) {
      toast.error("Anexe uma foto do disjuntor do padrão.");
      return false;
    }
    if (!files.fotoCabosPadrao) {
      toast.error("Anexe uma foto dos cabos do padrão.");
      return false;
    }
    if (requestInfo.uf == "GO" && !files.fotoPoste) {
      toast.error("Anexe uma foto do poste do padrão.");
      return false;
    }
    if (requestInfo.tipoDeSolicitacao == "VISITA TÉCNICA REMOTA - RURAL") {
      if (!files.fotoLocalizacaoPadraoAntigo) {
        toast.error("Anexe uma foto da localização do padrão antigo.");
        return false;
      }
      if (!files.fotoLocalizacaoPadraoNovo) {
        toast.error("Anexe uma foto da localização do padrão novo.");
        return false;
      }
    }

    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] px-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#fbcb83]">
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
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <SelectInput
              width="100%"
              label="RAMAL DE ENTRADA"
              value={requestInfo.ramalEntrada}
              options={[
                { id: 1, label: "AÉREO", value: "AÉREO" },
                { id: 2, label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) =>
                setRequestInfo((prev) => ({ ...prev, ramalEntrada: value }))
              }
              onReset={() =>
                setRequestInfo((prev) => ({ ...prev, ramalEntrada: undefined }))
              }
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              width="100%"
              label="RAMAL DE SAÍDA"
              value={requestInfo.ramalSaida}
              options={[
                { id: 1, label: "AÉREO", value: "AÉREO" },
                { id: 2, label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) =>
                setRequestInfo((prev) => ({ ...prev, ramalSaida: value }))
              }
              onReset={() =>
                setRequestInfo((prev) => ({ ...prev, ramalSaida: undefined }))
              }
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              width="100%"
              label="EM RELAÇÃO A CASA DO CLIENTE, O PADRÃO ESTÁ:"
              value={requestInfo.tipoPadrao}
              options={[
                {
                  id: 1,
                  label: "CONTRA À REDE - POSTE DO OUTRO LADO DA RUA",
                  value: "CONTRA À REDE - POSTE DO OUTRO LADO DA RUA",
                },
                {
                  id: 2,
                  label: "À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA",
                  value: "À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA",
                },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) =>
                setRequestInfo((prev) => ({ ...prev, tipoPadrao: value }))
              }
              onReset={() =>
                setRequestInfo((prev) => ({ ...prev, tipoPadrao: undefined }))
              }
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
          <div className="flex w-full flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label
                className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                htmlFor="laudo"
              >
                FOTO DO PADRÃO
              </label>
              {files?.fotoPadrao ? (
                <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
              ) : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files?.fotoPadrao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.fotoPadrao.file != "string"
                        ? files.fotoPadrao.file?.name
                        : formatLongString(files.fotoPadrao.file, 35)}
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
                    fotoPadrao: {
                      title: "FOTO DO PADRÃO",
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
                FOTO DO DISJUNTOR DO PADRÃO
              </label>
              {files?.fotoDisjuntor ? (
                <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
              ) : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files?.fotoDisjuntor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.fotoDisjuntor.file != "string"
                        ? files.fotoDisjuntor.file?.name
                        : formatLongString(files.fotoDisjuntor.file, 35)}
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
                    fotoDisjuntor: {
                      title: "FOTO DO DISJUNTOR DO PADRÃO",
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
          <div className="flex w-full grow flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label
                className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                htmlFor="laudo"
              >
                FOTO DOS CABOS DO PADRÃO
              </label>
              {files?.fotoCabosPadrao ? (
                <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
              ) : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files?.fotoCabosPadrao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.fotoCabosPadrao.file != "string"
                        ? files.fotoCabosPadrao.file?.name
                        : formatLongString(files.fotoCabosPadrao.file, 35)}
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
                    fotoCabosPadrao: {
                      title: "FOTO DO CABOS DO PADRÃO",
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
          {requestInfo.uf == "GO" ? (
            <div className="flex w-full grow flex-col items-center justify-center self-center">
              <div className="flex items-center gap-2">
                <label
                  className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                  htmlFor="laudo"
                >
                  FOTO DO POSTE
                </label>
                {files?.fotoPoste ? (
                  <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
                ) : null}
              </div>
              <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                <div className="absolute">
                  {files?.fotoPoste ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">
                        {typeof files.fotoPoste.file != "string"
                          ? files.fotoPoste.file?.name
                          : formatLongString(files.fotoPoste.file, 35)}
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
                      fotoPoste: {
                        title: "FOTO DO POSTE",
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
        {requestInfo.tipoDeSolicitacao == "VISITA TÉCNICA REMOTA - RURAL" ? (
          <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
            <div className="flex w-full flex-col items-center justify-center self-center">
              <div className="flex items-center gap-2">
                <label
                  className="ml-2 text-center text-sm font-bold text-[#fbcb83]"
                  htmlFor="laudo"
                >
                  FOTO DO LOCALIZAÇÃO DO PADRÃO ANTIGO
                </label>
                {files?.fotoLocalizacaoPadraoAntigo ? (
                  <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
                ) : null}
              </div>
              <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                <div className="absolute">
                  {files?.fotoLocalizacaoPadraoAntigo ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">
                        {typeof files.fotoLocalizacaoPadraoAntigo.file !=
                        "string"
                          ? files.fotoLocalizacaoPadraoAntigo.file?.name
                          : formatLongString(
                              files.fotoLocalizacaoPadraoAntigo.file,
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
                      fotoLocalizacaoPadraoAntigo: {
                        title: "FOTO DO LOCALIZAÇÃO DO PADRÃO ANTIGO",
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
                  FOTO DO LOCALIZAÇÃO DO PADRÃO NOVO
                </label>
                {files?.fotoLocalizacaoPadraoNovo ? (
                  <BsCheckCircleFill style={{ color: "rgb(34,197,94)" }} />
                ) : null}
              </div>
              <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                <div className="absolute">
                  {files?.fotoLocalizacaoPadraoNovo ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">
                        {typeof files.fotoLocalizacaoPadraoNovo.file != "string"
                          ? files.fotoLocalizacaoPadraoNovo.file?.name
                          : formatLongString(
                              files.fotoLocalizacaoPadraoNovo.file,
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
                      fotoLocalizacaoPadraoNovo: {
                        title: "FOTO DO LOCALIZAÇÃO DO PADRÃO NOVO",
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
        ) : null}
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

export default PAInfo;
