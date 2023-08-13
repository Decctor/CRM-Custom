import { Notification } from "@/utils/schemas/project.schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  BsCheck,
  BsCheckAll,
  BsFillCalendar3Fill,
  BsFillCalendarFill,
} from "react-icons/bs";
import { FaRobot, FaUserAlt } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import NotificationCard from "../Cards/Notification";

function Notifications({
  sidebarExtended,
  closeModal,
  notifications,
}: {
  sidebarExtended: boolean;
  closeModal: () => void;
  notifications?: Notification[];
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.25 }}
        variants={{
          visible: { opacity: 1, scale: 1, borderRadius: "5%" },
          hidden: { opacity: 0, scale: 0.5, borderRadius: "100%" },
        }}
        id="defaultModal"
        className={`fixed ${
          sidebarExtended
            ? "bottom-[52%] left-10 md:left-[220px]"
            : "bottom-[57%] left-10 md:left-[100px]"
        }  z-[2000] flex h-[300px] w-[300px] flex-col rounded-lg border border-gray-200 bg-[#fff] py-3 shadow-lg md:bottom-[10px]`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 px-3 pb-1">
          <h1 className="text-center text-sm font-medium text-[#fbcb83]">
            PAINEL DE NOTIFICAÇÕES
          </h1>
          <button
            onClick={closeModal}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: "red" }} />
          </button>
        </div>
        <div className="flex grow flex-col overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {notifications && notifications?.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationCard key={index} notification={notification} />
            ))
          ) : (
            <div className="flex grow items-center justify-center">
              <h1 className="text-sm italic text-gray-500">
                Sem notificações encontradas.
              </h1>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Notifications;
