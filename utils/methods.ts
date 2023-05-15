import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { IClient, IKit, IRepresentative, IResponsible } from "./models";
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
    refetchOnWindowFocus: false,
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
    refetchOnWindowFocus: false,
  });
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
export function useClients(): UseQueryResult<IClient[], Error> {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<IClient[]> => {
      try {
        const { data } = await axios.get("/api/clients");
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
