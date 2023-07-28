import { Sidebar } from "@/components/Sidebar";
import LoadingPage from "@/components/utils/LoadingPage";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsCheckLg } from "react-icons/bs";
import ErrorPage from "next/error";
import { IUsuario } from "@/utils/models";
import { funnels, roles } from "@/utils/constants";
import TextInput from "@/components/Inputs/TextInput";
import { VscChromeClose } from "react-icons/vsc";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
function isValidMongoId(id: string | string[] | undefined): boolean {
  if (typeof id != "string") return false;
  const mongoIdPattern = /^[a-fA-F0-9]{24}$/; // Regex pattern for MongoDB ID

  return mongoIdPattern.test(id);
}

function Profile() {
  const { query } = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const [changePassword, setChangePassword] = useState<{
    isOpen: boolean;
    value: string;
  }>({ isOpen: false, value: "" });
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    status,
  }: UseQueryResult<IUsuario, Error> = useQuery<IUsuario, Error>({
    queryKey: ["user", query.id],
    queryFn: async () => {
      try {
        if (!isValidMongoId(query.id)) throw new Error("ID inválido.");
        const { data } = await axios.get(`/api/users?id=${query.id}`);

        return data.data;
      } catch (error) {
        console.log("ERROR", error);
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
  });
  const [image, setImage] = useState<File | null>();
  console.log(user);
  if (isLoading) return <LoadingPage />;
  if (isSuccess)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex w-full grow items-center justify-center gap-4">
            <div className="flex h-[80%] w-[40%] flex-col rounded-md border border-gray-300 bg-[#fff] p-4">
              <h1 className="text-center font-Poppins text-2xl font-bold text-[#15599a]">
                Meu Perfil
              </h1>
              <div className="flex h-[160px]  flex-col items-center justify-center">
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
                        <BsCheckLg
                          style={{ color: "green", fontSize: "25px" }}
                        />
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
              <h1 className="text-center text-xl font-medium">{user.nome}</h1>
              <p className="w-full text-center font-Raleway text-gray-500">
                {user.email}
              </p>
              <p className="w-full text-center font-Raleway text-gray-500">
                {user.telefone ? user.telefone : "Sem telefone cadastrao..."}
              </p>
              <div className="mt-4 flex w-full flex-col gap-4 border-t border-gray-200 py-4">
                <div className="flex w-full flex-col">
                  <h1 className="text-center font-bold">GRUPO DE PERMISSÃO</h1>
                  <h1 className="text-center uppercase text-gray-500">
                    {
                      roles.find((role) => role.id == user.grupoPermissaoId)
                        ?.role
                    }
                  </h1>
                </div>
                <div className="flex w-full flex-col">
                  <h1 className="text-center font-bold">VISIBILIDADE</h1>
                  <h1 className="text-center text-gray-500">
                    {typeof user.visibilidade == "string"
                      ? user.visibilidade
                      : "PERMISSÃO"}
                  </h1>
                </div>
                <div className="flex w-full flex-col">
                  <h1 className="text-center font-bold">FUNIS VÍSIVEIS</h1>
                  <h1 className="text-center text-gray-500">
                    {user.funisVisiveis != "TODOS"
                      ? funnels
                          .filter((funnelOpt) =>
                            // @ts-ignore
                            user.funisVisiveis.includes(funnelOpt.id)
                          )
                          .map((funnel) => <p>{funnel.nome}</p>)
                      : "TODOS"}
                  </h1>
                </div>
              </div>
              <div className="mt-4 flex w-full flex-col gap-1 border-t border-gray-200 py-4">
                {changePassword.isOpen ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <div className="grow">
                      <TextInput
                        label="ALTERAÇÃO DE SENHA"
                        placeholder="Preencha aqui a nova senha"
                        value={changePassword.value}
                        width="100%"
                        handleChange={(value) =>
                          setChangePassword((prev) => ({
                            ...prev,
                            value: value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex h-full items-end justify-center gap-2 pb-1">
                      <button className="h-[40px] rounded-md bg-green-300 p-1 px-3 text-white shadow-sm hover:bg-green-500">
                        <HiCheck />
                      </button>
                      <button
                        onClick={() =>
                          setChangePassword((prev) => ({
                            ...prev,
                            isOpen: false,
                            value: "",
                          }))
                        }
                        className="h-[40px] rounded-md bg-red-300 p-1 px-3 text-white shadow-sm hover:bg-red-500"
                      >
                        <VscChromeClose />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-1">
                    <button
                      onClick={() =>
                        setChangePassword((prev) => ({
                          ...prev,
                          isOpen: true,
                        }))
                      }
                      className={`mt-1 flex w-fit gap-1 self-center rounded-md bg-[#fead41] p-2 text-sm font-medium text-black`}
                    >
                      ALTERAR SENHA
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex h-[80%] w-[60%] grow flex-col rounded-md border border-gray-300 bg-[#fff]"></div>
          </div>
        </div>
      </div>
    );
  if (isError)
    return (
      <ErrorPage title="ID inválido" statusCode={404} withDarkMode={true} />
    );
}

export default Profile;
