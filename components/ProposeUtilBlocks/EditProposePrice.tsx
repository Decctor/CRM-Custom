import {
  PricesObj,
  PricesOeMObj,
  PricesPromoObj,
  Pricing,
  getMarginValue,
} from "@/utils/pricing/methods";
import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import NumberInput from "../Inputs/NumberInput";
import { toast } from "react-hot-toast";

type EditPriceModalProps = {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  pricing: PricesObj | PricesOeMObj | PricesPromoObj;
  setPricing: React.Dispatch<React.SetStateAction<PricesObj | PricesPromoObj>>;
  finalProposePrice: number;
  finalSuggestedPrice: number;
  limit?: number;
};
function EditProposePrice({
  closeModal,
  pricing,
  setPricing,
  finalProposePrice,
  finalSuggestedPrice,
  limit,
}: EditPriceModalProps) {
  const [finalPrice, setFinalPrice] = useState<number>(finalProposePrice);
  function correctPrice(diff: number, value: number) {
    var pricingObjCopy = { ...pricing } as Pricing;
    Object.keys(pricingObjCopy).forEach((priceType) => {
      const pricesObj = pricingObjCopy[priceType as keyof Pricing];
      if (!pricesObj) return;
      const currentSellingPrice = pricesObj.vendaFinal;
      const correspondentPiece = currentSellingPrice / finalProposePrice;
      const newSellingPrice = currentSellingPrice - correspondentPiece * diff;
      const newMargin = getMarginValue(
        pricesObj.custo,
        newSellingPrice,
        pricesObj.imposto
      );

      pricesObj.margemLucro = newMargin;
      pricesObj.vendaFinal = newSellingPrice;
    });
    setPricing(pricingObjCopy);
    setFinalPrice(value);
  }
  console.log(finalProposePrice, finalSuggestedPrice);
  return (
    <div
      id="defaultModal"
      className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]"
    >
      <div className="fixed left-[50%] top-[50%] z-[100] h-fit w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]  lg:w-[25%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">
              ALTERAÇÃO DE PREÇO
            </h3>
            <button
              onClick={() => {
                if (
                  limit &&
                  finalProposePrice < finalSuggestedPrice * (1 - limit)
                ) {
                  toast.error(
                    "Desconto maior que o permitido. Alterando pro valor de desconto máximo..."
                  );
                  setTimeout(() => {
                    correctPrice(
                      finalPrice - finalSuggestedPrice * (1 - limit),
                      finalSuggestedPrice * (1 - limit)
                    );
                    closeModal(false);
                  }, 1000);
                } else {
                  closeModal(false);
                }
              }}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="w-full self-center lg:w-[50%]">
              <NumberInput
                label="PREÇO FINAL DA PROPOSTA"
                value={finalPrice ? Number(finalPrice.toFixed(2)) : 0}
                placeholder="Preencha aqui o valor final da proposta..."
                handleChange={(value) => {
                  const diff = finalProposePrice - value;
                  const comparativeChange =
                    (finalSuggestedPrice - value) / finalSuggestedPrice;
                  // console.log(
                  //   "MUDANÇA COMPARATIVA",
                  //   comparativeChange,
                  //   comparativeChange > 0.02
                  // );
                  // var pricingObjCopy = { ...pricing } as Pricing;
                  // Object.keys(pricingObjCopy).forEach((priceType) => {
                  //   const pricesObj =
                  //     pricingObjCopy[priceType as keyof Pricing];
                  //   if (!pricesObj) return;
                  //   const currentSellingPrice = pricesObj.vendaFinal;
                  //   const correspondentPiece =
                  //     currentSellingPrice / finalProposePrice;
                  //   const newSellingPrice =
                  //     currentSellingPrice - correspondentPiece * diff;
                  //   const newMargin = getMarginValue(
                  //     pricesObj.custo,
                  //     newSellingPrice,
                  //     pricesObj.imposto
                  //   );

                  //   pricesObj.margemLucro = newMargin;
                  //   pricesObj.vendaFinal = newSellingPrice;
                  // });
                  // setPricing(pricingObjCopy);
                  // setFinalPrice(value);
                  correctPrice(diff, value);
                }}
                width="100%"
              />
            </div>
            {limit ? (
              <p className="text-center text-sm italic text-gray-500">
                Valor mínimo permitido de R${" "}
                {(finalSuggestedPrice * (1 - limit)).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProposePrice;
