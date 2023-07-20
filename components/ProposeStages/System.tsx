import {
  IKit,
  IProject,
  IProposeInfo,
  InverterType,
  ModuleType,
} from "@/utils/models";
import React, { useEffect, useState } from "react";
import genFactors from "../../utils/generationFactors.json";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../utils/LoadingComponent";
import Kit from "../Cards/Kit";
import { ImSad } from "react-icons/im";
import {
  getEstimatedGen,
  getPeakPotByModules,
  useKitQueryPipelines,
} from "@/utils/methods";
import { toast } from "react-hot-toast";
import ProposeKit from "../Cards/ProposeKit";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import MultipleSelectInput from "../Inputs/MultipleSelectInput";
import Suppliers from "../../utils/pvsuppliers.json";
import TextInput from "../Inputs/TextInput";
import { AiOutlineSearch } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { orientations } from "@/utils/constants";
import { IoMdRemoveCircle } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
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
  order: "ASC" | "DESC" | null;
  potOrder: "ASC" | "DESC" | null;
};
type QueryTypes = "KITS POR PREMISSA" | "TODOS OS KITS";
type SelectedKitsState = {
  kitId: string | string[];
  tipo?: "TRADICIONAL" | "PROMOCIONAL";
  nome: string;
  topologia: string;
  modulos: ModuleType[];
  inversores: InverterType[];
  fornecedor: string;
  preco: number;
}[];
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
function getSelectedKitsPowerPeak(selectedKits: SelectedKitsState) {
  var totalSum = 0;
  selectedKits.forEach((kit) => {
    const kitPeakPower = getPeakPotByModules(kit.modulos);
    totalSum = totalSum + kitPeakPower;
  });
  return totalSum;
}
function combineModules(
  modulosArray: {
    modelo: string;
    potencia: number;
    qtde: number;
    id: string;
    fabricante: string;
    garantia: number;
  }[]
): {
  modelo: string;
  potencia: number;
  qtde: number;
  id: string;
  fabricante: string;
  garantia: number;
}[] {
  const combinedModulos: { [key: string]: { qtde: number } } = {};

  for (const modulo of modulosArray) {
    const key = `${modulo.modelo}==${modulo.potencia}==${modulo.id}==${modulo.fabricante}==${modulo.garantia}`;
    if (combinedModulos[key]) {
      combinedModulos[key].qtde += modulo.qtde;
    } else {
      combinedModulos[key] = { qtde: modulo.qtde };
    }
  }

  return Object.entries(combinedModulos).map(([key, value]) => {
    const [modelo, potencia, id, fabricante, garantia] = key.split("==");
    return {
      modelo,
      potencia: Number(potencia),
      qtde: value.qtde,
      id: id,
      fabricante: fabricante,
      garantia: Number(garantia),
    };
  });
}
function combineInverters(
  invertersArray: {
    modelo: string;
    potenciaNominal: number;
    qtde: number;
    id: string;
    fabricante: string;
    garantia: number;
  }[]
): {
  modelo: string;
  potenciaNominal: number;
  qtde: number;
  id: string;
  fabricante: string;
  garantia: number;
}[] {
  const combinedInverters: { [key: string]: { qtde: number } } = {};

  for (const modulo of invertersArray) {
    const key = `${modulo.modelo}==${modulo.potenciaNominal}==${modulo.id}==${modulo.fabricante}==${modulo.garantia}`;
    if (combinedInverters[key]) {
      combinedInverters[key].qtde += modulo.qtde;
    } else {
      combinedInverters[key] = { qtde: modulo.qtde };
    }
  }

  return Object.entries(combinedInverters).map(([key, value]) => {
    const [modelo, potenciaNominal, id, fabricante, garantia] = key.split("==");
    return {
      modelo,
      potenciaNominal: Number(potenciaNominal),
      qtde: value.qtde,
      id: id,
      fabricante: fabricante,
      garantia: Number(garantia),
    };
  });
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
    order: null,
    potOrder: null,
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

  const [selectedKits, setSelectedKits] = useState<SelectedKitsState>([]);
  function ordenateKits(param: string) {
    if (!filteredKits) return;
    var dumpyCopyOfKits = [...filteredKits];
    var newArr;
    console.log("PARAMETRO", param);
    switch (param) {
      case "ASC":
        newArr = dumpyCopyOfKits.sort((a, b) => a.preco - b.preco);
        setFilteredKits(newArr);
        setFilters((prev) => ({ ...prev, order: "ASC", potOrder: null }));
        break;
      case "DESC":
        newArr = dumpyCopyOfKits.sort((a, b) => b.preco - a.preco);
        setFilteredKits(newArr);
        setFilters((prev) => ({ ...prev, order: "DESC", potOrder: null }));
        break;
      default:
        setFilters((prev) => ({ ...prev, order: null, potOrder: null }));
        setFilteredKits(dumpyCopyOfKits);
        break;
    }
  }
  function ordenateKitsByPower(param: string) {
    if (!filteredKits) return;
    var dumpyCopyOfKits = [...filteredKits];
    var newArr;
    console.log("PARAMETRO", param);
    switch (param) {
      case "ASC":
        newArr = dumpyCopyOfKits.sort(
          (a, b) =>
            getPeakPotByModules(a.modulos) - getPeakPotByModules(b.modulos)
        );
        setFilteredKits(newArr);
        setFilters((prev) => ({ ...prev, potOrder: "ASC", order: null }));
        break;
      case "DESC":
        newArr = dumpyCopyOfKits.sort(
          (a, b) =>
            getPeakPotByModules(b.modulos) - getPeakPotByModules(a.modulos)
        );
        setFilteredKits(newArr);
        setFilters((prev) => ({ ...prev, potOrder: "DESC", order: null }));
        break;
      default:
        setFilters((prev) => ({ ...prev, potOrder: null, order: null }));
        setFilteredKits(dumpyCopyOfKits);
        break;
    }
  }
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
    if (selectedKits.some((prevKit) => prevKit.topologia != topology)) {
      toast.error("Não é possível selecionar kits de topologia diferente.");
      return;
    }
    if (selectedKits.some((prevKit) => prevKit.tipo != kit.tipo)) {
      toast.error(
        "Não é possível selecionar kits tradicionais e promocionais numa única proposta."
      );
      return;
    }
    if (selectedKits.some((prevKit) => prevKit.fornecedor != kit.fornecedor)) {
      toast.error(
        "Não é possível selecionar kits de diferentes fornecedores numa única proposta."
      );
      return;
    }
    var currentSelectedKitsCopy = [...selectedKits];
    currentSelectedKitsCopy.push({
      kitId: kit._id ? kit._id : "",
      tipo: kit.tipo,
      nome: kit.nome,
      topologia: topology,
      modulos: modules,
      inversores: inverters,
      fornecedor: supplier,
      preco: price,
    });
    toast.success("Kit adicionado !");
    setSelectedKits(currentSelectedKitsCopy);
    // setProposeInfo((prev) => ({
    //   ...prev,
    //   kit: {
    //     kitId: kit._id ? kit._id : "",
    //     tipo: kit.tipo,
    //     nome: kit.nome,
    //     topologia: topology,
    //     modulos: modules,
    //     inversores: inverters,
    //     fornecedor: supplier,
    //     preco: price,
    //   },
    //   potenciaPico: getPeakPotByModules(modules),
    // }));
    // moveToNextStage(null);
  }
  function handleProceed() {
    var proposeKitObject: any;
    var peakPower: any;
    if (selectedKits.length == 0) {
      toast.error("Por favor, selecione ao menos um kit para prosseguir.");
      return;
    }
    if (selectedKits.length > 1) {
      const kitIds = selectedKits.map((selectedKit) => {
        if (typeof selectedKit.kitId == "string") return selectedKit.kitId;
        else return selectedKit.kitId[0];
      });
      const kitType = selectedKits[0].tipo;
      const kitName = selectedKits
        .map((selectedKit) => selectedKit.nome)
        .join(" + ");
      const kitTopology = selectedKits[0].topologia;
      console.log("KITS", selectedKits);
      const concatenatedModules = selectedKits.reduce(
        // @ts-ignore
        (accumulator, currentKit) => {
          const iterator = accumulator.modulos
            ? accumulator.modulos
            : accumulator;
          // @ts-ignore
          return [...iterator, ...currentKit.modulos];
        }
      );

      // @ts-ignore
      const kitModules = combineModules(concatenatedModules);

      const concatenatedInverters = selectedKits.reduce(
        // @ts-ignore
        (accumulator, currentKit) => {
          const iterator = accumulator.inversores
            ? accumulator.inversores
            : accumulator;
          // @ts-ignore
          return [...iterator, ...currentKit.inversores];
        }
      );

      // @ts-ignore
      const kitInverters = combineInverters(concatenatedInverters);

      const kitSupplier = selectedKits[0].fornecedor;
      // @ts-ignore
      const kitPrice = selectedKits.reduce((accumulator, currentKit) => {
        console.log("ACCUMULUDADOR", accumulator);
        const iterator = accumulator.preco ? accumulator.preco : accumulator;
        // @ts-ignore
        return iterator + currentKit.preco;
      });
      // @ts-ignore
      peakPower = selectedKits.reduce((accumulator, currentKit) => {
        return (
          getPeakPotByModules(accumulator.modulos) +
          getPeakPotByModules(currentKit.modulos)
        );
      });
      proposeKitObject = {
        kitId: kitIds,
        tipo: kitType,
        nome: kitName,
        topologia: kitTopology,
        modulos: kitModules,
        inversores: kitInverters,
        fornecedor: kitSupplier,
        preco: kitPrice,
      };
    } else {
      proposeKitObject = {
        kitId: selectedKits[0].kitId,
        tipo: selectedKits[0].tipo,
        nome: selectedKits[0].nome,
        topologia: selectedKits[0].topologia,
        modulos: selectedKits[0].modulos,
        inversores: selectedKits[0].inversores,
        fornecedor: selectedKits[0].fornecedor,
        preco: selectedKits[0].preco,
      };
      peakPower = getPeakPotByModules(selectedKits[0].modulos);
    }
    console.log(selectedKits, peakPower);
    console.log(proposeKitObject);
    // @ts-ignore
    setProposeInfo((prev) => ({
      ...prev,
      kit: proposeKitObject,
      potenciaPico: peakPower,
    }));
    moveToNextStage(null);
  }
  useEffect(() => {
    setFilteredKits(kits);
  }, [kits]);
  console.log(selectedKits);
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
          <div className="flex w-full flex-col items-center gap-2 lg:w-fit lg:flex-row">
            <button
              onClick={() => setQueryType("KITS POR PREMISSA")}
              className={`${
                queryType == "KITS POR PREMISSA"
                  ? "bg-[#fead61] text-white hover:bg-transparent hover:text-[#fead61]"
                  : "text-[#fead61] hover:bg-[#fead61] hover:text-white"
              } w-full rounded border border-[#fead61] px-2  py-1 font-medium lg:w-fit`}
            >
              MOSTRAR KITS IDEAIS
            </button>
            <button
              onClick={() => setQueryType("TODOS OS KITS")}
              className={`${
                queryType == "TODOS OS KITS"
                  ? "bg-[#15599a] text-white hover:bg-transparent hover:text-[#15599a]"
                  : "text-[#15599a] hover:bg-[#15599a] hover:text-white"
              } w-full rounded border border-[#15599a] px-2  py-1 font-medium lg:w-fit`}
            >
              MOSTRAR TODOS OS KITS
            </button>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`flex w-full items-center justify-center rounded border border-[#15599a] px-2 py-1 lg:w-fit ${
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
          <div className="mt-2 flex w-full flex-col items-center justify-between gap-1">
            <div className="flex w-full flex-col items-center justify-between lg:flex-row">
              <TextInput
                label="PESQUISA"
                value={filters.search}
                handleChange={(value) => {
                  handleSearchFilter(value);
                }}
                placeholder="Pesquisa aqui o nome do kit..."
              />
              <div className="flex items-center justify-end gap-1">
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
                  className="flex h-[46px] items-center justify-center self-end rounded border border-[#fead61] p-3 text-[#fead61] hover:bg-[#fead61] hover:text-black"
                >
                  <AiOutlineSearch />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 lg:flex-row">
              <div
                onClick={() => ordenateKitsByPower("ASC")}
                className={`flex h-[46px] w-full cursor-pointer items-center justify-center rounded-md border border-[#FEAD41] p-1 text-center lg:w-fit ${
                  filters.potOrder == "ASC"
                    ? "bg-[#FEAD41] text-white"
                    : "bg-transparent text-[#FEAD41]"
                }`}
              >
                POTÊNCIA CRESCENTE
              </div>
              <div
                onClick={() => ordenateKitsByPower("DESC")}
                className={`flex h-[46px] w-full cursor-pointer items-center justify-center rounded-md border border-[#FEAD41] p-1 text-center lg:w-fit ${
                  filters.potOrder == "DESC"
                    ? "bg-[#FEAD41] text-white"
                    : "bg-transparent text-[#FEAD41]"
                }`}
              >
                POTÊNCIA DECRESCENTE
              </div>
              <div
                onClick={() => ordenateKits("ASC")}
                className={`flex h-[46px] w-full cursor-pointer items-center justify-center rounded-md border border-[#15599a] p-1 text-center lg:w-fit ${
                  filters.order == "ASC"
                    ? "bg-[#15599a] text-white"
                    : "bg-transparent text-[#15599a]"
                }`}
              >
                PREÇO CRESCENTE
              </div>
              <div
                onClick={() => ordenateKits("DESC")}
                className={`flex h-[46px] w-full cursor-pointer items-center justify-center rounded-md border border-[#15599a] p-1 text-center lg:w-fit ${
                  filters.order == "DESC"
                    ? "bg-[#15599a] text-white"
                    : "bg-transparent text-[#15599a]"
                }`}
              >
                PREÇO DECRESCENTE
              </div>
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
      <div className="flex w-full flex-col items-center justify-between gap-2 px-1">
        <h1 className="w-full text-start font-bold">KITS SELECIONADOS</h1>
        {selectedKits.length > 0 ? (
          <>
            {selectedKits.map((kit, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-between pb-1"
              >
                <p className="italic text-gray-500">{kit.nome}</p>
                <button
                  onClick={() => {
                    var currentSelectedKitsCopy = [...selectedKits];
                    currentSelectedKitsCopy.splice(index, 1);
                    setSelectedKits(currentSelectedKitsCopy);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <IoMdRemoveCircle />
                </button>
              </div>
            ))}
            <div className="flex w-full items-center justify-center gap-2">
              <div className="flex flex-col rounded border border-[#15599a] p-2 text-[#15599a]">
                <h1 className="text-center">POTÊNCIA PICO TOTAL</h1>
                <h1 className="text-center font-medium">
                  {getSelectedKitsPowerPeak(selectedKits).toLocaleString(
                    "pt-br",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}{" "}
                  kWp{" "}
                </h1>
              </div>
              <div
                className={`flex flex-col rounded border p-2 ${
                  getSelectedKitsPowerPeak(selectedKits) /
                    getIdealPowerInterval(
                      proposeInfo.premissas.consumoEnergiaMensal,
                      project.cliente?.cidade,
                      project.cliente?.uf,
                      proposeInfo.premissas.orientacao
                    ).ideal >
                  0.99
                    ? "border-green-500 text-green-500"
                    : "border-red-500 text-red-500"
                } `}
              >
                <div className="flex items-center gap-2">
                  <h1 className="text-center">GERAÇÃO PREVISTA</h1>
                  <div className="flex items-center self-end">
                    {getSelectedKitsPowerPeak(selectedKits) /
                      getIdealPowerInterval(
                        proposeInfo.premissas.consumoEnergiaMensal,
                        project.cliente?.cidade,
                        project.cliente?.uf,
                        proposeInfo.premissas.orientacao
                      ).ideal >
                    0.99 ? (
                      <MdOutlineKeyboardArrowUp style={{ fontSize: "20px" }} />
                    ) : (
                      <MdOutlineKeyboardArrowDown
                        style={{ fontSize: "20px" }}
                      />
                    )}
                    <p className="self-end">
                      {(
                        (getSelectedKitsPowerPeak(selectedKits) /
                          getIdealPowerInterval(
                            proposeInfo.premissas.consumoEnergiaMensal,
                            project.cliente?.cidade,
                            project.cliente?.uf,
                            proposeInfo.premissas.orientacao
                          ).ideal) *
                        100
                      ).toLocaleString("pt-br", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                      %
                    </p>
                  </div>
                </div>

                <h1 className="text-center font-medium">
                  {(
                    getSelectedKitsPowerPeak(selectedKits) *
                    getEstimatedGen(
                      getSelectedKitsPowerPeak(selectedKits),
                      project.cliente?.cidade,
                      project.cliente?.uf,
                      proposeInfo.premissas.orientacao
                    )
                  ).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  kWh{" "}
                </h1>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-[80px] w-full items-center justify-center">
            <p className="text-sm italic text-gray-500">
              Sem kits selecionados...
            </p>
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <button
          onClick={() => moveToPreviousStage(null)}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          onClick={() => handleProceed()}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default System;
