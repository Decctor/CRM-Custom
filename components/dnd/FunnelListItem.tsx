import Link from "next/link";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { MdOpenInNew } from "react-icons/md";
interface FunnelListItemProps {
  index: number;
  item: {
    id: number | string;
    name: string;
  };
}
function FunnelListItem({ item, index }: FunnelListItemProps) {
  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={` shadow-xs flex min-h-[70px] w-full flex-col border border-gray-100 bg-[#fff] p-2 shadow-sm`}
        >
          <div className="h-1 w-1/3 rounded-sm bg-blue-400"></div>
          <h1 className="font-medium text-[#353432]">{item.name}</h1>
          <div className="flex w-full items-center justify-end">
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
