const Kits = require("./kits.json");
// const Kits = [];
const Inverters = require("./utils/pvinverters.json");
const Modules = require("./utils/pvmodules.json");
const fs = require("fs");
function formatSVB() {
  const formatted = Kits.map((kit) => {
    return {
      nome: kit.Nome + "(SOLO)",
      categoria: "ON-GRID",
      tipo: "TRADICIONAL",
      topologia: "INVERSOR",
      potPico: Number(
        ((kit["M�dulo qtd"] * kit["M�dulo pot�ncia (W)"]) / 1000).toFixed(2)
      ),
      preco: Number(Number(kit["Custo (R$)"]).toFixed(2)),
      ativo: true,
      fornecedor: "BYD",
      estruturasCompativeis: ["Solo"],
      incluiEstrutura: true,
      incluiTransformador: false,
      inversores: [
        {
          id: Inverters.find(
            (inv) => inv.modelo == kit["Inversor 1 modelo"].split("BYD-")[1]
          ).id,
          fabricante: Inverters.find(
            (inv) => inv.modelo == kit["Inversor 1 modelo"].split("BYD-")[1]
          ).fabricante,
          modelo: Inverters.find(
            (inv) => inv.modelo == kit["Inversor 1 modelo"].split("BYD-")[1]
          ).modelo,
          qtde: Number(kit["Inversor 1 qtd"]),
          garantia: 12,
          potenciaNominal: Number(kit["Inversor 1 pot�ncia (W)"]),
        },
      ],
      modulos: [
        {
          id: Modules.find(
            (mod) => mod.modelo == kit["M�dulo modelo"].split("BYD-")[1]
          ).id,
          fabricante: Modules.find(
            (mod) => mod.modelo == kit["M�dulo modelo"].split("BYD-")[1]
          ).fabricante,
          modelo: Modules.find(
            (mod) => mod.modelo == kit["M�dulo modelo"].split("BYD-")[1]
          ).modelo,
          qtde: Number(kit["M�dulo qtd"]),
          potencia: Number(kit["M�dulo pot�ncia (W)"]),
          garantia: 12,
        },
      ],
      dataInsercao: new Date().toISOString(),
    };
  });
  return formatted;
}
function formatBYD() {
  const formatted = Kits.map((kit) => {
    const inv = Inverters.filter(
      (inv) =>
        inv.potenciaNominal == kit["POTENCIA INVERSOR"] &&
        inv.fabricante == "BYD"
    );
    console.log(kit.INVERSOR, inv.length);
    return {
      nome: `GERADOR DE ENERGIA BYD ${(
        (Number(kit["QTDE MODULOS"]) * Number(kit["POTENCIA MODULOS"])) /
        1000
      ).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} kWp - IMPORTADO`,
      categoria: "ON-GRID",
      tipo: "TRADICIONAL",
      topologia: "INVERSOR",
      potPico: Number(
        (
          (Number(kit["QTDE MODULOS"]) * Number(kit["POTENCIA MODULOS"])) /
          1000
        ).toFixed(2)
      ),
      preco: Number(Number(kit.VALOR).toFixed(2)),
      ativo: true,
      fornecedor: "BYD",
      estruturasCompativeis: ["Fibrocimento"],
      incluiEstrutura: true,
      incluiTransformador: false,
      inversores: [
        {
          id: Inverters.find(
            (inv) =>
              inv.potenciaNominal == kit["POTENCIA INVERSOR"] &&
              inv.fabricante == "BYD"
          ).id,
          fabricante: Inverters.find(
            (inv) =>
              inv.potenciaNominal == kit["POTENCIA INVERSOR"] &&
              inv.fabricante == "BYD"
          ).fabricante,
          modelo: Inverters.find(
            (inv) =>
              inv.potenciaNominal == kit["POTENCIA INVERSOR"] &&
              inv.fabricante == "BYD"
          ).modelo,
          qtde: Number(kit["QTDE INVERSORES"]),
          garantia: 12,
          potenciaNominal: Number(kit["POTENCIA INVERSOR"]),
        },
      ],
      modulos: [
        {
          id: Modules.find((mod) => mod.modelo == kit.PAINEL).id,
          fabricante: Modules.find((mod) => mod.modelo == kit.PAINEL)
            .fabricante,
          modelo: Modules.find((mod) => mod.modelo == kit.PAINEL).modelo,
          qtde: Number(kit["QTDE MODULOS"]),
          potencia: Number(kit["POTENCIA MODULOS"]),
          garantia: 12,
        },
      ],
      dataInsercao: new Date().toISOString(),
    };
  });
  return formatted;
}
const formatted = formatSVB();
const json = JSON.stringify(formatted);
fs.writeFile("./formattedKits.json", json, "utf8", function (err) {
  if (err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
