import NewKit from "@/components/Modals/NewKit";
import { Sidebar } from "@/components/Sidebar";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { useKits } from "@/utils/methods";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { IKit, ModuleType } from "@/utils/models";
import Modules from "../../utils/pvmodules.json";

import LoadingPage from "@/components/utils/LoadingPage";
import NotAuthorizedPage from "@/components/utils/NotAuthorizedPage";
import Kit from "@/components/Cards/Kit";
import { AiOutlineSearch } from "react-icons/ai";
import TextInput from "@/components/Inputs/TextInput";
import MultipleSelectInput from "@/components/Inputs/MultipleSelectInput";
import Suppliers from "../../utils/pvsuppliers.json";
import EditKit from "@/components/Modals/EditKit";

type Filters = {
  suppliers: string[];
  topology: string[];
  search: string;
  order: null | "ASC" | "DESC";
};
function Kits() {
  const { data: session, status } = useSession({ required: true });

  const { data: kits = [], status: kitsStatus } = useKits();
  const [filteredKits, setFilteredKits] = useState<IKit[] | undefined>(kits);
  const [filters, setFilters] = useState<Filters>({
    suppliers: [],
    topology: [],
    search: "",
    order: null,
  });

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editKitInfo, setEditKitInfo] = useState<IKit | null>();

  const [newKitModalIsOpen, setNewKitModalIsOpen] = useState(false);

  function ordenateKits(param: string) {
    if (!filteredKits) return;
    var dumpyCopyOfKits = [...filteredKits];
    var newArr;
    console.log("PARAMETRO", param);
    switch (param) {
      case "ASC":
        newArr = dumpyCopyOfKits.sort((a, b) => a.preco - b.preco);
        setFilteredKits(newArr);
        setFilters((prev) => ({ ...prev, order: "ASC" }));
        break;
      case "DESC":
        newArr = dumpyCopyOfKits.sort((a, b) => b.preco - a.preco);
        setFilteredKits(newArr);
        setFilters((prev) => ({ ...prev, order: "DESC" }));
        break;
      default:
        setFilters((prev) => ({ ...prev, order: null }));
        setFilteredKits(dumpyCopyOfKits);
        break;
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

  useEffect(() => {
    setFilteredKits(kits);
  }, [kits]);
  console.log(filters);
  if (status == "loading") return <LoadingPage />;
  if (session.user.permissoes.kits.visualizar)
    return (
      <div className="flex h-full">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex flex-col items-center border-b border-[#fead61] pb-2 ">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="flex font-['Roboto'] text-2xl font-bold text-[#fead61]">
                  KITS
                </h1>
                <h1 className="flex font-['Roboto'] text-2xl font-bold text-[#fead61]">
                  ({filteredKits ? filteredKits.length : 0})
                </h1>
              </div>

              {session?.user.permissoes.kits.editar ? (
                <button
                  onClick={() => setNewKitModalIsOpen(true)}
                  className="rounded bg-[#15599a] p-2 text-sm font-bold text-white"
                >
                  NOVO KIT
                </button>
              ) : null}
            </div>
            <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-1">
              <TextInput
                label="PESQUISA"
                value={filters.search}
                handleChange={(value) => {
                  handleSearchFilter(value);
                }}
                placeholder="Pesquisa aqui o nome do kit..."
              />
              <div className="flex flex-wrap items-end gap-1">
                <div
                  onClick={() => ordenateKits("ASC")}
                  className={`flex h-[46px] cursor-pointer items-center justify-center rounded-md border border-[#15599a] p-1 text-center ${
                    filters.order == "ASC"
                      ? "bg-[#15599a] text-white"
                      : "bg-transparent text-[#15599a]"
                  }`}
                >
                  PREÇO CRESCENTE
                </div>
                <div
                  onClick={() => ordenateKits("DESC")}
                  className={`flex h-[46px] cursor-pointer items-center justify-center rounded-md border border-[#15599a] p-1 text-center ${
                    filters.order == "DESC"
                      ? "bg-[#15599a] text-white"
                      : "bg-transparent text-[#15599a]"
                  }`}
                >
                  PREÇO DECRESCENTE
                </div>
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
          </div>
          <div className="flex grow flex-wrap justify-between gap-3 p-3">
            {kitsStatus == "loading" ? <LoadingComponent /> : null}
            {kitsStatus == "success"
              ? filteredKits?.map((kit, index) => (
                  <Kit
                    key={index}
                    kit={kit}
                    handleClick={() => {
                      if (session.user?.permissoes.kits.editar) {
                        setEditKitInfo(kit);
                        setEditModalIsOpen(true);
                      }
                    }}
                  />
                ))
              : null}
            {kitsStatus == "error" ? (
              <div className="flex w-full grow items-center justify-center">
                <p className="font-medium text-red-400">
                  Parece que ocorreu um erro no carregamento dos kits. Por
                  favor, tente novamente mais tarde.
                </p>
              </div>
            ) : null}
          </div>
        </div>
        {newKitModalIsOpen ? (
          <NewKit
            isOpen={newKitModalIsOpen}
            setModalIsOpen={setNewKitModalIsOpen}
          />
        ) : null}
        {editModalIsOpen && editKitInfo ? (
          <EditKit
            isOpen={editModalIsOpen}
            info={editKitInfo}
            setModalIsOpen={setEditModalIsOpen}
          />
        ) : null}
      </div>
    );
  if (!session.user.permissoes.kits.visualizar) return <NotAuthorizedPage />;
}

export default Kits;
