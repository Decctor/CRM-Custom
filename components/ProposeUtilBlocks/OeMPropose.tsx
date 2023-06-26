import React, { useEffect, useState } from "react";
import System from "../ProposeStages/System";
import Sizing from "../ProposeStages/Sizing";
import Sale from "../ProposeStages/Sale";
import Propose from "../ProposeStages/Propose";
import { IoMdOptions } from "react-icons/io";
import { SlEnergy } from "react-icons/sl";
import { MdAttachMoney, MdSell } from "react-icons/md";
import { ImFileEmpty } from "react-icons/im";
import { IProject, IProposeInfo, IProposeOeMInfo } from "@/utils/models";
import SizingOeM from "../ProposeStages/SizingOeM";
import SaleOeM from "../ProposeStages/SaleOeM";
import ProposeOeM from "../ProposeStages/ProposeOeM";

type OeMProposeTypes = {
  project: IProject;
};
function OeMPropose({ project }: OeMProposeTypes) {
  const [proposeStage, setProposeStage] = useState(1);
  const [proposeInfo, setProposeInfo] = useState<IProposeOeMInfo>({
    projeto: {
      nome: project?.nome,
      id: project?._id,
    },
    premissas: {
      consumoEnergiaMensal: 0,
      tarifaEnergia: 0,
      distancia: 0,
      qtdeModulos: 0,
      potModulos: 0,
      eficienciaAtual: 0,
    },
  });
  useEffect(() => {
    setProposeInfo((prev) => ({
      ...prev,
      projeto: {
        id: project?._id,
        nome: project?.nome,
      },
    }));
  }, [project]);
  return (
    <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
      <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-3 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-3 lg:grid-rows-1 lg:gap-1">
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 1 ? "text-[#15599a]" : "text-gray-600"
          } `}
        >
          <IoMdOptions style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">DIMENSIONAMENTO</p>
        </div>
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 2 ? "text-[#15599a]" : "text-gray-600"
          } `}
        >
          <MdSell style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">VENDA</p>
        </div>
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 3 ? "text-[#15599a]" : "text-gray-600"
          } `}
        >
          <ImFileEmpty style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">PROPOSTA</p>
        </div>
      </div>
      {proposeStage == 1 ? (
        <SizingOeM
          proposeInfo={proposeInfo}
          project={project}
          setProposeInfo={setProposeInfo}
          moveToNextStage={() => setProposeStage((prev) => prev + 1)}
        />
      ) : null}
      {proposeStage == 2 ? (
        <SaleOeM
          proposeInfo={proposeInfo}
          setProposeInfo={setProposeInfo}
          project={project}
          moveToPreviousStage={() => setProposeStage((prev) => prev - 1)}
          moveToNextStage={() => setProposeStage((prev) => prev + 1)}
        />
      ) : null}
      {proposeStage == 3 ? (
        <ProposeOeM
          proposeInfo={proposeInfo}
          setProposeInfo={setProposeInfo}
          project={project}
          moveToPreviousStage={() => setProposeStage((prev) => prev - 1)}
        />
      ) : null}
    </div>
  );
}

export default OeMPropose;
