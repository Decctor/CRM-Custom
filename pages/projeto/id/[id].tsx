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
  BsTelephoneFill,
} from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";
import { HiIdentification } from "react-icons/hi";
import SleepyVolts from "../../../utils/sleepVolts.svg";
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

function Projeto() {
  const { data: session } = useSession({
    required: true,
  });
  const { query } = useRouter();
  const queryClient = useQueryClient();

  const [blockMode, setBlockMode] = useState<"PROPOSES" | "DOCUMENTS">(
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
      <div className="flex h-full">
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
      <div className="flex h-full">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex w-full flex-col items-center justify-between border-b border-[#fead61] pb-2 lg:flex-row">
            <div className="flex w-full flex-col items-start">
              <div className="flex w-full flex-col items-center gap-2 lg:w-fit lg:flex-row">
                <h1 className="flex text-center font-Raleway text-2xl font-bold text-[#fead41] lg:text-start">
                  {project.identificador}
                </h1>
                <h1 className="flex text-center font-Raleway text-2xl font-bold text-blue-900 lg:text-start">
                  {project.nome}
                </h1>
              </div>

              <p className="w-full text-start text-xs italic text-gray-500">
                {project.descricao}
              </p>
            </div>
            <div className="flex items-center justify-center">
              {project.dataPerda || project.dataEfetivacao ? null : (
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
              {project.assinado && project.dataAssinatura ? (
                <div className="flex w-fit min-w-[250px] items-center justify-end gap-5 text-green-500">
                  <BsFillCalendarCheckFill
                    style={{ color: "rgb(34,197,94)", fontSize: "25px" }}
                  />
                  <div className="flex flex-col items-center">
                    <p className="text-center text-sm italic text-gray-500">
                      Assinado em:
                    </p>
                    <p className="text-md text-center font-medium text-gray-500">
                      {dayjs(project.dataAssinatura).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-6 py-4 lg:flex-row">
            <div className="flex h-[300px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:h-[230px] lg:w-[40%]">
              <div className="flex h-[40px] items-center justify-between border-b border-gray-200 pb-2">
                <h1 className="font-bold text-black">Dados do Cliente</h1>
                <div
                  onClick={() => {
                    setEditModalInfo(project.cliente);
                    setEditModalIsOpen(true);
                  }}
                  className="cursor-pointer text-lg text-[#15599a] duration-300 ease-in-out hover:scale-110"
                >
                  <AiFillEdit />
                </div>
              </div>
              <div className="mt-3 flex w-full grow flex-col gap-1 lg:flex-row">
                <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <AiOutlineUser
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.nome : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <MdEmail style={{ color: "#15599a", fontSize: "20px" }} />
                    <p className="break-all font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.email : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <BsTelephoneFill
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.telefonePrimario : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <HiIdentification
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.cpfCnpj : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <FaCity style={{ color: "#15599a", fontSize: "20px" }} />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente
                        ? `${project.cliente.cidade} (${project.cliente.uf})`
                        : "-"}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                    <GiPositionMarker
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente
                        ? `${project.cliente.endereco} - ${project.cliente.numeroOuIdentificador},  ${project.cliente.bairro}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex h-[230px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:w-[60%]">
              <div className="flex  h-[40px] items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center justify-center gap-10">
                  <h1 className="w-[120px] cursor-pointer border-b border-blue-500 p-1 text-center font-bold text-black hover:border-blue-500">
                    Propostas
                  </h1>
                </div>
                <Link href={`/projeto/proposta/${project._id}`}>
                  <button className="rounded bg-green-600 p-1 text-sm font-bold text-white">
                    GERAR PROPOSTA
                  </button>
                </Link>
              </div>
              <div className="overscroll-y mt-3 flex w-full grow flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="flex h-[30px] min-h-[30px] w-full items-center rounded bg-black">
                  <h1 className="w-1/4 text-center text-white">NOME</h1>
                  <h1 className="w-1/4 text-center text-white">POTÊNCIA</h1>
                  <h1 className="w-1/4 text-center text-white">VALOR</h1>
                  <h1 className="w-1/4 text-center text-white">
                    DATA INSERÇÃO
                  </h1>
                </div>
                {projectProposesSuccess ? (
                  projectProposes.length > 0 ? (
                    projectProposes.map((propose, index) => (
                      <div key={index} className="flex w-full items-center">
                        <div className="flex w-1/4 items-center justify-center gap-2">
                          {propose._id == project.propostaAtiva ? (
                            <AiOutlineStar style={{ color: "#15599a" }} />
                          ) : null}
                          <Link href={`/proposta/${propose._id}`}>
                            <h1 className="text-center hover:text-blue-400">
                              {propose.nome}
                            </h1>
                          </Link>
                        </div>

                        <h1 className="w-1/4 text-center">
                          {propose.potenciaPico?.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          kWp
                        </h1>
                        <h1 className="w-1/4 text-center">
                          R${" "}
                          {propose.valorProposta?.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </h1>
                        <h1 className="w-1/4 text-center">
                          {propose.dataInsercao
                            ? dayjs(propose.dataInsercao).format("DD/MM/YYYY")
                            : null}
                        </h1>
                      </div>
                    ))
                  ) : (
                    <p className="flex grow items-center justify-center italic text-gray-500">
                      Sem propostas vinculadas a esse projeto.
                    </p>
                  )
                ) : null}
                {projectLoading ? (
                  <div className="flex grow items-center justify-center">
                    <LoadingComponent />
                  </div>
                ) : null}
                {projectProposesError ? (
                  <p className="flex grow items-center justify-center italic text-gray-500">
                    Oops, houve um erro na busca das propostas desse projeto.
                    Tente recarregar a página.
                  </p>
                ) : null}
              </div>
            </div> */}
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
          />
        ) : null}
      </div>
    );
}

export default Projeto;
