import { Sidebar } from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { IoMdOptions } from "react-icons/io";
import { MdAttachMoney, MdSell } from "react-icons/md";
import { SlEnergy } from "react-icons/sl";
import { ImFileEmpty } from "react-icons/im";
import TextInput from "@/components/Inputs/TextInput";
import System from "@/components/ProposeStages/System";
import Sizing from "@/components/ProposeStages/Sizing";
import { useProject } from "@/utils/methods";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "@/components/utils/LoadingPage";
import { IProject, IProposeInfo, ISession } from "@/utils/models";
import Sale from "@/components/ProposeStages/Sale";
import Propose from "@/components/ProposeStages/Propose";
import SolarSystemPropose from "@/components/ProposeUtilBlocks/SolarSystemPropose";
import OeMPropose from "@/components/ProposeUtilBlocks/OeMPropose";
import { energyTariffs } from "@/utils/constants";
import Link from "next/link";
function checkQueryEnableStatus(session: ISession | null, queryId: any) {
  if (session?.user && typeof queryId === "string") {
    return true;
  } else {
    return false;
  }
}

function getProposeInfoBasedOnProjectType(project: IProject) {
  if (project.tipoProjeto == "SISTEMA FOTOVOLTAICO") {
    return {
      projeto: {
        nome: project?.nome,
        id: project?._id,
      },
      premissas: {
        consumoEnergiaMensal: 0,
        tarifaEnergia: 0,
        tarifaTUSD: 0,
        tensaoRede: "127/220V",
        fase: "Bifásico",
        fatorSimultaneidade: 0,
        tipoEstrutura: "Fibrocimento",
        distancia: 0,
      },
    };
  }
  if (project.tipoProjeto == "OPERAÇÃO E MANUTENÇÃO") {
    return {
      projeto: {
        nome: project?.nome,
        id: project?._id,
      },
      premissas: {
        consumoEnergiaMensal: 0,
        tarifaEnergia: 0,
        distancia: 0,
      },
    };
  }
}

function PropostaPage() {
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  const {
    data: project,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useProject(
    typeof router.query.id === "string" ? router.query.id : "",
    checkQueryEnableStatus(session, router.query.id)
  );

  if (isLoading) return <LoadingPage />;
  if (error) {
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col items-center justify-center overflow-x-hidden bg-[#f8f9fa]">
          <p>Oops, houve um erro ao acessar essa página.</p>
        </div>
      </div>
    );
  }
  if (isSuccess) {
    if (project.idSolicitacaoContrato)
      return (
        <div className="flex h-full flex-col md:flex-row">
          <Sidebar />
          <div className="flex w-full max-w-full grow flex-col items-center justify-center overflow-x-hidden bg-[#f8f9fa]">
            <p className="text-center text-lg italic text-gray-500">
              Oops, parece que já existe uma solicitação de contrato para esse
              projeto e, portanto, criação novas propostas não é permitido.
            </p>
            <p className="text-center text-lg italic text-gray-500">
              Crie um novo projeto, ou requisite a inativação do formulário
              anterior.
            </p>
            <Link href={`/projeto/id/${project._id}`}>
              <p className="text-center text-lg italic text-blue-300 underline hover:text-blue-500">
                Voltar à página do projeto
              </p>
            </Link>
          </div>
        </div>
      );
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa]">
          <div className="flex h-[70px] w-full items-center justify-around bg-black">
            <div className="flex flex-col items-center">
              <h1 className="text-sm text-gray-400">CLIENTE</h1>
              <h1 className="font-bold text-white">{project.nome}</h1>
            </div>
            <div className="hidden flex-col items-center lg:flex">
              <h1 className="text-sm text-gray-400">CÓD. DO PROJETO</h1>
              <h1 className="font-bold text-white">
                # {project.identificador}
              </h1>
            </div>
            {/* <div className="flex flex-col items-center">
              <h1 className="text-sm text-gray-400">CÓD.PROPOSTA</h1>
              <h1 className="font-bold text-white">#1</h1>
            </div> */}
            <div className="hidden flex-col items-center lg:flex">
              <h1 className="text-sm text-gray-400">RESPONSÁVEL</h1>
              <h1 className="font-bold text-white">
                {project.responsavel.nome}
              </h1>
            </div>
            <div className="hidden flex-col items-center lg:flex">
              <h1 className="text-sm text-gray-400">REPRESENTANTE</h1>
              <h1 className="font-bold text-white">
                {project.representante.nome}
              </h1>
            </div>
          </div>
          {project.tipoProjeto == "OPERAÇÃO E MANUTENÇÃO" ? (
            <OeMPropose project={project} />
          ) : null}
          {project.tipoProjeto == "SISTEMA FOTOVOLTAICO" ? (
            <SolarSystemPropose project={project} />
          ) : null}
          {/* <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
            <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-5 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-1">
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
                <SlEnergy style={{ fontSize: "23px" }} />
                <p className="text-sm font-bold lg:text-lg">SISTEMA</p>
              </div>
              <div
                className={`flex items-center justify-center gap-1 ${
                  proposeStage == 3 ? "text-[#15599a]" : "text-gray-600"
                } `}
              >
                <MdSell style={{ fontSize: "23px" }} />
                <p className="text-sm font-bold lg:text-lg">VENDA</p>
              </div>
              <div
                className={`flex items-center justify-center gap-1 ${
                  proposeStage == 5 ? "text-[#15599a]" : "text-gray-600"
                } `}
              >
                <MdAttachMoney style={{ fontSize: "23px" }} />
                <p className="text-sm font-bold lg:text-lg">FINANCEIRO</p>
              </div>
              <div
                className={`flex items-center justify-center gap-1 ${
                  proposeStage == 4 ? "text-[#15599a]" : "text-gray-600"
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
              />
            ) : null}
            {proposeStage == 4 ? (
              <Propose
                proposeInfo={proposeInfo}
                setProposeInfo={setProposeInfo}
                project={project}
              />
            ) : null}
          </div> */}
        </div>
      </div>
    );
  }
}

export default PropostaPage;
