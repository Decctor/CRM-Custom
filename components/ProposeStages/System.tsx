import React from "react";

function System() {
  return (
    <div className="flex w-full flex-col py-4">
      <h1 className="font-bold">KITS FECHADOS</h1>
      <div className="flex w-full flex-wrap justify-around">
        <div className="flex h-[100px] w-[300px] flex-col rounded-sm border border-gray-300 shadow-sm"></div>
      </div>
    </div>
  );
}

export default System;
