import { Notification } from "@/utils/schemas/project.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { toast } from "react-hot-toast";
import { BsCheckAll, BsFillCalendar3Fill } from "react-icons/bs";
import { FaRobot, FaUserAlt } from "react-icons/fa";
type NotificationCardProps = {
  notification: Notification;
};
function NotificationCard({ notification }: NotificationCardProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  function getHeaderMessage(
    recipient:
      | {
          id: string;
          nome: string;
          email?: string;
          avatar?: string;
        }
      | "SISTEMA",
    projectName?: string
  ) {
    if (recipient == "SISTEMA")
      return (
        <h1 className="text-xs italic text-gray-500">
          ATUALIZAÇÃO SOBRE O PROJETO <strong>{projectName}</strong>:
        </h1>
      );
    if (recipient.nome && projectName)
      return (
        <h1 className="text-xs italic text-gray-500">
          <strong>{recipient.nome}</strong> diz sobre o projeto{" "}
          <strong className="text-[#fead41]">{projectName}</strong> :
        </h1>
      );
    if (recipient.nome)
      return (
        <h1 className="text-xs italic text-gray-500">
          <strong>{recipient.nome}</strong> diz:
        </h1>
      );
  }
  const { mutate: setAsRead } = useMutation({
    mutationKey: ["setAsRead"],
    mutationFn: async () => {
      try {
        const { data } = await axios.patch(
          `/api/notifications?id=${notification._id}`
        );
        if (data.data) toast.success(data.data);
        return data;
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
      await queryClient.cancelQueries({
        queryKey: ["notifications", session?.user.id],
      });
    },
    onSettled: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications", session?.user.id],
      });
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      // if (data.message) toast.success(data.message);
    },
  });
  return (
    <div
      className={`${
        notification.dataLeitura ? "bg-green-100" : " "
      } flex w-full flex-col border-b border-gray-200 p-2 font-Raleway`}
    >
      <div className="flex w-full">
        <div className="flex w-[20%] items-start justify-center">
          <div className="relative flex h-[35px] w-[35px] items-center  justify-center rounded-full bg-gray-700">
            {notification.remetente == "SISTEMA" ? (
              <FaRobot style={{ color: "white" }} />
            ) : notification.remetente.avatar ? (
              <Image
                src={notification.remetente.avatar}
                fill={true}
                alt={"FOTO DO USUÁRIO"}
                style={{ borderRadius: "100%", objectFit: "cover" }}
              />
            ) : (
              <FaUserAlt style={{ color: "white" }} />
            )}
          </div>
        </div>
        <div className="flex w-[80%] flex-col">
          {getHeaderMessage(
            notification.remetente,
            notification.projetoReferencia?.nome
          )}

          <div className="flex w-full items-center gap-1 text-xs italic text-gray-800">
            <BsFillCalendar3Fill style={{ color: "#fead41" }} />
            <p className="align-middle">
              {dayjs(notification.dataInsercao).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
          <h1 className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium">
            {notification.mensagem}
          </h1>
        </div>
      </div>
      <div className="flex w-full items-center justify-end pt-1">
        <button
          onClick={() => setAsRead()}
          disabled={!!notification.dataLeitura}
          className={`${
            notification.dataLeitura
              ? "text-green-500"
              : "text-gray-600 hover:text-blue-500"
          }  duration-300 hover:scale-110 `}
        >
          <BsCheckAll
            style={{
              fontSize: "20px",
            }}
          />
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;
