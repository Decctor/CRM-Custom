import React from "react";
import FunnelListItem from "./FunnelListItem";
import { Droppable } from "react-beautiful-dnd";
import { ProjectActivity } from "@/utils/models";
import { ImPower } from "react-icons/im";
import { MdDashboard } from "react-icons/md";

interface IFunnelListProps {
  stageName: string;
  id: string | number;
  items: {
    id: number | string;
    name: string;
    responsavel: string;
    [key: string]: string | unknown;
    atividades?: ProjectActivity[];
    nomeProposta?: string;
    valorProposta?: number;
    potenciaPicoProposta?: number;
  }[];
}
function FunnelList({ stageName, items, id }: IFunnelListProps) {
  function getListCumulativeProposeValues() {
    var sum = 0;
    for (let i = 0; i < items.length; i++) {
      var value = items[i]?.valorProposta ? items[i].valorProposta : 0;
      if (value) sum = sum + value;
    }
    return sum.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  function getListCumulativeProposePeakPower() {
    var sum = 0;
    for (let i = 0; i < items.length; i++) {
      var value = items[i]?.potenciaPicoProposta
        ? items[i].potenciaPicoProposta
        : 0;
      if (value) sum = sum + value;
    }
    return sum.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return (
    <Droppable droppableId={id.toString()}>
      {(provided) => (
        <div className="flex w-full min-w-[350px] flex-col p-2 px-4 lg:w-[350px]">
          <div className="flex h-[60px] w-full flex-col rounded bg-[#15599a] px-2">
            <h1 className="rounded p-1 text-center font-medium text-white">
              {stageName}
            </h1>
            <div className="mt-1 flex w-full justify-between">
              <div className="flex items-center gap-1 text-xs text-white">
                <p>R$</p>
                <p>{getListCumulativeProposeValues()}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-white">
                <p>
                  <ImPower />
                </p>
                <p>{getListCumulativeProposePeakPower()} kWp</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-white">
                <p>
                  <MdDashboard />
                </p>
                <p>{items.length}</p>
              </div>
            </div>
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
