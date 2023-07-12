import { Sidebar } from "@/components/Sidebar";
import React from "react";

function Profile() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6"></div>
    </div>
  );
}

export default Profile;
