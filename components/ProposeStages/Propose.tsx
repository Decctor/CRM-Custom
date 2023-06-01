import { IProject, IProposeInfo, ModuleType } from "@/utils/models";
import Modules from "../../utils/pvmodules.json";
import React from "react";
import axios from "axios";
import { getProposeObject } from "@/utils/methods";
type ProposeProps = {
  setProposeInfo: React.Dispatch<React.SetStateAction<IProposeInfo>>;
  proposeInfo: IProposeInfo;
  project: IProject;
  moveToNextStage: React.Dispatch<React.SetStateAction<number>>;
};
function getPeakPotByModules(modules: ModuleType[] | undefined) {
  if (modules) {
    var peakPotSum = 0;
    for (let i = 0; i < modules.length; i++) {
      const moduleInfo = Modules.find((mod) => mod.id == modules[i].id);
      if (moduleInfo) {
        peakPotSum = peakPotSum + modules[i].qtde * moduleInfo.potencia;
      }
    }
    return peakPotSum / 1000;
  } else {
    return 0;
  }
}
function Propose({ proposeInfo, project }: ProposeProps) {
  async function handleDownload() {
    // const obj = {
    //   title: proposeInfo.projeto.nome,
    //   fontSize: 10,
    //   textColor: "#333333",
    //   data: {
    //     idProposta: project._id,
    //     nomeCliente: project.cliente?.nome,
    //     cpfCnpjCliente: project.cliente?.cpfCnpj,
    //     cidadeUfCliente: `${project.cliente?.cidade} - ${project.cliente?.uf}`,
    //     enderecoCliente: `${project.cliente?.endereco}`,
    //     nomeVendedor: project.responsavel.nome,
    //     potPico: getPeakPotByModules(proposeInfo.kit?.modulos),
    //     consumoMedio: proposeInfo.premissas.consumoEnergiaMensal,
    //     gastoMensalAtual:
    //       proposeInfo.premissas.consumoEnergiaMensal *
    //       proposeInfo.premissas.tarifaEnergia,
    //     gastoAnualAtual:
    //       proposeInfo.premissas.consumoEnergiaMensal *
    //       proposeInfo.premissas.tarifaEnergia *
    //       12,
    //     qtdeModulos: "N/A",
    //     geracaoEstimada: "N/A",
    //     precoFinal: `R$ ${proposeInfo.valorProposta?.toLocaleString("pt-br", {
    //       minimumFractionDigits: 2,
    //       maximumFractionDigits: 2,
    //     })}`,
    //   },
    // };
    const obj = getProposeObject(project, proposeInfo);
    const response = await axios.post("/api/utils/proposePdf", obj, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `PROPOSTA.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  return (
    <div className="flex min-h-[400px] w-full flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold">PROPOSTA</h1>
      </div>
      <div className="justfiy-center flex grow items-center">
        <button
          onClick={handleDownload}
          className="rounded bg-blue-400 p-1 font-medium text-white"
        >
          DOWNLOAD
        </button>
      </div>
    </div>
  );
}

export default Propose;
