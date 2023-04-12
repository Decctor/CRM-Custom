import React from "react";
import FunnelListItem from "./FunnelListItem";
import { Droppable } from "react-beautiful-dnd";

interface IFunnelListProps {
  stageName: string;
  items: {
    id: number | string;
    name: string;
    [key: string]: string | unknown;
  }[];
}
function FunnelList({ stageName, items }: IFunnelListProps) {
  return (
    <Droppable droppableId={stageName}>
      {(provided) => (
        <div className="flex w-full min-w-[350px] flex-col p-2 px-4 lg:w-[350px]">
          <div className="flex h-[50px] w-full flex-col">
            <h1 className="font-medium">{stageName}</h1>
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
