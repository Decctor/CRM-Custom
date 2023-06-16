import { ProjectActivity } from "@/utils/models";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiOutlineRight } from "react-icons/ai";
import { MdOpenInNew } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import ProjectOpenActivities from "../Modals/ProjectOpenActivities";
interface FunnelListItemProps {
  index: number;
  item: {
    id: number | string;
    name: string;
    responsavel: string;
    responsavel_avatar?: string;
    atividades?: ProjectActivity[];
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
          className="relative flex min-h-[100px] w-full flex-col justify-between rounded border border-gray-200 bg-[#fff] p-2 shadow-sm"
        >
          {openActivitiesModal && item.atividades ? (
            <ProjectOpenActivities
              projectName={item.name}
              activities={item.atividades}
              setOpenActivitiesModal={setOpenActivitiesModal}
            />
          ) : null}
          <div className="relative flex w-full items-center justify-between">
            <div className="flex flex-col">
              <div className="h-1 w-1/3 rounded-sm bg-blue-400"></div>
              <h1 className="font-medium text-[#353432]">{item.name}</h1>
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

          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {item.responsavel_avatar ? (
                <div className="relative h-[20px] w-[20px] rounded-full">
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
