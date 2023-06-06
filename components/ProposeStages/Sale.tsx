import { IProject, IProposeInfo } from "@/utils/models";
import {
  PricesObj,
  getMarginValue,
  getPrices,
  getProposedPrice,
  getTaxValue,
  priceDescription,
} from "@/utils/pricing/methods";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import PricingTable from "../ProposeUtilBlocks/PricingTable";
type SaleProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<null>>;
  moveToPreviousStage: React.Dispatch<React.SetStateAction<null>>;
};
function Sale({
  proposeInfo,
  setProposeInfo,
  project,
  moveToNextStage,
  moveToPreviousStage,
}: SaleProps) {
  const { data: session } = useSession({ required: true });
  const [pricing, setPricing] = useState(getPrices(project, proposeInfo));
  function getTotals() {
    const kitPrice = proposeInfo.kit ? proposeInfo.kit.preco : 0;
    var totalCosts = kitPrice;
    var totalTaxes = 0;
    var totalProfits =
      getMarginValue(kitPrice, getProposedPrice(kitPrice, 0), 0) *
      getProposedPrice(kitPrice, 0);
    var finalProposePrice = getProposedPrice(kitPrice, 0);
    Object.keys(pricing).forEach((priceType) => {
      const cost = pricing[priceType as keyof PricesObj].custo;
      const finalSellingPrice =
        pricing[priceType as keyof PricesObj].vendaFinal;
      const taxValue = getTaxValue(cost, finalSellingPrice) * finalSellingPrice;
      const marginValue =
        getMarginValue(cost, finalSellingPrice) * finalSellingPrice;

      totalCosts = totalCosts + cost;
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

  function handleProceed() {
    setProposeInfo((prev) => ({
      ...prev,
      precificacao: pricing,
      valorProposta: Number(getTotals().finalProposePrice.toFixed(2)),
    }));
    moveToNextStage(null);
  }
  console.log("PRICING", pricing);
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <h1 className="font-Raleway font-bold text-gray-800">
          DESCRITIVO DA VENDA
        </h1>
      </div>
      {session?.user.permissoes.propostas.visualizarPrecos ? (
        <PricingTable
          proposeInfo={proposeInfo}
          pricing={pricing}
          setPricing={setPricing}
        />
      ) : // <div className="flex w-full grow flex-col gap-1">
      //   <div className="flex w-full items-center rounded bg-blue-100">
      //     <div className="flex w-4/12 items-center justify-center p-1">
      //       <h1 className="font-Raleway font-bold text-gray-500">ITEM</h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-Raleway font-bold text-gray-500">CUSTO</h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-Raleway font-bold text-gray-500">IMPOSTO</h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-Raleway font-bold text-gray-500">LUCRO</h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-Raleway font-bold text-gray-500">VENDA</h1>
      //     </div>
      //   </div>
      //   <div className="flex w-full items-center rounded">
      //     <div className="flex w-4/12 items-center justify-center p-1">
      //       <h1 className="text-gray-500">{proposeInfo.kit?.nome}</h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="text-gray-500">
      //         R${" "}
      //         {proposeInfo.kit?.preco.toLocaleString("pt-br", {
      //           maximumFractionDigits: 2,
      //           minimumFractionDigits: 2,
      //         })}
      //       </h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="text-gray-500">-</h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="text-gray-500">
      //         R${" "}
      //         {proposeInfo.kit
      //           ? (
      //               getMarginValue(
      //                 proposeInfo.kit.preco,
      //                 getProposedPrice(proposeInfo.kit.preco, 0),
      //                 0
      //               ) * getProposedPrice(proposeInfo.kit.preco, 0)
      //             ).toLocaleString("pt-br", {
      //               maximumFractionDigits: 2,
      //               minimumFractionDigits: 2,
      //             })
      //           : 0}
      //       </h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="text-gray-500">
      //         R${" "}
      //         {proposeInfo.kit
      //           ? getProposedPrice(proposeInfo.kit.preco, 0).toLocaleString(
      //               "pt-br",
      //               { maximumFractionDigits: 2, minimumFractionDigits: 2 }
      //             )
      //           : "-"}
      //       </h1>
      //     </div>
      //   </div>
      //   {Object.keys(pricing).map((priceType, index) => {
      //     const description = priceDescription[priceType];
      //     const cost = pricing[priceType as keyof PricesObj].custo;
      //     const finalSellingPrice =
      //       pricing[priceType as keyof PricesObj].vendaFinal;
      //     const taxValue =
      //       getTaxValue(cost, finalSellingPrice) * finalSellingPrice;
      //     const marginValue =
      //       getMarginValue(cost, finalSellingPrice) * finalSellingPrice;
      //     return (
      //       <div className="flex w-full items-center rounded" key={index}>
      //         <div className="flex w-4/12 items-center justify-center p-1">
      //           <h1 className="text-gray-500">{description}</h1>
      //         </div>
      //         <div className="flex w-2/12 items-center justify-center p-1">
      //           <h1 className="text-gray-500">
      //             R${" "}
      //             {cost.toLocaleString("pt-br", {
      //               maximumFractionDigits: 2,
      //               minimumFractionDigits: 2,
      //             })}
      //           </h1>
      //         </div>
      //         <div className="flex w-2/12 items-center justify-center p-1">
      //           <h1 className="text-gray-500">
      //             R${" "}
      //             {taxValue.toLocaleString("pt-br", {
      //               maximumFractionDigits: 2,
      //               minimumFractionDigits: 2,
      //             })}
      //           </h1>
      //         </div>
      //         <div className="flex w-2/12 items-center justify-center p-1">
      //           <h1 className="text-gray-500">
      //             R${" "}
      //             {marginValue.toLocaleString("pt-br", {
      //               maximumFractionDigits: 2,
      //               minimumFractionDigits: 2,
      //             })}
      //           </h1>
      //         </div>
      //         <div className="flex w-2/12 items-center justify-center p-1">
      //           <h1 className="text-gray-500">
      //             R${" "}
      //             {finalSellingPrice.toLocaleString("pt-br", {
      //               maximumFractionDigits: 2,
      //               minimumFractionDigits: 2,
      //             })}
      //           </h1>
      //         </div>
      //       </div>
      //     );
      //   })}
      //   <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
      //     <div className="flex w-4/12 items-center justify-center p-1">
      //       <h1 className="font-bold text-gray-800">TOTAIS</h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-medium text-gray-800">
      //         R${" "}
      //         {getTotals().totalCosts.toLocaleString("pt-br", {
      //           maximumFractionDigits: 2,
      //           minimumFractionDigits: 2,
      //         })}
      //       </h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-medium text-gray-800">
      //         R${" "}
      //         {getTotals().totalTaxes.toLocaleString("pt-br", {
      //           maximumFractionDigits: 2,
      //           minimumFractionDigits: 2,
      //         })}
      //       </h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-medium text-gray-800">
      //         R${" "}
      //         {getTotals().totalProfits.toLocaleString("pt-br", {
      //           maximumFractionDigits: 2,
      //           minimumFractionDigits: 2,
      //         })}
      //       </h1>
      //     </div>
      //     <div className="flex w-2/12 items-center justify-center p-1">
      //       <h1 className="font-medium text-gray-800">
      //         R${" "}
      //         {getTotals().finalProposePrice.toLocaleString("pt-br", {
      //           maximumFractionDigits: 2,
      //           minimumFractionDigits: 2,
      //         })}
      //       </h1>
      //     </div>
      //   </div>
      // </div>
      null}

      <div className="flex w-full items-center justify-between gap-2 px-1">
        <button
          onClick={() => moveToPreviousStage(null)}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          onClick={handleProceed}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </>
  );
}

export default Sale;
