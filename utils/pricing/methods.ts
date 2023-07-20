import {
  IProject,
  IProposeInfo,
  ITechnicalAnalysis,
  ModuleType,
  aditionalServicesType,
} from "../models";
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
  aditionalServices: aditionalServicesType;
  paPrice: number;
};
export type Pricing = PricesObj | PricesPromoObj;
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
  padrao?: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  estrutura?: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  extra?: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
}
export interface PricesPromoObj {
  kit: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  instalacao?: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  maoDeObra?: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  padrao?: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  estrutura?: {
    margemLucro: number;
    imposto: number;
    custo: number;
    vendaProposto: number;
    vendaFinal: number;
  };
  extra?: {
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
export interface StructureCostArguments {
  structurePrice?: number;
  structureType: string;
  city?: string | null;
  peakPower: number;
  moduleQty: number;
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
  padrao: "ADEQUAÇÕES DE PADRÃO",
  estrutura: "ADEQUAÇÕES DE ESTRUTURA",
  extra: "OUTROS SERVIÇOS",
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
  if (salePrice == 0) return 0;
  const costBySale = cost / salePrice;
  const taxValue = 1 - margin - costBySale;

  return taxValue;
}
export function getMarginValue(
  cost: number,
  salePrice: number,
  tax = fixedTaxAliquot
): number {
  if (salePrice == 0) return 0;
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
function getStructureCost({
  structurePrice,
  structureType,
  city,
  peakPower,
  moduleQty,
}: StructureCostArguments) {
  if (structurePrice) {
    return structurePrice;
  } else {
    var structureCost = 0;
    if (structureType == "Solo" && city != "INACIOLÂNDIA") {
      structureCost = peakPower * 100;
    }
    if (structureType == "Carport") {
      structureCost = moduleQty * 350;
    }
    return structureCost;
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
  aditionalServices,
  paPrice,
}: SaleCostArguments) {
  var grounding = 0;
  var structureAdequations = 0;

  if (uf == "GO") {
    grounding = 900;
  }

  if (aditionalServices.estrutura) {
    structureAdequations = aditionalServices.estrutura;
  } else {
    if (structureType == "Solo" && city != "INACIOLÂNDIA") {
      structureAdequations = peakPower * 100;
    }
    if (structureType == "Carport") {
      structureAdequations = moduleQty * 350;
    }
  }

  return (
    (kitPrice +
      grounding +
      structureAdequations +
      laborPrice +
      projectPrice +
      paPrice) *
    0.05
  );
}
type TechnicalAnalysisCostReturnObj = {
  installationCosts: number;
  structureCosts: number;
  paCosts: number;
  otherCosts: number;
};
export function extractTechnicalAnalysisCosts(
  technicalAnalysis: ITechnicalAnalysis | null
) {
  var installationCosts = 0;
  var structureCosts = 0;
  var paCosts = 0;
  var otherCosts = 0;
  var returnObj: TechnicalAnalysisCostReturnObj = {
    installationCosts,
    structureCosts,
    paCosts,
    otherCosts,
  };
  if (!technicalAnalysis) return returnObj;
  const costArray = technicalAnalysis.custosAdicionais;
  if (costArray) {
    returnObj = costArray.reduce((acc, current) => {
      var type;
      console.log("ACCUMULADOR", acc);
      if (current.categoria == "PADRÃO") type = "paCosts";
      if (current.categoria == "ESTRUTURA") type = "structureCosts";
      if (current.categoria == "INSTALAÇÃO") type = "installationCosts";
      if (current.categoria == "OUTROS") type = "otherCosts";
      if (!type) return acc;
      acc[type as keyof TechnicalAnalysisCostReturnObj] =
        acc[type as keyof TechnicalAnalysisCostReturnObj] + current.valor;
      return acc;
    }, returnObj);

    return returnObj;
  }
  return returnObj;
}
export function getPrices(
  project: IProject | undefined,
  propose: IProposeInfo,
  technicalAnalysis: ITechnicalAnalysis | null
): PricesObj | PricesPromoObj {
  if (propose.kit?.tipo == "PROMOCIONAL") {
    // Extracting premisses and other info from project/propose
    const city = project?.cliente?.cidade;
    const structureType = propose.premissas.tipoEstrutura;
    const peakPower = getPeakPotByModules(propose.kit?.modulos);
    const moduleQty = getModulesQty(propose.kit?.modulos);
    const distance = propose.premissas.distancia;
    const extractedCostsFromTechnicalAnalysis =
      extractTechnicalAnalysisCosts(technicalAnalysis);
    // Extracting and defining prices
    const kitPrice = propose.kit?.preco ? propose.kit?.preco : 0; // extract from kit info
    const paPrice = extractedCostsFromTechnicalAnalysis.paCosts;
    const structurePrice = getStructureCost({
      structurePrice: extractedCostsFromTechnicalAnalysis.structureCosts,
      structureType: structureType,
      moduleQty: moduleQty,
      peakPower: peakPower,
      city: city,
    });
    const extraServicesPrice = extractedCostsFromTechnicalAnalysis.otherCosts;

    // Defining price object
    var pricesPromo: PricesPromoObj = {
      kit: {
        margemLucro: 0,
        imposto: 0,
        custo: kitPrice,
        vendaProposto: getProposedPrice(kitPrice, 0, 0),
        vendaFinal: getProposedPrice(kitPrice, 0, 0),
      },
    };

    // Updating labor prices for Inaciolandia projects
    if (city == "INACIOLÂNDIA") {
      const specialLaborPriceInaciolandia = moduleQty * 150;
      pricesPromo.maoDeObra = {
        margemLucro: 0,
        imposto: 0,
        custo: specialLaborPriceInaciolandia,
        vendaProposto: getProposedPrice(specialLaborPriceInaciolandia, 0, 0),
        vendaFinal: getProposedPrice(specialLaborPriceInaciolandia, 0, 0),
      };
    }
    // Updating prices object in case of PA/structure/installation/extra costs
    if (extractedCostsFromTechnicalAnalysis.installationCosts > 0) {
      pricesPromo.instalacao = {
        margemLucro: fixedMargin,
        imposto: fixedTaxAliquot,
        custo: extractedCostsFromTechnicalAnalysis.installationCosts,
        vendaProposto: getProposedPrice(
          extractedCostsFromTechnicalAnalysis.installationCosts
        ),
        vendaFinal: getProposedPrice(
          extractedCostsFromTechnicalAnalysis.installationCosts
        ),
      };
    }
    if (paPrice > 0) {
      pricesPromo.padrao = {
        margemLucro: fixedMargin,
        imposto: fixedTaxAliquot,
        custo: paPrice,
        vendaProposto: getProposedPrice(paPrice),
        vendaFinal: getProposedPrice(paPrice),
      };
    }
    if (structurePrice > 0) {
      pricesPromo.estrutura = {
        margemLucro: fixedMargin,
        imposto: fixedTaxAliquot,
        custo: structurePrice,
        vendaProposto: getProposedPrice(structurePrice),
        vendaFinal: getProposedPrice(structurePrice),
      };
    }
    if (extraServicesPrice > 0) {
      pricesPromo.extra = {
        margemLucro: fixedMargin,
        imposto: fixedTaxAliquot,
        custo: extraServicesPrice,
        vendaProposto: getProposedPrice(extraServicesPrice),
        vendaFinal: getProposedPrice(extraServicesPrice),
      };
    }
    return pricesPromo;
  } else {
    // Extracting premisses and other info from project/propose
    const city = project?.cliente?.cidade;
    const structureType = propose.premissas.tipoEstrutura;
    const peakPower = getPeakPotByModules(propose.kit?.modulos); // extract from kit info
    const moduleQty = getModulesQty(propose.kit?.modulos); // extract from kit info
    const distance = propose.premissas.distancia; // get initially from API call
    const extractedCostsFromTechnicalAnalysis =
      extractTechnicalAnalysisCosts(technicalAnalysis);

    // Extracting and defining prices
    const kitPrice = propose.kit?.preco ? propose.kit?.preco : 0; // extract from kit info
    const paPrice = extractedCostsFromTechnicalAnalysis.paCosts;
    const structurePrice = getStructureCost({
      structurePrice: extractedCostsFromTechnicalAnalysis.structureCosts,
      structureType: structureType,
      moduleQty: moduleQty,
      peakPower: peakPower,
      city: city,
    });
    const extraServicesPrice = extractedCostsFromTechnicalAnalysis.otherCosts;
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
    prices.instalacao.custo =
      extractedCostsFromTechnicalAnalysis.installationCosts // Using installation cost provided by technical analysis
        ? extractedCostsFromTechnicalAnalysis.installationCosts
        : getInstallationCost(peakPower, distance);
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
      aditionalServices: project?.servicosAdicionais
        ? project.servicosAdicionais
        : {},
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

    // Updating prices object in case of PA/structure costs
    if (paPrice > 0) {
      prices.padrao = {
        margemLucro: fixedMargin,
        imposto: fixedTaxAliquot,
        custo: paPrice,
        vendaProposto: getProposedPrice(paPrice),
        vendaFinal: getProposedPrice(paPrice),
      };
    }
    if (structurePrice > 0) {
      prices.estrutura = {
        margemLucro: fixedMargin,
        imposto: fixedTaxAliquot,
        custo: structurePrice,
        vendaProposto: getProposedPrice(structurePrice),
        vendaFinal: getProposedPrice(structurePrice),
      };
    }
    if (extraServicesPrice > 0) {
      prices.extra = {
        margemLucro: fixedMargin,
        imposto: fixedTaxAliquot,
        custo: extraServicesPrice,
        vendaProposto: getProposedPrice(extraServicesPrice),
        vendaFinal: getProposedPrice(extraServicesPrice),
      };
    }
    return prices;
  }
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
