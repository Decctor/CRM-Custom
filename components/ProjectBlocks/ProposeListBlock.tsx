import React from "react";
import LoadingComponent from "../utils/LoadingComponent";
import dayjs from "dayjs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Link from "next/link";
import { IProposeInfo } from "@/utils/models";
import { MdAdd } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
type ProposeListBlock = {
  city?: string | null;
  uf?: string | null;
  projectId: string;
  projectProposes: IProposeInfo[];
  projectProposesSuccess: boolean;
  projectProposesLoading: boolean;
  projectProposesError: boolean;
  idActivePropose?: string;
  setBlockMode: React.Dispatch<
    React.SetStateAction<"PROPOSES" | "TECHNICAL ANALYSIS">
  >;
  contractSigned?: boolean;
};
function ProposeListBlock({
  city,
  uf,
  projectId,
  projectProposes,
  projectProposesSuccess,
  projectProposesLoading,
  projectProposesError,
  idActivePropose,
  contractSigned,
  setBlockMode,
}: ProposeListBlock) {
  const router = useRouter();
  return (
    <div className="flex h-[230px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:w-[60%]">
      <div className="flex  h-[40px] items-center  justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center justify-center gap-5">
          <h1 className="w-[120px] cursor-pointer border-b border-blue-500 p-1 text-center font-bold text-black hover:border-blue-500">
            Propostas
          </h1>
          <h1
            onClick={() => setBlockMode("TECHNICAL ANALYSIS")}
            className="w-fit cursor-pointer border-b border-transparent p-1 text-center font-bold text-black hover:border-blue-500"
          >
            Análises Técnicas
          </h1>
        </div>
        {contractSigned ? null : (
          <>
            <button
              onClick={() => {
                if (!city || !uf) {
                  toast.error(
                    "Por favor, preecha a cidade e o estado do cliente antes de prosseguir para geração de propostas."
                  );
                } else {
                  router.push(`/projeto/proposta/${projectId}`);
                }
              }}
              className="hidden rounded bg-green-600 p-1 text-sm font-bold text-white lg:flex"
            >
              GERAR PROPOSTA
            </button>
            <button className="flex rounded bg-green-600 p-1 text-sm font-bold text-white lg:hidden">
              <MdAdd />
            </button>
          </>
        )}
      </div>
      <div className="overscroll-y mt-3 flex w-full grow flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        <div className="flex h-[30px] min-h-[30px] w-full items-center rounded bg-black">
          <div className="flex w-full items-center justify-center lg:w-1/4">
            <h1 className="w-full text-center text-white">NOME</h1>
          </div>
          <div className="hidden items-center justify-center lg:flex lg:w-1/4">
            <h1 className="w-full text-center text-white">POTÊNCIA</h1>
          </div>

          <div className="hidden items-center justify-center lg:flex  lg:w-1/4">
            <h1 className="w-full text-center text-white">VALOR</h1>
          </div>

          <div className="hidden w-full items-center justify-center lg:flex lg:w-1/4">
            <h1 className="w-full text-center text-white">DATA INSERÇÃO</h1>
          </div>
        </div>
        <div className=" flex grow flex-col">
          {projectProposesSuccess ? (
            projectProposes.length > 0 ? (
              projectProposes.map((propose, index) => (
                <div
                  key={index}
                  className={`relative flex w-full items-center ${
                    propose.contratoSolicitado
                      ? "font-medium text-green-500"
                      : ""
                  }`}
                >
                  <div className="flex w-full items-center justify-center lg:w-1/4">
                    {propose._id == idActivePropose ? (
                      <AiFillStar style={{ color: "#15599a" }} />
                    ) : null}
                    <Link href={`/proposta/${propose._id}`}>
                      <h1 className="text-center hover:text-blue-400">
                        {propose.nome}
                      </h1>
                    </Link>
                  </div>
                  <div className="hidden items-center justify-center lg:flex lg:w-1/4">
                    <h1 className="w-full text-center">
                      {propose.potenciaPico?.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      kWp
                    </h1>
                  </div>
                  <div className="hidden items-center justify-center lg:flex lg:w-1/4">
                    <h1 className="w-full text-center">
                      R${" "}
                      {propose.valorProposta?.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="hidden items-center justify-center lg:flex lg:w-1/4">
                    <h1 className="hidden w-1/4 text-center lg:flex">
                      {propose.dataInsercao
                        ? dayjs(propose.dataInsercao).format("DD/MM/YYYY")
                        : null}
                    </h1>
                  </div>
                  {propose.assinado ? (
                    <div className="absolute right-2 flex items-center justify-center text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="flex grow items-center justify-center italic text-gray-500">
                Sem propostas vinculadas a esse projeto.
              </p>
            )
          ) : null}
          {projectProposesLoading ? (
            <div className="flex grow items-center justify-center">
              <LoadingComponent />
            </div>
          ) : null}
          {projectProposesError ? (
            <p className="flex grow items-center justify-center italic text-gray-500">
              Oops, houve um erro na busca das propostas desse projeto. Tente
              recarregar a página.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProposeListBlock;
