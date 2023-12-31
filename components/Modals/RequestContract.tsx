import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "../Inputs/TextInput";
import DateInput from "../Inputs/DateInput";
import {
  checkQueryEnableStatus,
  formatDate,
  formatToCEP,
  formatToCPForCNPJ,
  formatToPhone,
  getEstimatedGen,
  getModulesQty,
  useClient,
  useResponsibles,
} from "@/utils/methods";
import SelectInput from "../Inputs/SelectInput";
import {
  customersAcquisitionChannels,
  customersNich,
  signMethods,
} from "@/utils/constants";
import NumberInput from "../Inputs/NumberInput";
import { AiOutlineSearch } from "react-icons/ai";
import {
  IClient,
  IContractRequest,
  IProposeInfo,
  IProposeOeMInfo,
  IResponsible,
} from "@/utils/models";
import { useSession } from "next-auth/react";
import { stateCities } from "@/utils/estados_cidades";
import ContractInfo from "../ContractRequest/SolarSystem/ContractInfo";
import JourneyInfo from "../ContractRequest/SolarSystem/JourneyInfo";
import HomologationInfo from "../ContractRequest/SolarSystem/HomologationInfo";
import SystemInfo from "../ContractRequest/SolarSystem/SystemInfo";
import StructureInfo from "../ContractRequest/SolarSystem/StructureInfo";
import OeMPlansInfo from "../ContractRequest/SolarSystem/OeMPlansInfo";
import PAInfo from "../ContractRequest/SolarSystem/PAInfo";
import PaymentInfo from "../ContractRequest/SolarSystem/PaymentInfo";
import DocumentAttachmentInfo from "../ContractRequest/SolarSystem/DocumentAttachmentInfo";
import CreditDistributionInfo from "../ContractRequest/SolarSystem/CreditDistributionInfo";
import ReviewInfo from "../ContractRequest/SolarSystem/ReviewInfo";
import { Pricing } from "@/utils/pricing/methods";
import SolarSystemForm from "../ContractRequest/SolarSystemForm";
import OeMForm from "../ContractRequest/OeMForm";
type ContractRequestProps = {
  closeModal: () => void;
  proposeInfo: IProposeInfo | IProposeOeMInfo;
};
type getRequestObjectByProjectTypeArguments = {
  propose: IProposeInfo | IProposeOeMInfo;
  projectType?: "SISTEMA FOTOVOLTAICO" | "OPERAÇÃO E MANUTENÇÃO";
  responsibles?: IResponsible[];
  client?: IClient;
};

// Utility functions for this Modal
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
function getSolarSystemContractValueWithoutAdditionalCosts(
  pricing: IProposeInfo["precificacao"]
): number {
  var totalSum = 0;
  if (pricing) {
    Object.keys(pricing).map((key) => {
      if (!["padrao", "estrutura", "extra"].includes(key)) {
        const sellingValue = pricing[key as keyof Pricing]?.vendaFinal;
        if (sellingValue) totalSum = totalSum + sellingValue;
      }
    });
    return Number(totalSum.toFixed(2));
  } else {
    return Number(totalSum.toFixed(2));
  }
}
function getOeMPlanById(id: number): IContractRequest["planoOeM"] {
  if (id == 1) {
    return "MANUTENÇÃO SIMPLES";
  }
  if (id == 2) {
    return "PLANO SOL";
  }
  if (id == 3) {
    return "PLANO SOL +";
  }
  return "NÃO SE APLICA";
}

function getRequestObjectByProjectType({
  propose,
  projectType,
  responsibles,
  client,
}: getRequestObjectByProjectTypeArguments): IContractRequest {
  var proposeInfo;
  switch (projectType) {
    case "SISTEMA FOTOVOLTAICO":
      proposeInfo = propose as IProposeInfo;
      return {
        nomeVendedor: proposeInfo.infoProjeto?.responsavel.nome
          ? proposeInfo.infoProjeto?.responsavel.nome
          : "",
        nomeDoProjeto: proposeInfo.infoProjeto?.nome
          ? proposeInfo.infoProjeto?.nome
          : "",
        telefoneVendedor: getSellerContact(
          responsibles,
          proposeInfo.infoProjeto?.responsavel.id
        ),
        tipoDeServico: proposeInfo.infoProjeto?.tipoProjeto
          ? proposeInfo.infoProjeto?.tipoProjeto
          : "SISTEMA FOTOVOLTAICO",
        nomeDoContrato: proposeInfo.infoProjeto?.nome
          ? proposeInfo.infoProjeto?.nome
          : "",
        telefone: "",
        cpf_cnpj: "",
        rg: "",
        dataDeNascimento: null,
        cep: "",
        cidade: "NÃO DEFINIDO",
        uf: null,
        enderecoCobranca: "",
        numeroResCobranca: "",
        bairro: "",
        pontoDeReferencia: "",
        segmento: undefined,
        formaAssinatura: "FISICO",
        codigoSVB: proposeInfo.infoProjeto?.identificador
          ? proposeInfo.infoProjeto.identificador
          : "",
        estadoCivil: null,
        email: "",
        profissao: "",
        ondeTrabalha: "",
        possuiDeficiencia: "NÃO",
        qualDeficiencia: "",
        canalVenda: null,
        nomeIndicador: "",
        telefoneIndicador: "",
        comoChegouAoCliente: "",
        nomeContatoJornadaUm: "",
        telefoneContatoUm: "",
        nomeContatoJornadaDois: "",
        telefoneContatoDois: "",
        cuidadosContatoJornada: "",
        nomeTitularProjeto: proposeInfo.infoProjeto?.titularInstalacao,
        tipoDoTitular: proposeInfo.infoProjeto?.tipoTitular,
        tipoDaLigacao: proposeInfo.infoProjeto?.tipoLigacao,
        tipoDaInstalacao: proposeInfo.infoProjeto?.tipoInstalacao,
        cepInstalacao: "",
        enderecoInstalacao: "",
        numeroResInstalacao: "",
        numeroInstalacao:
          proposeInfo.infoProjeto?.numeroInstalacaoConcessionaria,
        bairroInstalacao: "",
        cidadeInstalacao: "NÃO DEFINIDO",
        ufInstalacao: null,
        pontoDeReferenciaInstalacao: "",
        loginCemigAtende: "",
        senhaCemigAtende: "",
        latitude: "",
        longitude: "",
        potPico: proposeInfo.potenciaPico,
        geracaoPrevista: Number(
          getEstimatedGen(
            proposeInfo.potenciaPico ? proposeInfo.potenciaPico : 0,
            client?.cidade,
            client?.uf
          ).toFixed(2)
        ),
        topologia: proposeInfo.kit
          ? proposeInfo.kit.topologia == "INVERSOR"
            ? "INVERSOR"
            : "MICRO-INVERSOR"
          : null,
        marcaInversor: proposeInfo.kit
          ? proposeInfo.kit.inversores
              .map((inv) => `${inv.fabricante}-${inv.modelo}`)
              .join("/")
          : "",
        qtdeInversor: proposeInfo.kit
          ? proposeInfo.kit.inversores.map((inv) => inv.qtde).join("/")
          : "",
        potInversor: proposeInfo.kit
          ? proposeInfo.kit.inversores
              .map((inv) => inv.potenciaNominal)
              .join("/")
          : "",
        marcaModulos: proposeInfo.kit
          ? proposeInfo.kit.modulos
              .map((mod) => `(${mod.fabricante}) ${mod.modelo}`)
              .join("/")
          : "",
        qtdeModulos: proposeInfo.kit
          ? proposeInfo.kit.modulos.map((mod) => mod.qtde).join("/")
          : "",
        potModulos: proposeInfo.kit
          ? proposeInfo.kit.modulos.map((mod) => mod.potencia).join("/")
          : "",
        tipoEstrutura: proposeInfo.premissas.tipoEstrutura
          ? proposeInfo.premissas.tipoEstrutura
          : null,
        materialEstrutura: null,
        estruturaAmpere: "NÃO",
        responsavelEstrutura: "NÃO SE APLICA",
        formaPagamentoEstrutura: null,
        valorEstrutura: proposeInfo.precificacao?.estrutura?.vendaFinal,
        possuiOeM: "NÃO",
        planoOeM: undefined,
        clienteSegurado: "NÃO",
        tempoSegurado: "NÃO SE APLICA",
        formaPagamentoOeMOuSeguro: "NÃO SE APLICA",
        valorOeMOuSeguro: null,
        aumentoDeCarga: proposeInfo.infoProjeto?.servicosAdicionais?.padrao
          ? "SIM"
          : "NÃO",
        caixaConjugada: "NÃO",
        tipoDePadrao: null,
        aumentoDisjuntor: null,
        respTrocaPadrao: null,
        formaPagamentoPadrao: null,
        valorPadrao: proposeInfo.precificacao?.padrao?.vendaFinal,
        nomePagador: "",
        contatoPagador: "",
        necessidaInscricaoRural: null,
        inscriçãoRural: "",
        cpf_cnpjNF: "",
        localEntrega: null,
        entregaIgualCobranca: null,
        restricoesEntrega: null,
        valorContrato: getSolarSystemContractValueWithoutAdditionalCosts(
          proposeInfo.precificacao
        ),
        origemRecurso: null,
        numParcelas: 0,
        valorParcela: 0,
        credor: proposeInfo?.infoProjeto?.credor
          ? proposeInfo?.infoProjeto?.credor
          : null,
        nomeGerente: "",
        contatoGerente: "",
        necessidadeNFAdiantada: null,
        necessidadeCodigoFiname: null,
        formaDePagamento: null,
        descricaoNegociacao: "",
        possuiDistribuicao: null,
        realizarHomologacao: true,
        distribuicoes: [],
      };
    case "OPERAÇÃO E MANUTENÇÃO":
      proposeInfo = propose as IProposeOeMInfo;
      return {
        nomeVendedor: proposeInfo.infoProjeto?.responsavel.nome
          ? proposeInfo.infoProjeto?.responsavel.nome
          : "",
        nomeDoProjeto: proposeInfo.infoProjeto?.nome
          ? proposeInfo.infoProjeto?.nome
          : "",
        telefoneVendedor: getSellerContact(
          responsibles,
          proposeInfo.infoProjeto?.responsavel.id
        ),
        tipoDeServico: proposeInfo.infoProjeto?.tipoProjeto
          ? proposeInfo.infoProjeto?.tipoProjeto
          : "SISTEMA FOTOVOLTAICO",
        nomeDoContrato: proposeInfo.infoProjeto?.nome
          ? proposeInfo.infoProjeto?.nome
          : "",
        telefone: "",
        cpf_cnpj: "",
        rg: "",
        dataDeNascimento: null,
        cep: "",
        cidade: "NÃO DEFINIDO",
        uf: null,
        enderecoCobranca: "",
        numeroResCobranca: "",
        bairro: "",
        pontoDeReferencia: "",
        segmento: undefined,
        formaAssinatura: "FISICO",
        codigoSVB: proposeInfo.infoProjeto?.identificador
          ? proposeInfo.infoProjeto.identificador
          : "",
        estadoCivil: null,
        email: "",
        profissao: "",
        ondeTrabalha: "",
        possuiDeficiencia: "NÃO",
        qualDeficiencia: "",
        canalVenda: null,
        nomeIndicador: "",
        telefoneIndicador: "",
        comoChegouAoCliente: "",
        nomeContatoJornadaUm: "",
        telefoneContatoUm: "",
        nomeContatoJornadaDois: "",
        telefoneContatoDois: "",
        cuidadosContatoJornada: "",
        nomeTitularProjeto: proposeInfo.infoProjeto?.titularInstalacao,
        tipoDoTitular: proposeInfo.infoProjeto?.tipoTitular,
        tipoDaLigacao: proposeInfo.infoProjeto?.tipoLigacao,
        tipoDaInstalacao: proposeInfo.infoProjeto?.tipoInstalacao,
        cepInstalacao: "",
        enderecoInstalacao: "",
        numeroResInstalacao: "",
        numeroInstalacao:
          proposeInfo.infoProjeto?.numeroInstalacaoConcessionaria,
        bairroInstalacao: "",
        cidadeInstalacao: "NÃO DEFINIDO",
        ufInstalacao: null,
        pontoDeReferenciaInstalacao: "",
        loginCemigAtende: "",
        senhaCemigAtende: "",
        latitude: "",
        longitude: "",
        potPico: proposeInfo.potenciaPico,
        geracaoPrevista: Number(
          getEstimatedGen(
            proposeInfo.potenciaPico ? proposeInfo.potenciaPico : 0,
            client?.cidade,
            client?.uf
          ).toFixed(2)
        ),
        topologia: null,
        marcaInversor: "",
        qtdeInversor: "",
        potInversor: "",
        marcaModulos: "",
        qtdeModulos: "",
        potModulos: "",
        tipoEstrutura: null,
        materialEstrutura: null,
        estruturaAmpere: "NÃO",
        responsavelEstrutura: "NÃO SE APLICA",
        formaPagamentoEstrutura: null,
        valorEstrutura: null,
        possuiOeM: "SIM",
        planoOeM: proposeInfo.idPlanoEscolhido
          ? getOeMPlanById(proposeInfo.idPlanoEscolhido)
          : undefined,
        clienteSegurado: "NÃO",
        tempoSegurado: "NÃO SE APLICA",
        formaPagamentoOeMOuSeguro: "NÃO SE APLICA",
        valorOeMOuSeguro: null,
        aumentoDeCarga: proposeInfo.infoProjeto?.servicosAdicionais?.padrao
          ? "SIM"
          : "NÃO",
        caixaConjugada: "NÃO",
        tipoDePadrao: null,
        aumentoDisjuntor: null,
        respTrocaPadrao: null,
        formaPagamentoPadrao: null,
        valorPadrao: null,
        nomePagador: "",
        contatoPagador: "",
        necessidaInscricaoRural: null,
        inscriçãoRural: "",
        cpf_cnpjNF: "",
        localEntrega: null,
        entregaIgualCobranca: null,
        restricoesEntrega: null,
        valorContrato: proposeInfo.valorProposta
          ? proposeInfo.valorProposta
          : null,
        origemRecurso: null,
        numParcelas: 0,
        valorParcela: 0,
        credor: proposeInfo?.infoProjeto?.credor
          ? proposeInfo?.infoProjeto?.credor
          : null,
        nomeGerente: "",
        contatoGerente: "",
        necessidadeNFAdiantada: null,
        necessidadeCodigoFiname: null,
        formaDePagamento: null,
        descricaoNegociacao: "",
        possuiDistribuicao: null,
        realizarHomologacao: true,
        distribuicoes: [],
      };
    default:
      proposeInfo = propose as IProposeInfo;
      return {
        nomeVendedor: proposeInfo.infoProjeto?.responsavel.nome
          ? proposeInfo.infoProjeto?.responsavel.nome
          : "",
        nomeDoProjeto: proposeInfo.infoProjeto?.nome
          ? proposeInfo.infoProjeto?.nome
          : "",
        telefoneVendedor: getSellerContact(
          responsibles,
          proposeInfo.infoProjeto?.responsavel.id
        ),
        tipoDeServico: proposeInfo.infoProjeto?.tipoProjeto
          ? proposeInfo.infoProjeto?.tipoProjeto
          : "SISTEMA FOTOVOLTAICO",
        nomeDoContrato: proposeInfo.infoProjeto?.nome
          ? proposeInfo.infoProjeto?.nome
          : "",
        telefone: "",
        cpf_cnpj: "",
        rg: "",
        dataDeNascimento: null,
        cep: "",
        cidade: "NÃO DEFINIDO",
        uf: null,
        enderecoCobranca: "",
        numeroResCobranca: "",
        bairro: "",
        pontoDeReferencia: "",
        segmento: undefined,
        formaAssinatura: "FISICO",
        codigoSVB: proposeInfo.infoProjeto?.identificador
          ? proposeInfo.infoProjeto.identificador
          : "",
        estadoCivil: null,
        email: "",
        profissao: "",
        ondeTrabalha: "",
        possuiDeficiencia: "NÃO",
        qualDeficiencia: "",
        canalVenda: null,
        nomeIndicador: "",
        telefoneIndicador: "",
        comoChegouAoCliente: "",
        nomeContatoJornadaUm: "",
        telefoneContatoUm: "",
        nomeContatoJornadaDois: "",
        telefoneContatoDois: "",
        cuidadosContatoJornada: "",
        nomeTitularProjeto: proposeInfo.infoProjeto?.titularInstalacao,
        tipoDoTitular: proposeInfo.infoProjeto?.tipoTitular,
        tipoDaLigacao: proposeInfo.infoProjeto?.tipoLigacao,
        tipoDaInstalacao: proposeInfo.infoProjeto?.tipoInstalacao,
        cepInstalacao: "",
        enderecoInstalacao: "",
        numeroResInstalacao: "",
        numeroInstalacao:
          proposeInfo.infoProjeto?.numeroInstalacaoConcessionaria,
        bairroInstalacao: "",
        cidadeInstalacao: "NÃO DEFINIDO",
        ufInstalacao: null,
        pontoDeReferenciaInstalacao: "",
        loginCemigAtende: "",
        senhaCemigAtende: "",
        latitude: "",
        longitude: "",
        potPico: proposeInfo.potenciaPico,
        geracaoPrevista: Number(
          getEstimatedGen(
            proposeInfo.potenciaPico ? proposeInfo.potenciaPico : 0,
            client?.cidade,
            client?.uf
          ).toFixed(2)
        ),
        topologia: proposeInfo.kit
          ? proposeInfo.kit.topologia == "INVERSOR"
            ? "INVERSOR"
            : "MICRO-INVERSOR"
          : null,
        marcaInversor: proposeInfo.kit
          ? proposeInfo.kit.inversores
              .map((inv) => `${inv.fabricante}-${inv.modelo}`)
              .join("/")
          : "",
        qtdeInversor: proposeInfo.kit
          ? proposeInfo.kit.inversores.map((inv) => inv.qtde).join("/")
          : "",
        potInversor: proposeInfo.kit
          ? proposeInfo.kit.inversores
              .map((inv) => inv.potenciaNominal)
              .join("/")
          : "",
        marcaModulos: proposeInfo.kit
          ? proposeInfo.kit.modulos
              .map((mod) => `(${mod.fabricante}) ${mod.modelo}`)
              .join("/")
          : "",
        qtdeModulos: proposeInfo.kit
          ? proposeInfo.kit.modulos.map((mod) => mod.qtde).join("/")
          : "",
        potModulos: proposeInfo.kit
          ? proposeInfo.kit.modulos.map((mod) => mod.potencia).join("/")
          : "",
        tipoEstrutura: proposeInfo.premissas.tipoEstrutura
          ? proposeInfo.premissas.tipoEstrutura
          : null,
        materialEstrutura: null,
        estruturaAmpere: "NÃO",
        responsavelEstrutura: "NÃO SE APLICA",
        formaPagamentoEstrutura: null,
        valorEstrutura: proposeInfo.precificacao?.estrutura?.vendaFinal,
        possuiOeM: "NÃO",
        planoOeM: undefined,
        clienteSegurado: "NÃO",
        tempoSegurado: "NÃO SE APLICA",
        formaPagamentoOeMOuSeguro: "NÃO SE APLICA",
        valorOeMOuSeguro: null,
        aumentoDeCarga: proposeInfo.infoProjeto?.servicosAdicionais?.padrao
          ? "SIM"
          : "NÃO",
        caixaConjugada: "NÃO",
        tipoDePadrao: null,
        aumentoDisjuntor: null,
        respTrocaPadrao: null,
        formaPagamentoPadrao: null,
        valorPadrao: proposeInfo.precificacao?.padrao?.vendaFinal,
        nomePagador: "",
        contatoPagador: "",
        necessidaInscricaoRural: null,
        inscriçãoRural: "",
        cpf_cnpjNF: "",
        localEntrega: null,
        entregaIgualCobranca: null,
        restricoesEntrega: null,
        valorContrato: getSolarSystemContractValueWithoutAdditionalCosts(
          proposeInfo.precificacao
        ),
        origemRecurso: null,
        numParcelas: 0,
        valorParcela: 0,
        credor: proposeInfo?.infoProjeto?.credor
          ? proposeInfo?.infoProjeto?.credor
          : null,
        nomeGerente: "",
        contatoGerente: "",
        necessidadeNFAdiantada: null,
        necessidadeCodigoFiname: null,
        formaDePagamento: null,
        descricaoNegociacao: "",
        possuiDistribuicao: null,
        realizarHomologacao: true,
        distribuicoes: [],
      };
  }
}

function ContractRequest({ closeModal, proposeInfo }: ContractRequestProps) {
  // Queries
  const { data: session } = useSession();
  const { data: responsibles } = useResponsibles();
  const { data: client } = useClient(
    proposeInfo.infoProjeto?.clienteId
      ? proposeInfo.infoProjeto?.clienteId
      : "",
    checkQueryEnableStatus(session, proposeInfo.infoProjeto?.clienteId)
  );
  // Data for contract request
  const [requestInfo, setRequestInfo] = useState<IContractRequest>(
    getRequestObjectByProjectType({
      propose: proposeInfo,
      client: client,
      projectType: proposeInfo.infoProjeto?.tipoProjeto,
      responsibles: responsibles,
    })
  );
  // Using useEffect to populate data into request info for when responsibles and client queries load
  useEffect(() => {
    setRequestInfo((prev) => ({
      ...prev,
      telefoneVendedor: getSellerContact(
        responsibles,
        proposeInfo.infoProjeto?.responsavel.id
      ),
      telefone: client?.telefonePrimario ? client?.telefonePrimario : "",
      cpf_cnpj: client?.cpfCnpj ? client?.cpfCnpj : "",
      rg: client?.rg ? client.rg : "",
      dataDeNascimento: client?.dataNascimento,
      cep: client?.cep ? client.cep : "",
      cidade: client?.cidade,
      uf: client?.uf ? client.uf : null,
      enderecoCobranca: client?.endereco ? client?.endereco : "",
      numeroResCobranca: client?.numeroOuIdentificador
        ? client.numeroOuIdentificador
        : "",
      bairro: client?.bairro ? client.bairro : "",
      estadoCivil: client?.estadoCivil,
      email: client?.email ? client.email : "",
      profissao: client?.profissao ? client.profissao : "",
      ondeTrabalha: client?.ondeTrabalha ? client.ondeTrabalha : "",
      canalVenda: client?.canalVenda,
    }));
  }, [responsibles, client]);

  return (
    <div
      id="ContractRequest"
      className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]"
    >
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]">
        <div className="flex h-full flex-col">
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

          <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
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
            {proposeInfo?.infoProjeto?.tipoProjeto == "SISTEMA FOTOVOLTAICO" ? (
              <SolarSystemForm
                requestInfo={requestInfo}
                setRequestInfo={setRequestInfo}
                proposeInfo={proposeInfo as IProposeInfo}
              />
            ) : null}
            {proposeInfo?.infoProjeto?.tipoProjeto ==
            "OPERAÇÃO E MANUTENÇÃO" ? (
              <OeMForm
                requestInfo={requestInfo}
                setRequestInfo={setRequestInfo}
                proposeInfo={proposeInfo as IProposeOeMInfo}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractRequest;
