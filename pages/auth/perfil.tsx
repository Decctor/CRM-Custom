import { Sidebar } from "@/components/Sidebar";
import LoadingPage from "@/components/utils/LoadingPage";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/services/firebase";
import { useNotifications } from "@/utils/methods";
import NotificationCard from "@/components/Cards/Notification";
function isValidMongoId(id: string | string[] | undefined): boolean {
  if (typeof id != "string") return false;
  const mongoIdPattern = /^[a-fA-F0-9]{24}$/; // Regex pattern for MongoDB ID

  return mongoIdPattern.test(id);
}

function Profile() {
  const queryClient = useQueryClient();
  const { query } = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const [changePassword, setChangePassword] = useState<{
    isOpen: boolean;
    value: string;
  }>({ isOpen: false, value: "" });
  const { data: notifications } = useNotifications(session?.user.id);
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    status,
    refetch,
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
  const { mutate: updateUser } = useMutation({
    mutationKey: ["editUser"],
    mutationFn: async (changes?: { [key: string]: any }) => {
      console.log("mudanças", changes);
      try {
        var updateObj;

        if (changes?.newPassword) {
          updateObj = {
            changePassword: true,
            changes: {
              senha: changes.newPassword,
            },
          };
        }
        if (image) {
          const url = await uploadImage();
          updateObj = {
            changes: {
              avatar_url: url,
            },
          };
        }
        if (!updateObj) return;
        const { data } = await axios.put(
          `/api/users?id=${user?._id}`,
          updateObj
        );
        // queryClient.invalidateQueries({ queryKey: ["project"] });
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
      return;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["user", query.id] });
    },
    onSettled: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["user", query.id],
      });
      // refetch();
      setImage(null);
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      if (data.message) toast.success(data.message);
    },
  });

  async function uploadImage() {
    var splitNome = user ? user.nome.toLowerCase().split(" ") : [];
    var fixedNome = splitNome.join("_");
    var imageRef = ref(storage, `usuarios/crm/avatar-${fixedNome}`);
    if (image) {
      let res = await uploadBytes(imageRef, image);
      let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
      return url;
    }
  }
  const [image, setImage] = useState<File | null>();
  console.log(user);
  if (isLoading) return <LoadingPage />;
  if (isSuccess)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#393E46] p-6">
          <div className="flex w-full grow flex-col items-center justify-center gap-4 md:flex-row">
            <div className="flex h-fit w-full flex-col  rounded-md border border-gray-300 bg-[#fff] p-4 md:h-[80%] md:w-[40%]">
              <div className="flex w-full grow flex-col">
                <h1 className="text-center font-Raleway text-2xl font-bold uppercase text-[#fbcb83]">
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
                        accept=".png, .jpeg"
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
                        <BsCheckLg
                          style={{ color: "green", fontSize: "25px" }}
                        />
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
                {image ? (
                  <button
                    onClick={() => updateUser({})}
                    className="h-[40px] self-center rounded-md bg-green-300 p-1 px-3 text-white shadow-sm hover:bg-green-500"
                  >
                    ATUALIZAR FOTO
                  </button>
                ) : null}
                <h1 className="text-center text-xl font-medium">{user.nome}</h1>
                <p className="w-full text-center font-Raleway text-gray-500">
                  {user.email}
                </p>
                <p className="w-full text-center font-Raleway text-gray-500">
                  {user.telefone ? user.telefone : "Sem telefone cadastrao..."}
                </p>
                <div className="mt-4 flex w-full flex-col gap-4 border-t border-gray-200 py-4">
                  <div className="flex w-full flex-col">
                    <h1 className="text-center font-bold">
                      GRUPO DE PERMISSÃO
                    </h1>
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
                      <button
                        onClick={() =>
                          updateUser({
                            newPassword: changePassword.value,
                          })
                        }
                        className="h-[40px] rounded-md bg-green-300 p-1 px-3 text-white shadow-sm hover:bg-green-500"
                      >
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
                  <div className="flex min-h-[75px] w-full flex-col items-center justify-center gap-1">
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
            <div className="flex h-fit w-full grow flex-col rounded-md border border-gray-300 bg-[#fff] p-4 md:h-[80%] md:w-[60%]">
              <h1 className="mb-4 text-center font-Raleway text-2xl font-bold uppercase text-[#fbcb83]">
                Histórico de Notificações
              </h1>
              {notifications && notifications?.length > 0 ? (
                notifications.map((notification, index) => (
                  <NotificationCard key={index} notification={notification} />
                ))
              ) : (
                <div className="flex grow items-center justify-center">
                  <h1 className="text-sm italic text-gray-500">
                    Sem notificações encontradas.
                  </h1>
                </div>
              )}
            </div>
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
