import {
  PricesObj,
  PricesPromoObj,
  Pricing,
  getMarginValue,
  getProposedPrice,
  getTaxValue,
} from "@/utils/pricing/methods";
import React from "react";
import { VscChromeClose } from "react-icons/vsc";
import NumberInput from "../Inputs/NumberInput";

type EditPriceModalProps = {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  priceType: string;
  pricing: Pricing;
  setPricing: React.Dispatch<React.SetStateAction<PricesObj | PricesPromoObj>>;
};
function EditPriceModal({
  closeModal,
  priceType,
  pricing,
  setPricing,
}: EditPriceModalProps) {
  const tag = priceType as keyof Pricing;
  const pricesObj = pricing[priceType as keyof Pricing];
  console.log("OBJETO DE PREÇO", pricesObj);
  if (!pricesObj) return <></>;
  const { custo, vendaFinal, margemLucro, imposto } = pricesObj;
  return (
    <div
      id="defaultModal"
      className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]"
    >
      <div className="fixed left-[50%] top-[50%] z-[100] h-fit w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]  lg:w-[30%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">
              ALTERAÇÃO DE PREÇOS
            </h3>
            <button
              onClick={() => closeModal(false)}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="w-full self-center lg:w-[50%]">
              <NumberInput
                label="CUSTO"
                value={custo ? Number(custo.toFixed(2)) : 0}
                placeholder="Valor de custo..."
                handleChange={(value) => {
                  const newSellingPrice = getProposedPrice(
                    value,
                    imposto,
                    margemLucro
                  );

                  setPricing((prev) => ({
                    ...prev,
                    [tag]: {
                      ...prev[tag],
                      custo: value,
                      vendaFinal: newSellingPrice,
                    },
                  }));
                }}
                width="100%"
              />
            </div>
            <div className="w-full self-center lg:w-[50%]">
              <NumberInput
                label="MARGEM DE LUCRO"
                value={margemLucro ? Number(margemLucro.toFixed(2)) : 0}
                placeholder="Valor da margem de lucro..."
                handleChange={(value) => {
                  const newSellingPrice = getProposedPrice(
                    custo,
                    imposto,
                    value
                  );

                  setPricing((prev) => ({
                    ...prev,
                    [tag]: {
                      ...prev[tag],
                      margemLucro: value,
                      vendaFinal: newSellingPrice,
                    },
                  }));
                }}
                width="100%"
              />
            </div>
            <div className="w-full self-center lg:w-[50%]">
              <NumberInput
                label="TAXA DE IMPOSTO"
                value={imposto ? Number(imposto.toFixed(2)) : 0}
                placeholder="Valor da taxa de imposto..."
                handleChange={(value) => {
                  const newSellingPrice = getProposedPrice(
                    custo,
                    value,
                    margemLucro
                  );
                  setPricing((prev) => ({
                    ...prev,
                    [tag]: {
                      ...prev[tag],
                      imposto: value,
                      vendaFinal: newSellingPrice,
                    },
                  }));
                }}
                width="100%"
              />
            </div>
            <div className="w-full self-center lg:w-[50%]">
              <NumberInput
                label="PREÇO DE VENDA"
                value={vendaFinal ? Number(vendaFinal.toFixed(2)) : 0}
                placeholder="Valor de venda final..."
                handleChange={(value) => {
                  const newMargin = getMarginValue(custo, value, imposto);

                  setPricing((prev) => ({
                    ...prev,
                    [tag]: {
                      ...prev[tag],
                      vendaFinal: value,
                      margemLucro: newMargin,
                    },
                  }));
                }}
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPriceModal;
