import { IKit, IProject, IProposeInfo } from "@/utils/models";
import React, { useEffect, useState } from "react";
import genFactors from "../../utils/generationFactors.json";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../utils/LoadingComponent";
import Kit from "../Cards/Kit";
import { ImSad } from "react-icons/im";
import { getPeakPotByModules, useKitQueryPipelines } from "@/utils/methods";
import { toast } from "react-hot-toast";
import ProposeKit from "../Cards/ProposeKit";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import MultipleSelectInput from "../Inputs/MultipleSelectInput";
import Suppliers from "../../utils/pvsuppliers.json";
import TextInput from "../Inputs/TextInput";
import { AiOutlineSearch } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { orientations } from "@/utils/constants";
type SystemProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<null>>;
  moveToPreviousStage: React.Dispatch<React.SetStateAction<null>>;
};
type Filters = {
  suppliers: string[];
  topology: string[];
  search: string;
};
type QueryTypes = "KITS POR PREMISSA" | "TODOS OS KITS";
function getIdealPowerInterval(
  consumption: number,
  city: string | undefined | null,
  uf: string | undefined | null,
  orientation: (typeof orientations)[number]
): { max: number; min: number; ideal: number } {
  if (!city || !uf)
    return {
      max: 400 + consumption / 127,
      min: -400 + consumption / 127,
      ideal: consumption / 127,
    };
  const cityFactors = genFactors[city as keyof typeof genFactors];

  if (!cityFactors)
    return {
      max: 400 + consumption / 127,
      min: -400 + consumption / 127,
      ideal: consumption / 127,
    };
  const factor = cityFactors[orientation];
  console.log("FATOR", factor);
  return {
    max: 400 + (consumption / cityFactors[orientation]) * 1000,
    min: -400 + (consumption / cityFactors[orientation]) * 1000,
    ideal: consumption / cityFactors[orientation],
  };
}
function System({
  proposeInfo,
  setProposeInfo,
  project,
  moveToNextStage,
  moveToPreviousStage,
}: SystemProps) {
  // console.log(
  //   getIdealPowerInterval(
  //     proposeInfo.premissas.consumoEnergiaMensal,
  //     project.cliente?.cidade,
  //     project.cliente?.uf
  //   )
  // );
  const [queryType, setQueryType] = useState<QueryTypes>("KITS POR PREMISSA");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    suppliers: [],
    topology: [],
    search: "",
  });
  const {
    data: kits,
    isSuccess: kitsSuccess,
    isLoading: kitsLoading,
    isError: kitsError,
  } = useQuery({
    queryKey: ["queryKits", queryType],
    queryFn: async (): Promise<IKit[]> => {
      try {
        console.log(
          useKitQueryPipelines(
            queryType,
            getIdealPowerInterval(
              proposeInfo.premissas.consumoEnergiaMensal,
              project.cliente?.cidade,
              project.cliente?.uf,
              proposeInfo.premissas.orientacao
            )
          )
        );
        const { data } = await axios.post("/api/kits/query", {
          pipeline: useKitQueryPipelines(
            queryType,
            getIdealPowerInterval(
              proposeInfo.premissas.consumoEnergiaMensal,
              project.cliente?.cidade,
              project.cliente?.uf,
              proposeInfo.premissas.orientacao
            )
          ),
        });
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    onError(err) {
      return err;
    },
    refetchOnWindowFocus: false,
  });
  const [filteredKits, setFilteredKits] = useState<IKit[] | undefined>(kits);
  function handleFilters() {
    var newArr;
    if (filters.suppliers.length > 0) {
      if (!newArr) newArr = kits;
      newArr = newArr?.filter((x) => filters.suppliers.includes(x.fornecedor));
    }
    if (filters.topology.length > 0) {
      if (!newArr) newArr = kits;
      newArr = newArr?.filter((x) => filters.topology.includes(x.topologia));
    }
    if (!newArr) {
      setFilteredKits(kits);
      return kits;
    } else {
      setFilteredKits(newArr);
      return newArr;
    }
  }
  function handleSearchFilter(value: string) {
    setFilters((prev) => ({ ...prev, search: value }));
    if (value.trim().length > 0) {
      if (filters.search.trim().length > 0) {
        let filtered = handleFilters();
        let newArr = filtered?.filter((x) =>
          x.nome.toUpperCase().includes(value.toUpperCase())
        );
        setFilteredKits(newArr);
      }
    } else {
      setFilteredKits(kits);
    }
  }
  function selectKit(kit: IKit) {
    const modules = kit.modulos;
    const inverters = kit.inversores;
    const price = kit.preco;
    const topology = kit.topologia;
    const supplier = kit.fornecedor;
    setProposeInfo((prev) => ({
      ...prev,
      kit: {
        kitId: kit._id ? kit._id : "",
        tipo: kit.tipo,
        nome: kit.nome,
        topologia: topology,
        modulos: modules,
        inversores: inverters,
        fornecedor: supplier,
        preco: price,
      },
      potenciaPico: getPeakPotByModules(modules),
    }));
    moveToNextStage(null);
  }
  useEffect(() => {
    setFilteredKits(kits);
  }, [kits]);
  console.log(filteredKits);
  return (
    <div className="flex min-h-[400px] w-full flex-col gap-2 py-4">
      <div className="flex w-full items-center justify-center">
        <h1 className="text-center font-medium italic text-[#fead61]">
          Nessa etapa, por favor escolha o kit que melhor se adeque as
          necessidades desse projeto.
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="text-center font-thin italic text-gray-500">
          Calculamos, com base nas premissas preenchidas, que a potência pico
          ideal para esse projeto é de aproximadamente:
        </h1>
        <h1 className="text-center font-medium italic text-gray-800">
          {getIdealPowerInterval(
            proposeInfo.premissas.consumoEnergiaMensal,
            project.cliente?.cidade,
            project.cliente?.uf,
            proposeInfo.premissas.orientacao
          ).ideal.toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          kWp
        </h1>
      </div>
      <div className="flex w-full flex-col border-b border-gray-200 pb-2">
        <div className="flex w-full flex-col items-center justify-between lg:flex-row">
          <h1 className="font-bold">
            KITS FECHADOS ({filteredKits ? filteredKits.length : "..."})
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQueryType("KITS POR PREMISSA")}
              className={`${
                queryType == "KITS POR PREMISSA"
                  ? "bg-[#fead61] text-white hover:bg-transparent hover:text-[#fead61]"
                  : "text-[#fead61] hover:bg-[#fead61] hover:text-white"
              } rounded border border-[#fead61] px-2 py-1  font-medium`}
            >
              MOSTRAR KITS IDEAIS
            </button>
            <button
              onClick={() => setQueryType("TODOS OS KITS")}
              className={`${
                queryType == "TODOS OS KITS"
                  ? "bg-[#15599a] text-white hover:bg-transparent hover:text-[#15599a]"
                  : "text-[#15599a] hover:bg-[#15599a] hover:text-white"
              } rounded border border-[#15599a] px-2 py-1  font-medium`}
            >
              MOSTRAR TODOS OS KITS
            </button>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`rounded border border-[#15599a] px-2 py-1 ${
                showFilters
                  ? "bg-[#15599a] text-white"
                  : "bg-white text-[#15599a]"
              } `}
            >
              {showFilters ? (
                <VscFilterFilled style={{ fontSize: "22px" }} />
              ) : (
                <VscFilter style={{ fontSize: "22px" }} />
              )}
            </button>
          </div>
        </div>
        {showFilters ? (
          <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-1">
            <TextInput
              label="PESQUISA"
              value={filters.search}
              handleChange={(value) => {
                handleSearchFilter(value);
              }}
              placeholder="Pesquisa aqui o nome do kit..."
            />
            <div className="flex items-end gap-1">
              <MultipleSelectInput
                label="FORNECEDORES"
                selected={
                  filters.suppliers.length > 0
                    ? filters.suppliers.map((supplier) => supplier)
                    : null
                }
                options={Suppliers.map((supplier) => {
                  return {
                    id: supplier.id,
                    label: supplier.nome,
                    value: supplier.nome,
                  };
                })}
                selectedItemLabel="NÃO DEFINIDO"
                handleChange={(value: string[] | []) => {
                  setFilters((prev) => ({
                    ...prev,
                    suppliers: value,
                  }));
                }}
                onReset={() => {
                  setFilters((prev) => ({
                    ...prev,
                    suppliers: [],
                  }));
                }}
              />
              <MultipleSelectInput
                label="TOPOLOGIA"
                selected={
                  filters.topology.length > 0
                    ? filters.topology.map((supplier) => supplier)
                    : null
                }
                options={[
                  { id: 1, label: "INVERSOR", value: "INVERSOR" },
                  {
                    id: 2,
                    label: "MICRO-INVERSOR",
                    value: "MICRO-INVERSOR",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                handleChange={(value: string[] | []) => {
                  setFilters((prev) => ({
                    ...prev,
                    topology: value,
                  }));
                }}
                onReset={() => {
                  setFilters((prev) => ({
                    ...prev,
                    topology: [],
                  }));
                }}
              />
              <button
                onClick={() => handleFilters()}
                className="flex h-[46px] items-center justify-center rounded border border-[#fead61] p-3 text-[#fead61] hover:bg-[#fead61] hover:text-black"
              >
                <AiOutlineSearch />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex w-full grow flex-wrap justify-around gap-2">
        {kitsLoading ? <LoadingComponent /> : null}
        {kitsError ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <ImSad style={{ fontSize: "50px", color: "#fead61" }} />
            <p className="w-full text-center text-sm italic text-gray-600 lg:w-[50%]">
              Houve um erro na busca dos kits. Por favor, tente
              <strong className="text-[#15599a]">
                "Mostrar todos os kits"
              </strong>
              . Se o erro persistir, tente recarregar a página.
            </p>
          </div>
        ) : null}
        {kitsSuccess ? (
          kits.length > 0 ? (
            filteredKits?.map((kit, index) => (
              <ProposeKit
                project={project}
                propose={proposeInfo}
                key={kit._id}
                kit={kit}
                handleSelect={(value) => selectKit(value)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <ImSad style={{ fontSize: "50px", color: "#fead61" }} />
              <p className="w-full text-center text-sm italic text-gray-600 lg:w-[50%]">
                Oops, parece que não temos kits cadastrados pra essa faixa de
                potência. Contate o Volts (34 8406-4658) ou, se desejar, busque
                os demais kits clicando em{" "}
                <strong className="text-[#15599a]">
                  "Mostrar todos os kits"
                </strong>
                .
              </p>
            </div>
          )
        ) : null}
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <button
          onClick={() => moveToPreviousStage(null)}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        {/* <button
          onClick={() => console.log("TEXT")}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button> */}
      </div>
    </div>
  );
}

export default System;
