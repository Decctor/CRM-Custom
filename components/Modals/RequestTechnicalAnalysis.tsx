import React, { useState } from "react";
import SelectInput from "../Inputs/SelectInput";
import { VscChromeClose } from "react-icons/vsc";
import { IProject, IResponsible, ITechnicalAnalysis } from "@/utils/models";
import { formatToPhone, useResponsibles } from "@/utils/methods";
import TextInput from "../Inputs/TextInput";
import GeneralInfo from "../TechnicalAnalysisRequest/Blocks/GeneralInfo";
import SystemInfo from "../TechnicalAnalysisRequest/Blocks/SystemInfo";
import { MdAssessment } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import { FaCalculator } from "react-icons/fa";
import SolicitationTypeSelection from "../TechnicalAnalysisRequest/Blocks/SolicitationTypeSelection";
import RemoteUrban from "../TechnicalAnalysisRequest/RemoteUrban";

type RequestTechnicalAnalysisProps = {
  closeModal: () => void;
  project: IProject;
};
function getSellerContact(
  responsibles?: IResponsible[],
  responsibleId?: string
) {
  if (responsibleId && responsibles) {
    const responsible = responsibles.filter(
      (resp) => resp.id == responsibleId
    )[0];

    return responsible?.telefone ? responsible.telefone : "";
  } else {
    return "";
  }
}
function RequestTechnicalAnalysis({
  closeModal,
  project,
}: RequestTechnicalAnalysisProps) {
  console.log(project);
  const [stage, setStage] = useState(1);
  const { data: responsibles } = useResponsibles();
  const [requestInfo, setRequestInfo] = useState<ITechnicalAnalysis>({
    nomeVendedor: project.responsavel.nome,
    nomeDoCliente: project.nome,
    codigoSVB: project.identificador ? project.identificador : "",
    uf: project.cliente?.uf ? project.cliente.uf : undefined,
    cidade: project.cliente?.cidade ? project.cliente?.cidade : undefined,
    cep: project.cliente?.cep ? project.cliente?.cep : "",
    bairro: project.cliente?.bairro ? project.cliente.bairro : "",
    logradouro: project.cliente?.endereco ? project.cliente.endereco : "",
    numeroResidencia: project.cliente?.numeroOuIdentificador
      ? project.cliente.numeroOuIdentificador
      : "",
    qtdeInversor: "",
    potInversor: "",
    marcaInversor: "",
    qtdeModulos: "",
    potModulos: "",
    marcaModulos: "",
    amperagem: "",
    numeroMedidor: "",
    distanciaInversorRoteador: "",
    obsInstalacao: "",
    adaptacaoQGBT: "NÃO SE APLICA",
    alambrado: "NÃO DEFINIDO",
    avaliarTelhado: "NÃO",
    britagem: "NÃO DEFINIDO",
    casaDeMaquinas: "NÃO DEFINIDO",
    concessionaria: "",
    construcaoBarracao: "NÃO DEFINIDO",
    custosAdicionais: [],
    dataDeAbertura: "",
    dataDeConclusao: "",
    descricaoOrcamentacao: "",
    descritivo: {
      texto: "",
      topíco: "",
    },
    descritivoInfraEletrica: "",
    distanciaInversorPadrao: "",
    distanciaItbaRural: "",
    distanciaModulosInversores: "",
    distanciaSistemaInversor: "",
    distanciaSistemaQuadro: "",
    dpsQGBT: "NÃO",
    espacoQGBT: "NÃO DEFINIDO",
    estruturaMontagem: "NÃO DEFINIDO",
    fotoDroneDesenho: "NÃO",
    fotoFaixada: "NÃO",
    fotosDrone: "",
    googleEarth: "NÃO",
    infoPadraoConjugado: "",
    infraCabos: "NÃO DEFINIDO",
    instalacaoRoteador: "NÃO DEFINIDO",
    limpezaLocalUsinaSolo: "NÃO DEFINIDO",
    links: [],
    linkVisualizacaoProjeto: "",
    localAterramento: "",
    localInstalacaoInversor: "",
    localizacaoInstalacao: "",
    medidasLocal: "NÃO",
    modeloCaixa: "",
    modLeste: undefined,
    modNordeste: undefined,
    modNoroeste: undefined,
    modNorte: undefined,
    modOeste: undefined,
    modSudeste: undefined,
    modSudoeste: undefined,
    modSul: undefined,
    novaAmperagem: "",
    novaLigacaoPadrao: "",
    numeroPosteDerivacao: "",
    numeroPosteTrafo: "",
    numeroTrafo: "",
    obsDesenho: "",
    obsObras: "",
    obsProjetos: "",
    obsSuprimentos: "",
    obsVisita: "",
    orientacaoEstrutura: "",
    padraoTrafoAcoplados: "NÃO",
    pendenciasProjetos: "",
    pendenciasTrafo: "",
    potTrafo: "",
    ramalEntrada: "NÃO DEFINIDO",
    ramalSaida: "NÃO DEFINIDO",
    realimentar: "NÃO",
    redeReligacao: "NÃO DEFINIDO",
    respostaConclusao: "",
    respostaEspacoProjeto: "NÃO DEFINIDO",
    respostaEstruturaInclinacao: "NÃO DEFINIDO",
    respostaExplicacaoDetalhada: "NÃO DEFINIDO",
    respostaMaderamento: "NÃO DEFINIDO",
    respostaPadrao: "NÃO DEFINIDO",
    respostaPossuiSombra: "NÃO DEFINIDO",
    solicitacaoContrato: false,
    status: "",
    suprimentos: [],
    telefoneDoCliente: project.cliente?.telefonePrimario
      ? project.cliente.telefonePrimario
      : "",
    telefoneVendedor: getSellerContact(responsibles, project.responsavel.id),
    telhasReservas: "NÃO DEFINIDO",
    temEstudoDeCaso: "NÃO DEFINIDO",
    terraplanagemUsinaSolo: "NÃO DEFINIDO",
    tipoDeLaudo: "ESTUDO SIMPLES (36 HORAS)",
    tipoDesenho: "NÃO DEFINIDO",
    tipoDeSolicitacao: undefined,
    tipoDisjuntor: "",
    tipoEstrutura: "NÃO DEFINIDO",
    tipoFixacaoInversores: "",
    tipoInversor: "NÃO DEFINIDO",
    tipoOrcamentacao: "",
    tipoPadrao: "NÃO DEFINIDO",
    tipoProjeto: "NÃO DEFINIDO",
    tipoTelha: "NÃO DEFINIDO",
  });
  const [files, setFiles] = useState<{
    [key: string]: {
      title: string;
      file: File | null | string;
    };
  }>();
  return (
    <div
      id="ContractRequest"
      className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]"
    >
      <div className="fixed left-[50%] top-[50%] z-[100] h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">
              SOLICITAÇÃO DE CONTRATO DE SISTEMA FOTOVOLTAICO
            </h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto border-b border-gray-200 py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 ">
            <div className="my-1 flex w-full flex-wrap items-center justify-center gap-2">
              <SelectInput
                label="VENDEDOR"
                value={requestInfo.nomeVendedor}
                options={
                  responsibles
                    ? responsibles.map((responsible, index) => {
                        return {
                          id: index + 1,
                          value: responsible.nome,
                          label: responsible.nome,
                        };
                      })
                    : []
                }
                handleChange={(value) =>
                  setRequestInfo((prev) => ({ ...prev, nomeVendedor: value }))
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    nomeVendedor: undefined,
                  }))
                }
              />
              <TextInput
                label="TELEFONE DO VENDEDOR"
                value={requestInfo.telefoneVendedor}
                placeholder="Preencha aqui o telefone do vendedor."
                handleChange={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    telefoneVendedor: formatToPhone(value),
                  }))
                }
              />
            </div>
            {!requestInfo.tipoDeSolicitacao ? (
              <SolicitationTypeSelection
                selectType={(value) =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoDeSolicitacao: value,
                  }))
                }
              />
            ) : null}
            {requestInfo.tipoDeSolicitacao ==
            "VISITA TÉCNICA REMOTA - URBANA" ? (
              <RemoteUrban
                requestInfo={requestInfo}
                setRequestInfo={setRequestInfo}
                resetSolicitationType={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoDeSolicitacao: undefined,
                  }))
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestTechnicalAnalysis;
