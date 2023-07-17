import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";
import { useDebounce } from "usehooks-ts";
import LoadingComponent from "../utils/LoadingComponent";
import Link from "next/link";

type ISearchProjects = {
  _id: string;
  nome: string;
  identificador: string;
  responsavel: {
    nome: string;
    id: string;
  };
};

function SeachProjects() {
  const [searchMenuIsOpen, setSearchMenuIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedFilter = useDebounce(searchText, 1000);
  const {
    data: projects,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    status,
  }: UseQueryResult<ISearchProjects[], Error | AxiosError> = useQuery<
    ISearchProjects[],
    Error | AxiosError
  >({
    queryKey: ["searchProjects", debouncedFilter],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `/api/projects/search?searchParam=${searchText}`
        );
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          throw error;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          throw error;
        }
        throw error;
      }
    },
    placeholderData: [],
    retry: 1,
    enabled: searchText.length >= 3,
    refetchOnWindowFocus: false,
  });
  console.log("PROJETOS", projects);
  console.log(debouncedFilter);
  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={() => setSearchMenuIsOpen((prev) => !prev)}
        className={`w-fit rounded-md border border-[#fead61] p-2 ${
          searchMenuIsOpen ? "bg-[#fead61]" : "bg-transparent text-[#fead41]"
        } bg-[#fead61]`}
      >
        <AiOutlineSearch />
      </button>
      {searchMenuIsOpen ? (
        <div className="absolute -top-[5px] right-[30] z-[2000] flex h-[150px] w-[270px] flex-col self-center rounded-md border border-gray-200 bg-[#fff] p-2 shadow-sm lg:right-[110%] lg:w-[350px]">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full  bg-transparent p-2 text-center text-sm outline-none"
            placeholder="Preencha aqui o nome do projeto..."
          />
          <div className="overscroll-y flex w-full grow flex-col overflow-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {isLoading || isFetching ? <LoadingComponent /> : null}
            {isSuccess ? (
              <>
                {projects.map((project) => (
                  <Link href={`/projeto/id/${project._id}`}>
                    <div className="flex w-full cursor-pointer flex-col border-y border-gray-100 px-2 py-2 hover:bg-blue-50">
                      <h1 className="w-full text-start text-sm font-medium text-gray-700">
                        {project.nome}
                      </h1>
                      <div className="flex w-full justify-between">
                        <h1 className="w-full text-start text-xs text-gray-500">
                          {project.responsavel.nome}
                        </h1>
                        <h1 className="w-full text-end text-xs text-[#fead61]">
                          {project.identificador}
                        </h1>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            ) : null}
            {isError ? (
              <div className="flex grow items-center justify-center">
                {error instanceof AxiosError ? (
                  //
                  error.response?.status != undefined &&
                  error.response?.status < 500 ? (
                    <p className="text-center text-sm italic text-gray-500">
                      {error.response?.data.error.message}
                    </p>
                  ) : (
                    <p className="text-center text-sm italic text-gray-500">
                      Houve um erro de servidor na busca de projetos. Por favor,
                      tente novamente.
                    </p>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SeachProjects;
