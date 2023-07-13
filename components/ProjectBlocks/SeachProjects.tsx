import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";
import { useDebounce } from "usehooks-ts";

function SeachProjects() {
  const [searchMenuIsOpen, setSearchMenuIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedFilter = useDebounce(searchText, 500);
  const { data: projects, isLoading } = useQuery({
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
    retry: false,
    enabled: debouncedFilter.length > 3,
  });
  console.log(projects);
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
        <div className="absolute -top-[5px] right-[110%] z-[100] flex h-[150px] w-[350px] flex-col self-center rounded-md border border-gray-200 bg-[#fff] p-2 shadow-sm">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full  bg-transparent p-2 text-center text-sm outline-none"
            placeholder="Preencha aqui o nome do projeto..."
          />
        </div>
      ) : null}
    </div>
  );
}

export default SeachProjects;
