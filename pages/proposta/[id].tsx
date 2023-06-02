import { useRouter } from "next/router";
import React from "react";
import { Sidebar } from "../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { RxDashboard } from "react-icons/rx";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import { checkQueryEnableStatus } from "@/utils/methods";
import { useSession } from "next-auth/react";
import { IProposeInfo } from "@/utils/models";
import { ImPower, ImPriceTag, ImTab } from "react-icons/im";
import { TbDownload } from "react-icons/tb";
import { MdContentCopy } from "react-icons/md";
import { fileTypes } from "@/utils/constants";
import { getMetadata, ref } from "firebase/storage";
import { storage } from "@/services/firebase";

function copyToClipboard(text: string | undefined) {
  if (text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    toast.success("Link copiado para área de transferência.");
  } else {
    toast.error("Link não disponível para cópia.");
  }
}
async function handleDownload(url: string | undefined, proposeName: string) {
  if (!url) {
    alert("Houve um erro com o link. Por favor, tente novamente.");
    return;
  }
  let fileRef = ref(storage, url);
  const metadata = await getMetadata(fileRef);

  const filePath = fileRef.fullPath;

  const extension = fileTypes[metadata.contentType]?.extension;

  try {
    const response = await axios.get(
      `/api/utils/downloadFirebase?filePath=${encodeURIComponent(filePath)}`,
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${proposeName}${extension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    alert("Houve um erro no download do arquivo.");
  }
}

function SpecificProposePage() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const { id } = router.query;
  const {
    data: propose,
    isLoading: proposeLoading,
    isSuccess: proposeSuccess,
    isError: proposeError,
  } = useQuery({
    queryKey: ["propose", id],
    queryFn: async (): Promise<IProposeInfo> => {
      try {
        const { data } = await axios.get(`/api/proposes?id=${id}`);
        console.log(data);
        return data;
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
    enabled: checkQueryEnableStatus(session, id),
  });

  console.log(propose);
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="font-Raleway text-xl font-bold text-gray-800">
              {propose?.nome}
            </h1>
            <div className="flex items-center gap-2">
              <RxDashboard style={{ color: "#15599a" }} />
              <p className="text-xs">{propose?.infoProjeto?.nome}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded border border-green-500 p-1 font-medium text-green-500 duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white">
              EFETIVAR CONTRATO
            </button>
            {/* <button className="rounded border border-red-500 p-1 font-medium text-red-500 duration-300 ease-in-out hover:scale-105 hover:bg-red-500 hover:text-white">
              Perder
            </button> */}
          </div>
        </div>
        <div className="flex w-full grow flex-col py-2">
          <div className="flex min-h-[350px] w-full flex-col justify-around gap-3 lg:flex-row">
            <div className="flex h-full w-1/3 flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">
                  INFORMAÇÕES GERAIS
                </h1>
                <p className="text-center text-xs italic text-gray-500">
                  Essas são informações sobre a proposta.
                </p>
              </div>
              <div className="flex w-full grow flex-col justify-around">
                <div className="flex w-full flex-col items-center gap-2 p-3">
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1">
                    <div className="flex w-full items-center justify-center gap-2">
                      <ImPower
                        style={{ color: "rgb(239,68,68)", fontSize: "20px" }}
                      />
                      <p className="text-xs font-thin text-gray-600">
                        POTÊNCIA PICO
                      </p>
                    </div>
                    <p className="text-lg font-thin text-gray-600">
                      {propose?.potenciaPico} kWh
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1 text-green-500">
                    <div className="flex w-full items-center justify-center gap-2">
                      <ImPriceTag
                        style={{ color: "rgb(34 ,197,94)", fontSize: "20px" }}
                      />
                      <p className="text-xs font-thin text-gray-600">
                        VALOR DA PROPOSTA
                      </p>
                    </div>
                    <p className="text-lg font-thin text-gray-600">
                      R${" "}
                      {propose?.valorProposta
                        ? propose.valorProposta.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : null}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full w-1/3 flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">
                  PREMISSAS
                </h1>
                <p className="text-center text-xs italic text-gray-500">
                  Essas foram as premissas de dimensionamento utilizadas para
                  essa proposta.
                </p>
              </div>
              <div className="flex w-full grow flex-col justify-around">
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Consumo de energia mensal</h1>
                  <h1>{propose?.premissas.consumoEnergiaMensal} kWh</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Tarifa de energia</h1>
                  <h1>R$ {propose?.premissas.tarifaEnergia} R$/kWh</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Tarifa TUSD</h1>
                  <h1>{propose?.premissas.tarifaTUSD} R$/kWh</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Tensão da rede</h1>
                  <h1>{propose?.premissas.tensaoRede}</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Fase</h1>
                  <h1>{propose?.premissas.fase}</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Fator de simultaneidade</h1>
                  <h1>{propose?.premissas.fatorSimultaneidade}</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Tipo de estrutura</h1>
                  <h1>{propose?.premissas.tipoEstrutura}</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Distância</h1>
                  <h1>{propose?.premissas.distancia} km</h1>
                </div>
              </div>
            </div>
            <div className="flex h-full w-1/3 flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">
                  Arquivo
                </h1>
                <p className="text-center text-xs italic text-gray-500">
                  Faça o download do arquivo da proposta utilize do link para
                  acessá-lo a qualquer momento.
                </p>
              </div>
              <div className="flex w-full grow flex-col justify-center gap-4">
                <button
                  onClick={() =>
                    handleDownload(
                      propose?.linkArquivo,
                      propose?.nome ? propose.nome : "PROPOSTA"
                    )
                  }
                  className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#15599a] p-2 text-[#15599a]"
                >
                  <p>DOWNLOAD DO PDF</p>
                  <TbDownload />
                </button>
                <button
                  onClick={() => copyToClipboard(propose?.linkArquivo)}
                  className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#fead61] p-2 font-medium text-[#fead61]"
                >
                  <p>COPIAR LINK DO ARQUIVO</p>
                  <MdContentCopy />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificProposePage;
