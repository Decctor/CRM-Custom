import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { use, useState } from "react";
import { toast } from "react-hot-toast";
import { GoKebabVertical } from "react-icons/go";
import { Sidebar } from "@/components/Sidebar";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { IClient, IProject, IProposeInfo } from "@/utils/models";
import {
  AiFillCloseCircle,
  AiFillEdit,
  AiOutlineStar,
  AiOutlineUser,
} from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import {
  BsClipboardCheck,
  BsFillCalendarCheckFill,
  BsPatchCheckFill,
  BsTelephoneFill,
} from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";
import { HiIdentification } from "react-icons/hi";
import Image from "next/image";
import TextInput from "@/components/Inputs/TextInput";
import DateInput from "@/components/Inputs/DateInput";
import dayjs from "dayjs";
import SelectInput from "@/components/Inputs/SelectInput";
import { VscChromeClose } from "react-icons/vsc";
import {
  checkQueryEnableStatus,
  formatDate,
  useProject,
  useRepresentatives,
  useResponsibles,
  useTechnicalAnalysis,
} from "@/utils/methods";
import DetailsBlock from "@/components/ProjectBlocks/DetailsBlock";
import { TbNotes } from "react-icons/tb";
import ProjectHistoryBlock from "@/components/ProjectBlocks/ProjectHistoryBlock";
import Link from "next/link";
import DropdownSelect from "@/components/Inputs/DropdownSelect";
import LoseProject from "@/components/ProjectBlocks/LoseProject";
import EditClient from "@/components/Modals/EditClient";
import EditClientSimplified from "@/components/Modals/EditClientSimplified";
import ProposeListBlock from "@/components/ProjectBlocks/ProposeListBlock";
import TechAnalysisListBlock from "@/components/ProjectBlocks/TechAnalysisListBlock";

function Projeto() {
  const { data: session } = useSession({
    required: true,
  });
  const { query } = useRouter();
  const queryClient = useQueryClient();

  const [blockMode, setBlockMode] = useState<"PROPOSES" | "TECHNICAL ANALYSIS">(
    "PROPOSES"
  );
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const [editModalInfo, setEditModalInfo] = useState<IClient | null>();
  const { data: representatives = [] } = useRepresentatives();

  const {
    data: project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
    isError: projectError,
  } = useProject(
    typeof query.id === "string" ? query.id : "",
    checkQueryEnableStatus(session, query.id)
  );
  const {
    data: technicalAnalysis,
    isFetching: fetchingTechAnalysis,
    isSuccess: successTechAnalysis,
  } = useTechnicalAnalysis(
    project?.identificador,
    checkQueryEnableStatus(session, project?.identificador),
    "TODOS"
  );
  const {
    data: projectProposes,
    isLoading: projectProposesLoading,
    isSuccess: projectProposesSuccess,
    isError: projectProposesError,
  } = useQuery<IProposeInfo[]>({
    queryKey: ["projectProposes", project?._id],
    queryFn: async (): Promise<IProposeInfo[]> => {
      try {
        const { data } = await axios.get(
          `/api/proposes?projectId=${project?._id}`
        );
        console.log(data);
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          throw error;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          throw error;
        }
        throw error;
      }
    },
    enabled: !!project,
  });
  if (projectLoading) return <LoadingComponent />;

  if (projectError)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col items-center justify-center overflow-x-hidden bg-[#f8f9fa] p-6">
          <p className="text-lg italic text-gray-700">
            Oops, houve um erro no carregamento das informações do projeto em
            questão.
          </p>
        </div>
      </div>
    );
  if (projectSuccess)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#393E46] p-6">
          <div className="flex w-full flex-col items-center justify-between border-b border-[#fead61] pb-2 lg:flex-row">
            <div className="flex w-full flex-col items-start">
              <div className="flex w-full flex-col items-center gap-2 lg:w-fit lg:flex-row">
                <h1 className="flex text-center font-Raleway text-2xl font-bold text-[#fead41] lg:text-start">
                  {project.identificador}
                </h1>
                <h1 className="flex text-center font-Raleway text-2xl font-bold text-white lg:text-start">
                  {project.nome}
                </h1>
              </div>

              <p className="w-full text-start text-xs italic text-gray-300">
                {project.descricao}
              </p>
            </div>
            <div className="mt-4 flex w-full flex-col items-center gap-4 lg:mt-0 lg:w-fit lg:flex-row">
              {project.dataPerda ||
              !!project.solicitacaoContrato ||
              !!project.contrato ? null : (
                <LoseProject
                  oportunityId={project.idOportunidade}
                  responsibleId={project.responsavel.id}
                  projectId={project._id ? project._id : ""}
                />
              )}
              {project.dataPerda ? (
                <div className="flex items-center gap-2 rounded bg-red-500 p-2 text-sm font-medium italic text-white">
                  PERDIDO
                  <AiFillCloseCircle />
                </div>
              ) : null}
              {project.solicitacaoContrato ? (
                <div className="flex w-[80%] min-w-[200px] flex-col items-center rounded-md  bg-[#fead41] p-2 shadow-md lg:w-fit">
                  <h1 className="text-center font-Raleway text-xs font-bold text-black">
                    CONTRATO SOLICITADO
                  </h1>

                  <div className="flex items-center justify-center gap-2">
                    <BsPatchCheckFill
                      style={{ color: "#000", fontSize: "15px" }}
                    />
                    <p className="text-center text-xs font-bold text-black">
                      {project.solicitacaoContrato
                        ? dayjs(project.solicitacaoContrato.dataSolicitacao)
                            .add(3, "hours")
                            .format("DD/MM/YYYY")
                        : "-"}
                    </p>
                  </div>
                </div>
              ) : null}
              {project.contrato ? (
                <div className="flex min-w-[200px] flex-col items-center  rounded-md bg-green-400 p-2 shadow-md">
                  <h1 className="text-center font-Raleway text-xs font-bold text-black">
                    CONTRATO ASSINADO
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    <BsFillCalendarCheckFill
                      style={{ color: "#000", fontSize: "15px" }}
                    />
                    <p className="text-center text-xs font-bold text-black">
                      {dayjs(project.contrato.dataAssinatura)
                        .add(3, "hours")
                        .format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-6 py-4 lg:flex-row">
            <div className="flex h-[300px] w-full flex-col rounded-md border border-gray-600 bg-[#27374D] p-3 shadow-lg lg:h-[230px] lg:w-[40%]">
              <div className="flex h-[40px] items-center justify-between border-b border-gray-600 pb-2">
                <h1 className="font-bold text-white">Dados do Cliente</h1>
                <div
                  onClick={() => {
                    setEditModalInfo(project.cliente);
                    setEditModalIsOpen(true);
                  }}
                  className="cursor-pointer text-lg text-[#fbcb83] duration-300 ease-in-out hover:scale-110"
                >
                  <AiFillEdit />
                </div>
              </div>
              <div className="mt-3 flex w-full grow flex-col gap-1 lg:flex-row">
                <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <AiOutlineUser
                      style={{ color: "#fbcb83", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-200">
                      {project.cliente ? project.cliente.nome : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <MdEmail style={{ color: "#fbcb83", fontSize: "20px" }} />
                    <p className="break-all font-Poppins text-sm text-gray-200">
                      {project.cliente ? project.cliente.email : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <BsTelephoneFill
                      style={{ color: "#fbcb83", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-200">
                      {project.cliente ? project.cliente.telefonePrimario : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <HiIdentification
                      style={{ color: "#fbcb83", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-200">
                      {project.cliente ? project.cliente.cpfCnpj : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <FaCity style={{ color: "#fbcb83", fontSize: "20px" }} />
                    <p className="font-Poppins text-sm text-gray-200">
                      {project.cliente
                        ? `${project.cliente.cidade} (${project.cliente.uf})`
                        : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <GiPositionMarker
                      style={{ color: "#fbcb83", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-200">
                      {project.cliente
                        ? `${project.cliente.endereco} - ${project.cliente.numeroOuIdentificador},  ${project.cliente.bairro}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {blockMode == "PROPOSES" ? (
              <ProposeListBlock
                city={project.cliente?.cidade}
                uf={project.cliente?.uf}
                projectId={project._id ? project._id : ""}
                projectProposes={projectProposes ? projectProposes : []}
                projectProposesSuccess={projectProposesSuccess}
                projectProposesLoading={projectProposesLoading}
                projectProposesError={projectProposesError}
                idActivePropose={project.propostaAtiva}
                setBlockMode={setBlockMode}
                contractSigned={!!project.contrato?.id}
              />
            ) : null}
            {blockMode == "TECHNICAL ANALYSIS" ? (
              <TechAnalysisListBlock
                project={project}
                technicalAnalysis={technicalAnalysis}
                fetchingTechAnalysis={fetchingTechAnalysis}
                successTechAnalysis={successTechAnalysis}
                setBlockMode={setBlockMode}
              />
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            {project._id ? (
              <div className="w-full lg:w-[40%]">
                <DetailsBlock
                  info={project}
                  session={session}
                  projectId={project._id}
                />
              </div>
            ) : null}
            {project._id ? (
              <div className="w-full lg:w-[60%]">
                <ProjectHistoryBlock
                  projectId={project._id}
                  session={session}
                />
              </div>
            ) : null}
          </div>
        </div>
        {editModalIsOpen && editModalInfo ? (
          <EditClientSimplified
            client={editModalInfo}
            representatives={representatives}
            closeModal={() => {
              setEditModalInfo(null);
              setEditModalIsOpen(false);
            }}
            projectId={project._id ? project._id : ""}
            responsibleId={project.responsavel.id}
            editPermission={
              session?.user.id == editModalInfo.representante?.id ||
              session?.user.id == project.responsavel.id ||
              session?.user.permissoes.clientes.editar == true
            }
          />
        ) : null}
        {/* <div className="fixed bottom-10 right-[30px] cursor-pointer rounded-lg bg-[#fbcb83] p-3 text-white hover:bg-[#fead61] hover:text-[#fbcb83]">
          <p className="text-xs font-bold uppercase">ABRIR CHAMADO</p>
        </div> */}
      </div>
    );
}

export default Projeto;
