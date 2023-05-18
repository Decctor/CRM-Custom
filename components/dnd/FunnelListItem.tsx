import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { MdOpenInNew } from "react-icons/md";
interface FunnelListItemProps {
  index: number;
  item: {
    id: number | string;
    name: string;
    responsavel: string;
    responsavel_avatar?: string;
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
          className="flex min-h-[100px] w-full flex-col justify-between rounded border border-gray-200 bg-[#fff] p-2 shadow-sm"
        >
          <div className="flex flex-col">
            <div className="h-1 w-1/3 rounded-sm bg-blue-400"></div>
            <h1 className="font-medium text-[#353432]">{item.name}</h1>
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
