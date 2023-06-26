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
  kit: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  instalacao: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  maoDeObra: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  projeto: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  venda: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
}
export interface PricesOeMObj {
  manutencaoSimples: {
    vendaProposto: number;
    vendaFinal: number;
  };
  planoSol: {
    vendaProposto: number;
    vendaFinal: number;
  };
  planoSolPlus: {
    vendaProposto: number;
    vendaFinal: number;
  };
}
interface IPriceDescription {
  [key: string]: string;
}
export const priceDescription: IPriceDescription = {
  kit: "KIT FOTOVOLTAICO",
  instalacao: "INSTALAÇÃO",
  maoDeObra: "MÃO DE OBRA",
  projeto: "CUSTOS DE PROJETO",
  venda: "CUSTOS DE VENDA",
};
export function getProposedPrice(
  cost: number,
  tax = fixedTaxAliquot,
  margin = fixedMargin
): number {
  const proposedPrice = cost / (1 - (margin + tax));
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
  // return peakPower * 100 + 228;
  return peakPower * 80;
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
export function getPrices(
  project: IProject | undefined,
  propose: IProposeInfo
) {
  const kitPrice = propose.kit?.preco ? propose.kit?.preco : 0; // extract from kit info
  const peakPower = getPeakPotByModules(propose.kit?.modulos); // extract from kit info
  const moduleQty = getModulesQty(propose.kit?.modulos); // extract from kit info
  const distance = propose.premissas.distancia; // get initially from API call
  const extraServicesPrice = 0; // to be defined
  const paPrice = project?.servicosAdicionais?.padrao
    ? project.servicosAdicionais.padrao
    : 0; // to be defined
  const maintance = 1; // to be defined
  const delivery = 1; // to be defined

  var prices: PricesObj = {
    kit: {
      margemLucro: fixedMargin,
      imposto: 0,
      custo: kitPrice,
      vendaProposto: getProposedPrice(kitPrice, 0),
      vendaFinal: getProposedPrice(kitPrice, 0),
    },
    instalacao: {
      margemLucro: fixedMargin,
      imposto: fixedTaxAliquot,
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
    maoDeObra: {
      margemLucro: fixedMargin,
      imposto: fixedTaxAliquot,
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
    projeto: {
      margemLucro: fixedMargin,
      imposto: fixedTaxAliquot,
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
    venda: {
      margemLucro: fixedMargin,
      imposto: fixedTaxAliquot,
      custo: 0,
      vendaProposto: 0,
      vendaFinal: 0,
    },
  };
  // Costs
  prices.instalacao.custo = getInstallationCost(peakPower, distance);
  prices.maoDeObra.custo = getLaborPrice(
    project?.cliente?.cidade,
    moduleQty,
    peakPower,
    project?.responsavel.id ? project?.responsavel.id : ""
  );
  prices.projeto.custo = getProjectPrice(peakPower);
  prices.venda.custo = getSalePrice({
    kitPrice: kitPrice,
    peakPower: peakPower,
    moduleQty: moduleQty,
    city: project?.cliente?.cidade,
    uf: project?.cliente?.uf,
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

// OeM pricing
export const oemPricesByModuleQty = [
  {
    min: 0,
    max: 12,
    price: 19.9,
  },
  {
    min: 13,
    max: 19,
    price: 18.91,
  },
  {
    min: 20,
    max: 29,
    price: 17.96,
  },
  {
    min: 30,
    max: 49,
    price: 17.06,
  },
  {
    min: 50,
    max: 79,
    price: 16.21,
  },
  {
    min: 80,
    max: 109,
    price: 15.4,
  },
  {
    min: 110,
    max: 149,
    price: 13.86,
  },
  {
    min: 150,
    max: 199,
    price: 12.47,
  },
  {
    min: 200,
    max: 299,
    price: 11.23,
  },
  {
    min: 300,
    max: 499,
    price: 10.1,
  },
  {
    min: 500,
    max: 2000,
    price: 9.09,
  },
];
function findPriceByRange(modulesQty: number): number {
  var priceByModule;
  for (let i = 0; i < oemPricesByModuleQty.length; i++) {
    if (
      modulesQty >= oemPricesByModuleQty[i].min &&
      modulesQty <= oemPricesByModuleQty[i].max
    ) {
      priceByModule = oemPricesByModuleQty[i].price;
    } else {
      priceByModule = 19.9;
    }
  }
  return priceByModule ? priceByModule : 19.9;
}
export function getOeMPrices(modulesQty: number, distance: number) {
  const priceByModule =
    findPriceByRange(modulesQty) >= 0 ? findPriceByRange(modulesQty) : 19.9;
  var prices: PricesOeMObj = {
    manutencaoSimples: {
      vendaProposto: priceByModule * modulesQty + 1.5 * 2 * distance,
      vendaFinal: priceByModule * modulesQty + 1.5 * 2 * distance,
    },
    planoSol: {
      vendaProposto: 1.3 * priceByModule * modulesQty + 1.5 * 2 * distance,
      vendaFinal: 1.3 * priceByModule * modulesQty + 1.5 * 2 * distance,
    },
    planoSolPlus: {
      vendaProposto: 1.5 * priceByModule * modulesQty + 1.5 * 2 * distance,
      vendaFinal: 1.5 * priceByModule * modulesQty + 1.5 * 2 * distance,
    },
  };
  return prices;
}
