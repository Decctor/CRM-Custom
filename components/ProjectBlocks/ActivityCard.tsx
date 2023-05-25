import React from "react";
import CheckboxInput from "../Inputs/CheckboxInput";
import { ProjectActivity } from "@/utils/models";
import { IoIosCalendar } from "react-icons/io";
import dayjs from "dayjs";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useResponsibleInfo } from "@/utils/methods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
type ActivityBlockProps = {
  event: ProjectActivity;
  projectId: string;
};
function ActivityBlock({ event, projectId }: ActivityBlockProps) {
  const user = useResponsibleInfo(event.responsavelId);
  const queryClient = useQueryClient();
  const { mutate: updateActivity } = useMutation({
    mutationKey: ["updateProjectActivity"],
    mutationFn: async () => {
      try {
        const { data } = await axios.put(
          `/api/projects/events?id=${event._id}`,
          {
            dataConclusao: event.dataConclusao
              ? null
              : new Date().toISOString(),
          }
        );
        if (data.data) {
          toast.success(data.data);
          queryClient.invalidateQueries({
            queryKey: ["projectEventsHistory", projectId],
          });
        }
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
  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-2">
      <div className="flex w-full items-center justify-between">
        <div className="w-fit">
          <CheckboxInput
            labelFalse={"TESTE"}
            labelTrue="TESTE"
            checked={!!event.dataConclusao}
            handleChange={() => updateActivity()}
            padding="0.25rem"
          />
        </div>
        <div className="flex items-center gap-2">
          <BsFillCalendarCheckFill
            style={{ fontSize: "20px", color: "rgb(34,197,94)" }}
          />
          <p>
            {event.dataConclusao
              ? dayjs(event.dataConclusao).format("DD/MM/YYYY hh:mm")
              : null}
          </p>{" "}
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUser />
          <p>{user ? user.nome : null}</p>
        </div>
        <div className="flex items-center gap-2">
          <IoIosCalendar style={{ fontSize: "20px" }} />
          <p>
            {event.dataInsercao
              ? dayjs(event.dataInsercao).format("DD/MM/YYYY hh:mm")
              : null}
          </p>{" "}
        </div>
      </div>
    </div>
  );
}

export default ActivityBlock;
