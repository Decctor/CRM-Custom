import { useEffect, useState } from "react";
import DropdownSelect from "@/components/Inputs/DropdownSelect";
import { Sidebar } from "@/components/Sidebar";
import FunnelList from "@/components/dnd/FunnelList";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import LoadingPage from "@/components/utils/LoadingPage";
import { Funnel } from "../utils/models";
import { funnels } from "@/utils/constants";
import {
  useProjects,
  useRepresentatives,
  useResponsibles,
} from "@/utils/methods";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { IProject, IResponsible } from "@/utils/models";
import { Session } from "next-auth";
import { IoIosCalendar } from "react-icons/io";
import PeriodDropdownFilter from "@/components/Inputs/PeriodDropdownFilter";
import { AiOutlinePlus } from "react-icons/ai";
import NewProject from "@/components/Modals/NewProject";
import dayjs from "dayjs";
import Project from "@/components/Cards/Project";
import SeachProjects from "@/components/ProjectBlocks/SeachProjects";
import Link from "next/link";

type Options = {
  activeResponsible: string | null;
  activeFunnel: number | null;
  responsibleOptions:
    | {
        id: string;
        label: string;
        value: string;
      }[]
    | null;
  funnelOptions:
    | {
        id: number;
        label: string;
        value: number;
      }[]
    | null;
};
type UpdateObjFunnelStage = {
  updateObjId: string;
  funnelId: string;
  newStageId: string;
  responsibleId: string;
};
type DateFilterType = {
  after: string | undefined;
  before: string | undefined;
};
function getStageProjects(
  funnelId: number | null,
  stageId: number,
  projects: IProject[] | undefined
) {
  if (projects) {
    let stageProjects = projects.filter(
      (project) =>
        project.funis?.filter((funnel) => funnel.id == funnelId)[0].etapaId ==
        stageId
    );
    return stageProjects;
  } else return [];
}
function getOptions(
  session: Session | null,
  responsibles: IResponsible[] | undefined
) {
  var options: Options = {
    activeResponsible: null,
    activeFunnel: null,
    responsibleOptions: null,
    funnelOptions: null,
  };
  if (!session || !responsibles) return options;
  if (session.user.visibilidade == "GERAL") {
    options.activeResponsible = null;
    options.responsibleOptions = responsibles.map((resp) => {
      return {
        id: resp.id,
        label: resp.nome,
        value: resp.id,
      };
    });
  }
  if (session.user.visibilidade == "PRÓPRIA") {
    var filteredResponsibles = responsibles.filter(
      (responsible) => responsible.id == session.user.id
    );
    options.activeResponsible = session.user.id;
    options.responsibleOptions = filteredResponsibles.map((resp) => {
      return {
        id: resp.id,
        label: resp.nome,
        value: resp.id,
      };
    });
  }
  if (typeof session.user.visibilidade == "object") {
    var filteredResponsibles = responsibles.filter(
      (responsible) =>
        session.user.visibilidade.includes(responsible.id) ||
        responsible.id == session.user.id
    );
    options.activeResponsible = session.user.id;
    options.responsibleOptions = filteredResponsibles.map((resp) => {
      return {
        id: resp.id,
        label: resp.nome,
        value: resp.id,
      };
    });
  }
  if (session.user.funisVisiveis == "TODOS") {
    options.activeFunnel = 1;
    options.funnelOptions = funnels.map((funnel) => {
      return {
        id: funnel.id,
        label: funnel.nome,
        value: funnel.id,
      };
    });
  } else {
    var filteredFunnels: Funnel[] | [] = [];
    const allFunnels: Funnel[] = funnels;
    filteredFunnels = allFunnels.filter(
      (funnel) =>
        session.user.funisVisiveis != "TODOS" &&
        session.user.funisVisiveis.includes(funnel.id)
    );
    options.activeFunnel = filteredFunnels[0] ? filteredFunnels[0].id : null;
    options.funnelOptions = filteredFunnels.map((funnel) => {
      return {
        id: funnel.id,
        label: funnel.nome,
        value: funnel.id,
      };
    });
  }
  return options;
}

export default function Home() {
  const queryClient = useQueryClient();
  const [newProjectModalIsOpen, setNewProjectModalIsOpen] =
    useState<boolean>(false);
  const { data: session, status } = useSession({ required: true });

  const { data: responsibles } = useResponsibles();

  const [responsible, setResponsible] = useState<string | null>(
    getOptions(session, responsibles).activeResponsible
  );
  const [dateParam, setDateParam] = useState<DateFilterType>({
    after: undefined,
    before: undefined,
  });
  const [funnel, setFunnel] = useState<number | null>(
    getOptions(session, responsibles).activeFunnel
  );
  const { data: projects, isLoading: projectsLoading } = useProjects(
    funnel,
    responsible,
    dateParam.after,
    dateParam.before,
    session
  );

  const { mutate } = useMutation({
    mutationKey: ["updateObjFunnelStage"],
    mutationFn: async (info: UpdateObjFunnelStage) => {
      try {
        await axios.put("/api/projects/funnel", info);
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          return;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          return;
        }
      }
    },
    onMutate: async (variables) => {
      // Getting current projects snapshot
      const projectsSnapshot: any = queryClient.getQueryData([
        "projects",
        funnel,
        responsible,
        dateParam.after,
        dateParam.before,
      ]);
      // Updating project reference
      let project = projectsSnapshot.filter(
        (x: any) => x._id == variables.updateObjId
      )[0];
      let indexOfProject = projectsSnapshot
        .map((e: any) => e._id)
        .indexOf(variables.updateObjId);
      project.funis[variables.funnelId].etapaId = Number(variables.newStageId);
      // Generating NewProjects array
      const newProjects = [...projectsSnapshot];
      newProjects[indexOfProject] = project;
      queryClient.setQueryData(["projects", funnel, responsible], newProjects);

      // Returning snapshot as context for OnSuccess or OnError
      return { projectsSnapshot };
    },
    onError: async (err, variables, context) => {
      queryClient.setQueryData(
        ["projects", funnel, responsible],
        context?.projectsSnapshot
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId == source.droppableId) return;

    let project = projects?.filter((x) => x._id == draggableId)[0];
    if (project && funnel) {
      const setOfFunnelsInProject = project.funis?.map((funnel) => funnel.id);
      const indexOfFunnelInProject = setOfFunnelsInProject?.indexOf(funnel);
      const projectResponsibleId = project.responsavel.id;
      console.log("INDEX", indexOfFunnelInProject);
      const newStageId = destination.droppableId;
      if (indexOfFunnelInProject != undefined) {
        mutate({
          updateObjId: draggableId,
          funnelId: indexOfFunnelInProject.toString(),
          newStageId: newStageId,
          responsibleId: projectResponsibleId,
        });
      }
    }
    console.log("PROJETO", project);
    console.log("ON DRAG END", result);
    let add;
    let active;
  }

  useEffect(() => {
    if (!funnel) {
      setFunnel(getOptions(session, responsibles).activeFunnel);
    }
    if (!responsible) {
      setResponsible(getOptions(session, responsibles).activeResponsible);
    }
  }, [session, responsibles]);

  if (status == "loading") return <LoadingPage />;
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex flex-col items-center border-b border-[#fead61] pb-2 xl:flex-row">
          <div className="flex font-Poppins text-2xl font-bold text-[#fead61]">
            FUNIL
          </div>
          <div className="flex grow flex-col items-center justify-end  gap-2 xl:flex-row">
            <button
              onClick={() => setNewProjectModalIsOpen(true)}
              className="flex h-[40px] min-w-[250px] items-center justify-center gap-2 rounded-md border bg-[#15599a] p-2 text-sm font-medium text-white shadow-sm duration-300 ease-in-out hover:scale-105"
            >
              <p>Novo Projeto</p>
              <AiOutlinePlus style={{ fontSize: "18px" }} />
            </button>
            <PeriodDropdownFilter
              initialAfter={dateParam.after}
              initialBefore={dateParam.before}
              setDateParam={setDateParam}
            />
            <DropdownSelect
              categoryName="Usuários"
              selectedItemLabel="Todos"
              value={responsible}
              options={getOptions(session, responsibles).responsibleOptions}
              onChange={(selected) => setResponsible(selected.value)}
              onReset={() => {
                if (session.user.visibilidade == "GERAL") {
                  setResponsible(null);
                } else {
                  setResponsible(session.user.id);
                }
              }}
              width="350px"
            />
            {/**
                responsibles
                  ? responsibles.map((resp) => {
                      return {
                        id: resp.id,
                        label: resp.nome,
                        value: resp.id,
                      };
                    })
                  : null */}
            <DropdownSelect
              categoryName="Funis"
              selectedItemLabel="NÃO DEFINIDO"
              value={funnel}
              options={getOptions(session, responsibles).funnelOptions}
              onChange={(selected) => setFunnel(selected.value)}
              onReset={() => setFunnel(1)}
              width="350px"
            />
            <SeachProjects />
          </div>
        </div>
        <div className="flex w-full grow flex-wrap justify-between gap-2 py-2">
          {projects && projects.length > 0
            ? projects.map((project) => (
                <Project
                  key={project._id}
                  item={{
                    id: project._id ? project._id : "",
                    name: project.nome,
                    identificador: project.identificador,
                    responsavel: project.responsavel.nome,
                    responsavel_avatar: responsibles?.filter(
                      (resp) => resp.id == project.responsavel.id
                    )[0].avatar_url,
                    atividades: project.atividades,
                    nomeProposta:
                      project.proposta && project.proposta?.length > 0
                        ? project.proposta[0].nome
                        : undefined,
                    valorProposta:
                      project.proposta && project.proposta?.length > 0
                        ? project.proposta[0].valorProposta
                        : undefined,
                    potenciaPicoProposta:
                      project.proposta && project.proposta?.length > 0
                        ? project.proposta[0].potenciaPico
                        : undefined,
                    efetivacao: project.efetivacao,
                    assinado: project.assinado,
                  }}
                />
              ))
            : null}
        </div>
        {/* {session ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="mt-2 flex w-full grow overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              {projectsLoading ? (
                <LoadingComponent />
              ) : funnels.filter((funn) => funn.id == funnel)[0] ? (
                funnels
                  .filter((funn) => funn.id == funnel)[0]
                  .etapas.map((stage) => (
                    <FunnelList
                      key={stage.id}
                      id={stage.id}
                      stageName={stage.nome}
                      items={getStageProjects(funnel, stage.id, projects).map(
                        (item, index) => {
                          return {
                            id: item._id ? item._id : "",
                            name: item.nome,
                            responsavel: item.responsavel.nome,
                            responsavel_avatar: responsibles?.filter(
                              (resp) => resp.id == item.responsavel.id
                            )[0].avatar_url,
                            atividades: item.atividades,
                            nomeProposta:
                              item.proposta && item.proposta?.length > 0
                                ? item.proposta[0].nome
                                : undefined,
                            valorProposta:
                              item.proposta && item.proposta?.length > 0
                                ? item.proposta[0].valorProposta
                                : undefined,
                            potenciaPicoProposta:
                              item.proposta && item.proposta?.length > 0
                                ? item.proposta[0].potenciaPico
                                : undefined,
                            efetivacao: item.efetivacao,
                          };
                        }
                      )}
                    />
                  ))
              ) : null}
            </div>
          </DragDropContext>
        ) : null} */}
        <Link
          href={
            "https://forms.office.com/Pages/ResponsePage.aspx?id=8eMER-Xc8UymdamsboG6_zOKWJXTTFJBqfYnVlq8djNUOVA3MTdBNzYwQldIUlNFTFNZWTJBVk9LRS4u"
          }
        >
          <div className="fixed bottom-10 right-[30px] cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
            <p className="text-xs font-bold uppercase">Sugestões</p>
          </div>
        </Link>
        {/* <Link href={"https://wa.me/55XXXXXXXXXXX"}>
          <div className="fixed bottom-10 right-[140px] cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
            <p className="text-xs font-bold uppercase">Suporte</p>
          </div>
        </Link> */}
      </div>
      {newProjectModalIsOpen ? (
        <NewProject
          responsibles={responsibles ? responsibles : []}
          closeModal={() => setNewProjectModalIsOpen(false)}
        />
      ) : null}
    </div>
  );
}
