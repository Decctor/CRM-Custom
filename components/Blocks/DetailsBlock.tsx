import React, { useState } from "react";
import SelectInput from "../Inputs/SelectInput";
import TextInput from "../Inputs/TextInput";
import DateInput from "../Inputs/DateInput";
import { formatDate } from "@/utils/methods";
import { IProject } from "@/utils/models";
import { AiOutlineCheck } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
type DetailsBlockType = {
  info: IProject;
};
function DetailsBlock({ info }: DetailsBlockType) {
  const [infoHolder, setInfoHolder] = useState<IProject | undefined>(info);
  const queryClient = useQueryClient();

  const { mutate: updateClient } = useMutation({
    mutationKey: ["editClient"],
    mutationFn: async (changes: { [key: string]: any }) => {
      console.log("CHANGES", changes);
      try {
        const { data } = await axios.put(
          `/api/clients?id=${info.clienteId}&representative=${info.cliente?.representante?.id}`,
          {
            changes: changes,
          }
        );
        console.log("MUTATION", data);
        queryClient.invalidateQueries({ queryKey: ["projects", info._id] });
        if (data.message) toast.success(data.message);
        return "OK";
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
  const { mutate: updateProject } = useMutation({
    mutationKey: ["editProject"],
    mutationFn: async (changes: { [key: string]: any }) => {
      console.log("CHANGES", changes);
      try {
        const { data } = await axios.put(
          `/api/projects?id=${info._id}&responsavel=${info.responsavel?.id}`,
          {
            changes: changes,
          }
        );
        console.log(info._id);
        console.log("MUTATION", data);
        queryClient.invalidateQueries({ queryKey: ["projects", info._id] });
        if (data.message) toast.success(data.message);
        return "OK";
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
  function updateData(
    toUpdate: "CLIENTE" | "PROJETO",
    field: string,
    value: any
  ) {
    let obj = {
      [field]: value,
    };
    if (toUpdate == "CLIENTE") {
      updateClient(obj);
    }
    if (toUpdate == "PROJETO") {
      updateProject(obj);
    }
  }
  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      <div className="flex w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg">
        <div className="flex h-[40px] items-center justify-between border-b border-gray-200 pb-2">
          <h1 className="font-bold text-black">Detalhes</h1>
        </div>
        <div className="mt-3 flex w-full flex-col gap-2">
          <div className="flex w-full gap-2">
            <div className="grow">
              <DateInput
                label="DATA DE NASCIMENTO"
                value={
                  infoHolder?.cliente && infoHolder?.cliente.dataNascimento
                    ? formatDate(infoHolder.cliente.dataNascimento)
                    : undefined
                }
                handleChange={(value) => {
                  if (value)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: {
                        ...prev?.cliente,
                        dataNascimento: new Date(value).toISOString(),
                      },
                    }));
                  else
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: {
                        ...prev?.cliente,
                        dataNascimento: null,
                      },
                    }));
                }}
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.cliente?.dataNascimento ==
                info.cliente?.dataNascimento
              }
              onClick={() =>
                updateData(
                  "CLIENTE",
                  "dataNascimento",
                  infoHolder?.cliente?.dataNascimento
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.cliente?.dataNascimento !=
                    info.cliente?.dataNascimento
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="RG"
                value={
                  infoHolder?.cliente && infoHolder?.cliente.rg
                    ? infoHolder?.cliente.rg
                    : ""
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, rg: value },
                    }));
                }}
                placeholder="Preencha aqui o RG do cliente."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.cliente?.rg == info.cliente?.rg}
              onClick={() =>
                updateData("CLIENTE", "rg", infoHolder?.cliente?.rg)
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.cliente?.rg != info.cliente?.rg
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="ESTADO CIVIL"
                value={
                  infoHolder?.cliente ? infoHolder?.cliente.estadoCivil : null
                }
                options={[
                  {
                    id: 1,
                    label: "SOLTEIRO(A)",
                    value: "SOLTEIRO(A)",
                  },
                  {
                    id: 2,
                    label: "CASADO(A)",
                    value: "CASADO(A)",
                  },
                  {
                    id: 3,
                    label: "UNIÃO ESTÁVEL",
                    value: "UNIÃO ESTÁVEL",
                  },
                  {
                    id: 4,
                    label: "DIVORCIADO(A)",
                    value: "DIVORCIADO(A)",
                  },
                  {
                    id: 5,
                    label: "VIUVO(A)",
                    value: "VIUVO(A)",
                  },
                ]}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, estadoCivil: value },
                    }));
                }}
                onReset={() => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, estadoCivil: null },
                    }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.cliente?.estadoCivil == info.cliente?.estadoCivil
              }
              onClick={() =>
                updateData(
                  "CLIENTE",
                  "estadoCivil",
                  infoHolder?.cliente?.estadoCivil
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.cliente?.estadoCivil !=
                    info.cliente?.estadoCivil
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="PROFISSÃO"
                value={
                  infoHolder?.cliente && infoHolder?.cliente.profissao
                    ? infoHolder?.cliente.profissao
                    : ""
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: {
                        ...prev?.cliente,
                        profissao: value,
                      },
                    }));
                }}
                placeholder="Preencha aqui o profissão do cliente."
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.cliente?.profissao == info.cliente?.profissao
              }
              onClick={() =>
                updateData(
                  "CLIENTE",
                  "profissao",
                  infoHolder?.cliente?.profissao
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.cliente?.profissao != info.cliente?.profissao
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="ONDE TRABALHA"
                value={
                  infoHolder?.cliente && infoHolder?.cliente.ondeTrabalha
                    ? infoHolder?.cliente.ondeTrabalha
                    : ""
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, ondeTrabalha: value },
                    }));
                }}
                placeholder="Preencha aqui onde o cliente trabalha."
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.cliente?.ondeTrabalha == info.cliente?.ondeTrabalha
              }
              onClick={() =>
                updateData(
                  "CLIENTE",
                  "ondeTrabalha",
                  infoHolder?.cliente?.ondeTrabalha
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.cliente?.ondeTrabalha !=
                    info.cliente?.ondeTrabalha
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="TITULAR DA INSTALAÇÃO"
                value={
                  infoHolder?.cliente && infoHolder?.titularInstalacao
                    ? infoHolder?.titularInstalacao
                    : ""
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      titularInstalacao: value,
                    }));
                }}
                placeholder="Preencha aqui o profissão do cliente."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.titularInstalacao == info.titularInstalacao}
              onClick={() =>
                updateData(
                  "PROJETO",
                  "titularInstalacao",
                  infoHolder?.titularInstalacao
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.titularInstalacao != info.titularInstalacao
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="TIPO DO TITULAR"
                value={infoHolder?.tipoTitular}
                options={[
                  {
                    id: 1,
                    label: "PESSOA FISICA",
                    value: "PESSOA FISICA",
                  },
                  {
                    id: 2,
                    label: "PESSOA JURIDICA",
                    value: "PESSOA JURIDICA",
                  },
                ]}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      tipoTitular: value,
                    }));
                }}
                onReset={() => {
                  if (infoHolder?.cliente)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      tipoTitular: null,
                    }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.tipoTitular == info.tipoTitular}
              className="flex items-end justify-center pb-4 text-green-200"
              onClick={() =>
                updateData("PROJETO", "tipoTitular", infoHolder?.tipoTitular)
              }
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.tipoTitular != info.tipoTitular
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="TIPO DA LIGAÇÃO"
                value={infoHolder?.tipoLigacao}
                options={[
                  {
                    id: 1,
                    label: "NOVA",
                    value: "NOVA",
                  },
                  {
                    id: 2,
                    label: "EXISTENTE",
                    value: "EXISTENTE",
                  },
                ]}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      tipoLigacao: value,
                    }));
                }}
                onReset={() => {
                  if (infoHolder?.cliente)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      tipoLigacao: null,
                    }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.tipoLigacao == info.tipoLigacao}
              onClick={() =>
                updateData("PROJETO", "tipoLigacao", infoHolder?.tipoLigacao)
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.tipoLigacao != info.tipoLigacao
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsBlock;
