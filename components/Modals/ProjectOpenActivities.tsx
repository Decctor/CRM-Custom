import { ProjectActivity } from "@/utils/models";
import React from "react";
import { VscChromeClose } from "react-icons/vsc";
import CheckboxInput from "../Inputs/CheckboxInput";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
type ProjectOpenActivitiesProps = {
  activities: ProjectActivity[];
  setOpenActivitiesModal: React.Dispatch<React.SetStateAction<boolean>>;
};
function ProjectOpenActivities({
  activities,
  setOpenActivitiesModal,
}: ProjectOpenActivitiesProps) {
  const queryClient = useQueryClient();
  function getTextColor(status: string | undefined) {
    if (status == "VERMELHO") return "text-red-500";
    if (status == "LARANJA") return "text-orange-500";
    else return "text-green-500";
  }
  const { mutate: updateActivity } = useMutation({
    mutationKey: ["updateProjectActivity"],
    mutationFn: async (event: ProjectActivity) => {
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
          queryClient.invalidateQueries({ queryKey: ["projects"] });
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
    <div
      id="dropdown"
      className="absolute -right-5 z-10 flex w-52 list-none flex-col divide-y divide-gray-100 rounded bg-white text-base shadow"
    >
      <div className="flex w-full flex-col p-1">
        <div className="flex w-full justify-between border-b border-gray-200 pb-1">
          <h1 className="text-xs font-medium text-gray-700">EM ABERTO</h1>
          <button
            onClick={(e) => {
              setOpenActivitiesModal((prev) => !prev);
            }}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: "red", fontSize: "12px" }} />
          </button>
        </div>
        <div className="flex w-full flex-col gap-1 py-2">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div
                className="flex w-full flex-col border border-gray-200 p-2 hover:bg-blue-50"
                key={index}
              >
                <CheckboxInput
                  labelFalse={activity.titulo}
                  labelTrue={activity.titulo}
                  checked={!!activity.dataConclusao}
                  handleChange={() => updateActivity(activity)}
                  justify="justify-start"
                />
                <div
                  className={`flex w-full items-center justify-end gap-2 text-xs ${getTextColor(
                    activity.status
                  )}`}
                >
                  <BsFillCalendarCheckFill />
                  <p>
                    {dayjs(activity.dataVencimento).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="py-2 text-center text-sm italic text-gray-500">
              Sem atividades em aberto...
            </h1>
          )}
        </div>

        {/* <h1>{activity.titulo}</h1> */}
      </div>
    </div>
  );
}

export default ProjectOpenActivities;
