import { Sidebar } from "@/components/Sidebar";
import React from "react";

function EstatisticaPrincipal() {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#393E46] p-6">
        <div className="flex w-full items-center border-b border-[#fead61] pb-2">
          <h1 className="font-Raleway text-2xl font-black text-[#fead41]">
            RELATÓRIOS
          </h1>
        </div>
      </div>
    </div>
  );
}

export default EstatisticaPrincipal;
