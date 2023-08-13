import React, { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "mongodb";
import TextInput from "../Inputs/TextInput";
import DropdownSelect from "../Inputs/DropdownSelect";
import { comissionTable, funnels, roles } from "@/utils/constants";
import { Comissao, IUsuario } from "../../utils/models";
import { formatToPhone } from "@/utils/methods";
import { VscChromeClose } from "react-icons/vsc";
import { MdRemoveCircle } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { BsCheckLg } from "react-icons/bs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/firebase";
import NumberInput from "../Inputs/NumberInput";
import MultipleSelectInput from "../Inputs/MultipleSelectInput";
interface IUserInfo {
  _id?: ObjectId | string;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  visibilidade: "GERAL" | "PRÓPRIA" | string[];
  funisVisiveis: number[] | "TODOS";
  grupoPermissaoId: string | number | null;
  comissao: Comissao | null;
  avatar_url?: string;
  permissoes:
    | {
        usuarios: {
          visualizar: boolean; // visualizar área de usuário em auth/users
          editar: boolean; // criar usuários e editar informações de usuários em auth/users
        };
        comissoes: {
          visualizar: boolean; // visualizar comissões de todos os usuários
          editar: boolean; // editar comissões de todos os usuários
        };
        kits: {
          visualizar: boolean; // visualizar área de kits e kits possíveis
          editar: boolean; // editar e criar kits
        };
        propostas: {
          visualizar: boolean; // visualizar área de controle de propostas
          editar: boolean; // criar propostas em qualquer projeto e editar propostas de outros usuários
        };
        projetos: {
          serResponsavel: boolean; // habilitado a ser responsável de projetos
          editar: boolean; // editar informações de todos os projetos
        };
        clientes: {
          serRepresentante: boolean; // habilitado a ser representante de clientes
          editar: boolean; // editar informações de todos os clientes
        };
        precos: {
          visualizar: boolean; // visualizar precificacao geral, com custos, impostos, lucro e afins de propostas e kits
          editar: boolean; // editar precificacao de propostas
        };
      }
    | any;
}
type EditUserProps = {
  user: IUserInfo;
  users?: IUsuario[];
  closeModal: () => void;
};
function EditUser({ user, closeModal, users }: EditUserProps) {
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | null>();
  const [userInfo, setUserInfo] = useState<IUserInfo>(user);
  const [changePasswordMenu, setChangePasswordMenu] = useState<boolean>();
  async function uploadImage() {
    var splitNome = user.nome.toLowerCase().split(" ");
    var fixedNome = splitNome.join("_");
    var imageRef = ref(storage, `usuarios/crm/avatar-${fixedNome}`);
    if (image) {
      let res = await uploadBytes(imageRef, image);
      let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
      return url;
    }
  }
  const { mutate } = useMutation({
    mutationFn: async () => {
      var url;
      if (image) {
        url = await uploadImage();
      }
      var changes;
      if (url) {
        changes = { ...userInfo, avatar_url: url };
      } else {
        changes = userInfo;
      }
      try {
        let { data } = await axios.put(`/api/users?id=${userInfo._id}`, {
          changes: changes,
          changePassword: user.senha != userInfo.senha,
        });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(data.message);
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
  console.log(userInfo);
  return (
    <div
      id="defaultModal"
      className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]"
    >
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[50%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">
              NOVO USUÁRIO
            </h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="flex h-[200px]  flex-col items-center justify-center">
              {!image && user.avatar_url ? (
                <div className="relative mb-3 h-[120px] w-[120px] cursor-pointer rounded-full">
                  <Image
                    src={user.avatar_url}
                    // width={96}
                    // height={96}
                    fill={true}
                    alt="AVATAR"
                    style={{
                      borderRadius: "100%",
                      objectFit: "cover",
                      position: "absolute",
                    }}
                  />
                  <input
                    onChange={(e) => {
                      if (e.target.files) setImage(e.target.files[0]);
                    }}
                    className="h-full w-full opacity-0"
                    type="file"
                  />
                </div>
              ) : image ? (
                <div className="relative mb-3 flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-full bg-gray-200">
                  {/* <Image
                    src={user.avatar_url}
                    // width={96}
                    // height={96}
                    alt="AVATAR"
                    fill={true}
                    style={{
                      borderRadius: "100%",
                      objectFit: "cover",
                      position: "absolute",
                    }}
                  /> */}
                  <div className="absolute flex items-center justify-center">
                    <BsCheckLg style={{ color: "green", fontSize: "25px" }} />
                  </div>
                  <input
                    onChange={(e) => {
                      if (e.target.files) setImage(e.target.files[0]);
                    }}
                    className="h-full w-full opacity-0"
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </div>
              ) : (
                <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full border border-gray-300 bg-gray-200">
                  {image ? (
                    <div className="absolute flex items-center justify-center">
                      <BsCheckLg style={{ color: "green", fontSize: "25px" }} />
                    </div>
                  ) : (
                    <p className="absolute w-full text-center text-xs font-bold text-gray-700">
                      ESCOLHA UMA IMAGEM
                    </p>
                  )}

                  <input
                    onChange={(e) => {
                      if (e.target.files) setImage(e.target.files[0]);
                    }}
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg"
                  />
                </div>
              )}
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 items-center gap-2 lg:grid-cols-2 lg:grid-rows-1 lg:items-start">
              <TextInput
                label="NOME E SOBRENOME"
                value={userInfo.nome}
                placeholder="Preencha aqui o nome do usuário."
                handleChange={(value) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    nome: value,
                  }))
                }
                width="100%"
              />
              <TextInput
                label="EMAIL"
                value={userInfo.email}
                placeholder="Preencha aqui o email do usuário."
                handleChange={(value) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    email: value,
                  }))
                }
                width="100%"
              />
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 items-center gap-2 lg:grid-cols-2 lg:grid-rows-1 lg:items-start">
              <TextInput
                label="TELEFONE"
                value={userInfo.telefone ? userInfo.telefone : ""}
                placeholder="Preencha aqui o telefone do usuário."
                handleChange={(value) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    telefone: formatToPhone(value),
                  }))
                }
                width="100%"
              />
              <div className="flex w-full flex-col gap-1">
                {changePasswordMenu ? (
                  <div className="flex w-full items-center justify-center">
                    <TextInput
                      label="ALTERAÇÃO DE SENHA"
                      placeholder="Preencha aqui a nova senha"
                      value={userInfo.senha}
                      width="100%"
                      handleChange={(value) =>
                        setUserInfo((prev) => ({ ...prev, senha: value }))
                      }
                    />
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-1">
                    <label className="font-sans font-bold  text-[#353432]">
                      SENHA
                    </label>
                    <button
                      onClick={() => setChangePasswordMenu(true)}
                      className={`mt-1 flex w-fit gap-1 self-center rounded-md bg-[#fead41] p-2 text-sm font-medium text-black`}
                    >
                      RESETAR SENHA
                    </button>
                  </div>
                )}
                {/* {userInfo.senha != "123456" ? (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() =>
                        setUserInfo((prev) => ({
                          ...prev,
                          senha: "123456",
                        }))
                      }
                      className={`mt-1 flex gap-1 rounded-md bg-[#fead41] p-2 text-sm font-medium text-black`}
                    >
                      RESETAR SENHA
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <p
                      className={`mt-1 flex gap-1 rounded-md p-2 text-sm font-medium italic text-black`}
                    >
                      Senha padrão (123456)
                    </p>
                  </div>
                )} */}
              </div>
            </div>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full items-center gap-2">
                <div className="w-[50%]">
                  <NumberInput
                    label="COMISSÃO SEM REPRESENTANTE (%)"
                    placeholder="% SEM REPRESENTANTE"
                    value={
                      userInfo.comissao
                        ? userInfo.comissao.semRepresentante
                        : null
                    }
                    handleChange={(value) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        comissao: {
                          ...prev.comissao,
                          semRepresentante: value,
                          comRepresentante: prev.comissao
                            ? prev.comissao.comRepresentante
                            : 0,
                        },
                      }))
                    }
                    width="100%"
                  />
                </div>
                <div className="w-[50%]">
                  <NumberInput
                    label="COMISSÃO COM REPRESENTANTE (%)"
                    placeholder="% COM REPRESENTANTE"
                    value={
                      userInfo.comissao
                        ? userInfo.comissao.comRepresentante
                        : null
                    }
                    handleChange={(value) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        comissao: {
                          semRepresentante: prev.comissao
                            ? prev.comissao.comRepresentante
                            : 0,
                          comRepresentante: value,
                        },
                      }))
                    }
                    width="100%"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col gap-1">
                <label className="font-sans font-bold  text-[#353432]">
                  GRUPO DE PERMISSÃO
                </label>
                <DropdownSelect
                  selectedItemLabel="A SELECIONAR"
                  categoryName="GRUPO DE PERMISSÃO"
                  value={userInfo.grupoPermissaoId}
                  options={roles.map((role) => {
                    return {
                      id: role.id,
                      label: role.role,
                      value: role.permissoes,
                    };
                  })}
                  width="100%"
                  onChange={(value: any) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      grupoPermissaoId: value.id,
                      permissoes: value.value,
                    }))
                  }
                  onReset={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      grupoPermissaoId: null,
                      permissoes: undefined,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-1">
              <label className="font-sans font-bold  text-[#353432]">
                VISIBILIDADE DE PROJETOS/CLIENTES/ATIVIDADES
              </label>
              <div className="mt-3 flex items-center justify-center gap-4">
                <div
                  onClick={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      visibilidade: "PRÓPRIA",
                    }))
                  }
                  className={`rounded ${
                    userInfo.visibilidade == "PRÓPRIA"
                      ? "opacity-100"
                      : "opacity-30"
                  } cursor-pointer border border-[#fead41] p-2 font-bold text-[#fead41]`}
                >
                  PRÓPRIA
                </div>
                <div
                  onClick={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      visibilidade: "GERAL",
                    }))
                  }
                  className={`rounded ${
                    userInfo.visibilidade == "GERAL"
                      ? "opacity-100"
                      : "opacity-30"
                  } cursor-pointer border border-green-500 p-2 font-bold text-green-500`}
                >
                  GERAL
                </div>
                <div
                  onClick={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      visibilidade: [],
                    }))
                  }
                  className={`rounded ${
                    typeof userInfo.visibilidade == "object"
                      ? "opacity-100"
                      : "opacity-30"
                  } cursor-pointer border border-[#fbcb83] p-2 font-bold text-[#fbcb83]`}
                >
                  PERSONALIZADA
                </div>
              </div>
              {typeof userInfo.visibilidade == "object" ? (
                <div className="my-2 flex w-full flex-col items-center">
                  <h1 className="w-full text-center text-sm font-medium text-gray-500">
                    ADICIONAR USUÁRIOS A VISIBILIDADE DESSE USUÁRIO
                  </h1>
                  <MultipleSelectInput
                    label="USUÁRIOS"
                    options={
                      users
                        ? users.map((user, index) => {
                            return {
                              id: index + 1,
                              label: user.nome,
                              value: user._id,
                            };
                          })
                        : null
                    }
                    handleChange={(value: string[]) =>
                      setUserInfo((prev) => ({ ...prev, visibilidade: value }))
                    }
                    selected={userInfo.visibilidade}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => {
                      setUserInfo((prev) => ({ ...prev, visibilidade: [] }));
                    }}
                  />
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex w-full flex-col items-center gap-1">
              <label className="text-center font-sans font-bold text-[#353432]">
                FUNIS
              </label>
              <div className="mt-1 flex items-center justify-center gap-4">
                <div
                  onClick={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      funisVisiveis: "TODOS",
                    }))
                  }
                  className={`rounded ${
                    userInfo.funisVisiveis == "TODOS"
                      ? "opacity-100"
                      : "opacity-30"
                  } cursor-pointer border border-green-500 p-2 font-bold text-green-500`}
                >
                  TODOS
                </div>
                <div
                  onClick={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      funisVisiveis: [],
                    }))
                  }
                  className={`rounded ${
                    userInfo.funisVisiveis != "TODOS"
                      ? "opacity-100"
                      : "opacity-30"
                  } cursor-pointer border border-[#fbcb83] p-2 font-bold text-[#fbcb83]`}
                >
                  ALGUNS
                </div>
              </div>
              {userInfo.funisVisiveis != "TODOS" &&
                funnels.map((funnel) => (
                  <div
                    className={`flex w-full items-center justify-between gap-4 ${
                      typeof userInfo.funisVisiveis == "object" &&
                      userInfo.funisVisiveis.includes(funnel.id)
                        ? "bg-green-300"
                        : "bg-red-300"
                    } mt-2 rounded-lg px-1 py-2 lg:w-[40%]`}
                  >
                    <p className="text-sm font-medium text-white">
                      {funnel.nome}
                    </p>
                    {typeof userInfo.funisVisiveis == "object" &&
                    userInfo.funisVisiveis.includes(funnel.id) ? (
                      <div
                        onClick={() => {
                          let arr =
                            typeof userInfo.funisVisiveis == "object"
                              ? userInfo.funisVisiveis
                              : [];
                          let index = arr.indexOf(funnel.id);

                          arr.splice(index, 1);

                          setUserInfo((prev) => ({
                            ...prev,
                            funisVisiveis: arr,
                          }));
                        }}
                        className="cursor-pointer text-red-300 hover:text-red-500"
                      >
                        <MdRemoveCircle />
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          let arr =
                            typeof userInfo.funisVisiveis == "object"
                              ? userInfo.funisVisiveis
                              : [];
                          arr.push(funnel.id);
                          setUserInfo((prev) => ({
                            ...prev,
                            funisVisiveis: arr,
                          }));
                        }}
                        className="cursor-pointer text-green-300 hover:text-green-500"
                      >
                        <IoMdAddCircle />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex w-full grow items-end justify-end">
              <button
                onClick={() => mutate()}
                className="rounded-md border border-[#fbcb83] p-2 font-medium text-[#fbcb83] duration-300 ease-in-out  hover:bg-[#fbcb83] hover:text-white"
              >
                SALVAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
