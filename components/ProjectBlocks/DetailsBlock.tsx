import React, { useEffect, useState } from "react";
import SelectInput from "../Inputs/SelectInput";
import TextInput from "../Inputs/TextInput";
import DateInput from "../Inputs/DateInput";
import { formatDate } from "@/utils/methods";
import { IProject, ISession } from "@/utils/models";
import { AiOutlineCheck } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { creditors, customersAcquisitionChannels } from "@/utils/constants";
import NumberInput from "../Inputs/NumberInput";
import SingleFileInput from "../Inputs/SingleFileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/services/firebase";
import { FirebaseError } from "firebase/app";
type DetailsBlockType = {
  info: IProject;
  session: ISession | null;
  id: string | string[] | undefined;
};

function DetailsBlock({ info, session, id }: DetailsBlockType) {
  const [infoHolder, setInfoHolder] = useState<IProject | undefined>(info);
  const queryClient = useQueryClient();

  const { mutate: updateClient } = useMutation({
    mutationKey: ["editClient"],
    mutationFn: async (changes: { [key: string]: any }) => {
      try {
        const { data } = await axios.put(
          `/api/clients?id=${info.clienteId}&representative=${info.cliente?.representante?.id}`,
          {
            changes: changes,
          }
        );
        queryClient.invalidateQueries({ queryKey: ["projects", id] });
        if (data.message) toast.success(data.message);
        return "OK";
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
  });
  const { mutate: updateProject } = useMutation({
    mutationKey: ["editProject"],
    mutationFn: async (changes: { [key: string]: any }) => {
      try {
        const { data } = await axios.put(
          `/api/projects?id=${info._id}&responsavel=${info.responsavel?.id}`,
          {
            changes: changes,
          }
        );

        queryClient.invalidateQueries({ queryKey: ["projects", info._id] });
        if (data.message) toast.success(data.message);
        return "OK";
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
  });
  async function handleAttachment(fileKey: string, file: File) {
    console.log("FUI CHAMADO", fileKey);
    try {
      let storageName = `crm/projetos/${infoHolder?.nome}/${fileKey}-${infoHolder?._id}`;
      const fileRef = ref(storage, storageName);
      const res = await uploadBytes(fileRef, file).catch((err) => {
        if (err instanceof FirebaseError)
          switch (err.code) {
            case "storage/unauthorized":
              throw "Usuário não autorizado para upload de arquivos.";
            case "storage/canceled":
              throw "O upload de arquivos foi cancelado pelo usuário.";

            case "storage/retry-limit-exceeded":
              throw "Tempo de envio de arquivo excedido, tente novamente.";

            case "storage/invalid-checksum":
              throw "Ocorreu um erro na checagem do arquivo enviado, tente novamente.";

            case "storage/unknown":
              throw "Erro de origem desconhecida no upload de arquivos.";
          }
      });

      const url = await getDownloadURL(ref(storage, res.metadata.fullPath));
      updateData("PROJETO", "anexos", {
        [fileKey]: url,
      });
    } catch (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      if (typeof error == "string") {
        toast.error(error);
      } else {
        toast.error(
          "Houve um erro no envio dos arquivos. Por favor, tente novamente."
        );
      }
    }
  }

  function updateData(
    toUpdate: "CLIENTE" | "PROJETO",
    field: string,
    value: any
  ) {
    let obj = {
      [field]: value,
    };
    console.log("OBJECTO", obj);
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
          <h1 className="text-center text-sm font-medium text-[#fead61]">
            DADOS ADICIONAIS DO CLIENTE
          </h1>
          <div className="flex w-full gap-2">
            <div className="grow">
              <DateInput
                label="DATA DE NASCIMENTO"
                value={
                  infoHolder?.cliente && infoHolder?.cliente.dataNascimento
                    ? formatDate(infoHolder.cliente.dataNascimento)
                    : undefined
                }
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
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
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
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
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
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
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
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
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
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
              <SelectInput
                label="CANAL DE AQUISIÇÃO"
                value={
                  infoHolder?.cliente ? infoHolder?.cliente.canalVenda : null
                }
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
                options={customersAcquisitionChannels}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, canalVenda: value },
                    }));
                }}
                onReset={() => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, canalVenda: null },
                    }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.cliente?.canalVenda == info.cliente?.canalVenda
              }
              onClick={() =>
                updateData(
                  "CLIENTE",
                  "canalVenda",
                  infoHolder?.cliente?.canalVenda
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.cliente?.canalVenda != info.cliente?.canalVenda
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <h1 className="text-center text-sm font-medium text-[#fead61]">
            DADOS DA INSTALAÇÃO
          </h1>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="TITULAR DA INSTALAÇÃO"
                value={
                  infoHolder?.cliente && infoHolder?.titularInstalacao
                    ? infoHolder?.titularInstalacao
                    : ""
                }
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      titularInstalacao: value,
                    }));
                }}
                placeholder="Preencha aqui o títular da instalação do cliente."
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
              <TextInput
                label="NÚMERO DE INSTALAÇÃO DA CONCESSIONÁRIA"
                value={
                  infoHolder?.cliente &&
                  infoHolder?.numeroInstalacaoConcessionaria
                    ? infoHolder?.numeroInstalacaoConcessionaria
                    : ""
                }
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      numeroInstalacaoConcessionaria: value,
                    }));
                }}
                placeholder="Preencha aqui o número de instalação do cliente com a consessionária."
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.numeroInstalacaoConcessionaria ==
                info.numeroInstalacaoConcessionaria
              }
              onClick={() =>
                updateData(
                  "PROJETO",
                  "numeroInstalacaoConcessionaria",
                  infoHolder?.numeroInstalacaoConcessionaria
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.numeroInstalacaoConcessionaria !=
                    info.numeroInstalacaoConcessionaria
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
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
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
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
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
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="TIPO DA INSTALAÇÃO"
                value={infoHolder?.tipoInstalacao}
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
                options={[
                  {
                    id: 1,
                    label: "URBANO",
                    value: "URBANO",
                  },
                  {
                    id: 2,
                    label: "RURAL",
                    value: "RURAL",
                  },
                ]}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      tipoInstalacao: value,
                    }));
                }}
                onReset={() => {
                  if (infoHolder?.cliente)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      tipoInstalacao: null,
                    }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.tipoInstalacao == info.tipoInstalacao}
              onClick={() =>
                updateData(
                  "PROJETO",
                  "tipoInstalacao",
                  infoHolder?.tipoInstalacao
                )
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.tipoInstalacao != info.tipoInstalacao
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <h1 className="text-center text-sm font-medium text-[#fead61]">
            OUTROS
          </h1>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="CREDOR"
                value={infoHolder?.credor}
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
                options={creditors.map((item, index) => ({
                  ...item,
                  id: index + 1,
                }))}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      credor: value,
                    }));
                }}
                onReset={() => {
                  if (infoHolder?.cliente)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      credor: null,
                    }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.credor == info.credor}
              onClick={() =>
                updateData("PROJETO", "credor", infoHolder?.credor)
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.credor != info.credor
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <NumberInput
                label="PADRÃO DE ENTRADA"
                placeholder="Preencha aqui o preço do padrão de entrada, se houver troca."
                value={
                  infoHolder?.servicosAdicionais?.padrao
                    ? infoHolder?.servicosAdicionais?.padrao
                    : null
                }
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      servicosAdicionais: {
                        ...prev.servicosAdicionais,
                        padrao: Number(value),
                      },
                    }));
                }}
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.servicosAdicionais?.padrao ==
                info.servicosAdicionais?.padrao
              }
              onClick={() =>
                updateData("PROJETO", "servicosAdicionais", {
                  padrao: infoHolder?.servicosAdicionais?.padrao,
                })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.servicosAdicionais?.padrao !=
                    info.servicosAdicionais?.padrao
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <NumberInput
                label="SERVIÇOS EXTRA"
                placeholder="Preencha aqui o preço de serviços extra, se houverem."
                value={
                  infoHolder?.servicosAdicionais?.outros
                    ? infoHolder?.servicosAdicionais?.outros
                    : null
                }
                editable={
                  session?.user.id == infoHolder?.responsavel?.id ||
                  session?.user.permissoes.projetos.editar
                }
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      servicosAdicionais: {
                        ...prev.servicosAdicionais,
                        outros: Number(value),
                      },
                    }));
                }}
                width="100%"
              />
            </div>
            <button
              disabled={
                infoHolder?.servicosAdicionais?.outros ==
                info.servicosAdicionais?.outros
              }
              onClick={() =>
                updateData("PROJETO", "servicosAdicionais", {
                  outros: infoHolder?.servicosAdicionais?.outros,
                })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: "18px",
                  color:
                    infoHolder?.servicosAdicionais?.outros !=
                    info.servicosAdicionais?.outros
                      ? "rgb(34,197,94)"
                      : "rgb(156,163,175)",
                }}
              />
            </button>
          </div>
          <h1 className="text-center text-sm font-medium text-[#fead61]">
            ANEXOS
          </h1>
          <div className="w-full">
            <SingleFileInput
              label="DOCUMENTO COM FOTO"
              fileKey={"documentoComFoto"}
              handleAttachment={handleAttachment}
              currentFileUrl={infoHolder?.anexos?.documentoComFoto}
              info={info}
              infoHolder={infoHolder}
            />
          </div>
          <div className="w-full">
            <SingleFileInput
              label="IPTU"
              fileKey={"iptu"}
              handleAttachment={handleAttachment}
              currentFileUrl={infoHolder?.anexos?.iptu}
              info={info}
              infoHolder={infoHolder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsBlock;
