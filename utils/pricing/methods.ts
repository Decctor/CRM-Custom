import { IProject, IProposeInfo, ModuleType } from "../models";
import Modules from "../../utils/pvmodules.json";
const fixedMargin = 0.12;
const fixedTaxAliquot = 0.175;
type SaleCostArguments = {
  kitPrice: number;
  peakPower: number;
  moduleQty: number;
  city: string | null | undefined;
  uf: string | null | undefined;
  structureType: string;
  laborPrice: number;
  projectPrice: number;
  extraServicesPrice: number;
  paPrice: number;
};
export interface PricesObj {
  instalacao: {
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  maoDeObra: {
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  projeto: {
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  venda: {
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
}
interface IPriceDescription {
  [key: string]: string;
}
export const priceDescription: IPriceDescription = {
  instalacao: "INSTALAÇÃO",
  maoDeObra: "MÃO DE OBRA",
  projeto: "CUSTOS DE PROJETO",
  venda: "CUSTOS DE VENDA",
};
export function getProposedPrice(cost: number, tax = fixedTaxAliquot): number {
  const proposedPrice = cost / (1 - (fixedMargin + tax));
  return proposedPrice;
}
export function getTaxValue(
  cost: number,
  salePrice: number,
  margin = fixedMargin
): number {
  const costBySale = cost / salePrice;
  const taxValue = 1 - margin - costBySale;
  return taxValue;
}
export function getMarginValue(
  cost: number,
  salePrice: number,
  tax = fixedTaxAliquot
): number {
  const costBySale = cost / salePrice;
  const marginValue = 1 - tax - costBySale;
  return marginValue;
}
function getPeakPotByModules(modules: ModuleType[] | undefined) {
  var peakPotSum = 0;
  if (modules) {
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
function getModulesQty(modules: ModuleType[] | undefined) {
  var totalQty = 0;
  if (modules) {
    for (let i = 0; i < modules.length; i++) {
      const moduleQty = modules[i].qtde;
      totalQty = totalQty + moduleQty;
    }
    return totalQty;
  } else {
    return 0;
  }
}

function getInstallationCost(peakPower: number, distance: number) {
  // Peak system power must be in kilowatts
  if (distance > 30) {
    return peakPower * 150 + (distance - 30) * 3.2;
  } else {
    return peakPower * 150;
  }
}
function getLaborPrice(
  city: string | undefined | null,
  moduleQty: number,
  peakPower: number,
  responsibleId: string
) {
  if (city == "INACIOLÂNDIA" || city == "QUIRINÓPOLIS") {
    if (moduleQty < 7) return moduleQty * 250;
    else return peakPower * 450;
  }
  if (responsibleId == "312454213141") {
    //  use Marcos Vinicius ID when his account is created
    if (moduleQty < 7) return moduleQty * 250;
    else return peakPower * 450;
  }
  return peakPower * 275;
}
function getProjectPrice(peakPower: number) {
  return peakPower * 100 + 228;
}
function getSalePrice({
  kitPrice,
  peakPower,
  moduleQty,
  city,
  uf,
  structureType,
  laborPrice,
  projectPrice,
  extraServicesPrice,
  paPrice,
}: SaleCostArguments) {
  var grounding = 0;
  var brickwork = 0;
  var carportPrice = 0;
  if (uf == "GO") {
    grounding = 900;
  }
  if (structureType == "Solo" && city != "INACIOLÂNDIA") {
    // conferir
    brickwork = peakPower * 100;
  }
  if (structureType == "Carport") {
    carportPrice = moduleQty * 350;
  }
  return (
    (kitPrice +
      grounding +
      brickwork +
      laborPrice +
      projectPrice +
      extraServicesPrice +
      carportPrice +
      paPrice) *
    0.05
  );
}
export function getPrices(project: IProject, propose: IProposeInfo) {
  const kitPrice = propose.kit?.preco ? propose.kit?.preco : 0; // extract from kit info
  const peakPower = getPeakPotByModules(propose.kit?.modulos); // extract from kit info
  const moduleQty = getModulesQty(propose.kit?.modulos); // extract from kit info
  const distance = propose.premissas.distancia; // get initially from API call
  const extraServicesPrice = 0; // to be defined
  const paPrice = 0; // to be defined
  const maintance = 1; // to be defined
  const delivery = 1; // to be defined

  var prices: PricesObj = {
    instalacao: {
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
    maoDeObra: {
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
    projeto: {
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
    venda: {
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
  };
  // Costs
  prices.instalacao.custo = getInstallationCost(peakPower, distance);
  prices.maoDeObra.custo = getLaborPrice(
    project.cliente?.cidade,
    moduleQty,
    peakPower,
    project.responsavel.id
  );
  prices.projeto.custo = getProjectPrice(peakPower);
  prices.venda.custo = getSalePrice({
    kitPrice: kitPrice,
    peakPower: peakPower,
    moduleQty: moduleQty,
    city: project.cliente?.cidade,
    uf: project.cliente?.uf,
    structureType: propose.premissas.tipoEstrutura,
    laborPrice: prices.maoDeObra.custo,
    projectPrice: prices.projeto.custo,
    extraServicesPrice: extraServicesPrice,
    paPrice: paPrice,
  });

  // Proposed Price
  prices.instalacao.vendaProposto = getProposedPrice(prices.instalacao.custo);
  prices.maoDeObra.vendaProposto = getProposedPrice(prices.maoDeObra.custo);
  prices.projeto.vendaProposto = getProposedPrice(prices.projeto.custo);
  prices.venda.vendaProposto = getProposedPrice(prices.venda.custo);

  // Final sale price for each item (initially, equal to proposed price)
  prices.instalacao.vendaFinal = getProposedPrice(prices.instalacao.custo);
  prices.maoDeObra.vendaFinal = getProposedPrice(prices.maoDeObra.custo);
  prices.projeto.vendaFinal = getProposedPrice(prices.projeto.custo);
  prices.venda.vendaFinal = getProposedPrice(prices.venda.custo);
  return prices;
}
