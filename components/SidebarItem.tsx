import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
type SiderbarItemProps = {
  isOpen: boolean;
  icon: React.ReactNode;
  text: string;
  url: string;
};

function SidebarItem({ isOpen, icon, text, url }: SiderbarItemProps) {
  return (
    <>
      <Link title={text} href={url}>
        <div
          className={`mt-2 flex cursor-pointer items-center ${
            isOpen ? "justify-start" : "justify-center "
          } rounded p-2  duration-300 ease-in hover:scale-105 hover:bg-blue-100`}
        >
          {icon}
          {isOpen ? (
            <motion.p
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`pl-3 text-xs text-gray-600 `}
            >
              {text}
            </motion.p>
          ) : null}
        </div>
      </Link>
    </>
  );
}

export default SidebarItem;
