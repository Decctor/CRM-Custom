import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  IClient,
  IKit,
  IProject,
  IRepresentative,
  IResponsible,
  ISession,
} from "./models";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function formatToCPForCNPJ(value: string): string {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
export function formatToCEP(value: string): string {
  let cep = value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
export function formatToPhone(value: string): string {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

export function formatDate(value: any) {
  return new Date(value).toISOString().slice(0, 10);
}

export function useKitQueryPipelines(
  type: "TODOS OS KITS" | "KITS POR PREMISSA",
  payload: any
) {
  switch (type) {
    case "TODOS OS KITS":
      return [
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
      ];
    case "KITS POR PREMISSA":
      return [
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $match: {
            $and: [
              { potPico: { $gte: payload.min } },
              { potPico: { $lte: payload.max } },
            ],
          },
        },
      ];
    default:
      return [
        {
          $addFields: {
            potPico: {
              $reduce: {
                input: "$modulos",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    {
                      $multiply: ["$$this.potencia", "$$this.qtde"],
                    },
                  ],
                },
              },
            },
          },
        },
      ];
  }
}

// Hooks
export function useRepresentatives(): UseQueryResult<IRepresentative[], Error> {
  return useQuery({
    queryKey: ["representatives"],
    queryFn: async (): Promise<IRepresentative[]> => {
      try {
        const { data } = await axios.get("/api/representatives");
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    onError(err) {
      console.log("ERRO ONERROR", err);
      return err;
    },
    refetchOnWindowFocus: false,
  });
}
export function useProject(
  projectId: string,
  enabled: boolean
): UseQueryResult<IProject, Error> {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      console.log("IDp", projectId);
      try {
        const { data } = await axios.get(`/api/projects?id=${projectId}`);
        console.log("DATA", data.data);
        return data.data;
      } catch (error) {
        console.log("ERRO", error);
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
          throw error;
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return;
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
export function useResponsibles(): UseQueryResult<IResponsible[], Error> {
  return useQuery({
    queryKey: ["responsibles"],
    queryFn: async (): Promise<IResponsible[]> => {
      try {
        const { data } = await axios.get("/api/responsibles");
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    cacheTime: 300000,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
export function useResponsibleInfo(
  responsibleId: string | undefined
): IResponsible | null {
  const { data: responsible } = useQuery({
    queryKey: ["responsible", responsibleId],
    queryFn: async (): Promise<IResponsible | null> => {
      try {
        const { data } = await axios.get(
          `/api/responsibles?id=${responsibleId}`
        );
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return null;
      }
    },
    refetchOnWindowFocus: false,
    cacheTime: 300000,
    staleTime: 0,
    enabled: !!responsibleId,
  });

  if (responsible) return responsible;
  else return null;
}
export function useKits(onlyActive?: boolean): UseQueryResult<IKit[], Error> {
  return useQuery({
    queryKey: ["kits"],
    queryFn: async (): Promise<IKit[]> => {
      try {
        var url;
        if (onlyActive) url = "/api/kits/active=true";
        else url = "/api/kits";
        const { data } = await axios.get(url);
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
}
export function useClients(
  representative: string | null | undefined
): UseQueryResult<IClient[], Error> {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<IClient[]> => {
      try {
        const { data } = await axios.get(
          `/api/clients?representative=${representative}`
        );
        return data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message;
          toast.error(errorMsg);
        }
        if (error instanceof Error) {
          let errorMsg = error.message;
          toast.error(errorMsg);
        }
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
}

export function useProjects(
  funnel: number | null,
  responsible: string | null,
  after: string | undefined,
  before: string | undefined,
  session: ISession | null
): UseQueryResult<IProject[], Error> {
  return useQuery({
    queryKey: ["projects", funnel, responsible, after, before],
    queryFn: async (): Promise<IProject[]> => {
      try {
        const { data } = await axios.get(
          `/api/projects?responsible=${responsible}&funnel=${funnel}&after=${after}&before=${before}`
        );
        return data.data;
      } catch (error) {
        toast.error(
          "Erro ao buscar informações desse cliente. Por favor, tente novamente mais tarde."
        );
        return [];
      }
    },
    enabled: !!session?.user,
  });
}
