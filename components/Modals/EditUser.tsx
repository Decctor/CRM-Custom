import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "../Inputs/TextInput";
import { formatToPhone } from "@/utils/methods";
import DropdownSelect from "../Inputs/DropdownSelect";
import { comissionTable, funnels, roles } from "@/utils/constants";
import { MdRemoveCircle } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Comissao } from "../../utils/models";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "mongodb";

interface IUserInfo {
  _id?: ObjectId | string;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  visibilidade: "GERAL" | "PRÓPRIA" | string[];
  funisVisiveis: number[] | "TODOS";
  grupoPermissaoId: string | number;
  comissao: Comissao | null;
  permissoes:
    | {
        usuarios: {
          visualizar: boolean;
          editar: boolean;
        };
        comissoes: {
          visualizarComissaoResponsavel: boolean;
          editarComissaoResponsavel: boolean;
          visualizarComissaoRepresentante: boolean;
          editarComissaoRepresentante: boolean;
        };
        dimensionamento: {
          editarPremissas: boolean;
          editarFatorDeGeracao: boolean;
          editarInclinacao: boolean;
          editarDesvio: boolean;
          editarDesempenho: boolean;
          editarSombreamento: boolean;
        };
        kits: {
          visualizar: boolean;
          editar: boolean;
        };
        tabelaVenda: {
          visualizarItens: boolean;
          habitarDesabilitarItens: boolean;
          editarQuantidades: boolean;
          adicionarItens: boolean;
          visualizarPrecos: boolean;
          visualizarMargem: boolean;
          editarMargem: boolean;
        };
        projetos: {
          serResponsavel: boolean;
          editarResponsavel: boolean;
          visualizarDocumentos: boolean;
          editarDocumentos: boolean;
        };
        clientes: {
          serRepresentante: boolean;
          editarRepresentante: boolean;
        };
      }
    | any;
}
type EditUserProps = {
  user: IUserInfo;
  closeModal: () => void;
};
function EditUser({ user, closeModal }: EditUserProps) {
  const queryClient = useQueryClient();

  const [userInfo, setUserInfo] = useState<IUserInfo>(user);
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        let { data } = await axios.put(`/api/users?id=${userInfo._id}`, {
          changes: userInfo,
          changePassword: user.senha != userInfo.senha,
        });
        console.log("res", data);
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
          <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 ">
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
                <label className="font-sans font-bold  text-[#353432]">
                  SENHA
                </label>
                {userInfo.senha != "123456" ? (
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
                )}
              </div>
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 items-center gap-2 lg:grid-cols-2 lg:grid-rows-1 lg:items-start">
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
                      value: role.role,
                      permissoes: role.permissoes,
                    };
                  })}
                  width="100%"
                  onChange={(value: any) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      permissoes: value.permissoes,
                    }))
                  }
                  onReset={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      permissoes: userInfo.permissoes,
                    }))
                  }
                />
              </div>
              <div className="flex w-full flex-col gap-1">
                <label
                  htmlFor="responsavel"
                  className="font-sans font-bold  text-[#353432]"
                >
                  COMISSÃO
                </label>
                <DropdownSelect
                  selectedItemLabel="A SELECIONAR"
                  categoryName="COMISSÃO"
                  value={userInfo.comissao ? userInfo.comissao.id : ""}
                  options={comissionTable.map((value) => {
                    return {
                      id: value.id,
                      label: value.nome,
                      value: value.nome,
                    };
                  })}
                  width="100%"
                  onChange={(value: any) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      comissao: {
                        id: value.id,
                        nome: value.value,
                      },
                    }))
                  }
                  onReset={() =>
                    setUserInfo((prev) => ({
                      ...prev,
                      comissao: null,
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
                  } cursor-pointer border border-[#15599a] p-2 font-bold text-[#15599a]`}
                >
                  GERAL
                </div>
              </div>
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
                  } cursor-pointer border border-[#15599a] p-2 font-bold text-[#15599a]`}
                >
                  ALGUNS
                </div>
              </div>
              {userInfo.funisVisiveis != "TODOS" &&
                funnels.map((funnel) => (
                  <div
                    className={`flex w-full items-center justify-between gap-4 ${
                      userInfo.funisVisiveis.includes(funnel.id)
                        ? "bg-green-300"
                        : "bg-red-300"
                    } mt-2 rounded-lg px-1 py-2 lg:w-[40%]`}
                  >
                    <p className="text-sm font-medium text-white">
                      {funnel.nome}
                    </p>
                    {userInfo.funisVisiveis.includes(funnel.id) ? (
                      <div
                        onClick={() => {
                          let arr = userInfo.funisVisiveis
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
                          let arr = userInfo.funisVisiveis
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
                className="rounded-md border border-[#15599a] p-2 font-medium text-[#15599a] duration-300 ease-in-out  hover:bg-[#15599a] hover:text-white"
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
