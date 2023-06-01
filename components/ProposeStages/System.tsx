import { IKit, IProject, IProposeInfo } from "@/utils/models";
import React, { useState } from "react";
import genFactors from "../../utils/generationFactors.json";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import LoadingComponent from "../utils/LoadingComponent";
import Kit from "../Cards/Kit";
import { ImSad } from "react-icons/im";
import { useKitQueryPipelines } from "@/utils/methods";
import { toast } from "react-hot-toast";
import ProposeKit from "../Cards/ProposeKit";

type SystemProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<null>>;
  moveToPreviousStage: React.Dispatch<React.SetStateAction<null>>;
};

type QueryTypes = "KITS POR PREMISSA" | "TODOS OS KITS";
function getIdealPowerInterval(
  consumption: number,
  city: string | undefined | null,
  uf: string | undefined | null
): { max: number; min: number } {
  if (!city || !uf)
    return { max: 400 + consumption / 127, min: -400 + consumption / 127 };
  const cityFactors = genFactors[city as keyof typeof genFactors];
  if (!cityFactors)
    return { max: 400 + consumption / 127, min: -400 + consumption / 127 };
  return {
    max: 400 + (consumption / cityFactors.fatorGen) * 1000,
    min: -400 + (consumption / cityFactors.fatorGen) * 1000,
  };
}
function System({
  proposeInfo,
  setProposeInfo,
  project,
  moveToNextStage,
  moveToPreviousStage,
}: SystemProps) {
  // console.log(
  //   getIdealPowerInterval(
  //     proposeInfo.premissas.consumoEnergiaMensal,
  //     project.cliente?.cidade,
  //     project.cliente?.uf
  //   )
  // );
  const [queryType, setQueryType] = useState<QueryTypes>("KITS POR PREMISSA");

  const {
    data: kits,
    isSuccess: kitsSuccess,
    isLoading: kitsLoading,
    isError: kitsError,
  } = useQuery({
    queryKey: ["queryKits", queryType],
    queryFn: async (): Promise<IKit[]> => {
      try {
        const { data } = await axios.post("/api/kits/query", {
          pipeline: useKitQueryPipelines(
            queryType,
            getIdealPowerInterval(
              proposeInfo.premissas.consumoEnergiaMensal,
              project.cliente?.cidade,
              project.cliente?.uf
            )
          ),
        });
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
      return err;
    },
  });
  function selectKit(kit: IKit) {
    const modules = kit.modulos;
    const inverters = kit.inversores;
    const price = kit.preco;
    const topology = kit.topologia;
    setProposeInfo((prev) => ({
      ...prev,
      kit: {
        kitId: kit._id ? kit._id : "",
        nome: kit.nome,
        topologia: topology,
        modulos: modules,
        inversores: inverters,
        preco: price,
      },
    }));
    moveToNextStage(null);
  }
  return (
    <div className="flex min-h-[400px] w-full flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold">KITS FECHADOS</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQueryType("KITS POR PREMISSA")}
            className={`${
              queryType == "KITS POR PREMISSA"
                ? "bg-[#fead61] text-white hover:bg-transparent hover:text-[#fead61]"
                : "text-[#fead61] hover:bg-[#fead61] hover:text-white"
            } rounded border border-[#fead61] px-2 py-1  font-medium`}
          >
            MOSTRAR KITS IDEAIS
          </button>
          <button
            onClick={() => setQueryType("TODOS OS KITS")}
            className={`${
              queryType == "TODOS OS KITS"
                ? "bg-[#15599a] text-white hover:bg-transparent hover:text-[#15599a]"
                : "text-[#15599a] hover:bg-[#15599a] hover:text-white"
            } rounded border border-[#15599a] px-2 py-1  font-medium`}
          >
            MOSTRAR TODOS OS KITS
          </button>
        </div>
      </div>

      <div className="flex w-full grow flex-wrap justify-center gap-2">
        {kitsLoading ? <LoadingComponent /> : null}
        {kitsSuccess ? (
          kits.length > 0 ? (
            kits.map((kit, index) => (
              <ProposeKit
                key={index}
                kit={kit}
                handleSelect={(value) => selectKit(value)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <ImSad style={{ fontSize: "50px", color: "#fead61" }} />
              <p className="w-full text-center text-sm italic text-gray-600 lg:w-[50%]">
                Oops, parece que não temos kits cadastrados pra essa faixa de
                potência. Contate o Volts (34 8406-4658) ou, se desejar, busque
                os demais kits clicando em{" "}
                <strong className="text-[#15599a]">
                  "Mostrar todos os kits"
                </strong>
                .
              </p>
            </div>
          )
        ) : null}
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <button
          onClick={() => moveToPreviousStage(null)}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        {/* <button
          onClick={() => console.log("TEXT")}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button> */}
      </div>
    </div>
  );
}

export default System;
