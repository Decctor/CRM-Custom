import {
  IKit,
  ITechnicalAnalysis,
  InverterType,
  ModuleType,
} from "@/utils/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TextInput from "../Inputs/TextInput";
import {
  formatToCEP,
  formatToPhone,
  getCEPInfo,
  getPeakPotByModules,
  useKits,
} from "@/utils/methods";
import SelectInput from "../Inputs/SelectInput";
import { stateCities } from "@/utils/estados_cidades";
import Suppliers from "../../utils/pvsuppliers.json";
import LoadingComponent from "../utils/LoadingComponent";
import { IoMdRemoveCircle } from "react-icons/io";
import MultipleSelectInput from "../Inputs/MultipleSelectInput";
import { AiOutlineSearch } from "react-icons/ai";
import TechAnalysisKit from "../Cards/TechAnalysisKit";
import { BsClipboardCheckFill } from "react-icons/bs";
type InLocoUrbanProps = {
  requestInfo: ITechnicalAnalysis;
  setRequestInfo: React.Dispatch<React.SetStateAction<ITechnicalAnalysis>>;
  resetSolicitationType: () => void;
  projectId?: string;
  projectCode?: string;
};
type Filters = {
  suppliers: string[];
  topology: string[];
  search: string;
  potOrder: null | "ASC" | "DESC";
};
type SelectedKitsState = {
  kitId: string | string[];
  tipo?: "TRADICIONAL" | "PROMOCIONAL";
  nome: string;
  topologia: "INVERSOR" | "MICRO-INVERSOR";
  modulos: ModuleType[];
  inversores: InverterType[];
  fornecedor: string;
  preco: number;
}[];

function getSelectedKitsPowerPeak(selectedKits: SelectedKitsState) {
  var totalSum = 0;
  selectedKits.forEach((kit) => {
    const kitPeakPower = getPeakPotByModules(kit.modulos);
    totalSum = totalSum + kitPeakPower;
  });
  return totalSum;
}

function InLocoUrban({
  resetSolicitationType,
  requestInfo,
  setRequestInfo,
  projectId,
  projectCode,
}: InLocoUrbanProps) {
  const queryClient = useQueryClient();
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep);
    const toastID = toast.loading("Buscando informações sobre o CEP...", {
      duration: 2000,
    });
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID);
        toast.success("Dados do CEP buscados com sucesso.", {
          duration: 1000,
        });
        setRequestInfo((prev) => ({
          ...prev,
          logradouro: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf:
            addressInfo.uf == "MG" || addressInfo.uf == "GO"
              ? addressInfo.uf
              : undefined,
          cidade: addressInfo.localidade.toUpperCase(),
        }));
      }
    }, 1000);
  }
  const {
    data: kits = [],
    isFetching: kitsFetching,
    isSuccess: kitsSuccess,
  } = useKits(true);
  const [filteredKits, setFilteredKits] = useState<IKit[] | undefined>(kits);
  const [filters, setFilters] = useState<Filters>({
    suppliers: [],
    topology: [],
    search: "",
    potOrder: null,
  });

  const [selectedKits, setSelectedKits] = useState<SelectedKitsState>([]);

  function handleOptionFilters() {
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
        let filtered = handleOptionFilters();
        let newArr = filtered?.filter((x) =>
          x.nome.toUpperCase().includes(value.toUpperCase())
        );
        setFilteredKits(newArr);
      }
    } else {
      setFilteredKits(kits);
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
  function handleRequest() {
    var selectedKitsCopy = [...selectedKits];
    var kitIdsArr = selectedKitsCopy.flatMap((x) => x.kitId);
    var invQtdeArr = selectedKitsCopy
      .flatMap((x) => x.inversores)
      .map((inv) => inv.qtde);
    var invPotArr = selectedKitsCopy
      .flatMap((x) => x.inversores)
      .map((inv) => inv.potenciaNominal);
    var invBrandArr = selectedKitsCopy
      .flatMap((x) => x.inversores)
      .map((inv) => `(${inv.fabricante}) ${inv.modelo}`);
    var modQtdeArr = selectedKitsCopy
      .flatMap((x) => x.modulos)
      .map((mod) => mod.qtde);
    var modPotArr = selectedKitsCopy
      .flatMap((x) => x.modulos)
      .map((mod) => mod.potencia);
    var modBrandArr = selectedKitsCopy
      .flatMap((x) => x.modulos)
      .map((mod) => `(${mod.fabricante}) ${mod.modelo}`);

    // Joining into string
    var joinedInvQtdeArr = invQtdeArr.join("/");
    var joinedInvPotArr = invPotArr.join("/");
    var joinedInvBrandArr = invBrandArr.join("/");
    var joinedModQtdeArr = modQtdeArr.join("/");
    var joinedModPotArr = modPotArr.join("/");
    var joinedModBrandArr = modBrandArr.join("/");

    // console.log({ joinedInvQtdeArr, joinedInvPotArr, joinedInvBrandArr });
    setRequestInfo((prev) => ({
      ...prev,
      kitIds: kitIdsArr,
      tipoInversor: selectedKitsCopy[0].topologia,
      qtdeInversor: joinedInvQtdeArr,
      potInversor: joinedInvPotArr,
      marcaInversor: joinedInvBrandArr,
      qtdeModulos: joinedModQtdeArr,
      potModulos: joinedModPotArr,
      marcaModulos: joinedModBrandArr,
      localInstalacaoInversor:
        selectedKitsCopy[0].topologia == "MICRO-INVERSOR"
          ? "MICRO-INVERSOR"
          : "",
    }));
    createTechAnalysisRequest();
  }
  const {
    mutate: createTechAnalysisRequest,
    isLoading,
    isSuccess, //64adb93249f94d9354becb64
  } = useMutation({
    mutationKey: ["createTechAnalysisRequest"],
    mutationFn: async () => {
      try {
        const { data } = await axios.post(
          `/api/ampereIntegration/technicalAnalysis`,
          {
            ...requestInfo,
            idProjetoCRM: projectId,
          }
        );
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          return;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
          return;
        }
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["technicalAnalysis", projectCode, "TODOS"],
      });
    },
    onSettled: async (data, variables, context) => {
      console.log("INVALIDANDO QUERIES COM PROJECTCODE:", projectCode);
      await queryClient.invalidateQueries({
        queryKey: ["technicalAnalysis", projectCode, "TODOS"],
      });
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      if (data.message) toast.success(data.message);
    },
  });
  useEffect(() => {
    setFilteredKits(kits);
  }, [kits]);
  if (isSuccess)
    return (
      <div className="flex w-full grow flex-col items-center justify-center gap-4">
        <BsClipboardCheckFill
          style={{ color: "rgb(34,197,94)", fontSize: "60px" }}
        />
        <h1 className="text-lg font-medium italic text-gray-600">
          Solicitação criada com sucesso !
        </h1>
      </div>
    );
  else
    return (
      <div className="flex w-full grow flex-col">
        <div className="flex w-full flex-col bg-[#fff] px-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#fbcb83]">
            DADOS GERAIS
          </span>
          <div className="flex w-full grow flex-col gap-2">
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={"NOME DO CLIENTE"}
                  placeholder="Digite aqui o nome do cliente..."
                  width={"100%"}
                  value={requestInfo.nomeDoCliente}
                  handleChange={(value) =>
                    setRequestInfo((prev) => ({
                      ...prev,
                      nomeDoCliente: value,
                    }))
                  }
                />
              </div>
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={"TELEFONE DO CLIENTE"}
                  placeholder="Digite o telefone do cliente..."
                  width={"100%"}
                  value={requestInfo.telefoneDoCliente}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      telefoneDoCliente: formatToPhone(value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="w-full lg:w-[450px]">
                <TextInput
                  label={"CEP"}
                  placeholder="Digite aqui o nome do cliente..."
                  width={"100%"}
                  value={requestInfo.cep}
                  handleChange={(value) => {
                    if (value.length == 9) {
                      setAddressDataByCEP(value);
                    }
                    setRequestInfo({
                      ...requestInfo,
                      cep: formatToCEP(value),
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <SelectInput
                  width={"100%"}
                  label={"CIDADE"}
                  editable={true}
                  value={requestInfo.cidade}
                  options={
                    requestInfo.uf
                      ? stateCities[requestInfo.uf].map((city, index) => {
                          return {
                            id: index,
                            value: city,
                            label: city,
                          };
                        })
                      : null
                  }
                  handleChange={(value) =>
                    setRequestInfo({ ...requestInfo, cidade: value })
                  }
                  onReset={() => {
                    setRequestInfo((prev) => ({
                      ...prev,
                      cidade: undefined,
                    }));
                  }}
                  selectedItemLabel="NÃO DEFINIDO"
                />
              </div>
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <SelectInput
                  width={"100%"}
                  label={"UF"}
                  editable={true}
                  options={[
                    {
                      id: 1,
                      label: "MG",
                      value: "MG",
                    },
                    {
                      id: 2,
                      label: "GO",
                      value: "GO",
                    },
                  ]}
                  value={requestInfo.uf}
                  handleChange={(value) =>
                    setRequestInfo({ ...requestInfo, uf: value })
                  }
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setRequestInfo((prev) => ({ ...prev, uf: undefined }));
                  }}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={"BAIRRO"}
                  placeholder="Digite aqui o bairro do cliente.."
                  width={"100%"}
                  value={requestInfo.bairro}
                  handleChange={(value) =>
                    setRequestInfo((prev) => ({ ...prev, bairro: value }))
                  }
                />
              </div>
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={"LOGRADOURO"}
                  placeholder="Digite o logradouro do cliente..."
                  width={"100%"}
                  value={requestInfo.logradouro}
                  handleChange={(value) =>
                    setRequestInfo({
                      ...requestInfo,
                      logradouro: value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="w-full lg:w-[450px]">
                <TextInput
                  label={"NÚMERO OU IDENTIFICADOR"}
                  placeholder="Digite aqui o número/identificador da residência..."
                  width={"100%"}
                  value={requestInfo.numeroResidencia}
                  handleChange={(value) => {
                    setRequestInfo({
                      ...requestInfo,
                      numeroResidencia: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col bg-[#fff] px-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#fbcb83]">
            DADOS DO SISTEMA
          </span>
          <div className="flex w-full grow flex-col gap-2">
            <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-1">
              <div className="flex w-full items-end gap-2">
                <div className="w-full lg:w-[50%]">
                  <TextInput
                    label="PESQUISA"
                    value={filters.search}
                    handleChange={(value) => {
                      handleSearchFilter(value);
                    }}
                    placeholder="Pesquisa aqui o nome do kit..."
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-[50%]">
                  <div className="flex w-full justify-center gap-2">
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
                  </div>
                </div>
              </div>
              <div className="flex w-full items-end justify-center gap-2">
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
                  onClick={() => handleOptionFilters()}
                  className="flex h-[46px] w-full items-center justify-center rounded border border-[#fead61] p-3 text-[#fead61] hover:bg-[#fead61] hover:text-black lg:w-fit"
                >
                  <AiOutlineSearch />
                </button>
              </div>
            </div>
            <div className="flex max-h-[500px] grow flex-wrap items-center justify-between gap-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              {kitsSuccess && filteredKits
                ? filteredKits.map((kit) => (
                    <TechAnalysisKit
                      key={kit._id}
                      kit={kit}
                      handleSelect={(value) => selectKit(value)}
                    />
                  ))
                : null}
              {kitsFetching ? <LoadingComponent /> : null}
            </div>
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
                  <div className="flex flex-col rounded border border-[#fbcb83] p-2 text-[#fbcb83]">
                    <h1 className="text-center">POTÊNCIA PICO TOTAL</h1>
                    <h1 className="text-center font-medium">
                      {getSelectedKitsPowerPeak(selectedKits).toLocaleString(
                        "pt-br",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}{" "}
                      kWp{" "}
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
        </div>
        <div className="mt-2 flex w-full justify-between">
          <button
            onClick={() => resetSolicitationType()}
            className="rounded p-2 font-bold text-gray-500 duration-300 ease-in-out hover:scale-105"
          >
            Voltar
          </button>
          <button
            disabled={isLoading || isSuccess}
            className="rounded p-2 font-bold hover:bg-black hover:text-white"
            onClick={() => {
              handleRequest();
            }}
          >
            {isLoading ? "Criando solicitação..." : null}
            {isSuccess ? "Criação concluida!" : null}
            {!isLoading && !isSuccess ? "Criar solicitação" : null}
          </button>
        </div>
      </div>
    );
}

export default InLocoUrban;
