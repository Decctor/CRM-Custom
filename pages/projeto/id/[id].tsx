import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { GoKebabVertical } from "react-icons/go";
import { Sidebar } from "@/components/Sidebar";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { IProject } from "@/utils/models";
import { AiOutlineUser } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";
import { HiIdentification } from "react-icons/hi";
import SleepyVolts from "../../../utils/sleepVolts.svg";
import Image from "next/image";
import TextInput from "@/components/Inputs/TextInput";
import DateInput from "@/components/Inputs/DateInput";
import dayjs from "dayjs";
import SelectInput from "@/components/Inputs/SelectInput";
import { formatDate } from "@/utils/methods";
import DetailsBlock from "@/components/Blocks/DetailsBlock";
function Projeto() {
  const { data: session } = useSession({
    required: true,
  });
  const { query } = useRouter();
  const [infoHolder, setInfoHolder] = useState<IProject | undefined>();

  const {
    data: project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
    isError: projectError,
  }: UseQueryResult<IProject, Error> = useQuery({
    queryKey: ["projects", query.id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/projects?id=${query.id}`);
        console.log("FETCH", data);
        setInfoHolder(data.data);
        return data.data;
      } catch (error) {
        toast.error(
          "Erro ao buscar informações desse cliente. Por favor, tente novamente mais tarde."
        );
        return error;
      }
    },
    enabled: !!session?.user,
  });

  if (projectError)
    return (
      <div className="flex h-full">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col items-center justify-center overflow-x-hidden bg-[#f8f9fa] p-6">
          <p className="text-lg italic text-gray-700">
            Oops, houve um erro no carregamento das informações do projeto.
          </p>
        </div>
      </div>
    );

  if (projectLoading) return <LoadingComponent />;

  if (projectSuccess)
    return (
      <div className="flex h-full">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex w-full flex-col items-start border-b border-[#fead61] pb-2">
            <h1 className="flex font-['Roboto'] text-2xl font-bold text-blue-900">
              {project.nome}
            </h1>
            <p className="w-full text-start text-xs italic text-gray-500">
              {project.descricao}
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-6 py-4 lg:flex-row">
            <div className="flex h-[230px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:w-[40%]">
              <div className="flex h-[40px] items-center justify-between border-b border-gray-200 pb-2">
                <h1 className="font-bold text-black">Dados do Cliente</h1>
                <div className="cursor-pointer text-lg text-[#15599a] duration-300 ease-in-out hover:scale-110">
                  <GoKebabVertical />
                </div>
              </div>
              <div className="mt-3 flex w-full grow gap-1">
                <div className="flex h-full w-[50%] flex-col justify-around gap-2">
                  <div className="flex items-center gap-2">
                    <AiOutlineUser
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.nome : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdEmail style={{ color: "#15599a", fontSize: "20px" }} />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.email : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsTelephoneFill
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.telefonePrimario : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex h-full w-[50%] flex-col justify-around gap-2">
                  <div className="flex items-center gap-2">
                    <HiIdentification
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente ? project.cliente.cpfCnpj : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCity style={{ color: "#15599a", fontSize: "20px" }} />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente
                        ? `${project.cliente.cidade} (${project.cliente.uf})`
                        : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <GiPositionMarker
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="font-Poppins text-sm text-gray-500">
                      {project.cliente
                        ? `${project.cliente.endereco} - ${project.cliente.numeroOuIdentificador},  ${project.cliente.bairro}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-[230px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:w-[60%]">
              <div className="flex  h-[40px] items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center justify-start gap-10">
                  <h1 className="w-[120px] cursor-pointer border-b border-blue-500 p-1 text-center font-bold text-black hover:border-blue-500">
                    Propostas
                  </h1>
                  <h1 className="cursor-pointer border-b border-white p-1 pb-1 font-bold text-black hover:border-blue-500">
                    Documentos
                  </h1>
                </div>
                <button className="rounded bg-green-600 p-1 text-sm font-bold text-white">
                  GERAR PROPOSTA
                </button>
              </div>
              <div className="overscroll-y mt-3 flex w-full grow flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="flex h-[50px] w-full justify-center">
                  <h1>TESTE</h1>
                </div>
                <div className="h-[50px] w-full"></div>
                <div className="h-[50px] w-full">a</div>
                <div className="h-[50px] w-full">a</div>
                <div className="h-[50px] w-full">a</div>
                <div className="h-[50px] w-full">a</div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-[40%]">
              <DetailsBlock info={project} />
            </div>
            <div className="w-full rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:w-[60%]"></div>
          </div>
        </div>
      </div>
    );
}

export default Projeto;
