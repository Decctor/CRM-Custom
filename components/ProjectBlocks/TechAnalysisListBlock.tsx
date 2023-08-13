import { IProject, ITechnicalAnalysis } from "@/utils/models";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdAdd } from "react-icons/md";
import LoadingComponent from "../utils/LoadingComponent";
import dayjs from "dayjs";
import RequestTechnicalAnalysis from "../Modals/RequestTechnicalAnalysis";

type TechAnalysisListBlockProps = {
  project: IProject;
  technicalAnalysis?: ITechnicalAnalysis[];
  setBlockMode: React.Dispatch<
    React.SetStateAction<"PROPOSES" | "TECHNICAL ANALYSIS">
  >;
  fetchingTechAnalysis: boolean;
  successTechAnalysis: boolean;
};
function getStatusStyling(status: string, conclusionDate?: string) {
  if (status == "CONCLUIDO" && conclusionDate) {
    if (dayjs().diff(conclusionDate, "days") < 30)
      return { text: "CONCLUIDO", color: "text-green-500" };
    else return { text: "VENCIDO", color: "text-red-500" };
  }
  if (status == "EM ANÁLISE TÉCNICA") {
    return { text: status, color: "text-yellow-500" };
  }
  if (status == "PENDÊNCIA COMERCIAL") {
    return { text: status, color: "text-cyan-500" };
  }

  if (status == "VISITA IN LOCO") {
    return { text: status, color: "text-indigo-500" };
  }
  if (status == "REJEITADA") {
    return { text: status, color: "text-red-300" };
  }
  return { text: status, color: "text-black" };
}
function TechAnalysisListBlock({
  project,
  technicalAnalysis,
  setBlockMode,
  fetchingTechAnalysis,
  successTechAnalysis,
}: TechAnalysisListBlockProps) {
  const [requestModalIsOpen, setRequestModalIsOpen] = useState<boolean>(false);
  useEffect(() => {
    console.log("ATUALIZAÇÃO VISITA", technicalAnalysis);
  }, [technicalAnalysis]);
  return (
    <div className="flex h-[230px] w-full flex-col rounded-md border border-gray-600 bg-[#27374D] p-3 shadow-lg lg:w-[60%]">
      <div className="flex  h-[40px] items-center  justify-between border-b border-gray-600 pb-2">
        <div className="flex items-center justify-center gap-5">
          <h1
            onClick={() => setBlockMode("PROPOSES")}
            className="w-[120px] cursor-pointer border-b border-transparent p-1 text-center font-bold text-white hover:border-blue-500"
          >
            Propostas
          </h1>
          <h1
            onClick={() => setBlockMode("TECHNICAL ANALYSIS")}
            className="w-fit cursor-pointer border-b border-[#fbcb83] p-1 text-center font-bold text-white hover:border-blue-500"
          >
            Análises Técnicas
          </h1>
        </div>

        <button
          onClick={() => setRequestModalIsOpen(true)}
          className="hidden rounded bg-green-600 p-1 text-sm font-bold text-white lg:flex"
        >
          SOLICITAR ANÁLISE
        </button>
        <button
          onClick={() => setRequestModalIsOpen(true)}
          className="flex rounded bg-green-600 p-1 text-sm font-bold text-white lg:hidden"
        >
          <MdAdd />
        </button>
      </div>
      <div className="overscroll-y mt-3 flex w-full grow flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        <div className="flex h-[30px] min-h-[30px] w-full items-center rounded bg-black">
          <div className="flex w-full items-center justify-center lg:w-1/4">
            <h1 className="w-full text-center text-white">NOME</h1>
          </div>
          <div className="hidden items-center justify-center lg:flex lg:w-1/4">
            <h1 className="w-full text-center text-white">STATUS</h1>
          </div>

          <div className="hidden items-center justify-center lg:flex  lg:w-1/4">
            <h1 className="w-full text-center text-white">DATA SOLICITAÇÃO</h1>
          </div>

          <div className="hidden w-full items-center justify-center lg:flex lg:w-1/4">
            <h1 className="w-full text-center text-white">DATA DE CONCLUSÃO</h1>
          </div>
        </div>
        <div className=" flex grow flex-col">
          {fetchingTechAnalysis ? (
            <div className="flex grow items-center justify-center">
              <LoadingComponent />
            </div>
          ) : null}
          {successTechAnalysis && technicalAnalysis ? (
            technicalAnalysis?.length > 0 ? (
              technicalAnalysis?.map((analysis, index) => (
                <div className="flex h-[45px] min-h-[45px] w-full items-center rounded">
                  <div className="flex w-full items-center justify-center lg:w-1/4">
                    <div className="flex w-full flex-col items-center">
                      <h1 className={`w-full text-center text-black`}>
                        {analysis.nomeDoCliente}
                      </h1>
                      <h1 className="w-full text-center text-xxs text-gray-500">
                        {analysis._id}
                      </h1>
                    </div>
                  </div>
                  <div className="hidden items-center justify-center lg:flex lg:w-1/4">
                    <h1
                      className={`w-full text-center font-medium ${
                        getStatusStyling(
                          analysis.status,
                          analysis.dataDeConclusao
                        ).color
                      }`}
                    >
                      {
                        getStatusStyling(
                          analysis.status,
                          analysis.dataDeConclusao
                        ).text
                      }
                    </h1>
                  </div>

                  <div className="hidden items-center justify-center lg:flex  lg:w-1/4">
                    <h1 className={`w-full text-center text-black`}>
                      {analysis.dataDeAbertura
                        ? dayjs(analysis.dataDeAbertura).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        : "-"}
                    </h1>
                  </div>

                  <div className="hidden w-full items-center justify-center lg:flex lg:w-1/4">
                    <h1 className={`w-full text-center text-black`}>
                      {analysis.dataDeConclusao
                        ? dayjs(analysis.dataDeConclusao).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        : "-"}
                    </h1>
                  </div>
                </div>
              ))
            ) : (
              <p className="flex grow items-center justify-center italic text-gray-500">
                Não foram encontradas análises técnicas vinculadas a esse
                projeto...
              </p>
            )
          ) : null}
          {/* {projectProposesSuccess ? (
            projectProposes.length > 0 ? (
              projectProposes.map((propose, index) => (
                <div
                  key={index}
                  className={`relative flex w-full items-center ${
                    propose.aceite ? "font-medium text-green-500" : ""
                  }`}
                >
                  <div className="flex w-full items-center justify-center lg:w-1/4">
                    {propose._id == idActivePropose ? (
                      <AiFillStar style={{ color: "#fbcb83" }} />
                    ) : null}
                    <Link href={`/proposta/${propose._id}`}>
                      <h1 className="text-center hover:text-blue-400">
                        {propose.nome}
                      </h1>
                    </Link>
                  </div>
                  <div className="hidden items-center justify-center lg:flex lg:w-1/4">
                    <h1 className="w-full text-center">
                      {propose.potenciaPico?.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      kWp
                    </h1>
                  </div>
                  <div className="hidden items-center justify-center lg:flex lg:w-1/4">
                    <h1 className="w-full text-center">
                      R${" "}
                      {propose.valorProposta?.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="hidden items-center justify-center lg:flex lg:w-1/4">
                    <h1 className="hidden w-1/4 text-center lg:flex">
                      {propose.dataInsercao
                        ? dayjs(propose.dataInsercao).format("DD/MM/YYYY")
                        : null}
                    </h1>
                  </div>
                  {propose.aceite ? (
                    <div className="absolute right-2 flex items-center justify-center text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="flex grow items-center justify-center italic text-gray-500">
                Sem propostas vinculadas a esse projeto.
              </p>
            )
          ) : null}
          {projectProposesLoading ? (
            <div className="flex grow items-center justify-center">
              <LoadingComponent />
            </div>
          ) : null}
          {projectProposesError ? (
            <p className="flex grow items-center justify-center italic text-gray-500">
              Oops, houve um erro na busca das propostas desse projeto. Tente
              recarregar a página.
            </p>
          ) : null} */}
        </div>
      </div>
      {requestModalIsOpen ? (
        <RequestTechnicalAnalysis
          project={project}
          closeModal={() => setRequestModalIsOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default TechAnalysisListBlock;
