import { useRouter } from "next/router";
import React from "react";
import { Sidebar } from "../../components/Sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RxDashboard } from "react-icons/rx";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import { checkQueryEnableStatus, getInverterStr } from "@/utils/methods";
import { useSession } from "next-auth/react";
import { IProposeInfo, IProposeOeMInfo } from "@/utils/models";

import ProposeViewUF from "@/components/ProposeUtilBlocks/ProposeViewUF";
import ProposeViewOeM from "@/components/ProposeUtilBlocks/ProposeViewOeM";

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

function SpecificProposePage() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const { id } = router.query;

  const queryClient = useQueryClient();
  const {
    data: propose,
    isLoading: proposeLoading,
    isSuccess: proposeSuccess,
    isError: proposeError,
  } = useQuery({
    queryKey: ["propose", id],
    queryFn: async (): Promise<IProposeInfo | IProposeOeMInfo> => {
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
  const { mutate: closePropose } = useMutation({
    mutationKey: ["editPropose"],
    mutationFn: async () => {
      try {
        const { data } = await axios.put(
          `/api/proposes?id=${id}&responsible=${propose?.autor?.id}`,
          {
            changes: {
              contratoSolicitado: true,
              dataSolicitacaoContrato: new Date().toISOString(),
            },
          }
        );
        if (propose?.infoProjeto?.idOportunidade) {
          await axios.post("/api/utils/updateOportunityRD", {
            oportunityId: propose?.infoProjeto?.idOportunidade,
            operation: "GANHAR",
          });
          toast.success("Alteração de oportunidade bem sucedida.");
        }
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
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["propose", id],
      });
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      if (data.message) toast.success(data.message);
    },
  });

  console.log(propose);
  if (proposeSuccess) {
    if (propose.infoProjeto?.tipoProjeto == "SISTEMA FOTOVOLTAICO")
      // @ts-ignore
      return <ProposeViewUF propose={propose} />;
    if (propose.infoProjeto?.tipoProjeto == "OPERAÇÃO E MANUTENÇÃO")
      // @ts-ignore
      return <ProposeViewOeM propose={propose} />;
    // return (
    //   <div className="flex flex-col md:flex-row h-full">
    //     <Sidebar />
    //     <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#393E46] p-6">
    //       <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
    //         <div className="flex flex-col gap-1">
    //           <h1 className="font-Raleway text-xl font-bold text-gray-800">
    //             {propose?.nome}
    //           </h1>
    //           <div className="flex items-center gap-2">
    //             <RxDashboard style={{ color: "#fbcb83" }} />
    //             <p className="text-xs">{propose?.infoProjeto?.nome}</p>
    //           </div>
    //         </div>

    //         <div className="flex items-center gap-4">
    //           {propose?.infoProjeto?.dataPerda ||
    //           propose?.infoProjeto?.dataEfetivacao ||
    //           propose.dataEfetivacao ? null : (
    //             <button
    //               onClick={() => closePropose()}
    //               className="rounded border border-green-500 p-1 font-medium text-green-500 duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
    //             >
    //               EFETIVAR CONTRATO
    //             </button>
    //           )}

    //           {/* <button className="rounded border border-red-500 p-1 font-medium text-red-500 duration-300 ease-in-out hover:scale-105 hover:bg-red-500 hover:text-white">
    //           Perder
    //         </button> */}
    //         </div>
    //       </div>
    //       <div className="flex w-full grow flex-col py-2">
    //         <div className="flex min-h-[350px] w-full flex-col justify-around gap-3 lg:flex-row">
    //           <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md lg:w-1/3">
    //             <div className="flex w-full flex-col items-center">
    //               <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#fbcb83]">
    //                 INFORMAÇÕES GERAIS
    //               </h1>
    //               <p className="text-center text-xs italic text-gray-500">
    //                 Essas são informações sobre a proposta.
    //               </p>
    //             </div>
    //             <div className="flex w-full grow flex-col justify-around">
    //               <div className="flex w-full flex-col items-center gap-2 p-3">
    //                 <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1">
    //                   <div className="flex w-full items-center justify-center gap-2">
    //                     <ImPower
    //                       style={{ color: "rgb(239,68,68)", fontSize: "20px" }}
    //                     />
    //                     <p className="text-xs font-thin text-gray-600">
    //                       POTÊNCIA PICO
    //                     </p>
    //                   </div>
    //                   <p className="text-lg font-thin text-gray-600">
    //                     {propose?.potenciaPico} kWh
    //                   </p>
    //                 </div>
    //                 <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1 ">
    //                   <div className="flex w-full items-center justify-center gap-2">
    //                     <ImPriceTag
    //                       style={{ color: "rgb(34 ,197,94)", fontSize: "20px" }}
    //                     />
    //                     <p className="text-xs font-thin text-gray-600">
    //                       VALOR DA PROPOSTA
    //                     </p>
    //                   </div>
    //                   <p className="text-lg font-thin text-gray-600">
    //                     R${" "}
    //                     {propose?.valorProposta
    //                       ? propose.valorProposta.toLocaleString("pt-br", {
    //                           minimumFractionDigits: 2,
    //                           maximumFractionDigits: 2,
    //                         })
    //                       : null}{" "}
    //                   </p>
    //                 </div>
    //                 <div className="flex w-full flex-col items-center gap-2 rounded border border-gray-300 p-1 ">
    //                   <h1 className="text-lg font-thin text-gray-600">KIT</h1>
    //                   <div className="flex w-full flex-col">
    //                     <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-600">
    //                       INVERSORES
    //                     </h1>
    //                     {propose?.kit?.inversores.map((inverter: any) => (
    //                       <div className="w-full text-center text-xs font-medium text-gray-500">
    //                         {inverter.qtde}x{inverter.fabricante} (
    //                         {inverter.modelo})
    //                       </div>
    //                     ))}
    //                   </div>
    //                   <div className="flex w-full flex-col">
    //                     <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-600">
    //                       MÓDULOS
    //                     </h1>
    //                     {propose?.kit?.modulos.map((module: any) => (
    //                       <div className="w-full text-center text-xs font-medium text-gray-500">
    //                         {module.qtde}x{module.fabricante} ({module.modelo})
    //                       </div>
    //                     ))}
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md lg:w-1/3">
    //             <div className="flex w-full flex-col items-center">
    //               <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#fbcb83]">
    //                 PREMISSAS
    //               </h1>
    //               <p className="text-center text-xs italic text-gray-500">
    //                 Essas foram as premissas de dimensionamento utilizadas para
    //                 essa proposta.
    //               </p>
    //             </div>
    //             <div className="flex w-full grow flex-col justify-around">
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Consumo de energia mensal</h1>
    //                 <h1>{propose?.premissas.consumoEnergiaMensal} kWh</h1>
    //               </div>
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Tarifa de energia</h1>
    //                 <h1>R$ {propose?.premissas.tarifaEnergia} R$/kWh</h1>
    //               </div>
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Tarifa TUSD</h1>
    //                 <h1>{propose?.premissas.tarifaTUSD} R$/kWh</h1>
    //               </div>
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Tensão da rede</h1>
    //                 <h1>{propose?.premissas.tensaoRede}</h1>
    //               </div>
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Fase</h1>
    //                 <h1>{propose?.premissas.fase}</h1>
    //               </div>
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Fator de simultaneidade</h1>
    //                 <h1>{propose?.premissas.fatorSimultaneidade}</h1>
    //               </div>
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Tipo de estrutura</h1>
    //                 <h1>{propose?.premissas.tipoEstrutura}</h1>
    //               </div>
    //               <div className="flex w-full items-center justify-between">
    //                 <h1 className="font-medium">Distância</h1>
    //                 <h1>{propose?.premissas.distancia} km</h1>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md lg:w-1/3">
    //             <div className="flex w-full flex-col items-center">
    //               <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#fbcb83]">
    //                 Arquivo
    //               </h1>
    //               <p className="text-center text-xs italic text-gray-500">
    //                 Faça o download do arquivo da proposta utilize do link para
    //                 acessá-lo a qualquer momento.
    //               </p>
    //             </div>
    //             <div className="flex w-full grow flex-col justify-center gap-4">
    //               <button
    //                 onClick={() =>
    //                   handleDownload(
    //                     propose?.linkArquivo,
    //                     propose?.nome ? propose.nome : "PROPOSTA"
    //                   )
    //                 }
    //                 className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#fbcb83] p-2 text-[#fbcb83]"
    //               >
    //                 <p>DOWNLOAD DO PDF</p>
    //                 <TbDownload />
    //               </button>
    //               <button
    //                 onClick={() => copyToClipboard(propose?.linkArquivo)}
    //                 className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#fead61] p-2 font-medium text-[#fead61]"
    //               >
    //                 <p>COPIAR LINK DO ARQUIVO</p>
    //                 <MdContentCopy />
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //         {session?.user.permissoes.precos.visualizar ? (
    //           <div className="mt-4 flex w-full flex-col gap-1 border border-gray-200 bg-[#fff] shadow-md">
    //             <div className="flex w-full items-center rounded bg-gray-200">
    //               <div className="flex w-4/12 items-center justify-center p-1">
    //                 <h1 className="font-Raleway font-bold text-gray-500">
    //                   ITEM
    //                 </h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-Raleway font-bold text-gray-500">
    //                   CUSTO
    //                 </h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-Raleway font-bold text-gray-500">
    //                   IMPOSTO
    //                 </h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-Raleway font-bold text-gray-500">
    //                   LUCRO
    //                 </h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-Raleway font-bold text-gray-500">
    //                   VENDA
    //                 </h1>
    //               </div>
    //             </div>
    //             {Object.keys(getPrices(propose?.infoProjeto, propose)).map(
    //               (priceType, index) => {
    //                 const description =
    //                   priceType == "kit"
    //                     ? propose.kit?.nome
    //                     : priceDescription[priceType];
    //                 const cost = propose.precificacao
    //                   ? propose.precificacao[priceType as keyof PricesObj].custo
    //                   : 0;
    //                 const finalSellingPrice = propose.precificacao
    //                   ? propose.precificacao[priceType as keyof PricesObj]
    //                       .vendaFinal
    //                   : 0;
    //                 const taxValue =
    //                   getTaxValue(cost, finalSellingPrice) * finalSellingPrice;
    //                 const marginValue =
    //                   getMarginValue(cost, finalSellingPrice) *
    //                   finalSellingPrice;
    //                 return (
    //                   <div
    //                     className="flex w-full items-center rounded"
    //                     key={index}
    //                   >
    //                     <div className="flex w-4/12 items-center justify-center p-1">
    //                       <h1 className="text-gray-500">{description}</h1>
    //                     </div>
    //                     <div className="flex w-2/12 items-center justify-center p-1">
    //                       <h1 className="text-gray-500">
    //                         R${" "}
    //                         {cost.toLocaleString("pt-br", {
    //                           maximumFractionDigits: 2,
    //                           minimumFractionDigits: 2,
    //                         })}
    //                       </h1>
    //                     </div>
    //                     <div className="flex w-2/12 items-center justify-center p-1">
    //                       <h1 className="text-gray-500">
    //                         R${" "}
    //                         {taxValue.toLocaleString("pt-br", {
    //                           maximumFractionDigits: 2,
    //                           minimumFractionDigits: 2,
    //                         })}
    //                       </h1>
    //                     </div>
    //                     <div className="flex w-2/12 items-center justify-center p-1">
    //                       <h1 className="text-gray-500">
    //                         R${" "}
    //                         {marginValue.toLocaleString("pt-br", {
    //                           maximumFractionDigits: 2,
    //                           minimumFractionDigits: 2,
    //                         })}
    //                       </h1>
    //                     </div>
    //                     <div className="flex w-2/12 items-center justify-center p-1">
    //                       <h1 className="text-gray-500">
    //                         R${" "}
    //                         {finalSellingPrice.toLocaleString("pt-br", {
    //                           maximumFractionDigits: 2,
    //                           minimumFractionDigits: 2,
    //                         })}
    //                       </h1>
    //                     </div>
    //                   </div>
    //                 );
    //               }
    //             )}
    //             <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
    //               <div className="flex w-4/12 items-center justify-center p-1">
    //                 <h1 className="font-bold text-gray-800">TOTAIS</h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-medium text-gray-800">
    //                   R${" "}
    //                   {getTotals()?.totalCosts.toLocaleString("pt-br", {
    //                     maximumFractionDigits: 2,
    //                     minimumFractionDigits: 2,
    //                   })}
    //                 </h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-medium text-gray-800">
    //                   R${" "}
    //                   {getTotals()?.totalTaxes.toLocaleString("pt-br", {
    //                     maximumFractionDigits: 2,
    //                     minimumFractionDigits: 2,
    //                   })}
    //                 </h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-medium text-gray-800">
    //                   R${" "}
    //                   {getTotals()?.totalProfits.toLocaleString("pt-br", {
    //                     maximumFractionDigits: 2,
    //                     minimumFractionDigits: 2,
    //                   })}
    //                 </h1>
    //               </div>
    //               <div className="flex w-2/12 items-center justify-center p-1">
    //                 <h1 className="font-medium text-gray-800">
    //                   R${" "}
    //                   {getTotals()?.finalProposePrice.toLocaleString("pt-br", {
    //                     maximumFractionDigits: 2,
    //                     minimumFractionDigits: 2,
    //                   })}
    //                 </h1>
    //               </div>
    //             </div>
    //           </div>
    //         ) : (
    //           <div className="mt-4 flex w-full flex-col gap-1 border border-gray-200 bg-[#fff] shadow-md">
    //             <div className="flex w-full items-center rounded bg-gray-200">
    //               <div className="flex w-8/12 items-center justify-center p-1">
    //                 <h1 className="font-Raleway font-bold text-gray-500">
    //                   ITEM
    //                 </h1>
    //               </div>
    //               <div className="flex w-4/12 items-center justify-center p-1">
    //                 <h1 className="font-Raleway font-bold text-gray-500">
    //                   VENDA
    //                 </h1>
    //               </div>
    //             </div>
    //             {Object.keys(getPrices(propose?.infoProjeto, propose)).map(
    //               (priceType, index) => {
    //                 const description =
    //                   priceType == "kit"
    //                     ? propose.kit?.nome
    //                     : priceDescription[priceType];
    //                 const cost = propose.precificacao
    //                   ? propose.precificacao[priceType as keyof PricesObj].custo
    //                   : 0;
    //                 const finalSellingPrice = propose.precificacao
    //                   ? propose.precificacao[priceType as keyof PricesObj]
    //                       .vendaFinal
    //                   : 0;
    //                 return (
    //                   <div
    //                     className="flex w-full items-center rounded"
    //                     key={index}
    //                   >
    //                     <div className="flex w-8/12 items-center justify-center p-1">
    //                       <h1 className="text-gray-500">{description}</h1>
    //                     </div>

    //                     <div className="flex w-4/12 items-center justify-center p-1">
    //                       <h1 className="text-gray-500">
    //                         R${" "}
    //                         {finalSellingPrice.toLocaleString("pt-br", {
    //                           maximumFractionDigits: 2,
    //                           minimumFractionDigits: 2,
    //                         })}
    //                       </h1>
    //                     </div>
    //                   </div>
    //                 );
    //               }
    //             )}
    //             <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
    //               <div className="flex w-8/12 items-center justify-center p-1">
    //                 <h1 className="font-bold text-gray-800">TOTAIS</h1>
    //               </div>

    //               <div className="flex w-4/12 items-center justify-center p-1">
    //                 <h1 className="font-medium text-gray-800">
    //                   R${" "}
    //                   {getTotals()?.finalProposePrice.toLocaleString("pt-br", {
    //                     maximumFractionDigits: 2,
    //                     minimumFractionDigits: 2,
    //                   })}
    //                 </h1>
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

export default SpecificProposePage;
