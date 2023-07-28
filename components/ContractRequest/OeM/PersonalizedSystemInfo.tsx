import { IContractRequest } from "@/utils/models";
import React from "react";
type PersonalizedSystemInfoProps = {
  requestInfo: IContractRequest;
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>;
  goToPreviousStage: () => void;
  goToNextStage: () => void;
};
function PersonalizedSystemInfo({
  requestInfo,
  setRequestInfo,
  goToPreviousStage,
  goToNextStage,
}: PersonalizedSystemInfoProps) {
  function validateFields() {
    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
        DADOS DO SISTEMA
      </span>
      <div className="flex w-full grow flex-col"></div>
      <div className="mt-2 flex w-full flex-wrap justify-between  gap-2">
        <button
          onClick={() => {
            goToPreviousStage();
          }}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          onClick={() => {
            if (validateFields()) {
              goToNextStage();
            }
          }}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default PersonalizedSystemInfo;
