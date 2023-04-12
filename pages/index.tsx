import { useState } from "react";
import DropdownSelect from "@/components/Inputs/DropdownSelect";
import { Sidebar } from "@/components/Sidebar";
import FunnelList from "@/components/dnd/FunnelList";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import NewClientModal from "@/components/Modals/NewClient";
import LoadingPage from "@/components/utils/LoadingPage";
import { funnels } from "@/utils/constants";
import { useResponsibles } from "@/utils/methods";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { IProject } from "@/utils/models";

{
  // Exemplo de mutation com tratamento de erros
  /**
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      try {
        let { data } = await axios.post("/api/test", {
          nome: "Lucas",
          email: "email",
          role: "ADMIN",
        });
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
  }); */
}
function getStageProjects(
  funnelId: number,
  stageId: number,
  projects: IProject[]
) {
  let stageProjects = projects.filter(
    (project) =>
      project.funis?.filter((funnel) => funnel.id == funnelId)[0].etapaId ==
      stageId
  );
  return stageProjects;
}

export default function Home() {
  const { data, status } = useSession({ required: true });
  const [responsible, setResponsible] = useState<string | null>(null);
  const [funnel, setFunnel] = useState<number>(1);

  const { data: responsibles } = useResponsibles();
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", funnel, responsible],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `/api/projects?responsible=${responsible}&funnel=${funnel}`
        );
        return data.data;
      } catch (error) {
        toast.error(
          "Erro ao buscar informações desse cliente. Por favor, tente novamente mais tarde."
        );
      }
    },
  });

  const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState(false);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (destination.droppableId == source.droppableId) return;
    console.log("ON DRAG END", result);
    let add;
    let active;
  }

  console.log(projects);
  if (status == "loading") return <LoadingPage />;
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex flex-col items-center justify-between border-b border-[#fead61] pb-2 xl:flex-row">
          <div className="flex font-['Roboto'] text-2xl font-bold text-[#fead61]">
            FUNIL
          </div>
          <div className="flex flex-col items-center gap-2 xl:flex-row">
            {/*<button
              onClick={() => setNewProjectModalIsOpen(true)}
              className="flex h-[40px] min-w-[250px] items-center justify-center gap-2 rounded-md border bg-[#15599a] p-2 text-sm font-medium text-white shadow-sm duration-300 ease-in-out hover:scale-105"
            >
              <p>Novo Projeto</p>
              <AiOutlinePlus style={{ fontSize: "18px" }} />
            </button> */}
            <DropdownSelect
              categoryName="Usuários"
              selectedItemLabel="Todos"
              value={responsible}
              options={
                responsibles
                  ? responsibles.map((resp) => {
                      return {
                        id: resp.id,
                        label: resp.nome,
                        value: resp.id,
                      };
                    })
                  : null
              }
              onChange={(selected) => setResponsible(selected.value)}
              onReset={() => setResponsible(null)}
              width="350px"
            />
            <DropdownSelect
              categoryName="Funis"
              selectedItemLabel="PADRÃO"
              value={funnel}
              options={funnels.map((funnel) => {
                return {
                  id: funnel.id,
                  label: funnel.nome,
                  value: funnel.id,
                };
              })}
              onChange={(selected) => setFunnel(selected.value)}
              onReset={() => setFunnel(1)}
              width="350px"
            />
          </div>
        </div>
        {data ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="mt-2 flex w-full grow overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              {projectsLoading ? (
                <LoadingComponent />
              ) : (
                funnels
                  .filter((funn) => funn.id == funnel)[0]
                  .etapas.map((stage) => (
                    <FunnelList
                      key={stage.id}
                      stageName={stage.nome}
                      items={getStageProjects(funnel, stage.id, projects).map(
                        (item, index) => {
                          return {
                            id: index,
                            name: item.nome,
                          };
                        }
                      )}
                    />
                  ))
              )}
              {/* <FunnelList
                stageName="APRESENTAÇÃO DE PROPOSTA"
                items={[
                  { id: "11a2141kkoa", name: "LUCAS" },
                  { id: "12adçaddadmja", name: "ADRIANO" },
                  { id: "13sakaosa", name: "NATHAN" },
                ]}
              />
              <FunnelList
                stageName="PARA ATENDER"
                items={[
                  { id: "14asiwjqw", name: "ANA" },
                  { id: "15aavab", name: "MATHEUS" },
                  { id: "16a141adhau", name: "JOÃO" },
                  { id: "17apdppoeqj", name: "MARIA" },
                  { id: "adajdi131231", name: "ISA" },
                  { id: "421kjaidjai", name: "BIA" },
                ]}
              /> */}
            </div>
          </DragDropContext>
        ) : null}
      </div>
      {/* {newProjectModalIsOpen ? (
        <NewClientModal closeModal={() => setNewProjectModalIsOpen(false)} />
      ) : null} */}
    </div>
  );
}
