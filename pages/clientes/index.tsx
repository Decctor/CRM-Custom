import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { IClient, IRepresentative } from "@/utils/models";
import NewClientModal from "@/components/Modals/NewClient";
import { Sidebar } from "@/components/Sidebar";
import LoadingPage from "@/components/utils/LoadingPage";
import EditClient from "@/components/Modals/EditClient";
import { useClients, useRepresentatives } from "@/utils/methods";
import LoadingComponent from "@/components/utils/LoadingComponent";

function Clientes() {
  // Session
  const { data: session, status } = useSession({ required: true });

  // States
  const [newClientModalIsOpen, setNewClientModalIsOpen] = useState(false);

  const [editClientIsOpen, setEditClientIsOpen] = useState<boolean>(false);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  // Queries and functions
  const { data: representatives = [] } = useRepresentatives();
  const {
    data: clients = [],
    isLoading: clientsLoading,
    isSuccess: clientsSuccess,
  } = useClients(
    session?.user.visibilidade != "GERAL" ? session?.user.id : null
  );
  const { data: editClient, refetch }: UseQueryResult<IClient, Error> =
    useQuery({
      queryKey: ["editModal", editClientId],
      queryFn: async (x) => {
        try {
          const { data } = await axios.get(`/api/clients?id=${editClientId}`);
          return data.data;
        } catch (error) {
          toast.error(
            "Erro ao buscar informações desse cliente. Por favor, tente novamente."
          );
        }
      },
      enabled: !!editClientId,
    });

  async function handleOpenEditClientModal(clientId: string) {
    setEditClientId(clientId);
    setEditClientIsOpen(true);
  }
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex flex-col items-center justify-between border-b border-[#fead61] pb-2 xl:flex-row">
          <h1 className="flex font-['Roboto'] text-2xl font-bold text-[#fead61]">
            CLIENTES
          </h1>
        </div>
        <div className="mt-4  flex flex-wrap justify-around gap-3">
          {clientsSuccess ? (
            clients.length > 0 ? (
              clients.map((client) => (
                <div
                  onClick={() => {
                    handleOpenEditClientModal(client._id ? client._id : "");
                  }}
                  key={client._id}
                  className="flex h-[100px] w-[450px] cursor-pointer flex-col border border-gray-300 bg-[#fff] p-2 shadow-sm duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-100"
                >
                  <div className="flex w-full items-center justify-between">
                    <h1 className="font-medium text-gray-600">{client.nome}</h1>
                    <h1 className="font-medium text-[#15599a]">
                      {client.cidade}
                    </h1>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between">
                    <div className="flex flex-col items-start">
                      <p className="text-xs text-gray-500">REPRESENTANTE</p>
                      <h1 className="text-sm font-medium text-[#fead61]">
                        {client.representante?.nome}
                      </h1>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="w-full text-end text-xs text-gray-500">
                        CONTATO
                      </p>
                      <h1 className="text-sm font-medium text-[#fead61]">
                        {client.telefonePrimario}
                      </h1>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex grow flex-col items-center justify-center">
                <p className="text-lg italic text-gray-500">
                  Oops, parece que não há clientes cadastrados pelo seu usuário.
                </p>
                <p className="text-lg italic text-gray-500">
                  Clique em{" "}
                  <strong className="text-[#15599a]">NOVO CLIENTE</strong> para
                  criar um !
                </p>
              </div>
            )
          ) : null}
          {clientsLoading ? <LoadingComponent /> : null}
        </div>
        <button
          onClick={() => setNewClientModalIsOpen(true)}
          className="fixed bottom-10 left-[100px] cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
        >
          <p className="font-bold">NOVO CLIENTE</p>
        </button>
      </div>
      {newClientModalIsOpen ? (
        <NewClientModal
          representatives={representatives}
          closeModal={() => setNewClientModalIsOpen(false)}
        />
      ) : null}
      {editClientIsOpen && editClient ? (
        <EditClient
          user={{
            id: session ? session.user.id : "",
            nome: session ? session.user.name : "",
          }}
          updateInfo={refetch}
          client={editClient}
          representatives={representatives}
          closeModal={() => {
            setEditClientIsOpen(false);
            setEditClientId(null);
          }}
        />
      ) : null}
    </div>
  );
}

export default Clientes;
