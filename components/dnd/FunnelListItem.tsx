import { ProjectActivity } from "@/utils/models";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiOutlineRight } from "react-icons/ai";
import { MdOpenInNew } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import ProjectOpenActivities from "../Modals/ProjectOpenActivities";
import { BsPatchCheckFill } from "react-icons/bs";
interface FunnelListItemProps {
  index: number;
  item: {
    id: number | string;
    name: string;
    responsavel: string;
    responsavel_avatar?: string;
    atividades?: ProjectActivity[];
    nomeProposta?: string;
    valorProposta?: number;
    potenciaPicoProposta?: number;
    contratoSolicitado?: boolean;
  };
}
function getTagColor(activities: ProjectActivity[]) {
  if (activities.some((activity) => activity.status == "VERMELHO"))
    return "bg-red-500";
  if (activities.some((activity) => activity.status == "LARANJA"))
    return "bg-orange-500";
  else return "bg-green-500";
}
function FunnelListItem({ item, index }: FunnelListItemProps) {
  const [openActivitiesModal, setOpenActivitiesModal] = useState(false);
  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative flex min-h-[110px] w-full flex-col justify-between rounded border border-gray-200 bg-[#fff] p-2 shadow-sm"
        >
          {openActivitiesModal && item.atividades ? (
            <ProjectOpenActivities
              projectName={item.name}
              activities={item.atividades}
              setOpenActivitiesModal={setOpenActivitiesModal}
            />
          ) : null}
          {item.contratoSolicitado ? (
            <div className="absolute right-2 top-2 flex items-center justify-center text-green-500">
              <BsPatchCheckFill />
            </div>
          ) : null}
          <div className="relative flex w-full items-center justify-between">
            <div className="flex flex-col">
              <div className="h-1 w-1/3 rounded-sm bg-blue-400"></div>
              <Link href={`/projeto/id/${item.id}`}>
                <h1 className="font-medium text-[#353432] hover:text-blue-400">
                  {item.name}
                </h1>
              </Link>
            </div>
            {item.atividades && item.atividades.length > 0 ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenActivitiesModal((prev) => !prev);
                }}
                className={`flex h-[15px] w-[15px] cursor-pointer items-center justify-center rounded-full text-white  ${getTagColor(
                  item.atividades
                )}`}
              >
                <AiOutlineRight style={{ fontSize: "10px" }} />
              </div>
            ) : null}
          </div>
          {(item.valorProposta || item.potenciaPicoProposta) &&
          item.nomeProposta ? (
            <div className="flex w-full grow flex-col">
              <h1 className="text-xxs font-thin text-gray-500">
                PROPOSTA ATIVA
              </h1>
              <div className="flex w-full items-center justify-between">
                <p className="text-xs text-green-500">{item.nomeProposta}</p>
                <p className="text-xs text-green-500">
                  {item.potenciaPicoProposta?.toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  kWp
                </p>
                <p className="text-xs text-green-500">
                  R${" "}
                  {item.valorProposta
                    ? item.valorProposta.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : 0.0}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {item.responsavel_avatar ? (
                <div className="relative h-[23px] w-[23px] rounded-full">
                  <Image
                    src={item.responsavel_avatar}
                    // width={96}
                    // height={96}
                    fill={true}
                    alt={"FOTO DO USUÁRIO"}
                    style={{ borderRadius: "100%", objectFit: "cover" }}
                  />
                </div>
              ) : null}
              <p className="text-sm font-light text-gray-400">
                {item.responsavel}
              </p>
            </div>

            <div className="cursor-pointer text-xl text-[#fead61] duration-300 ease-in hover:scale-110">
              <Link href={`/projeto/id/${item.id}`}>
                <MdOpenInNew />
              </Link>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default FunnelListItem;
