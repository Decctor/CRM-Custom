import { TechAnalysisSolicitationTypes } from "@/utils/constants";
import React from "react";
import DrawIcon from "../../../utils/images/drawicon.svg";
import { FaCalculator } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import Image from "next/image";
type SolicitationTypeSelectionProps = {
  selectType: (string: (typeof TechAnalysisSolicitationTypes)[number]) => void;
};

function SolicitationTypeSelection({
  selectType,
}: SolicitationTypeSelectionProps) {
  return (
    <div className="flex w-full grow flex-col items-center gap-2 px-4">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
        TIPO DE SOLICITAÇÃO
      </span>
      <div className="flex w-full items-center gap-2">
        <div
          onClick={() => selectType("VISITA TÉCNICA REMOTA - URBANA")}
          className="flex h-[300px] w-full cursor-pointer flex-col items-center gap-2 rounded-sm border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-100 lg:w-[50%]"
        >
          <MdAssessment style={{ color: "#fead61", fontSize: "35px" }} />
          <h1 className="text-center text-lg font-bold">
            VISITA TÉCNICA REMOTA - URBANA
          </h1>
          <p className="text-center text-sm text-gray-500">
            Requisite ao nosso time de engenharia uma avaliação técnica.
          </p>
          <p className="text-center text-sm text-gray-500">
            Uma vez realizada uma visita técnica de uma instalação urbana,
            preencha um formulário com as informações e imagens coletadas.
          </p>
          <p className="text-center text-sm text-gray-500">
            Concluída a requisição, o formulário passará pela avaliação e estudo
            da engenharia, que em um prazo máximo de 72 horas úteis retornará um
            laudo técnico para futuras operações.
          </p>
        </div>
        <div
          onClick={() => selectType("VISITA TÉCNICA REMOTA - RURAL")}
          className="flex h-[300px] w-full cursor-pointer flex-col items-center gap-2 rounded-sm border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-100 lg:w-[50%]"
        >
          <MdAssessment style={{ color: "#fead61", fontSize: "35px" }} />
          <h1 className="text-center text-lg font-bold">
            VISITA TÉCNICA REMOTA - RURAL
          </h1>
          <p className="text-center text-sm text-gray-500">
            Requisite ao nosso time de engenharia uma avaliação técnica.
          </p>
          <p className="text-center text-sm text-gray-500">
            Uma vez realizada uma visita técnica de uma instalação rural,
            preencha um formulário com as informações e imagens coletadas.
          </p>
          <p className="text-center text-sm text-gray-500">
            Concluída a requisição, o formulário passará pela avaliação e estudo
            da engenharia, que em um prazo máximo de 72 horas úteis retornará um
            laudo técnico para futuras operações.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <div
          onClick={() => selectType("VISITA TÉCNICA IN LOCO - URBANA")}
          className="flex h-[300px] w-full cursor-pointer flex-col items-center gap-2 rounded-sm border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-100 lg:w-[50%]"
        >
          <MdAssessment style={{ color: "#15599a", fontSize: "35px" }} />
          <h1 className="text-center text-lg font-bold">
            VISITA TÉCNICA IN LOCO - URBANA
          </h1>
          <p className="text-center text-sm text-gray-500">
            Requisite ao nosso time de engenharia uma avaliação técnica.
          </p>
          <p className="text-center text-sm text-gray-500">
            Preencha um conjunto de informações acerca do cliente e do projeto a
            ser avaliado e nosso time de engenharia realizará uma visita técnica
            para coleta e elaboração de um laudo técnico.
          </p>
          <p className="text-center text-sm text-gray-500">
            Uma vez requisitada, um resultado será informado em um prazo de 72
            horas úteis.
          </p>
        </div>
        <div
          onClick={() => selectType("VISITA TÉCNICA IN LOCO - RURAL")}
          className="flex h-[300px] w-full cursor-pointer flex-col items-center gap-2 rounded-sm border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-100 lg:w-[50%]"
        >
          <MdAssessment style={{ color: "#15599a", fontSize: "35px" }} />
          <h1 className="text-center text-lg font-bold">
            VISITA TÉCNICA IN LOCO - RURAL
          </h1>
          <p className="text-center text-sm text-gray-500">
            Requisite ao nosso time de engenharia uma avaliação técnica.
          </p>
          <p className="text-center text-sm text-gray-500">
            Preencha um conjunto de informações acerca do cliente e do projeto a
            ser avaliado e nosso time de engenharia realizará uma visita técnica
            para coleta e elaboração de um laudo técnico.
          </p>
          <p className="text-center text-sm text-gray-500">
            Uma vez requisitada, um resultado será informado em um prazo de 72
            horas úteis.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <div
          onClick={() => selectType("DESENHO PERSONALIZADO")}
          className="flex h-[300px] w-full cursor-pointer flex-col items-center gap-2 rounded-sm border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-100 lg:w-[50%]"
        >
          <MdAssessment style={{ color: "#000", fontSize: "35px" }} />
          <h1 className="text-center text-lg font-bold">
            DESENHO PERSONALIZADO
          </h1>
          <p className="text-center text-sm text-gray-500">
            Requisite ao nosso time de engenharia um desenho personalizado.
          </p>
          {/* <TbRulerMeasure
            style={{ color: "rgb(34,197,94)", fontSize: "50px" }}
          /> */}
          <Image src={DrawIcon} alt="DESENHO TÉCNICO" height={50} />

          <p className="text-center text-sm text-gray-500">
            Uma vez requisitado, um resultado será informado em um prazo de 72
            horas úteis.
          </p>
        </div>
        <div
          onClick={() => selectType("ORÇAMENTAÇÃO")}
          className="flex h-[300px] w-full cursor-pointer flex-col items-center gap-2 rounded-sm border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-100 lg:w-[50%]"
        >
          <MdAssessment style={{ color: "#000", fontSize: "35px" }} />
          <h1 className="text-center text-lg font-bold">ORÇAMENTAÇÃO</h1>
          <p className="text-center text-sm text-gray-500">
            Requisite ao nosso time de engenharia uma orçamentação
            personalizada.
          </p>
          <FaCalculator style={{ color: "rgb(34,197,94)", fontSize: "50px" }} />
          <p className="text-center text-sm text-gray-500">
            Uma vez requisitado, um resultado será informado em um prazo de 72
            horas úteis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SolicitationTypeSelection;
