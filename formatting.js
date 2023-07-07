const Kits = [];
const Inverters = [];
const Modules = [];

const formatted = Kits.map((kit) => {
  return {
    nome: kit.Nome,
    categoria: "ON-GRID",
    tipo: "TRADICIONAL" | "PROMOCIONAL",
    topologia: "INVERSOR" | "MICRO-INVERSOR",
    potPico: Number(
      ((kit["M�dulo qtd"] * kit["M�dulo pot�ncia (W)"]) / 1000).toFixed(2)
    ),
    preco: Number(Number(kit["Custo (R$)"]).toFixed(2)),
    ativo: true,
    fornecedor: "GENYX",
    estruturasCompativeis: ["Fibrocimento"],
    incluiEstrutura: true,
    incluiTransformador: false,
    inversores: [
      {
        id: Inverters.find((inv) => inv.modelo == kit["Inversor 1 modelo"]).id,
        fabricante: Inverters.find(
          (inv) => inv.modelo == kit["Inversor 1 modelo"]
        ).fabricante,
        modelo: Inverters.find((inv) => inv.modelo == kit["Inversor 1 modelo"])
          .modelo,
        qtde: Number(kit["Inversor 1 qtd"]),
        garantia: 12,
        potenciaNominal: Number(kit["Inversor 1 pot�ncia (W)"]),
      },
    ],
    modulos: [
      {
        id: Modules.find((mod) => mod.modelo == kit["M�dulo modelo"]).id,
        fabricante: Modules.find((mod) => mod.modelo == kit["M�dulo modelo"])
          .fabricante,
        modelo: Modules.find((mod) => mod.modelo == kit["M�dulo modelo"])
          .modelo,
        qtde: Number(kit["M�dulo qtd"]),
        potencia: Number(kit["M�dulo pot�ncia (W)"]),
        garantia: 12,
      },
    ],
    dataInsercao: new Date().toISOString(),
  };
});
const json = JSON.stringify(formatted);
fs.writeFile("./formattedKits.json", json, "utf8", function (err) {
  if (err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
console.log(formatted);
