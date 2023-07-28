import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MdDashboard,
  MdLogout,
  MdNotifications,
  MdNotificationsActive,
} from "react-icons/md";
import { FaSolarPanel, FaUser, FaUsers } from "react-icons/fa";
import { TfiAngleRight } from "react-icons/tfi";
import { BsGraphUpArrow } from "react-icons/bs";
import SidebarItem from "./SidebarItem";
import { useRouter } from "next/router";
import Image from "next/image";
import Logo from "../utils/noTextLogo.png";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useNotifications } from "@/utils/methods";
import { Notification } from "@/utils/schemas/project.schema";
import NotificationBlock from "./NotificationBlock";
//react-icons.github.io/react-icons
export const Sidebar = () => {
  const { data: session } = useSession();
  const [sidebarExtended, setSidebarExtended] = useState(false);
  const { pathname, push } = useRouter();

  if (pathname.includes("/auth/signin")) return null;
  return (
    <AnimatePresence>
      <motion.div
        layout={true}
        transition={{
          type: "keyframes",
          ease: "easeInOut",
          delay: 0.1,
        }}
        style={{ maxHeight: "100vh" }}
        className={`overscroll-y sticky top-0 z-[90] hidden flex-col overflow-y-auto border-r border-gray-200 bg-[#fff] px-2  py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 md:flex ${
          sidebarExtended ? "w-[210px] min-w-[210px]" : "w-[70px] min-w-[70px]"
        }`}
      >
        <div className="flex h-[70px] w-full items-start justify-center">
          <div className="relative h-[37px] w-[37px]">
            <Image src={Logo} alt="LOGO" title="LOGO" fill={true} />
          </div>
        </div>
        <div className="flex w-full grow flex-col">
          <motion.div
            animate={sidebarExtended ? "active" : "inactive"}
            variants={{
              inactive: {
                rotate: 0,
              },
              active: {
                rotate: 180,
              },
            }}
            onClick={() => setSidebarExtended((prev) => !prev)}
            className={`my-2 flex w-fit cursor-pointer items-center justify-center self-center rounded p-2  text-[#15599a] duration-300 ease-in hover:scale-105`}
          >
            <TfiAngleRight />
          </motion.div>
          {sidebarExtended ? (
            <h2 className="h-[18px] text-xs text-gray-500">PRINCIPAL</h2>
          ) : (
            <div className="h-[18px] w-full "></div>
          )}
          <SidebarItem
            text="Projetos"
            isOpen={sidebarExtended}
            url="/"
            icon={
              <MdDashboard style={{ fontSize: "20px", color: "#15599a" }} />
            }
          />
          {sidebarExtended ? (
            <h2 className="mt-2 h-[18px] text-xs text-gray-500">CADASTROS</h2>
          ) : (
            <div className="mt-2 h-[18px]"></div>
          )}
          <SidebarItem
            text="Clientes"
            isOpen={sidebarExtended}
            url="/clientes"
            icon={<FaUser style={{ fontSize: "20px", color: "#15599a" }} />}
          />
          <SidebarItem
            text="Kits"
            isOpen={sidebarExtended}
            url="/kits"
            icon={
              <FaSolarPanel style={{ fontSize: "20px", color: "#15599a" }} />
            }
          />
        </div>
        <NotificationBlock sidebarExtended={sidebarExtended} />
        {session?.user.image ? (
          <div className="flex w-full items-center justify-center">
            <Link href={`/auth/perfil?id=${session.user.id}`}>
              <div className="relative h-[37px] w-[37px]">
                <Image
                  src={session?.user.image}
                  alt="USUÁRIO"
                  title="CONFIGURAÇÕES"
                  fill={true}
                  style={{ borderRadius: "100%" }}
                />
              </div>
            </Link>
          </div>
        ) : null}
        <div className="flex w-full flex-col">
          {session?.user.permissoes.usuarios.visualizar ? (
            <SidebarItem
              text="Controle de Usuários"
              isOpen={sidebarExtended}
              url={"/auth/usuarios"}
              icon={<FaUsers style={{ fontSize: "20px", color: "#15599a" }} />}
            />
          ) : null}
          <div
            className={`mt-2 flex cursor-pointer items-center justify-center rounded p-2  duration-300 ease-in  hover:bg-blue-100`}
          >
            <MdLogout
              onClick={() => {
                signOut({ redirect: false });
                push("/auth/signin");
              }}
              style={{
                fontSize: "20px",
                color: "#15599a",
                cursor: "pointer",
                alignSelf: "center",
              }}
            />
          </div>
        </div>
      </motion.div>
      <div
        className={`sticky  z-[90] flex flex-col ${
          sidebarExtended ? "h-[90px]" : "h-[50px] "
        } w-full items-center border-t border-gray-200 bg-[#fff] md:hidden`}
      >
        <div className="grid h-[50px] w-full grid-cols-3">
          <div className="col-span-1 flex items-center justify-center gap-2">
            {session?.user.image ? (
              <div className="flex h-full w-fit items-center justify-center">
                <Link href={`/auth/perfil?id=${session.user.id}`}>
                  <div className="relative h-[33px] w-[33px]">
                    <Image
                      src={session?.user.image}
                      alt="USUÁRIO"
                      title="CONFIGURAÇÕES"
                      fill={true}
                      style={{ borderRadius: "100%" }}
                    />
                  </div>
                </Link>
              </div>
            ) : null}
            <NotificationBlock sidebarExtended={sidebarExtended} />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <div className="flex h-[37px] w-full items-start justify-center">
              <Link href={"/"}>
                <div className="relative h-[37px] w-[37px]">
                  <Image src={Logo} alt="LOGO" title="LOGO" fill={true} />
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <motion.div
              animate={sidebarExtended ? "active" : "inactive"}
              variants={{
                inactive: {
                  rotate: 90,
                },
                active: {
                  rotate: -90,
                },
              }}
              transition={{ duration: 0.1 }}
              onClick={() => setSidebarExtended((prev) => !prev)}
              className={`my-2 flex w-fit cursor-pointer items-center justify-center self-center rounded p-2  text-[#15599a] duration-300 ease-in hover:scale-105`}
            >
              <TfiAngleRight />
            </motion.div>
          </div>
        </div>
        {sidebarExtended ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: "-50%" },
            }}
            transition={{ duration: 0.25 }}
            className="flex h-[40px] w-full flex-wrap items-center justify-center gap-2"
          >
            <div className="flex items-center justify-center p-2 text-[#15599a] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={"/"}>
                <MdDashboard />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#15599a] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={"/clientes"}>
                <FaUser />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#15599a] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={"/kits"}>
                <FaSolarPanel />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </div>
    </AnimatePresence>
  );
};
{
  /**
    <AnimatePresence>
      <motion.div
        variants={{
          hidden: {
            transform: "translateX(-100%)",
          },
          visible: {
            transform: "translateX(0%)",
            transition: { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
          },
        }}
        initial="hidden"
        animate={sidebarExtended ? "visible" : "hidden"}
        exit={{
          opacity: 0,
          transform: "translateX(-100%)",
          transition: { duration: 100 },
        }}
        style={{ maxHeight: "calc(100vh - 70px)" }}
        className="overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 sticky top-[70px] flex w-full flex-col overflow-y-auto border-r border-gray-200 bg-[#fff] px-2 py-4 md:w-[250px]"
      ></motion.div>
    </AnimatePresence> */
}
