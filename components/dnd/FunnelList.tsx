import React from "react";
import FunnelListItem from "./FunnelListItem";
import { Droppable } from "react-beautiful-dnd";
import { ProjectActivity } from "@/utils/models";

interface IFunnelListProps {
  stageName: string;
  id: string | number;
  items: {
    id: number | string;
    name: string;
    responsavel: string;
    [key: string]: string | unknown;
    atividades?: ProjectActivity[];
  }[];
}
function FunnelList({ stageName, items, id }: IFunnelListProps) {
  return (
    <Droppable droppableId={id.toString()}>
      {(provided) => (
        <div className="flex w-full min-w-[350px] flex-col p-2 px-4 lg:w-[350px]">
          <div className="flex h-[50px] w-full flex-col">
            <h1 className="rounded bg-[#15599a] p-1 text-center font-medium text-white">
              {stageName}
            </h1>
          </div>

          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="my-1 flex flex-col gap-2 "
          >
            {items.map((item, index) => (
              <FunnelListItem key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default FunnelList;
