import { useRouter } from "next/router";
import React, { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RxDashboard } from "react-icons/rx";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import {
  checkQueryEnableStatus,
  getEstimatedGen,
  getInverterStr,
} from "@/utils/methods";
import { useSession } from "next-auth/react";
import { IProject, IProposeInfo } from "@/utils/models";
import { ImPower, ImPriceTag, ImTab } from "react-icons/im";
import { TbDownload } from "react-icons/tb";
import { MdContentCopy } from "react-icons/md";
import { fileTypes } from "@/utils/constants";
import { FullMetadata, getMetadata, ref } from "firebase/storage";
import { storage } from "@/services/firebase";
import {
  PricesObj,
  PricesPromoObj,
  Pricing,
  getMarginValue,
  getProposedPrice,
  getTaxValue,
  priceDescription,
} from "@/utils/pricing/methods";
import { getPrices } from "@/utils/pricing/methods";
import Link from "next/link";
import RequestContract from "../Modals/RequestContract";
import { BsFillCalendarCheckFill, BsPatchCheckFill } from "react-icons/bs";
import JSZip from "jszip";
import { basename } from "path";
import { FaUser } from "react-icons/fa";
import dayjs from "dayjs";
import { AiFillStar } from "react-icons/ai";
type ProposeViewUFProps = {
  propose: IProposeInfo;
};
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
    toast.error("Houve um erro com o link. Por favor, tente novamente.");
    return;
  }
  let fileRef = ref(storage, url);
  const metadata = await getMetadata(fileRef);
  const md = metadata as FullMetadata;

  const filePath = fileRef.fullPath;
  // @ts-ignore
  const extension = fileTypes[metadata.contentType]?.extension;
  const toastID = toast.loading("Baixando arquivo...");
  try {
    const response = await axios.get(
      `/api/utils/downloadFirebase?filePath=${encodeURIComponent(filePath)}`,
      {
        responseType: "blob",
      }
    );

    // Given that the API now returns zipped files for reduced size, we gotta decompress
    const zip = new JSZip();
    const unzippedFiles = await zip.loadAsync(response.data);
    const propose = await unzippedFiles
      .file(basename(filePath))
      ?.async("arraybuffer");
    if (!propose) {
      toast.error("Erro ao descomprimir o arquivo da proposta.");
      throw "Erro ao descomprimir proposta.";
    }
    const url = window.URL.createObjectURL(new Blob([propose]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${proposeName}${extension}`);
    document.body.appendChild(link);
    link.click();
    toast.dismiss(toastID);
    link.remove();
  } catch (error) {
    toast.error("Houve um erro no download do arquivo.");
  }
}

function ProposeViewUF({ propose }: ProposeViewUFProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [requestContractModal, setRequestContractModal] =
    useState<boolean>(false);
  const { data: session } = useSession({
    required: true,
  });
  function renderContractRequestInfo(
    proposeId: string,
    contractRequest?: IProject["solicitacaoContrato"]
  ) {
    if (!contractRequest) return null;
    return (
      <div className="flex w-[80%] flex-col items-center rounded-md bg-[#fead41]  p-2 shadow-md lg:w-fit">
        <h1 className="text-center font-Raleway text-xs font-bold text-black">
          CONTRATO SOLICITADO
        </h1>
        {contractRequest.idProposta != proposeId ? (
          <p className="text-center font-Raleway text-xxs font-thin text-gray-700">
            (ATRAVÉS DE OUTRA PROPOSTA)
          </p>
        ) : null}
        <div className="flex items-center justify-center gap-2">
          <BsPatchCheckFill style={{ color: "#000", fontSize: "15px" }} />
          <p className="text-center text-xs font-bold text-black">
            {contractRequest.dataSolicitacao
              ? dayjs(contractRequest.dataSolicitacao)
                  .add(3, "hours")
                  .format("DD/MM/YYYY")
              : "-"}
          </p>
        </div>
      </div>
    );
  }
  function renderContractSigningInfo(
    proposeId: string,
    contract?: IProject["contrato"]
  ) {
    if (!contract) return null;
    return (
      <div className="flex w-[80%] flex-col items-center rounded-md bg-green-400  p-2 shadow-md lg:w-fit">
        <h1 className="text-center font-Raleway text-xs font-bold text-black">
          CONTRATO ASSINADO
        </h1>
        {contract.idProposta != proposeId ? (
          <p className="text-center font-Raleway text-xxs font-thin text-gray-700">
            (ATRAVÉS DE OUTRA PROPOSTA)
          </p>
        ) : null}
        <div className="flex items-center justify-center gap-2">
          <BsFillCalendarCheckFill
            style={{ color: "#000", fontSize: "15px" }}
          />
          <p className="text-center text-xs font-bold text-black">
            {contract.dataAssinatura
              ? dayjs(contract.dataAssinatura)
                  .add(3, "hours")
                  .format("DD/MM/YYYY")
              : "-"}
          </p>
        </div>
      </div>
    );
  }
  function getTotals() {
    if (propose?.infoProjeto) {
      const pricing = propose.precificacao
        ? propose.precificacao
        : getPrices(propose?.infoProjeto, propose, null);
      switch (propose.kit?.tipo) {
        case "PROMOCIONAL":
          var totalCosts = 0;
          var totalTaxes = 0;
          var totalProfits = 0;
          var finalProposePrice = 0;
          const promotionalPricing = pricing as PricesPromoObj;
          Object.keys(promotionalPricing).forEach((priceType) => {
            const pricesObj =
              promotionalPricing[priceType as keyof PricesPromoObj];
            if (!pricesObj) return;
            const { custo, vendaFinal, margemLucro, imposto } = pricesObj;

            const taxValue =
              getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal;
            const marginValue =
              getMarginValue(custo, vendaFinal, imposto) * vendaFinal;

            totalCosts = totalCosts + custo;
            totalTaxes = totalTaxes + taxValue;
            totalProfits = totalProfits + marginValue;
            finalProposePrice = finalProposePrice + vendaFinal;
          });
          return {
            totalCosts,
            totalTaxes,
            totalProfits,
            finalProposePrice,
          };
        case "TRADICIONAL":
          var totalCosts = 0;
          var totalTaxes = 0;
          var totalProfits = 0;
          var finalProposePrice = 0;
          const traditionalPricing = pricing as PricesObj;
          Object.keys(traditionalPricing).forEach((priceType) => {
            const pricesObj = traditionalPricing[priceType as keyof PricesObj];
            if (!pricesObj) return;
            const { custo, vendaFinal, margemLucro, imposto } = pricesObj;

            const taxValue =
              getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal;
            const marginValue =
              getMarginValue(custo, vendaFinal, imposto) * vendaFinal;

            totalCosts = totalCosts + custo;
            totalTaxes = totalTaxes + taxValue;
            totalProfits = totalProfits + marginValue;
            finalProposePrice = finalProposePrice + vendaFinal;
          });
          return {
            totalCosts,
            totalTaxes,
            totalProfits,
            finalProposePrice,
          };

        default:
          var totalCosts = 0;
          var totalTaxes = 0;
          var totalProfits = 0;
          var finalProposePrice = 0;
          Object.keys(pricing).forEach((priceType) => {
            const pricesObj = pricing[priceType as keyof Pricing];
            if (!pricesObj) return;
            const { custo, vendaFinal, margemLucro, imposto } = pricesObj;
            const finalSellingPrice = vendaFinal;
            const taxValue =
              getTaxValue(custo, finalSellingPrice, margemLucro) *
              finalSellingPrice;
            const marginValue =
              getMarginValue(custo, finalSellingPrice, imposto) *
              finalSellingPrice;

            totalCosts = totalCosts + custo;
            totalTaxes = totalTaxes + taxValue;
            totalProfits = totalProfits + marginValue;
            finalProposePrice = finalProposePrice + finalSellingPrice;
          });
          return {
            totalCosts,
            totalTaxes,
            totalProfits,
            finalProposePrice,
          };
      }
    }
  }
  const { mutate: setProposeAsActive } = useMutation({
    mutationKey: ["editProject"],
    mutationFn: async () => {
      try {
        const { data } = await axios.put(
          `/api/projects?id=${propose.infoProjeto?._id}&responsavel=${propose.infoProjeto?.responsavel.id}`,
          {
            changes: {
              propostaAtiva: propose._id,
            },
          }
        );
        // queryClient.invalidateQueries({ queryKey: ["project"] });
        // if (data.message) toast.success(data.message);
        return data;
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
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["propose", propose._id] });
    },
    onSettled: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["propose", propose._id],
      });
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      if (data.message) toast.success(data.message);
    },
  });
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#393E46] p-6">
        <div className="flex w-full flex-col items-center justify-between border-b border-gray-600 pb-2 lg:flex-row">
          <div className="flex flex-col gap-1">
            <h1 className="text-center font-Raleway text-xl font-bold text-white lg:text-start">
              {propose?.nome}
            </h1>
            <div className="flex items-center gap-2">
              <Link href={`/projeto/id/${propose.infoProjeto?._id}`}>
                <div className="flex items-center gap-2">
                  <RxDashboard style={{ color: "#fbcb83", fontSize: "15px" }} />
                  <p className="text-xs text-gray-200">
                    {propose?.infoProjeto?.nome}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <FaUser style={{ color: "#fbcb83", fontSize: "15px" }} />
                <p className="text-xs text-gray-200">{propose?.autor?.nome}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col items-center gap-4 lg:mt-0 lg:w-fit lg:flex-row">
            {propose.infoProjeto?.solicitacaoContrato ||
            propose.infoProjeto?.contrato ? null : (
              <button
                onClick={() => setRequestContractModal(true)}
                className="items-center rounded border border-green-500 p-1 font-medium text-green-500 duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
              >
                REQUISITAR CONTRATO
              </button>
            )}
            {/** Showing */}
            {renderContractRequestInfo(
              propose._id as string,
              propose.infoProjeto?.solicitacaoContrato
            )}
            {renderContractSigningInfo(
              propose._id as string,
              propose.infoProjeto?.contrato
            )}
            {/* {propose.infoProjeto?.solicitacaoContrato ? (
              <div className="flex flex-col items-center rounded-md  bg-[#fead41] p-2 shadow-md">
                <h1 className="text-center font-Raleway text-sm font-bold text-black">
                  CONTRATO SOLICITADO
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <BsPatchCheckFill
                    style={{ color: "#000", fontSize: "15px" }}
                  />
                  <p className="text-center text-sm font-bold text-black">
                    {propose.infoProjeto?.solicitacaoContrato.dataSolicitacao
                      ? dayjs(
                          propose.infoProjeto?.solicitacaoContrato
                            .dataSolicitacao
                        )
                          .add(3, "hours")
                          .format("DD/MM/YYYY")
                      : "-"}
                  </p>
                </div>
              </div>
            ) : null}
            {propose.infoProjeto?.contrato ? ( 
              <div className="flex flex-col items-center rounded-md  bg-green-400 p-2 shadow-md">
                <h1 className="text-center font-Raleway text-sm font-bold text-black">
                  CONTRATO ASSINADO
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <BsFillCalendarCheckFill
                    style={{ color: "#000", fontSize: "15px" }}
                  />
                  <p className="text-center text-sm font-bold text-black">
                    {propose.infoProjeto?.contrato.dataAssinatura
                      ? dayjs(propose.infoProjeto?.contrato.dataAssinatura)
                          .add(3, "hours")
                          .format("DD/MM/YYYY")
                      : "-"}
                  </p>
                </div>
              </div>
            ) : null} */}
          </div>
        </div>
        <div className="flex w-full grow flex-col py-2">
          {propose.infoProjeto?.contrato ||
          propose.infoProjeto?.solicitacaoContrato ||
          propose.infoProjeto?.propostaAtiva == propose._id ? null : (
            <div className="my-2 flex w-full items-center justify-center">
              <button
                onClick={() => setProposeAsActive()}
                className="flex w-fit items-center gap-2 rounded bg-blue-300 p-2 text-xs font-black text-white hover:bg-blue-500"
              >
                <h1>USAR COMO PROPOSTA ATIVA</h1>
                <AiFillStar />
              </button>
            </div>
          )}
          <div className="flex min-h-[350px] w-full flex-col justify-around gap-3 lg:flex-row">
            <div className="flex h-full w-full flex-col rounded border border-gray-600 bg-[#27374D] p-6 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#fbcb83]">
                  INFORMAÇÕES GERAIS
                </h1>
                <p className="text-center text-xs italic text-gray-200">
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
                      <p className="text-xs font-thin text-gray-200">
                        POTÊNCIA PICO E GERAÇÃO ESTIMADA
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-2">
                      <p className="text-lg font-thin text-gray-200">
                        {propose?.potenciaPico?.toLocaleString("pt-br", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{" "}
                        kWp
                      </p>
                      <p className="text-lg font-thin text-gray-200">
                        {getEstimatedGen(
                          propose.potenciaPico || 0,
                          propose.infoProjeto?.cliente?.cidade,
                          propose.infoProjeto?.cliente?.uf,
                          propose.premissas.orientacao
                        ).toLocaleString("pt-br", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{" "}
                        kWh
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1 ">
                    <div className="flex w-full items-center justify-center gap-2">
                      <ImPriceTag
                        style={{ color: "rgb(34 ,197,94)", fontSize: "20px" }}
                      />
                      <p className="text-xs font-thin text-gray-200">
                        VALOR DA PROPOSTA
                      </p>
                    </div>
                    <p className="text-lg font-thin text-gray-200">
                      R${" "}
                      {propose?.valorProposta
                        ? propose.valorProposta.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : null}{" "}
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-center gap-2 rounded border border-gray-300 p-1 ">
                    <h1 className="text-lg font-thin text-gray-200">KIT</h1>
                    <div className="flex w-full flex-col">
                      <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-100">
                        INVERSORES
                      </h1>
                      {propose?.kit?.inversores.map((inverter: any) => (
                        <div className="w-full text-center text-xs font-medium text-gray-200">
                          {inverter.qtde}x{inverter.fabricante} (
                          {inverter.modelo})
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full flex-col">
                      <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-100">
                        MÓDULOS
                      </h1>
                      {propose?.kit?.modulos.map((module: any) => (
                        <div className="w-full text-center text-xs font-medium text-gray-200">
                          {module.qtde}x{module.fabricante} ({module.modelo})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded border border-gray-600 bg-[#27374D] p-6 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#fbcb83]">
                  PREMISSAS
                </h1>
                <p className="text-center text-xs italic text-gray-200">
                  Essas foram as premissas de dimensionamento utilizadas para
                  essa proposta.
                </p>
              </div>
              <div className="flex w-full grow flex-col justify-around">
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">
                    Consumo de energia mensal
                  </h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    {propose?.premissas.consumoEnergiaMensal} kWh
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">
                    Tarifa de energia
                  </h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    R$ {propose?.premissas.tarifaEnergia} R$/kWh
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">Tarifa TUSD</h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    {propose?.premissas.tarifaTUSD} R$/kWh
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">Tensão da rede</h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    {propose?.premissas.tensaoRede}
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">Fase</h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    {propose?.premissas.fase}
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">
                    Fator de simultaneidade
                  </h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    {propose?.premissas.fatorSimultaneidade}
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">
                    Tipo de estrutura
                  </h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    {propose?.premissas.tipoEstrutura}
                  </h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-200">Distância</h1>
                  <h1 className="font-bold text-white lg:font-medium">
                    {propose?.premissas.distancia} km
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded border border-gray-600 bg-[#27374D] p-6 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#fbcb83]">
                  ARQUIVO
                </h1>
                <p className="text-center text-xs italic text-gray-200">
                  Faça o download do arquivo da proposta utilize do link para
                  acessá-lo a qualquer momento.
                </p>
              </div>
              <div className="mt-4 flex w-full grow flex-col justify-center gap-4 lg:mt-0">
                <button
                  onClick={() =>
                    handleDownload(
                      propose?.linkArquivo,
                      propose?.nome ? propose.nome : "PROPOSTA"
                    )
                  }
                  className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#fbcb83] p-2 text-[#fbcb83]"
                >
                  <p>DOWNLOAD DO PDF</p>
                  <TbDownload />
                </button>
                {/* <button
                  onClick={() => handleESigning(propose?.linkArquivo)}
                  className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#fbcb83] p-2 text-[#fbcb83]"
                >
                  <p>ASSINATURA DIGITAL</p>
                  <TbDownload />
                </button> */}
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
          {session?.user.permissoes.precos.visualizar ? (
            <>
              <div className="mt-4 hidden w-full flex-col gap-1 border border-gray-600 bg-[#27374D]  shadow-md lg:flex">
                <div className="flex w-full items-center rounded bg-gray-200">
                  <div className="flex w-4/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-800">
                      ITEM
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-800">
                      CUSTO
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-800">
                      IMPOSTO
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-800">
                      LUCRO
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-800">
                      VENDA
                    </h1>
                  </div>
                </div>
                {propose.precificacao
                  ? Object.keys(propose.precificacao).map(
                      (priceType, index) => {
                        if (!propose?.precificacao) return;
                        const pricesObj =
                          propose?.precificacao[priceType as keyof Pricing];
                        if (!pricesObj) return;
                        const {
                          custo,
                          vendaFinal,
                          margemLucro,
                          imposto,
                          vendaProposto,
                        } = pricesObj;
                        const description =
                          priceType == "kit"
                            ? propose.kit?.nome
                            : priceDescription[priceType];

                        const taxValue =
                          getTaxValue(custo, vendaFinal, margemLucro) *
                          vendaFinal;
                        const marginValue =
                          getMarginValue(custo, vendaFinal, imposto) *
                          vendaFinal;
                        return (
                          <div
                            className="flex w-full items-center rounded"
                            key={index}
                          >
                            <div className="flex w-4/12 items-center justify-center p-1">
                              <h1 className="text-gray-200">{description}</h1>
                            </div>
                            <div className="flex w-2/12 items-center justify-center p-1">
                              <h1 className="text-gray-200">
                                R${" "}
                                {custo.toLocaleString("pt-br", {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </h1>
                            </div>
                            <div className="flex w-2/12 items-center justify-center p-1">
                              <h1 className="text-gray-200">
                                R${" "}
                                {taxValue.toLocaleString("pt-br", {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </h1>
                            </div>
                            <div className="flex w-2/12 items-center justify-center p-1">
                              <h1 className="text-gray-200">
                                R${" "}
                                {marginValue.toLocaleString("pt-br", {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </h1>
                            </div>
                            <div className="flex w-2/12 items-center justify-center p-1">
                              <h1 className="text-gray-200">
                                R${" "}
                                {vendaFinal.toLocaleString("pt-br", {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </h1>
                            </div>
                          </div>
                        );
                      }
                    )
                  : null}
                <div className="flex w-full items-center rounded border-t border-gray-600 py-1">
                  <div className="flex w-4/12 items-center justify-center p-1">
                    <h1 className="font-bold text-white">TOTAIS</h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-200">
                      R${" "}
                      {getTotals()?.totalCosts.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-200">
                      R${" "}
                      {getTotals()?.totalTaxes.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-200">
                      R${" "}
                      {getTotals()?.totalProfits.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-200">
                      R${" "}
                      {getTotals()?.finalProposePrice.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col rounded border border-gray-600 bg-[#27374D] shadow-md lg:hidden">
                <h1 className="rounded-tl-md rounded-tr-md bg-gray-500 p-2 text-center font-Raleway font-bold text-white">
                  ITENS
                </h1>
                {Object.keys(
                  getPrices(propose?.infoProjeto, propose, null)
                ).map((priceType, index) => {
                  if (propose.precificacao) {
                    const pricesObj =
                      propose?.precificacao[priceType as keyof Pricing];
                    if (!pricesObj) return;
                    const {
                      custo,
                      vendaFinal,
                      margemLucro,
                      imposto,
                      vendaProposto,
                    } = pricesObj;
                    const description =
                      priceType == "kit"
                        ? propose.kit?.nome
                        : priceDescription[priceType];

                    const taxValue =
                      getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal;
                    const marginValue =
                      getMarginValue(custo, vendaFinal, imposto) * vendaFinal;
                    return (
                      <div
                        className="flex w-full flex-col items-center rounded px-4"
                        key={index}
                      >
                        <div className="flex w-full items-center justify-center p-1">
                          <h1 className="font-medium text-gray-200">
                            {description}
                          </h1>
                        </div>
                        <div className="grid w-full grid-cols-2  items-center gap-1">
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-200">
                              CUSTO
                            </h1>
                            <h1 className="text-center text-xs font-bold text-[#fbcb83]">
                              R${" "}
                              {custo.toLocaleString("pt-br", {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-200">
                              IMPOSTO
                            </h1>
                            <h1 className="text-center text-xs font-bold text-[#fbcb83]">
                              R${" "}
                              {taxValue.toLocaleString("pt-br", {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-200">
                              LUCRO
                            </h1>
                            <h1 className="text-center text-xs font-bold text-[#fbcb83]">
                              R${" "}
                              {marginValue.toLocaleString("pt-br", {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-200">
                              VENDA
                            </h1>
                            <h1 className="text-center text-xs font-bold text-blue-400">
                              R${" "}
                              {vendaFinal.toLocaleString("pt-br", {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
                <h1 className="mt-4 bg-gray-800 p-2 text-center font-Raleway font-bold text-white">
                  TOTAIS
                </h1>
                <div className="grid w-full grid-cols-2  items-center gap-1 p-2">
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-200">CUSTO</h1>
                    <h1 className="text-center text-xs font-bold text-[#fbcb83]">
                      R${" "}
                      {getTotals()?.totalCosts.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-200">IMPOSTO</h1>
                    <h1 className="text-center text-xs font-bold text-[#fbcb83]">
                      R${" "}
                      {getTotals()?.totalTaxes.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-200">LUCRO</h1>
                    <h1 className="text-center text-xs font-bold text-[#fbcb83]">
                      R${" "}
                      {getTotals()?.totalProfits.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-200">VENDA</h1>
                    <h1 className="text-center text-xs font-bold text-blue-400">
                      R${" "}
                      {getTotals()?.finalProposePrice.toLocaleString("pt-br", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 flex w-full flex-col gap-1 border border-gray-600 bg-[#27374D] shadow-md">
              <div className="flex w-full items-center rounded bg-gray-200">
                <div className="flex w-8/12 items-center justify-center p-1">
                  <h1 className="font-Raleway font-bold text-gray-800">ITEM</h1>
                </div>
                <div className="flex w-4/12 items-center justify-center p-1">
                  <h1 className="font-Raleway font-bold text-gray-800">
                    VENDA
                  </h1>
                </div>
              </div>
              {Object.keys(getPrices(propose?.infoProjeto, propose, null)).map(
                (priceType, index) => {
                  //@ts-ignore
                  const pricing = propose.precificacao
                    ? propose.precificacao
                    : getPrices(propose?.infoProjeto, propose, null);
                  const pricesObj = pricing[priceType as keyof Pricing];
                  if (!pricesObj) return;
                  const {
                    custo,
                    vendaFinal,
                    margemLucro,
                    imposto,
                    vendaProposto,
                  } = pricesObj;
                  const description =
                    priceType == "kit"
                      ? propose.kit?.nome
                      : priceDescription[priceType];
                  return (
                    <div
                      className="flex w-full items-center rounded"
                      key={index}
                    >
                      <div className="flex w-8/12 items-center justify-center p-1">
                        <h1 className="text-gray-200">{description}</h1>
                      </div>

                      <div className="flex w-4/12 items-center justify-center p-1">
                        <h1 className="text-gray-200">
                          R${" "}
                          {vendaFinal.toLocaleString("pt-br", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </h1>
                      </div>
                    </div>
                  );
                }
              )}
              <div className="flex w-full items-center rounded border-t border-gray-600 py-1">
                <div className="flex w-8/12 items-center justify-center p-1">
                  <h1 className="font-bold text-gray-800">TOTAIS</h1>
                </div>

                <div className="flex w-4/12 items-center justify-center p-1">
                  <h1 className="font-medium text-gray-200">
                    R${" "}
                    {getTotals()?.finalProposePrice.toLocaleString("pt-br", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {requestContractModal ? (
        <RequestContract
          closeModal={() => setRequestContractModal(false)}
          proposeInfo={propose}
        />
      ) : null}
    </div>
  );
}

export default ProposeViewUF;
