// =============================================================
// Banco de cores das Tintas Prontas de Fábrica
// -------------------------------------------------------------
// Estrutura: PRONTAS_COLORS[marcaTinta][montadora] = Cor[]
//   marcaTinta: "Brazilian" | "Lazzuril"
//   montadora:  Nome da montadora do veículo
//
// 👉 Para alimentar com a sua planilha do Excel, basta:
//   1. Manter as duas marcas como chaves principais.
//   2. Adicionar/editar cada montadora com um array de cores.
//   3. Cada cor precisa apenas de { nome, preco }.
//      (Opcional: hex para mostrar a amostra visual no autocomplete.)
// =============================================================

export type ProntaCor = {
  nome: string;
  preco: number;
  hex?: string;
};

export type ProntasColorsDB = Record<string, Record<string, ProntaCor[]>>;

export const MONTADORAS = [
  "Volkswagen",
  "Chevrolet",
  "Fiat",
  "Ford",
  "Honda",
  "Toyota",
  "Hyundai",
  "Renault",
  "Jeep",
  "Nissan",
  "Peugeot",
  "Citroën",
] as const;

export const PRONTAS_COLORS: ProntasColorsDB = {
  Brazilian: {
    Volkswagen: [
      { nome: "Branco Cristal", preco: 89.9, hex: "#F4F4F2" },
      { nome: "Prata Sargas", preco: 94.9, hex: "#B6BAB9" },
      { nome: "Preto Ninja", preco: 89.9, hex: "#0B0B0B" },
      { nome: "Vermelho Tornado", preco: 109.9, hex: "#A4181C" },
      { nome: "Cinza Platinum", preco: 99.9, hex: "#7C8083" },
    ],
    Chevrolet: [
      { nome: "Branco Summit", preco: 89.9, hex: "#EFEFEC" },
      { nome: "Prata Switchblade", preco: 94.9, hex: "#A9ADB0" },
      { nome: "Preto Ouro Negro", preco: 89.9, hex: "#0A0A0A" },
      { nome: "Vermelho Chili", preco: 109.9, hex: "#9C1B1F" },
      { nome: "Azul Macaw", preco: 109.9, hex: "#1C3E8A" },
    ],
    Fiat: [
      { nome: "Branco Banchisa", preco: 89.9, hex: "#F1F1EE" },
      { nome: "Prata Bari", preco: 94.9, hex: "#B0B3B6" },
      { nome: "Vermelho Alpine", preco: 109.9, hex: "#B11A1A" },
      { nome: "Cinza Cromo", preco: 99.9, hex: "#6E7174" },
      { nome: "Preto Vulcano", preco: 89.9, hex: "#080808" },
    ],
    Ford: [
      { nome: "Branco Ártico", preco: 89.9, hex: "#F2F3EF" },
      { nome: "Prata Geada", preco: 94.9, hex: "#AFB2B5" },
      { nome: "Azul Belize", preco: 109.9, hex: "#1B3D7A" },
      { nome: "Preto Diamante", preco: 89.9, hex: "#0A0A0B" },
    ],
    Honda: [
      { nome: "Branco Tafetá", preco: 89.9, hex: "#F1F1EE" },
      { nome: "Prata Lunar", preco: 94.9, hex: "#A8ACAF" },
      { nome: "Preto Cristal", preco: 89.9, hex: "#0B0B0B" },
    ],
    Toyota: [
      { nome: "Branco Polar", preco: 89.9, hex: "#F0F1EE" },
      { nome: "Prata Metálico", preco: 94.9, hex: "#A6AAAD" },
      { nome: "Vermelho Granada", preco: 109.9, hex: "#841A1A" },
    ],
  },
  Lazzuril: {
    Volkswagen: [
      { nome: "Branco Cristal", preco: 84.9, hex: "#F4F4F2" },
      { nome: "Prata Sargas", preco: 89.9, hex: "#B6BAB9" },
      { nome: "Preto Ninja", preco: 84.9, hex: "#0B0B0B" },
      { nome: "Azul Biscay", preco: 104.9, hex: "#1B3F7C" },
    ],
    Chevrolet: [
      { nome: "Branco Summit", preco: 84.9, hex: "#EFEFEC" },
      { nome: "Prata Switchblade", preco: 89.9, hex: "#A9ADB0" },
      { nome: "Vermelho Chili", preco: 104.9, hex: "#9C1B1F" },
      { nome: "Cinza Graphite", preco: 94.9, hex: "#5A5D60" },
    ],
    Fiat: [
      { nome: "Branco Banchisa", preco: 84.9, hex: "#F1F1EE" },
      { nome: "Vermelho Montecarlo", preco: 104.9, hex: "#A91A1A" },
      { nome: "Preto Vesúvio", preco: 84.9, hex: "#080808" },
    ],
    Ford: [
      { nome: "Branco Ártico", preco: 84.9, hex: "#F2F3EF" },
      { nome: "Azul Belize", preco: 104.9, hex: "#1B3D7A" },
    ],
    Hyundai: [
      { nome: "Branco Crystal", preco: 84.9, hex: "#F1F2EF" },
      { nome: "Prata Sleek", preco: 89.9, hex: "#A8ACAF" },
      { nome: "Vermelho Veloster", preco: 104.9, hex: "#A8181C" },
    ],
    Renault: [
      { nome: "Branco Glacier", preco: 84.9, hex: "#F1F2EF" },
      { nome: "Cinza Cassiopée", preco: 94.9, hex: "#6E7275" },
      { nome: "Vermelho Fogo", preco: 104.9, hex: "#B11A1A" },
    ],
    Jeep: [
      { nome: "Branco Polar", preco: 84.9, hex: "#F0F1EE" },
      { nome: "Granito Cristal", preco: 94.9, hex: "#6A6D70" },
      { nome: "Vermelho Colorado", preco: 104.9, hex: "#9C1B1F" },
    ],
  },
};