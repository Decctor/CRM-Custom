import { ISession, ProjectActivity, ProjectNote } from "@/utils/models";
import React, { useState } from "react";
import { BsClipboardCheck } from "react-icons/bs";
import { TbNotes } from "react-icons/tb";
import SelectInput from "../Inputs/SelectInput";
import dayjs from "dayjs";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import LoadingComponent from "../utils/LoadingComponent";
import { FaUser } from "react-icons/fa";
import { IoIosCalendar } from "react-icons/io";
import { useResponsibleInfo } from "@/utils/methods";
import NoteCard from "./NoteCard";
import ActivityBlock from "./ActivityCard";
import TextInput from "../Inputs/TextInput";

type ProjectHistoryBlockProps = {
  projectId: string | undefined;
  session: ISession | null;
};
function ProjectHistoryBlock({ projectId, session }: ProjectHistoryBlockProps) {
  const [newEvent, setNewEvent] = useState<ProjectActivity | ProjectNote>({
    categoria: null,
    titulo: "",
    tipo: "LIGAÇÃO",
    dataVencimento: new Date().toISOString(),
    observacoes: "",
  });
  const [view, setView] = useState<"HISTORY" | "NEW NOTE" | "NEW ACTIVITY">(
    "HISTORY"
  );
  const queryClient = useQueryClient();

  const {
    data: history,
    isLoading: historyLoading,
    isSuccess: historySuccess,
    isError: historyError,
    status,
  }: UseQueryResult<
    {
      open: ProjectActivity[];
      closed: (ProjectActivity | ProjectNote)[];
    },
    Error
  > = useQuery({
    queryKey: ["projectEventsHistory", projectId],
    queryFn: async (): Promise<
      | {
          open: ProjectActivity[];
          closed: (ProjectActivity | ProjectNote)[];
        }
      | []
    > => {
      try {
        const { data, status } = await axios.get(
          `/api/projects/events?id=${projectId}`
        );
        if (status == 200) return data.data;
        else return [];
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          return [];
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          return [];
        }
        return [];
      }
    },
  });
  const { mutate: createEvent } = useMutation({
    mutationKey: ["createEvent"],
    mutationFn: async () => {
      try {
        const { data } = await axios.post("/api/projects/events", {
          ...newEvent,
          responsavelId: session?.user.id,
          projetoId: projectId,
        });
        if (data.message) toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["projectEventsHistory", projectId],
        });
        setView("HISTORY");
        setNewEvent({
          categoria: null,
          titulo: "",
          tipo: "LIGAÇÃO",
          dataVencimento: new Date().toISOString(),
          observacoes: "",
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
  });
  console.log(history);
  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg">
      <div className="flex h-fit flex-col items-center justify-between border-b border-gray-200 pb-2 lg:h-[40px] lg:flex-row">
        <h1 className="font-bold text-black">Histórico</h1>
        <div className="mt-2 flex w-full grow flex-col items-center justify-end gap-2 lg:mt-0 lg:w-fit lg:flex-row">
          <button
            onClick={() => {
              setNewEvent((prev) => ({
                titulo: "",
                categoria: "ATIVIDADE",
                tipo: "LIGAÇÃO",
                dataVencimento: new Date().toISOString(),
                observacoes: "",
              }));
              setView("NEW ACTIVITY");
            }}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#15599a] p-1.5 font-medium text-white hover:bg-blue-800 lg:w-fit"
          >
            <BsClipboardCheck />
            <p className="text-xs font-normal">Nova Atividade</p>
          </button>
          <button
            onClick={() => {
              setNewEvent((prev) => ({
                categoria: "ANOTAÇÃO",
                anotacao: "",
              }));
              setView("NEW NOTE");
            }}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#15599a] p-1.5 font-medium text-white hover:bg-blue-800 lg:w-fit"
          >
            <TbNotes />
            <p className="text-xs font-normal">Nova Anotação</p>
          </button>
        </div>
      </div>
      {view == "HISTORY" ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full grow flex-col gap-1">
            {historySuccess ? (
              history.closed.length > 0 || history.open.length > 0 ? (
                <>
                  {history.open.length > 0 ? (
                    <div className="flex w-full flex-col gap-2">
                      <h1 className="w-full text-start font-medium">
                        Atividades em aberto
                      </h1>
                      {history.open.map((activity, index) => (
                        <ActivityBlock
                          key={index}
                          event={activity}
                          projectId={projectId ? projectId : ""}
                        />
                      ))}
                      <div className="my-4 h-1 w-full rounded bg-gray-300"></div>
                    </div>
                  ) : null}

                  {history.closed.length > 0
                    ? history.closed.map((event, index) => (
                        <>
                          {event.categoria == "ANOTAÇÃO" ? (
                            <NoteCard key={index} event={event} />
                          ) : null}
                          {event.categoria == "ATIVIDADE" ? (
                            <ActivityBlock
                              key={index}
                              event={event}
                              projectId={projectId ? projectId : ""}
                            />
                          ) : null}
                        </>
                      ))
                    : null}
                </>
              ) : (
                <p className="w-full grow text-center italic text-gray-500">
                  Nenhuma atividade vinculada a esse projeto foi encontrada...
                </p>
              )
            ) : null}
            {historyLoading ? <LoadingComponent /> : null}
            {historyError ? <div></div> : null}
            {/* {history ? (
              history.closed.length > 0 ? (
                history.closed.map((event, index) => (
                  <>
                    {event.categoria == "ANOTAÇÃO" ? (
                      <NoteCard key={index} event={event} />
                    ) : null}
                    {event.categoria == "ATIVIDADE" ? (
                      <ActivityBlock
                        key={index}
                        event={event}
                        projectId={projectId ? projectId : ""}
                      />
                    ) : null}
                  </>
                ))
              ) : (
                <div className="flex h-[50px] items-center justify-center">
                  <p className="text-sm italic text-gray-500">
                    Nenhuma atividade vinculada a esse projeto foi encontrada...
                  </p>
                </div>
              )
            ) : (
              <LoadingComponent />
            )} */}
          </div>
        </div>
      ) : null}
      {view == "NEW ACTIVITY" && newEvent.categoria == "ATIVIDADE" ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full grow flex-col gap-2">
            <TextInput
              label="TÍTULO DA ATIVIDADE"
              placeholder="Preencha o título da atividade."
              value={newEvent.titulo}
              handleChange={(value) =>
                setNewEvent((prev) => ({ ...prev, titulo: value }))
              }
              width="100%"
            />
            <div className="mt-2 flex flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-[50%]">
                <SelectInput
                  label="TIPO"
                  value={newEvent.tipo}
                  options={[
                    { id: 1, value: "LIGAÇÃO", label: "LIGAÇÃO" },
                    { id: 2, value: "REUNIÃO", label: "REUNIÃO" },
                    { id: 3, value: "VISITA TÉCNICA", label: "VISITA TÉCNICA" },
                  ]}
                  handleChange={(value) =>
                    setNewEvent((prev) => ({ ...prev, tipo: value }))
                  }
                  onReset={() =>
                    setNewEvent((prev) => ({ ...prev, tipo: "LIGAÇÃO" }))
                  }
                  selectedItemLabel="RESETAR"
                  width="100%"
                />
              </div>
              <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                <label
                  htmlFor={"DATAVENCIMENTO"}
                  className="font-sans font-bold  text-[#353432]"
                >
                  DATA DE VENCIMENTO
                </label>
                <input
                  value={
                    dayjs(newEvent.dataVencimento).isValid()
                      ? dayjs(newEvent.dataVencimento).format(
                          "YYYY-MM-DDTHH:mm"
                        )
                      : undefined
                  }
                  onChange={(e) => {
                    setNewEvent((prev) => ({
                      ...prev,
                      dataVencimento:
                        e.target.value != ""
                          ? new Date(e.target.value).toISOString()
                          : undefined,
                    }));
                  }}
                  id={"DATAVENCIMENTO"}
                  onReset={() =>
                    setNewEvent((prev) => ({
                      ...prev,
                      dataVencimento: undefined,
                    }))
                  }
                  type="datetime-local"
                  className="w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
                />
              </div>
            </div>
            <textarea
              value={newEvent.observacoes}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  observacoes: e.target.value,
                }))
              }
              placeholder="Observações sobre a atividade..."
              className="h-[80px] resize-none border border-gray-200 bg-gray-100 p-2 text-center outline-none"
            />
          </div>
          <div className="flex w-full items-center justify-end gap-3 border-t border-gray-200 p-1">
            <button
              onClick={() => setView("HISTORY")}
              className="text-gray-500 duration-300 ease-in-out hover:scale-105"
            >
              FECHAR
            </button>
            <button
              onClick={() => createEvent()}
              className="font-bold text-[#15599a] duration-300 ease-in-out hover:scale-105"
            >
              CRIAR
            </button>
          </div>
        </div>
      ) : null}
      {view == "NEW NOTE" && newEvent.categoria == "ANOTAÇÃO" ? (
        <div className="flex w-full flex-col">
          <div className="flex w-full grow flex-col">
            <textarea
              value={newEvent.anotacao}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  anotacao: e.target.value,
                }))
              }
              placeholder="Escreva aqui uma anotação ou atualização acerca do projeto."
              className="h-[80px] resize-none border border-gray-200 bg-gray-100 p-2 text-center outline-none"
            />
          </div>
          <div className="flex w-full items-center justify-end gap-3 border-t border-gray-200 p-1">
            <button
              onClick={() => setView("HISTORY")}
              className="text-gray-500 duration-300 ease-in-out hover:scale-105"
            >
              FECHAR
            </button>
            <button
              onClick={() => createEvent()}
              className="font-bold text-[#15599a] duration-300 ease-in-out hover:scale-105"
            >
              CRIAR
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProjectHistoryBlock;
