import { IProject, IProposeInfo } from "@/utils/models";
import {
  PricesObj,
  PricesPromoObj,
  Pricing,
  getMarginValue,
  getPrices,
  getTaxValue,
} from "@/utils/pricing/methods";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import PricingTable from "../ProposeUtilBlocks/PricingTable";
import PricingTableNonEditable from "../ProposeUtilBlocks/PricingTableNonEditable";
import EditProposePrice from "../ProposeUtilBlocks/EditProposePrice";
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
  const [editFinalPriceModalIsOpen, setEditFinalPriceModalIsOpen] =
    useState<boolean>(false);
  const [pricing, setPricing] = useState(getPrices(project, proposeInfo));
  function getTotals(pricing: Pricing) {
    switch (proposeInfo.kit?.tipo) {
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
          console.log("SOMATORIA", priceType, taxValue);
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

  function handleProceed() {
    setProposeInfo((prev) => ({
      ...prev,
      precificacao: pricing,
      valorProposta: Number(getTotals(pricing).finalProposePrice.toFixed(2)),
    }));
    moveToNextStage(null);
  }
  console.log("PREÇOS", pricing);
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <h1 className="font-Raleway font-bold text-gray-800">
          DESCRITIVO DA VENDA
        </h1>
      </div>
      {session?.user.permissoes.precos.visualizar ? (
        <PricingTable
          proposeInfo={proposeInfo}
          pricing={pricing}
          setPricing={setPricing}
          session={session}
        />
      ) : (
        <PricingTableNonEditable
          proposeInfo={proposeInfo}
          pricing={pricing}
          setPricing={setPricing}
        />
      )}
      <div className="flex w-full items-center justify-center py-1">
        <div className="flex gap-2 rounded border border-gray-600 px-2 py-1 font-medium text-gray-600">
          <p>
            R$
            {getTotals(pricing).finalProposePrice.toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          {session?.user.permissoes.precos.editar ? (
            <button
              onClick={() => setEditFinalPriceModalIsOpen((prev) => !prev)}
              className="text-md text-gray-400 hover:text-[#fead61]"
            >
              <AiFillEdit />
            </button>
          ) : (
            <button
              onClick={() => setEditFinalPriceModalIsOpen((prev) => !prev)}
              className="text-md text-gray-400 hover:text-[#fead61]"
            >
              <AiFillEdit />
            </button>
          )}
        </div>
      </div>
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
      {editFinalPriceModalIsOpen ? (
        <EditProposePrice
          pricing={pricing}
          setPricing={setPricing}
          closeModal={() => setEditFinalPriceModalIsOpen(false)}
          finalProposePrice={getTotals(pricing).finalProposePrice}
          finalSuggestedPrice={
            getTotals(getPrices(project, proposeInfo)).finalProposePrice
          }
          limit={session?.user.permissoes.precos.editar ? undefined : 0.02}
        />
      ) : null}
    </>
  );
}

export default Sale;
