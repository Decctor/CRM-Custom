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
import PricingTableNonEditable from "../ProposeUtilBlocks/PricingTableNonEditable";
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
    // const kitPrice = proposeInfo.kit ? proposeInfo.kit.preco : 0;
    // var totalCosts = kitPrice;
    // var totalTaxes = 0;
    // var totalProfits =
    //   getMarginValue(kitPrice, getProposedPrice(kitPrice, 0), 0) *
    //   getProposedPrice(kitPrice, 0);
    const kitPrice = proposeInfo.kit ? proposeInfo.kit.preco : 0;
    var totalCosts = 0;
    var totalTaxes = 0;
    var totalProfits = 0;
    var finalProposePrice = 0;
    Object.keys(pricing).forEach((priceType) => {
      const cost = pricing[priceType as keyof PricesObj].custo;
      const finalSellingPrice =
        pricing[priceType as keyof PricesObj].vendaFinal;
      const taxValue =
        getTaxValue(
          cost,
          finalSellingPrice,
          pricing[priceType as keyof PricesObj].margemLucro
        ) * finalSellingPrice;
      const marginValue =
        getMarginValue(
          cost,
          finalSellingPrice,
          pricing[priceType as keyof PricesObj].imposto
        ) * finalSellingPrice;

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
      ) : (
        <PricingTableNonEditable
          proposeInfo={proposeInfo}
          pricing={pricing}
          setPricing={setPricing}
        />
      )}

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
