import { useResponsibleInfo } from "@/utils/methods";
import { ProjectActivity, ProjectNote } from "@/utils/models";
import dayjs from "dayjs";
import React from "react";
import { FaUser } from "react-icons/fa";
import { IoIosCalendar } from "react-icons/io";
type NoteCardProps = {
  event: ProjectNote;
};
function NoteCard({ event }: NoteCardProps) {
  const user = useResponsibleInfo(event.responsavelId);
  return (
    <div className="flex w-full flex-col gap-2 rounded-md bg-yellow-100 p-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUser />
          <p>{user ? user.nome : null}</p>
        </div>
        <div className="flex items-center gap-2">
          <IoIosCalendar style={{ fontSize: "20px" }} />
          <p>
            {event.dataInsercao
              ? dayjs(event.dataInsercao).format("DD/MM/YYYY hh:mm")
              : null}
          </p>{" "}
        </div>
      </div>
      <div className="flex w-full items-center justify-center border border-gray-200 p-2">
        <p className="w-full text-center text-sm text-gray-500">
          {event.anotacao}
        </p>
      </div>
    </div>
  );
}

export default NoteCard;
