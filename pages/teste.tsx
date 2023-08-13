import { Sidebar } from "@/components/Sidebar";
import axios from "axios";
import React, { useState } from "react";

function Teste() {
  const [fileHolder, setFileHolder] = useState<FileList | undefined>(undefined);
  console.log(fileHolder);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files : undefined;
    setFileHolder(file);
    console.log("FILE", file);
  };
  async function sendFile() {
    if (fileHolder) {
      const formData = new FormData();
      const files = Array.from(fileHolder);
      files.forEach((file) => {
        formData.append("files", file);
      });
      console.log(formData);
      const response = await axios.post("/api/utils/clicksignUpload", formData);
    }
  }
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col gap-2 overflow-x-hidden bg-[#f8f9fa] p-6">
        <input onChange={(e) => handleFileChange(e)} type="file" />
        <button
          onClick={() => sendFile()}
          className="rounded border border-[#fbcb83] p-1 text-[#fbcb83]"
        >
          ENVIAR
        </button>
      </div>
    </div>
  );
}

export default Teste;
