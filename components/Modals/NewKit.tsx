import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
import CheckboxInput from "../Inputs/CheckboxInput";
import Inverters from "../../utils/pvinverters.json";
import Modules from "../../utils/pvmodules.json";
import Suppliers from "../../utils/pvsuppliers.json";
import { IoMdAdd } from "react-icons/io";
import NumberInput from "../Inputs/NumberInput";
import MultipleSelectInput from "../Inputs/MultipleSelectInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { AiOutlineMinus } from "react-icons/ai";
import { structureTypes } from "@/utils/constants";
type ModalNewKitProps = {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type InverterInfo = {
  id: string | number;
  fabricante: string;
  modelo: string;
  qtde: number;
  garantia: number;
};
type ModuleInfo = {
  id: string | number;
  fabricante: string;
  modelo: string;
  qtde: number;
  potencia: number;
  garantia: number;
};
type PersonalizedItem = {
  nome: string;
  categoria: "INVERSOR" | "MÓDULOS";
  potencia: number;
  qtde: number;
  garantia: number;
};
interface IKitInfo {
  _id?: string;
  nome: string;
  tipo?: "TRADICIONAL" | "PROMOCIONAL" | null;
  categoria?: "ON-GRID" | "OFF-GRID" | "BOMBA SOLAR" | null;
  topologia?: "INVERSOR" | "MICRO-INVERSOR" | null;
  preco: number;
  ativo: boolean;
  fornecedor: string | null;
  estruturasCompativeis: string[] | [];
  incluiEstrutura: boolean;
  incluiTransformador: boolean;
  inversores: InverterInfo[] | [];
  modulos: ModuleInfo[] | [];
}
function ModalNewKit({ isOpen, setModalIsOpen }: ModalNewKitProps) {
  const queryClient = useQueryClient();
  const [kitInfo, setKitInfo] = useState<IKitInfo>({
    nome: "",
    categoria: null,
    topologia: "INVERSOR",
    preco: 0,
    ativo: false,
    fornecedor: null,
    estruturasCompativeis: [],
    incluiEstrutura: false,
    incluiTransformador: false,
    inversores: [],
    modulos: [],
  });
  const [componentMsg, setComponentMsg] = useState({
    text: "",
    color: "",
  });

  const { mutate: createKit, status } = useMutation({
    mutationKey: ["addKit"],
    mutationFn: async () => {
      try {
        const { data } = await axios.post("/api/kits", kitInfo);
        queryClient.invalidateQueries({ queryKey: ["kits"] });
        if (data.message) toast.success(data.message);
        setKitInfo({
          nome: "",
          categoria: null,
          topologia: "INVERSOR",
          preco: 0,
          ativo: false,
          fornecedor: null,
          estruturasCompativeis: [],
          incluiEstrutura: false,
          incluiTransformador: false,
          inversores: [],
          modulos: [],
        });
      } catch (error) {
        console.log("ERROR", error);
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
  });

  const [inverterHolder, setInverterHolder] = useState<InverterInfo>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    garantia: 10,
  });
  const [moduleHolder, setModuleHolder] = useState<ModuleInfo>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    potencia: 0,
    garantia: 10,
  });
  const [personalizedItemHolder, setPersonalizedItemHolder] =
    useState<PersonalizedItem>({
      nome: "",
      categoria: "INVERSOR",
      potencia: 0,
      qtde: 1,
      garantia: 10,
    });
  function addInverterToKit() {
    if (
      !inverterHolder.id &&
      !inverterHolder.fabricante &&
      !inverterHolder.modelo
    ) {
      setComponentMsg({
        text: "Inversor inválido. Por favor, tente novamente.",
        color: "text-red-500",
      });
      return;
    }
    if (inverterHolder.qtde <= 0) {
      setComponentMsg({
        text: "Por favor, preencha um quantidade de inversores válida.",
        color: "text-red-500",
      });
      return;
    }
    var inverterArr = [...kitInfo.inversores];
    inverterArr.push(inverterHolder);
    setKitInfo((prev) => ({ ...prev, inversores: inverterArr }));
    setInverterHolder({
      id: "",
      fabricante: "",
      modelo: "",
      qtde: 1,
      garantia: 10,
    });
  }
  function addModuleToKit() {
    if (!moduleHolder.id && !moduleHolder.fabricante && !moduleHolder.modelo) {
      setComponentMsg({
        text: "Módulo inválido. Por favor, tente novamente.",
        color: "text-red-500",
      });
      return;
    }
    if (moduleHolder.qtde <= 0) {
      setComponentMsg({
        text: "Por favor, preencha um quantidade de módulos válida.",
        color: "text-red-500",
      });
      return;
    }
    var moduleArr = [...kitInfo.modulos];
    moduleArr.push(moduleHolder);
    setKitInfo((prev) => ({ ...prev, modulos: moduleArr }));
    setModuleHolder({
      id: "",
      fabricante: "",
      modelo: "",
      qtde: 1,
      potencia: 0,
      garantia: 10,
    });
  }
  function addPersonalizedItemToKit() {
    if (personalizedItemHolder.nome.trim().length < 3) {
      setComponentMsg({
        text: "Por favor, prencha o nome do item personalizado.",
        color: "text-red-500",
      });
    }
    if (personalizedItemHolder.qtde <= 0) {
      setComponentMsg({
        text: "Por favor, prencha uma quantidade válida para o item personalizado.",
        color: "text-red-500",
      });
    }
    if (personalizedItemHolder.potencia <= 0) {
      setComponentMsg({
        text: "Por favor, prencha uma potência válida para o item personalizado.",
        color: "text-red-500",
      });
    }
    if (personalizedItemHolder.categoria == "INVERSOR") {
      const insertObj = {
        id: "N/A",
        fabricante: "PROMO",
        modelo: personalizedItemHolder.nome,
        qtde: personalizedItemHolder.qtde,
        garantia: personalizedItemHolder.garantia,
      };
      var inverterArr = [...kitInfo.inversores];
      inverterArr.push(insertObj);
      setKitInfo((prev) => ({ ...prev, inversores: inverterArr }));
    }
    if (personalizedItemHolder.categoria == "MÓDULOS") {
      const insertObj = {
        id: "N/A",
        fabricante: "PROMO",
        modelo: personalizedItemHolder.nome,
        qtde: personalizedItemHolder.qtde,
        potencia: personalizedItemHolder.potencia,
        garantia: personalizedItemHolder.garantia,
      };
      var modulesArr = [...kitInfo.modulos];
      modulesArr.push(insertObj);
      setKitInfo((prev) => ({ ...prev, modulos: modulesArr }));
    }
  }
  console.log(kitInfo);
  return (
    <div
      id="defaultModal"
      className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]"
    >
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">
              NOVO KIT
            </h3>
            <button
              onClick={() => setModalIsOpen(false)}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <h1 className="w-full bg-black p-1 text-center font-medium text-white">
              INFORMAÇÕES GERAIS
            </h1>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full items-center justify-center gap-2">
                <CheckboxInput
                  checked={kitInfo.ativo}
                  labelFalse="KIT DESATIVADO"
                  labelTrue="KIT ATIVADO"
                  handleChange={(value) =>
                    setKitInfo((prev) => ({ ...prev, ativo: value }))
                  }
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="w-1/3">
                  <TextInput
                    label="NOME DO KIT"
                    placeholder="Preencha aqui o nome a ser dado ao kit."
                    value={kitInfo.nome}
                    handleChange={(value) =>
                      setKitInfo((prev) => ({ ...prev, nome: value }))
                    }
                    width="100%"
                  />
                </div>
                <div className="w-1/3">
                  <SelectInput
                    label="CATEGORIA"
                    value={kitInfo.categoria ? kitInfo.categoria : null}
                    handleChange={(value) =>
                      setKitInfo((prev) => ({
                        ...prev,
                        categoria: value,
                      }))
                    }
                    onReset={() =>
                      setKitInfo((prev) => ({ ...prev, categoria: null }))
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    options={[
                      { id: 1, label: "ON-GRID", value: "ON-GRID" },
                      { id: 2, label: "OFF-GRID", value: "OFF-GRID" },
                      { id: 3, label: "BOMBA SOLAR", value: "BOMBA SOLAR" },
                    ]}
                    width="100%"
                  />
                </div>
                <div className="w-1/3">
                  <SelectInput
                    label="TOPOLOGIA"
                    value={kitInfo.topologia ? kitInfo.topologia : null}
                    handleChange={(value) =>
                      setKitInfo((prev) => ({
                        ...prev,
                        topologia: value,
                      }))
                    }
                    onReset={() =>
                      setKitInfo((prev) => ({ ...prev, topologia: null }))
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    options={[
                      { id: 1, label: "INVERSOR", value: "INVERSOR" },
                      {
                        id: 2,
                        label: "MICRO-INVERSOR",
                        value: "MICRO-INVERSOR",
                      },
                    ]}
                    width="100%"
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="w-1/2">
                  <NumberInput
                    label="PREÇO"
                    value={kitInfo.preco}
                    placeholder="PREÇO DO KIT"
                    handleChange={(value) =>
                      setKitInfo((prev) => ({ ...prev, preco: Number(value) }))
                    }
                    width="100%"
                  />
                </div>
                <div className="w-1/2">
                  <SelectInput
                    label="TIPO DO KIT"
                    value={kitInfo.tipo ? kitInfo.tipo : null}
                    handleChange={(value) =>
                      setKitInfo((prev) => ({
                        ...prev,
                        tipo: value,
                      }))
                    }
                    onReset={() =>
                      setKitInfo((prev) => ({ ...prev, tipo: null }))
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    options={[
                      { id: 1, label: "TRADICIONAL", value: "TRADICIONAL" },
                      {
                        id: 2,
                        label: "PROMOCIONAL",
                        value: "PROMOCIONAL",
                      },
                    ]}
                    width="100%"
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="w-1/2">
                  <SelectInput
                    label="FORNECEDOR"
                    value={kitInfo.fornecedor}
                    handleChange={(value) =>
                      setKitInfo((prev) => ({ ...prev, fornecedor: value }))
                    }
                    onReset={() =>
                      setKitInfo((prev) => ({ ...prev, fornecedor: null }))
                    }
                    selectedItemLabel="NÃO DEFINIDO"
                    options={Suppliers.map((supplier) => {
                      return {
                        id: supplier.id,
                        label: supplier.nome,
                        value: supplier.nome,
                      };
                    })}
                    width="100%"
                  />
                </div>
                <div className="w-1/2">
                  <MultipleSelectInput
                    label="ESTRUTURAS COMPATÍVEIS"
                    selected={
                      kitInfo.estruturasCompativeis.length > 0
                        ? kitInfo.estruturasCompativeis.map(
                            (structure) => structure
                          )
                        : null
                    }
                    options={structureTypes.map((type, index) => ({
                      ...type,
                      id: index + 1,
                    }))}
                    selectedItemLabel="NÃO DEFINIDO"
                    handleChange={(value: string[] | []) =>
                      setKitInfo((prev) => ({
                        ...prev,
                        estruturasCompativeis: value,
                      }))
                    }
                    onReset={() =>
                      setKitInfo((prev) => ({
                        ...prev,
                        estruturasCompativeis: [],
                      }))
                    }
                    width="100%"
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="w-1/2">
                  <CheckboxInput
                    checked={kitInfo.incluiEstrutura}
                    labelTrue="INCLUSO ESTRUTURA"
                    labelFalse="NÃO INCLUSO ESTRUTURA"
                    handleChange={(value) =>
                      setKitInfo((prev) => ({
                        ...prev,
                        incluiEstrutura: value,
                      }))
                    }
                  />
                </div>
                <div className="w-1/2">
                  <CheckboxInput
                    checked={kitInfo.incluiTransformador}
                    labelTrue="INCLUSO TRANSFORMADOR"
                    labelFalse="NÃO INCLUSO TRANSFORMADOR"
                    handleChange={(value) =>
                      setKitInfo((prev) => ({
                        ...prev,
                        incluiTransformador: value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <h1 className="w-full bg-black p-1 text-center font-medium text-white">
              COMPOSIÇÃO
            </h1>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full items-center gap-2">
                <div className="flex w-[90%] items-center gap-2">
                  <div className="w-[50%]">
                    <SelectInput
                      label="INVERSOR"
                      value={
                        inverterHolder.id
                          ? Inverters.filter(
                              (inverter) => inverter.id == inverterHolder.id
                            )[0]
                          : null
                      }
                      handleChange={(value) =>
                        setInverterHolder((prev) => ({
                          ...prev,
                          id: value.id,
                          fabricante: value.fabricante,
                          modelo: value.modelo,
                        }))
                      }
                      onReset={() =>
                        setInverterHolder({
                          id: "",
                          fabricante: "",
                          modelo: "",
                          qtde: 1,
                          garantia: 10,
                        })
                      }
                      selectedItemLabel="NÃO DEFINIDO"
                      options={Inverters.map((inverter) => {
                        return {
                          id: inverter.id,
                          label: `${inverter.fabricante} - ${inverter.modelo}`,
                          value: inverter,
                        };
                      })}
                      width="100%"
                    />
                  </div>
                  <div className="w-[25%]">
                    <NumberInput
                      label="QTDE"
                      value={inverterHolder.qtde}
                      handleChange={(value) =>
                        setInverterHolder((prev) => ({
                          ...prev,
                          qtde: Number(value),
                        }))
                      }
                      placeholder="QTDE"
                      width="100%"
                    />
                  </div>
                  <div className="w-[25%]">
                    <NumberInput
                      label="GARANTIA"
                      value={inverterHolder.garantia}
                      handleChange={(value) =>
                        setInverterHolder((prev) => ({
                          ...prev,
                          garantia: Number(value),
                        }))
                      }
                      placeholder="GARANTIA"
                      width="100%"
                    />
                  </div>
                </div>
                <div className="flex h-fit w-[10%] flex-col items-center justify-center gap-1">
                  <p className="h-[24px] w-full "></p>
                  <button
                    onClick={addInverterToKit}
                    className="flex items-center justify-center rounded bg-green-300 p-2 duration-300 ease-out hover:scale-105 hover:bg-green-500 hover:text-white"
                  >
                    <IoMdAdd />
                  </button>
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex w-[90%] items-center gap-2">
                  <div className="w-[50%]">
                    <SelectInput
                      label="MÓDULO"
                      value={
                        moduleHolder.id
                          ? Modules.filter(
                              (module) => module.id == moduleHolder.id
                            )[0]
                          : null
                      }
                      handleChange={(value) =>
                        setModuleHolder((prev) => ({
                          ...prev,
                          id: value.id,
                          fabricante: value.fabricante,
                          modelo: value.modelo,
                          potencia: value.potencia,
                        }))
                      }
                      onReset={() =>
                        setModuleHolder({
                          id: "",
                          fabricante: "",
                          modelo: "",
                          qtde: 1,
                          potencia: 0,
                          garantia: 10,
                        })
                      }
                      selectedItemLabel="NÃO DEFINIDO"
                      options={Modules.map((module) => {
                        return {
                          id: module.id,
                          label: `${module.fabricante} - ${module.modelo}`,
                          value: module,
                        };
                      })}
                      width="100%"
                    />
                  </div>
                  <div className="w-[25%]">
                    <NumberInput
                      label="QTDE"
                      value={moduleHolder.qtde}
                      handleChange={(value) =>
                        setModuleHolder((prev) => ({
                          ...prev,
                          qtde: Number(value),
                        }))
                      }
                      placeholder="QTDE"
                      width="100%"
                    />
                  </div>
                  <div className="w-[25%]">
                    <NumberInput
                      label="GARANTIA"
                      value={moduleHolder.garantia}
                      handleChange={(value) =>
                        setModuleHolder((prev) => ({
                          ...prev,
                          garantia: Number(value),
                        }))
                      }
                      placeholder="GARANTIA"
                      width="100%"
                    />
                  </div>
                </div>

                <div className="flex h-fit w-[10%] flex-col items-center justify-center gap-1 lg:h-full">
                  <p className="h-[24px] w-full"></p>
                  <button
                    onClick={addModuleToKit}
                    className="flex items-center justify-center rounded bg-green-300 p-2 duration-300 ease-out hover:scale-105 hover:bg-green-500 hover:text-white"
                  >
                    <IoMdAdd />
                  </button>
                </div>
              </div>
              {kitInfo.tipo == "PROMOCIONAL" ? (
                <>
                  <div className="flex w-full items-center gap-4">
                    <div className="flex w-[90%] items-center gap-2">
                      <div className="w-[40%]">
                        <TextInput
                          label="ITEM PERSONALIZADO"
                          placeholder="ITEM PERSONALIZADO"
                          value={personalizedItemHolder.nome}
                          handleChange={(value) =>
                            setPersonalizedItemHolder((prev) => ({
                              ...prev,
                              nome: value,
                            }))
                          }
                          width="100%"
                        />
                      </div>
                      <div className="w-[30%]">
                        <SelectInput
                          label="CATEGORIA"
                          selectedItemLabel="NÃO DEFINIDO"
                          options={[
                            { id: 1, label: "INVERSOR", value: "INVERSOR" },
                            { id: 2, label: "MÓDULOS", value: "MÓDULOS" },
                          ]}
                          value={personalizedItemHolder.categoria}
                          handleChange={(value) =>
                            setPersonalizedItemHolder((prev) => ({
                              ...prev,
                              categoria: value,
                            }))
                          }
                          onReset={() => {
                            setPersonalizedItemHolder((prev) => ({
                              ...prev,
                              categoria: "INVERSOR",
                            }));
                          }}
                          width="100%"
                        />
                      </div>
                      <div className="w-[10%]">
                        <NumberInput
                          label="POTÊNCIA"
                          value={personalizedItemHolder.potencia}
                          handleChange={(value) =>
                            setPersonalizedItemHolder((prev) => ({
                              ...prev,
                              potencia: Number(value),
                            }))
                          }
                          placeholder="POTÊNCIA"
                          width="100%"
                        />
                      </div>
                      <div className="w-[10%]">
                        <NumberInput
                          label="QTDE"
                          value={personalizedItemHolder.qtde}
                          handleChange={(value) =>
                            setPersonalizedItemHolder((prev) => ({
                              ...prev,
                              qtde: Number(value),
                            }))
                          }
                          placeholder="QTDE"
                          width="100%"
                        />
                      </div>
                      <div className="w-[10%]">
                        <NumberInput
                          label="GARANTIA"
                          value={personalizedItemHolder.garantia}
                          handleChange={(value) =>
                            setPersonalizedItemHolder((prev) => ({
                              ...prev,
                              garantia: Number(value),
                            }))
                          }
                          placeholder="GARANTIA"
                          width="100%"
                        />
                      </div>
                    </div>

                    <div className="flex h-fit w-[10%] flex-col items-center justify-center gap-1 lg:h-full">
                      <p className="h-[24px] w-full"></p>
                      <button
                        onClick={addPersonalizedItemToKit}
                        className="flex items-center justify-center rounded bg-green-300 p-2 duration-300 ease-out hover:scale-105 hover:bg-green-500 hover:text-white"
                      >
                        <IoMdAdd />
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {componentMsg.text ? (
                <p
                  className={`w-full text-center ${componentMsg.color} text-xs italic`}
                >
                  {componentMsg.text}
                </p>
              ) : null}
              <div className="mt-2 flex w-full items-start">
                <div className="flex w-1/2 flex-col border-r border-gray-200">
                  <h1 className="text-center font-bold">
                    INVERSORES ADICIONADOS
                  </h1>
                  {kitInfo.inversores.length > 0 ? (
                    kitInfo.inversores.map((inverter, index) => (
                      <div className="flex items-center justify-between px-2 text-center font-light text-gray-500">
                        <p>
                          {inverter.qtde} x {inverter.fabricante}-
                          {inverter.modelo}
                        </p>
                        <AiOutlineMinus
                          onClick={() => {
                            var arr = [...kitInfo.inversores];
                            arr.splice(index, 1);
                            setKitInfo((prev) => ({
                              ...prev,
                              inversores: arr,
                            }));
                          }}
                          style={{ color: "rgb(239,68,68)", cursor: "pointer" }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center font-light text-gray-500">
                      Nenhum inversor adicionado
                    </div>
                  )}
                </div>
                <div className="flex w-1/2 flex-col border-l border-gray-200">
                  <h1 className="text-center font-medium">
                    MÓDULOS ADICIONADOS
                  </h1>
                  {kitInfo.modulos.length > 0 ? (
                    kitInfo.modulos.map((module, index) => (
                      <div className="flex items-center justify-between px-2 text-center font-light text-gray-500">
                        <p>
                          {module.qtde} x {module.fabricante}-{module.modelo}
                        </p>
                        <AiOutlineMinus
                          onClick={() => {
                            var arr = [...kitInfo.modulos];
                            arr.splice(index, 1);
                            setKitInfo((prev) => ({ ...prev, modulos: arr }));
                          }}
                          style={{ color: "rgb(239,68,68)", cursor: "pointer" }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center font-light text-gray-500">
                      Nenhum módulo adicionado
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-end p-2">
              {status == "loading" ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <button
                  onClick={() => createKit()}
                  className="rounded bg-green-300 p-2 font-medium duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
                >
                  CRIAR KIT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalNewKit;
