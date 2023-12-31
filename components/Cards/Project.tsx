import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOpenInNew } from "react-icons/md";
import ProjectOpenActivities from "../Modals/ProjectOpenActivities";
import { ProjectActivity } from "@/utils/models";
import { FaFileSignature, FaSignature } from "react-icons/fa";
type ProjectCardProps = {
  item: {
    id: number | string;
    name: string;
    identificador?: string;
    responsavel: string;
    responsavel_avatar?: string;
    atividades?: ProjectActivity[];
    nomeProposta?: string;
    valorProposta?: number;
    potenciaPicoProposta?: number;
    contratoSolicitado?: boolean;
    assinado?: boolean;
  };
};
function getTagColor(activities: ProjectActivity[]) {
  if (activities.some((activity) => activity.status == "VERMELHO"))
    return "bg-red-500";
  if (activities.some((activity) => activity.status == "LARANJA"))
    return "bg-orange-500";
  else return "bg-green-500";
}
function Project({ item }: ProjectCardProps) {
  const [openActivitiesModal, setOpenActivitiesModal] =
    useState<boolean>(false);
  return (
    <div
      className={`relative flex h-[150px] min-h-[110px] w-[350px] flex-col justify-between rounded border border-gray-600 ${
        item.assinado ? "bg-green-100" : "bg-[#27374D]"
      }  p-2 shadow-sm`}
    >
      {openActivitiesModal && item.atividades ? (
        <ProjectOpenActivities
          projectName={item.name}
          activities={item.atividades}
          setOpenActivitiesModal={setOpenActivitiesModal}
        />
      ) : null}
      {item.assinado ? (
        <div className="z-8 absolute right-2 top-4 flex items-center justify-center text-green-500">
          <p className="text-sm font-medium italic">ASSINADO</p>
        </div>
      ) : null}
      {item.atividades && item.atividades.length > 0 ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpenActivitiesModal((prev) => !prev);
          }}
          className={`absolute right-2 top-9 flex h-[15px] w-[15px] cursor-pointer items-center justify-center rounded-full text-white  ${getTagColor(
            item.atividades
          )}`}
        >
          <AiOutlineRight style={{ fontSize: "10px" }} />
        </div>
      ) : null}
      <div className="flex w-full flex-col">
        <div
          className={`h-1 w-full rounded-sm ${
            item.contratoSolicitado ? "bg-green-500" : "bg-[#fbcb83]"
          } `}
        ></div>
        <h1 className="text-xs font-bold text-[#fead41]">
          {item.identificador}
        </h1>
        <div className="flex w-full flex-col">
          <Link href={`/projeto/id/${item.id}`}>
            <h1 className="font-medium text-[#fff] hover:text-blue-400">
              {item.name}
            </h1>
          </Link>
        </div>
      </div>

      {(item.valorProposta || item.potenciaPicoProposta) &&
      item.nomeProposta ? (
        <div className="flex w-full grow flex-col">
          <h1 className="text-xxs font-thin text-gray-500">PROPOSTA ATIVA</h1>
          <div className="flex w-full flex-col justify-between">
            <p className="text-xs font-medium text-green-500">
              {item.nomeProposta}
            </p>

            <div className="flex  items-center justify-between">
              <p className="text-xs font-bold text-green-500">
                {item.potenciaPicoProposta?.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                kWp
              </p>
              <p className="text-xs font-bold text-green-500">
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
          <p className="text-sm font-light text-gray-200">{item.responsavel}</p>
        </div>

        <div className="cursor-pointer text-xl text-[#fead61] duration-300 ease-in hover:scale-110">
          <Link href={`/projeto/id/${item.id}`}>
            <MdOpenInNew />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Project;
