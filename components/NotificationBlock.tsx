import { useNotifications } from "@/utils/methods";
import { Notification } from "@/utils/schemas/project.schema";
import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdNotifications, MdNotificationsActive } from "react-icons/md";
import Notifications from "./Modals/Notifications";

function NotificationBlock({ sidebarExtended }: { sidebarExtended: boolean }) {
  const { data: session } = useSession();
  const { data: notifications } = useNotifications(session?.user.id);
  const [notificationModalIsOpen, setNotificationModalIsOpen] =
    useState<boolean>(false);
  function countUnreadNotifications(notifications?: Notification[]) {
    if (notifications) {
      const unreadArr = notifications.filter((x) => !x.dataLeitura);
      return unreadArr.length;
    }
    return 0;
  }
  useEffect(() => {
    if (notificationModalIsOpen) setNotificationModalIsOpen((prev) => !prev);
  }, [sidebarExtended]);
  return (
    <>
      <div
        onClick={() => {
          setNotificationModalIsOpen((prev) => !prev);
        }}
        className={`relative mb-2 flex cursor-pointer items-center justify-center rounded p-2   duration-300  ease-in hover:bg-blue-100`}
      >
        {countUnreadNotifications(notifications) > 0 ? (
          <>
            <MdNotificationsActive
              style={{ fontSize: "20px", color: "rgb(239,68,68)" }}
            />
            <p className="absolute top-1 ml-6 h-[15px] w-[15px] items-center justify-center rounded-full bg-red-500 p-1 text-center text-xs font-bold text-white lg:flex">
              {countUnreadNotifications(notifications)}
            </p>
          </>
        ) : (
          <MdNotifications style={{ fontSize: "20px", color: "#15599a" }} />
        )}
      </div>
      {notificationModalIsOpen ? (
        <Notifications
          notifications={notifications}
          sidebarExtended={sidebarExtended}
          closeModal={() => setNotificationModalIsOpen(false)}
        />
      ) : null}
    </>
  );
}

export default NotificationBlock;
