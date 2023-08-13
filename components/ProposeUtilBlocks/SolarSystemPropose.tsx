import React, { useEffect, useState } from "react";
import System from "../ProposeStages/System";
import Sizing from "../ProposeStages/Sizing";
import Sale from "../ProposeStages/Sale";
import Propose from "../ProposeStages/Propose";
import { IoMdOptions } from "react-icons/io";
import { SlEnergy } from "react-icons/sl";
import { MdAttachMoney, MdSell } from "react-icons/md";
import { ImFileEmpty } from "react-icons/im";
import { IProject, IProposeInfo, ITechnicalAnalysis } from "@/utils/models";
import { checkQueryEnableStatus, useTechnicalAnalysis } from "@/utils/methods";
import { useSession } from "next-auth/react";

type SolarSystemProposeTypes = {
  project: IProject;
};
function SolarSystemPropose({ project }: SolarSystemProposeTypes) {
  const { data: session } = useSession();
  const { data: technicalAnalysis } = useTechnicalAnalysis(
    project.identificador,
    checkQueryEnableStatus(session, project.identificador),
    "CONCLUIDO"
  );

  const [selectedAnalysis, setSelectedAnalysis] =
    useState<ITechnicalAnalysis | null>(null);
  const [proposeStage, setProposeStage] = useState(1);
  const [proposeInfo, setProposeInfo] = useState<IProposeInfo>({
    projeto: {
      nome: project?.nome,
      id: project?._id,
    },
    premissas: {
      consumoEnergiaMensal: 0,
      distribuidora: "CEMIG D",
      subgrupo: undefined,
      tarifaEnergia: 0,
      tarifaTUSD: 0,
      tensaoRede: "127/220V",
      fase: "Bifásico",
      fatorSimultaneidade: 0,
      tipoEstrutura: "Fibrocimento",
      orientacao: "NORTE",
      distancia: 0,
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
  console.log("VISITAS", technicalAnalysis);
  return (
    <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
      <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-5 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-1">
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 1 ? "text-[#fbcb83]" : "text-gray-600"
          } `}
        >
          <IoMdOptions style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">DIMENSIONAMENTO</p>
        </div>
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 2 ? "text-[#fbcb83]" : "text-gray-600"
          } `}
        >
          <SlEnergy style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">SISTEMA</p>
        </div>
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 3 ? "text-[#fbcb83]" : "text-gray-600"
          } `}
        >
          <MdSell style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">VENDA</p>
        </div>
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 5 ? "text-[#fbcb83]" : "text-gray-600"
          } `}
        >
          <MdAttachMoney style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">FINANCEIRO</p>
        </div>
        <div
          className={`flex items-center justify-center gap-1 ${
            proposeStage == 4 ? "text-[#fbcb83]" : "text-gray-600"
          } `}
        >
          <ImFileEmpty style={{ fontSize: "23px" }} />
          <p className="text-sm font-bold lg:text-lg">PROPOSTA</p>
        </div>
      </div>

      {proposeStage == 1 ? (
        <Sizing
          proposeInfo={proposeInfo}
          project={project}
          setProposeInfo={setProposeInfo}
          moveToNextStage={() => setProposeStage((prev) => prev + 1)}
          technicalAnalysis={technicalAnalysis}
          selectedAnalysis={selectedAnalysis}
          setSelectedAnalysis={setSelectedAnalysis}
        />
      ) : null}
      {proposeStage == 2 ? (
        <System
          proposeInfo={proposeInfo}
          setProposeInfo={setProposeInfo}
          project={project}
          moveToPreviousStage={() => setProposeStage((prev) => prev - 1)}
          moveToNextStage={() => setProposeStage((prev) => prev + 1)}
        />
      ) : null}
      {proposeStage == 3 ? (
        <Sale
          proposeInfo={proposeInfo}
          setProposeInfo={setProposeInfo}
          project={project}
          moveToPreviousStage={() => setProposeStage((prev) => prev - 1)}
          moveToNextStage={() => setProposeStage((prev) => prev + 1)}
          selectedAnalysis={selectedAnalysis}
        />
      ) : null}
      {proposeStage == 4 ? (
        <Propose
          proposeInfo={proposeInfo}
          setProposeInfo={setProposeInfo}
          project={project}
          moveToPreviousStage={() => setProposeStage((prev) => prev - 1)}
          selectedAnalysis={selectedAnalysis}
        />
      ) : null}
    </div>
  );
}

export default SolarSystemPropose;
