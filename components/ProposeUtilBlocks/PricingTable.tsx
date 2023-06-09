import { IProposeInfo } from "@/utils/models";
import {
  PricesObj,
  getMarginValue,
  getProposedPrice,
  getTaxValue,
  priceDescription,
} from "@/utils/pricing/methods";
import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import EditPriceModal from "./EditPriceModal";

type PricingTableProps = {
  pricing: PricesObj;
  setPricing: React.Dispatch<React.SetStateAction<PricesObj>>;
  proposeInfo: IProposeInfo;
};
type EditPriceModalState = {
  isOpen: boolean;
  priceTag: string | null;
};
function PricingTable({ pricing, setPricing, proposeInfo }: PricingTableProps) {
  const [editPriceModal, setEditPriceModal] = useState<EditPriceModalState>({
    isOpen: false,
    priceTag: null,
  });
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
  return (
    <div className="flex w-full grow flex-col gap-1">
      <div className="flex w-full items-center rounded bg-blue-100">
        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">ITEM</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">CUSTO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">IMPOSTO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">LUCRO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">VENDA</h1>
        </div>
      </div>
      {/* <div className="flex w-full items-center rounded">
        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="text-gray-500">{proposeInfo.kit?.nome}</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">
            R${" "}
            {proposeInfo.kit?.preco.toLocaleString("pt-br", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">-</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">
            R${" "}
            {proposeInfo.kit
              ? (
                  getMarginValue(
                    proposeInfo.kit.preco,
                    getProposedPrice(proposeInfo.kit.preco, 0),
                    0
                  ) * getProposedPrice(proposeInfo.kit.preco, 0)
                ).toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              : 0}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">
            R${" "}
            {proposeInfo.kit
              ? getProposedPrice(proposeInfo.kit.preco, 0).toLocaleString(
                  "pt-br",
                  { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                )
              : "-"}
          </h1>
        </div>
      </div> */}
      {Object.keys(pricing).map((priceType, index) => {
        const description =
          priceType == "kit"
            ? proposeInfo.kit?.nome
            : priceDescription[priceType];
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
            <div className="flex w-4/12 items-center justify-center p-1">
              <h1 className="text-gray-500">{description}</h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">
                R${" "}
                {cost.toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">
                R${" "}
                {taxValue.toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">
                R${" "}
                {marginValue.toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
            </div>
            <div className="flex w-2/12 items-center justify-center gap-4 p-1">
              <h1 className="w-full text-center text-gray-500 lg:w-1/2">
                R${" "}
                {finalSellingPrice.toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
              <button
                onClick={() =>
                  setEditPriceModal({ isOpen: true, priceTag: priceType })
                }
                className="text-md text-gray-400 hover:text-[#fead61]"
              >
                <AiFillEdit />
              </button>
            </div>
          </div>
        );
      })}
      <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="font-bold text-gray-800">TOTAIS</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${" "}
            {getTotals().totalCosts.toLocaleString("pt-br", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${" "}
            {getTotals().totalTaxes.toLocaleString("pt-br", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${" "}
            {getTotals().totalProfits.toLocaleString("pt-br", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${" "}
            {getTotals().finalProposePrice.toLocaleString("pt-br", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
      </div>
      {editPriceModal.isOpen && editPriceModal.priceTag ? (
        <EditPriceModal
          priceType={editPriceModal.priceTag}
          pricing={pricing}
          setPricing={setPricing}
          closeModal={() =>
            setEditPriceModal((prev) => ({ ...prev, isOpen: false }))
          }
        />
      ) : null}
    </div>
  );
}

export default PricingTable;
