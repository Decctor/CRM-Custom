import { IProposeInfo } from "@/utils/models";
import {
  PricesObj,
  getMarginValue,
  getProposedPrice,
  getTaxValue,
  priceDescription,
} from "@/utils/pricing/methods";
import React, { useState } from "react";

type PricingTableProps = {
  pricing: PricesObj;
  setPricing: React.Dispatch<React.SetStateAction<PricesObj>>;
  proposeInfo: IProposeInfo;
};

function PricingTableNonEditable({
  pricing,
  setPricing,
  proposeInfo,
}: PricingTableProps) {
  function getTotals() {
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
  return (
    <div className="flex w-full grow flex-col gap-1">
      <div className="flex w-full items-center rounded bg-blue-100">
        <div className="flex w-8/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">ITEM</h1>
        </div>

        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">VENDA</h1>
        </div>
      </div>
      {Object.keys(pricing).map((priceType, index) => {
        const description =
          priceType == "kit"
            ? proposeInfo.kit?.nome
            : priceDescription[priceType];
        const finalSellingPrice =
          pricing[priceType as keyof PricesObj].vendaFinal;
        return (
          <div
            className={`flex w-full items-center rounded ${
              Math.abs(
                pricing[priceType as keyof PricesObj].vendaFinal -
                  pricing[priceType as keyof PricesObj].vendaProposto
              ) > 1
                ? "bg-orange-200"
                : ""
            }`}
            key={index}
          >
            <div className="flex w-8/12 items-center justify-center p-1">
              <h1 className="text-gray-500">{description}</h1>
            </div>
            <div className="flex w-4/12 items-center justify-center gap-4 p-1">
              <h1 className="w-full text-center text-gray-500">
                R${" "}
                {finalSellingPrice.toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
            </div>
          </div>
        );
      })}
      <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
        <div className="flex w-8/12 items-center justify-center p-1">
          <h1 className="font-bold text-gray-800">TOTAIS</h1>
        </div>

        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${" "}
            {getTotals().finalProposePrice.toLocaleString("pt-br", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default PricingTableNonEditable;
