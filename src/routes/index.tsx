import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  ShoppingCart,
  Plus,
  HelpCircle,
  X,
  Upload,
  Palette,
  Trash2,
  Store,
  Bike,
  Send,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Instagram,
  Phone,
  MessageCircle,
  User,
  Search,
  AlertTriangle,
} from "lucide-react";

import canetaImg from "@/assets/caneta-retoque.jpg";
import personalizadaImg from "@/assets/tinta-personalizada.jpg";
import ProductCard from "@/components/ProductCard";
import SubCategorySelector, {
  type SubCategoryOption,
} from "@/components/catalog/SubCategorySelector";
import ProductGrid from "@/components/catalog/ProductGrid";
import PromoCarousel, { type PromoSlide } from "@/components/PromoCarousel";
import BottomNav from "@/components/BottomNav";
import tintaImg from "@/assets/tinta-spray.jpg";
import logoAsset from "@/assets/logo-dns.png.asset.json";
import { PRONTAS_COLORS, MONTADORAS, type ProntaCor } from "@/data/prontas-colors";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DNS TINTAS — Catálogo Inteligente" },
      {
        name: "description",
        content:
          "Catálogo de tintas automotivas, estética e materiais de pintura da DNS Tintas. Escolha os produtos e envie seu pedido pelo WhatsApp.",
      },
      { property: "og:title", content: "DNS TINTAS — Catálogo Inteligente" },
      {
        property: "og:description",
        content:
          "Tintas, retoques, estética automotiva e materiais de pintura. Monte seu pedido em poucos toques.",
      },
    ],
  }),
  component: Index,
});

type Category = "estetica" | "tintas" | "pintura";
type PaintSub = "tira-riscos" | "spray" | "prontas" | "pesadas";

/**
 * Subcategorias do sistema geral do catálogo (Estética, Pintura, futuras).
 * NÃO inclui os passos da categoria TINTAS (que tem fluxo especial próprio).
 */
export type CatalogSubCategory =
  // Estética
  | "uso-externo"
  | "uso-interno"
  | "polimento"
  | "motocicletas"
  | "acessorios-estetica"
  | "maquinas"
  | "kits"
  // Pintura
  | "verniz"
  | "primer"
  | "thinner"
  | "massa"
  | "complementos"
  | "lixa"
  | "mascaramento"
  | "acessorios"
  | "cola";

type PinturaSub = Extract<
  CatalogSubCategory,
  | "verniz"
  | "primer"
  | "thinner"
  | "massa"
  | "complementos"
  | "lixa"
  | "mascaramento"
  | "acessorios"
  | "cola"
>;
type EsteticaSub = Extract<
  CatalogSubCategory,
  | "uso-externo"
  | "uso-interno"
  | "polimento"
  | "motocicletas"
  | "acessorios-estetica"
  | "maquinas"
  | "kits"
>;

type Variant = { label: string; price: number; image?: string };
type Product = {
  id: string;
  name: string;
  subname?: string;
  description: string;
  images: string[];
  variants: Variant[];
  brand?: string;
  features?: string[];
  applications?: string[];
  colors?: string[];
  volume?: string;
  oldPrice?: number;
  /** Preenchido apenas para produtos das categorias comuns (Estética, Pintura, futuras). */
  category?: "estetica" | "pintura";
  subcategory?: CatalogSubCategory;
};

const ph = (t: string) =>
  `https://via.placeholder.com/400x400/1e3a5f/ffffff?text=${encodeURIComponent(t)}`;

const ESTETICA_PRODUCTS: Product[] = [
  {
    id: "blend-paste",
    name: "BLEND PASTE WAX — VONIXX",
    subname: "Cera em pasta com SiO2 & Carnaúba",
    description: "Brilho e hidrorrepelência. Rende até 25 aplicações. Até 7 meses de proteção.",
    images: ["https://i.imgur.com/PDgVqh7.jpeg", ph("BLEND+1"), ph("BLEND+2")],
    variants: [{ label: "100g", price: 90.0 }],
  },
  {
    id: "blend-spray",
    name: "BLEND SPRAY WAX — VONIXX",
    subname: "Cera líquida com SiO2 e Carnaúba",
    description: "Até 4 meses de proteção. Mantém o brilho da pintura.",
    images: [
      "https://images.tcdn.com.br/img/img_prod/1060217/blend_ceramic_eamp_carnauba_spray_wax_795_variacao_781_1_155b88bc06edd477e3b3e5abf3473c6e.png",
      "https://www.vonixx.com.br/wp-content/uploads/2023/07/sem-nome-900--900-px-1-e1713464742781.png",
    ],
    variants: [{ label: "500ml", price: 47.0 }],
  },
  {
    id: "alumax",
    name: "ALUMAX — VINTEX",
    subname: "Desincrustante ácido",
    description: "Limpeza de rodas, chassis, motores, baús de alumínio, inox e madeira.",
    images: [
      "https://vintex.com.br/wp-content/uploads/2020/07/ALUMAX-15L-copy-2.png",
      "https://images.tcdn.com.br/img/img_prod/1109830/alumax_vintex_desincrustante_acido_5l_89_3_5c463aaf86c38477aa82cc1c705c1d98.jpg",
    ],
    variants: [
      { label: "1,5L", price: 28.0 },
      { label: "5L", price: 60.0 },
    ],
  },
  { id: "cera-roxa", name: "Cera Pasta Roxa", description: "Para pinturas escuras, realça profundidade e cor.", images: [ph("Cera+Roxa")], variants: [{ label: "300g", price: 79.9 }] },
  { id: "cera-azul", name: "Cera Pasta Azul", description: "Especial para pinturas claras e metálicas.", images: [ph("Cera+Azul")], variants: [{ label: "300g", price: 79.9 }] },
  { id: "cera-amarela", name: "Cera Pasta Amarela", description: "Cera de abelha com silicone, brilho e proteção.", images: [ph("Cera+Amarela")], variants: [{ label: "250g", price: 74.9 }] },
  { id: "cera-preta", name: "Cera Pasta Preta", description: "Para carros pretos, cobre micro-riscos.", images: [ph("Cera+Preta")], variants: [{ label: "300g", price: 84.9 }] },
  { id: "cera-branca", name: "Cera Pasta Branca", description: "Elimina manchas e oxidação em pinturas brancas.", images: [ph("Cera+Branca")], variants: [{ label: "300g", price: 69.9 }] },
  { id: "cera-vermelha", name: "Cera Pasta Vermelha", description: "Intensifica a cor vermelha, brilho molhado.", images: [ph("Cera+Vermelha")], variants: [{ label: "300g", price: 79.9 }] },
  { id: "cera-verde", name: "Cera Pasta Verde", description: "Proteção ecológica, biodegradável, brilho natural.", images: [ph("Cera+Verde")], variants: [{ label: "300g", price: 89.9 }] },
  { id: "cera-prata", name: "Cera Pasta Prata", description: "Realça o efeito metalizado em prateadas.", images: [ph("Cera+Prata")], variants: [{ label: "300g", price: 74.9 }] },
  { id: "cera-dourada", name: "Cera Pasta Dourada", description: "Premium com nanopartículas, brilho espelhado.", images: [ph("Cera+Dourada")], variants: [{ label: "300g", price: 99.9 }] },
  { id: "polimento-corte", name: "Polidor de Corte Médio", description: "Remove riscos profundos e oxidação.", images: [ph("Polidor+Corte")], variants: [{ label: "500ml", price: 45.9 }, { label: "1L", price: 79.9 }] },
  { id: "polimento-fino", name: "Polidor de Acabamento", description: "Brilho final, remove marcas de polimento.", images: [ph("Polidor+Fino")], variants: [{ label: "500ml", price: 39.9 }, { label: "1L", price: 69.9 }] },
  { id: "vitrificador", name: "Vitrificador Nano", description: "Proteção cerâmica de alta durabilidade.", images: [ph("Vitrificador")], variants: [{ label: "30ml", price: 129.9 }, { label: "50ml", price: 189.9 }] },
  { id: "primer-est", name: "Primer Spray", description: "Prepara superfície para pintura.", images: [ph("Primer")], variants: [{ label: "400ml", price: 34.9 }] },
  { id: "desengraxante", name: "Desengraxante Multiuso", description: "Remove gordura, óleo e silicone antes da pintura.", images: [ph("Desengraxante")], variants: [{ label: "500ml", price: 19.9 }, { label: "1L", price: 32.9 }] },
  { id: "limpa-pneus", name: "Limpa Pneus e Borrachas", description: "Revitaliza pneus e plásticos externos.", images: [ph("Limpa+Pneus")], variants: [{ label: "500ml", price: 24.9 }, { label: "1L", price: 39.9 }] },
];

// ==================== Spray ====================
const SPRAY_PRODUCTS: Product[] = [
  { id: "spray-preto-fosco", name: "Spray Preto Fosco", description: "Uso geral automotivo e restauração.", images: [ph("Spray+Preto+Fosco")], variants: [{ label: "400ml", price: 32.9 }] },
  { id: "spray-preto-brilho", name: "Spray Preto Brilho", description: "Alta cobertura, secagem rápida.", images: [ph("Spray+Preto+Brilho")], variants: [{ label: "400ml", price: 32.9 }] },
  { id: "spray-branco", name: "Spray Branco", description: "Cobertura uniforme para retoques.", images: [ph("Spray+Branco")], variants: [{ label: "400ml", price: 32.9 }] },
  { id: "spray-verniz", name: "Spray Verniz Brilhante", description: "Proteção e brilho.", images: [ph("Spray+Verniz")], variants: [{ label: "400ml", price: 38.9 }] },
  { id: "spray-primer", name: "Spray Primer", description: "Base cinza para pintura.", images: [ph("Spray+Primer")], variants: [{ label: "400ml", price: 34.9 }] },
  { id: "spray-emborrachado", name: "Spray Emborrachado", description: "Envelopamento líquido removível.", images: [ph("Spray+Emborrachado")], variants: [{ label: "400ml", price: 49.9 }] },
];

// ==================== Estética — mapeamento de subcategorias ====================
const ESTETICA_SUBCATEGORY_MAP: Record<string, EsteticaSub> = {
  "blend-paste": "uso-externo",
  "blend-spray": "uso-externo",
  "alumax": "uso-externo",
  "cera-roxa": "uso-externo",
  "cera-azul": "uso-externo",
  "cera-amarela": "uso-externo",
  "cera-preta": "uso-externo",
  "cera-branca": "uso-externo",
  "cera-vermelha": "uso-externo",
  "cera-verde": "uso-externo",
  "cera-prata": "uso-externo",
  "cera-dourada": "uso-externo",
  "polimento-corte": "polimento",
  "polimento-fino": "polimento",
  "vitrificador": "polimento",
  "primer-est": "uso-externo",
  "desengraxante": "uso-externo",
  "limpa-pneus": "uso-externo",
};
const ESTETICA_ALL: Product[] = ESTETICA_PRODUCTS.map((p) => ({
  ...p,
  category: "estetica",
  subcategory: p.subcategory ?? ESTETICA_SUBCATEGORY_MAP[p.id] ?? "uso-externo",
}));
const ESTETICA_SUBCATEGORIES: SubCategoryOption<EsteticaSub>[] = [
  { id: "uso-externo", label: "🚗 Uso Externo" },
  { id: "uso-interno", label: "🧽 Uso Interno" },
  { id: "polimento", label: "✨ Polimento" },
  { id: "motocicletas", label: "🏍️ Motocicletas" },
  { id: "acessorios-estetica", label: "🔧 Acessórios" },
  { id: "maquinas", label: "🛠️ Máquinas" },
  { id: "kits", label: "📦 Kits" },
];

// ==================== Pintura — registry (id → produtos) ====================
const PINTURA_SUBCATEGORIES: SubCategoryOption<PinturaSub>[] = [
  { id: "verniz", label: "✨ Verniz" },
  { id: "primer", label: "🎯 Primer" },
  { id: "thinner", label: "💧 Thinner" },
  { id: "massa", label: "🧱 Massa" },
  { id: "complementos", label: "🧰 Complementos" },
  { id: "lixa", label: "📄 Lixa" },
  { id: "mascaramento", label: "🎭 Mascaramento" },
  { id: "acessorios", label: "🔧 Acessórios" },
  { id: "cola", label: "🧴 Cola" },
];

// ==================== Pintura subcategorias ====================
const VERNIZ_PRODUCTS: Product[] = [
  {
    id: "verniz-51",
    name: "Verniz PU 5.1",
    subname: "Alta produtividade, brilho intenso",
    description: "Kit verniz + endurecedor. Escolha a linha e o volume.",
    images: [ph("Verniz+5.1")],
    variants: [
      { label: "5.1 — 1/4", price: 149.9 },
      { label: "5.1 — Galão", price: 449.9 },
    ],
  },
  {
    id: "verniz-21",
    name: "Verniz PU 2.1",
    subname: "HS profissional, alto sólidos",
    description: "Kit verniz + endurecedor. Escolha a linha e o volume.",
    images: [ph("Verniz+2.1")],
    variants: [
      { label: "2.1 — 1/4", price: 189.9 },
      { label: "2.1 — Galão", price: 569.9 },
    ],
  },
];
const PRIMER_PRODUCTS: Product[] = [
  {
    id: "primer-51",
    name: "Primer PU 5.1",
    subname: "Rápida secagem, boa lixabilidade",
    description: "Kit primer + endurecedor.",
    images: [ph("Primer+5.1")],
    variants: [
      { label: "5.1 — 1/4", price: 119.9 },
      { label: "5.1 — Galão", price: 359.9 },
    ],
  },
  {
    id: "primer-81",
    name: "Primer PU 8.1",
    subname: "Alta cobertura, ideal reparos",
    description: "Kit primer + endurecedor.",
    images: [ph("Primer+8.1")],
    variants: [
      { label: "8.1 — 1/4", price: 149.9 },
      { label: "8.1 — Galão", price: 439.9 },
    ],
  },
];
const THINNER_PRODUCTS: Product[] = [
  { id: "thinner-basico", name: "Thinner 1000 (Diluente)", description: "Uso geral para limpeza.", images: [ph("Thinner+1000")], variants: [{ label: "900ml", price: 24.9 }, { label: "5L", price: 89.9 }] },
  { id: "thinner-nitro", name: "Thinner Nitro", description: "Diluição de laquê/laca.", images: [ph("Thinner+Nitro")], variants: [{ label: "900ml", price: 29.9 }, { label: "5L", price: 109.9 }] },
];
const MASSA_PRODUCTS: Product[] = [
  { id: "massa-plastica", name: "Massa Plástica Cinza", description: "Rápida cura, fácil lixamento.", images: [ph("Massa+Plástica")], variants: [{ label: "900g", price: 34.9 }, { label: "1,6kg", price: 54.9 }] },
  { id: "massa-poliester", name: "Massa Poliéster Premium", description: "Alta aderência.", images: [ph("Massa+Poliéster")], variants: [{ label: "900g", price: 44.9 }] },
];
const COMPLEMENTOS_PRODUCTS: Product[] = [
  { id: "microfibra", name: "Kit Microfibra Premium (2un)", description: "Pano dupla face, alta absorção.", images: [ph("Microfibra")], variants: [{ label: "1 Kit", price: 19.9 }, { label: "3 Kits", price: 49.9 }] },
  { id: "esponja", name: "Esponja Aplicadora Profissional", description: "Ideal para ceras, polidores e selantes.", images: [ph("Esponja")], variants: [{ label: "1 un", price: 8.9 }, { label: "5 un", price: 35.0 }] },
];
const MASCARAMENTO_PRODUCTS: Product[] = [
  { id: "fita-crepe", name: "Fita Crepe Automotiva (50m)", description: "Alta aderência, resistente a solventes.", images: [ph("Fita+Crepe")], variants: [{ label: "1 rolo", price: 12.5 }, { label: "3 rolos", price: 32.0 }] },
  { id: "papel-mascaramento", name: "Papel Mascaramento (60cm)", description: "Bobina para pintura.", images: [ph("Papel")], variants: [{ label: "50m", price: 34.9 }] },
  { id: "plastico-cobre-tudo", name: "Plástico Cobre Tudo", description: "Proteção do veículo.", images: [ph("Plástico")], variants: [{ label: "4x5m", price: 12.9 }] },
];
const ACESSORIOS_PRODUCTS: Product[] = [
  { id: "espatula", name: "Kit Espátulas de Massa", description: "3 medidas, aço inox.", images: [ph("Espátulas")], variants: [{ label: "Kit 3un", price: 22.9 }] },
  { id: "pistola-gravidade", name: "Pistola Gravidade 1.4mm", description: "Baixa pressão, alta transferência.", images: [ph("Pistola")], variants: [{ label: "1 un", price: 189.9 }] },
];
const COLA_PRODUCTS: Product[] = [
  { id: "cola-para-choque", name: "Cola PU Para-choque", description: "Adesivo estrutural bicomponente.", images: [ph("Cola+PU")], variants: [{ label: "50ml", price: 39.9 }] },
  { id: "cola-parabrisa", name: "Cola Uretânica Para-brisa", description: "Fixação de vidros.", images: [ph("Cola+Uret")], variants: [{ label: "310ml", price: 89.9 }] },
];
// Lixa - lista rápida
const LIXA_NUMERATIONS = [80, 100, 120, 150, 180, 220, 240, 320, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500];

// Subcategoria: Tira-Riscos / Pequenos Retoques
const KIT_TIRA_RISCOS_PRICE = 25.0;

// ==================== Prontas ====================
type ProntaTipo = "Poliéster" | "PU" | "Sintético" | "Duco/LACA";
type MarcaPronta = "Brazilian" | "Lazzuril";
const PRONTAS_MARCA_TIPOS: Record<MarcaPronta, ProntaTipo[]> = {
  Brazilian: ["Poliéster", "PU", "Sintético", "Duco/LACA"],
  Lazzuril: ["Poliéster", "PU"],
};
const TIPO_TAMANHO: Record<ProntaTipo, string> = {
  "Poliéster": "1/4 (900ml)",
  "PU": "1/4 (675ml)",
  "Sintético": "1/4 (900ml)",
  "Duco/LACA": "1/4 (900ml)",
};
const PRONTA_MARCA_IMG: Record<MarcaPronta, string> = {
  Brazilian: ph("BRAZILIAN"),
  Lazzuril: ph("LAZZURIL"),
};

// Pesadas - min 225ml
const PESADAS_MARCAS = ["Brazilian", "Wanda"] as const;
const FRACTIONS: { label: string; ml: number }[] = [
  { label: "1/4", ml: 225 },
  { label: "1/3", ml: 300 },
  { label: "1/2", ml: 450 },
  { label: "1 Quarto", ml: 900 },
  { label: "1 Quarto e Meio", ml: 1350 },
  { label: "2 Quartos", ml: 1800 },
  { label: "2 Quartos e Meio", ml: 2250 },
  { label: "3 Quartos", ml: 2700 },
  { label: "4 Quartos (Galão)", ml: 3600 },
  { label: "5 Quartos", ml: 4500 },
  { label: "6 Quartos", ml: 5400 },
  { label: "7 Quartos", ml: 6300 },
  { label: "8 Quartos", ml: 7200 },
];

const LOJAS = [
  {
    id: "dns1",
    nome: "DNS Tintas 1 — Jardim Luso",
    endereco: "R. Alcides Arguedas, 62 — Jardim Luso, São Paulo/SP",
    telefone: "(11) 5623-7320",
    whatsapp: "5511947256647",
    horario: "Seg-Sex 08:30–18:00 | Sáb 08:30–14:00",
  },
  {
    id: "dns2",
    nome: "DNS Tintas 2 — Vila Santa Catarina",
    endereco: "R. Coriolano Durand, 460 — Vila Santa Catarina, São Paulo/SP",
    telefone: "(11) 5677-8888",
    whatsapp: "5511996225943",
    horario: "Seg-Sex 08:30–17:30 | Sáb 08:30–13:00",
  },
] as const;

const BRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const calcParcelas = (valor: number) => {
  if (valor < 300) return null;
  const parcelas = 3;
  return { parcelas, valorParcela: valor / parcelas };
};
const calcPix = (valor: number) => valor * 0.97;

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

type CartItem = {
  uid: number;
  name: string;
  variant?: string;
  price: number;
  sobConsulta?: boolean;
  meta?: { label: string; value: string }[];
  photo?: { name: string; dataUrl: string } | null;
};

let __uid = 0;
const nextUid = () => ++__uid;

type Lightbox = { images: string[]; index: number } | null;

function Index() {
  const [category, setCategory] = useState<Category>("estetica");
  const [paintSub, setPaintSub] = useState<PaintSub>("tira-riscos");
  const [pinturaSub, setPinturaSub] = useState<PinturaSub | null>(null);
  const [esteticaSub, setEsteticaSub] = useState<EsteticaSub | null>(null);
  const [search, setSearch] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [showColorHelp, setShowColorHelp] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [identityErr, setIdentityErr] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<"retirar" | "motoboy" | "">("");
  const [deliveryError, setDeliveryError] = useState(false);
  const [motoboyAddress, setMotoboyAddress] = useState("");
  const [storeId, setStoreId] = useState<(typeof LOJAS)[number]["id"]>("dns1");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lightbox, setLightbox] = useState<Lightbox>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  /** Imagens promocionais da DNS — adicionar aqui quando disponíveis. */
  const PROMO_SLIDES: PromoSlide[] = [];

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((s, it) => s + (it.sobConsulta ? 0 : it.price), 0);
  const sobConsultaCount = cartItems.filter((it) => it.sobConsulta).length;
  void accumulated;

  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem("dns_last_phone");
      if (savedPhone) {
        const raw = localStorage.getItem(`dns_cliente_${savedPhone}`);
        if (raw) {
          const c = JSON.parse(raw) as { nome: string; telefone: string; total: number };
          setCustomerName(c.nome || "");
          setCustomerPhone(maskPhone(c.telefone || ""));
          setAccumulated(c.total || 0);
        }
      }
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft")
        setLightbox((lb) => (lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb));
      if (e.key === "ArrowRight")
        setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2200);
  };

  const pushCart = (item: Omit<CartItem, "uid">) => {
    const ci: CartItem = { ...item, uid: nextUid() };
    setCartItems((items) => [...items, ci]);
    showToast(`${ci.name} adicionado!`);
  };

  const addProductToCart = (p: Product) => {
    const idx = selectedVariant[p.id] ?? 0;
    const v = p.variants[idx];
    pushCart({ name: p.name, variant: v.label, price: v.price });
  };

  const removeCartItem = (index: number) =>
    setCartItems((items) => items.filter((_, i) => i !== index));

  const downloadPhoto = (dataUrl: string, name: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = name || "etiqueta-cor.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const loja = LOJAS.find((l) => l.id === storeId) ?? LOJAS[0];

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    const pix = calcPix(cartTotal);
    const parc = calcParcelas(cartTotal);
    lines.push("🛒 *NOVO PEDIDO — DNS TINTAS*");
    lines.push("");
    lines.push(`👤 *Cliente:* ${customerName.trim()}`);
    lines.push(`📱 *WhatsApp:* ${customerPhone.trim()}`);
    lines.push(`🏬 *Loja:* ${loja.nome}`);
    lines.push(`🚚 *Entrega:* ${delivery === "retirar" ? "Retirar na loja" : "Motoboy"}`);
    if (delivery === "motoboy" && motoboyAddress.trim())
      lines.push(`📍 *Endereço:* ${motoboyAddress.trim()}`);
    lines.push("");
    lines.push("📦 *Itens do pedido:*");
    cartItems.forEach((it, i) => {
      const variant = it.variant ? ` — ${it.variant}` : "";
      const priceStr = it.sobConsulta ? "Sob consulta" : BRL(it.price);
      lines.push(`${i + 1}. ${it.name}${variant} — ${priceStr}`);
      if (it.meta) it.meta.forEach((m) => lines.push(`   • ${m.label}: ${m.value}`));
      if (it.photo) lines.push(`   📎 Foto anexada: ${it.photo.name} (enviarei em seguida)`);
    });
    lines.push("");
    if (sobConsultaCount > 0) {
      lines.push(`ℹ️ *${sobConsultaCount} item(ns) sob consulta* — valor a combinar.`);
    }
    lines.push(`💰 *Subtotal (itens com preço):* ${BRL(cartTotal)}`);
    lines.push(`💠 *PIX (-3%):* ${BRL(pix)}`);
    if (parc) lines.push(`💳 *Ou em até ${parc.parcelas}x de ${BRL(parc.valorParcela)} sem juros*`);
    lines.push("");
    lines.push("✅ Pedido feito pelo catálogo — concorrendo ao sorteio mensal Vonixx!");
    return lines.join("\n");
  };

  const openCheckout = () => {
    const validDelivery = delivery === "retirar" || delivery === "motoboy";
    setDeliveryError(!validDelivery);
    if (!validDelivery) return;
    if (delivery === "motoboy" && !motoboyAddress.trim()) {
      setDeliveryError(true);
      return;
    }
    setShowIdentity(true);
  };

  const confirmIdentityAndSend = () => {
    const name = customerName.trim();
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (name.length < 2) return setIdentityErr("Informe seu nome.");
    if (phoneDigits.length < 10) return setIdentityErr("Informe um WhatsApp válido.");
    setIdentityErr(null);

    try {
      const key = `dns_cliente_${phoneDigits}`;
      const raw = localStorage.getItem(key);
      const prev = raw ? (JSON.parse(raw) as { total?: number }) : {};
      const newTotal = (prev.total || 0) + cartTotal;
      localStorage.setItem(key, JSON.stringify({ nome: name, telefone: phoneDigits, total: newTotal, updated: Date.now() }));
      localStorage.setItem("dns_last_phone", phoneDigits);
      setAccumulated(newTotal);
    } catch {
      /* noop */
    }

    cartItems.forEach((it) => it.photo && downloadPhoto(it.photo.dataUrl, it.photo.name));
    const text = encodeURIComponent(buildWhatsAppMessage());
    const url = `https://wa.me/${loja.whatsapp}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setShowIdentity(false);
    setShowCart(false);
    setCartItems([]);
    setDelivery("");
    setMotoboyAddress("");
  };

  const filterProducts = (list: Product[]) => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.subname?.toLowerCase().includes(q) ?? false) ||
        p.description.toLowerCase().includes(q),
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Top bar — PRESERVADO */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-border">
              <img src={logoAsset.url} alt="Logo DNS TINTAS" className="h-14 w-14 object-contain" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">DNS TINTAS</p>
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Catálogo Inteligente</p>
            </div>
          </div>
          <button
            onClick={() => cartCount > 0 && setShowCart(true)}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card transition-colors hover:border-primary"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-28 pt-4">
        <PromoCarousel slides={PROMO_SLIDES} />
        {/* Category tabs */}
        <section className="mt-5">
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border bg-card p-1.5">
            {[
              { id: "estetica" as const, label: "Estética" },
              { id: "tintas" as const, label: "Tintas" },
              { id: "pintura" as const, label: "Pintura" },
            ].map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategory(tab.id)}
                  className={`rounded-xl px-2 py-2.5 text-[12px] font-bold transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Global search bar */}
        <section className="mt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔎 Buscar produtos no catálogo..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-9 text-sm focus:border-primary focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        {/* Estética — arquitetura geral (SubCategorySelector + ProductGrid) */}
        {category === "estetica" && (
          <section className="mt-4 space-y-3">
            <SubCategorySelector
              options={ESTETICA_SUBCATEGORIES}
              value={esteticaSub}
              onChange={setEsteticaSub}
              variant={esteticaSub ? "tabs" : "grid"}
            />
            {esteticaSub && (
              <ProductGrid
                products={filterProducts(
                  ESTETICA_ALL.filter((p) => p.subcategory === esteticaSub),
                )}
                selectedVariant={selectedVariant}
                onVariant={(id, i) => setSelectedVariant((s) => ({ ...s, [id]: i }))}
                onAdd={(p) => addProductToCart(p)}
                onOpenLightbox={(images, i) => setLightbox({ images, index: i })}
                emptyLabel="Nenhum produto nesta subcategoria."
              />
            )}
            {!esteticaSub && (
              <p className="text-center text-xs text-muted-foreground">
                Selecione uma subcategoria acima para ver os produtos.
              </p>
            )}
          </section>
        )}

        {/* Tintas */}
        {category === "tintas" && (
          <section className="mt-4 space-y-3">
            <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-border bg-card p-1.5">
              {[
                { id: "tira-riscos" as const, label: "🚗 Retoques" },
                { id: "spray" as const, label: "💨 Spray" },
                { id: "prontas" as const, label: "🧑‍🎨 Prontas" },
                { id: "pesadas" as const, label: "⚖️ Pesadas" },
              ].map((tab) => {
                const active = paintSub === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPaintSub(tab.id)}
                    className={`rounded-xl px-1 py-2 text-[10.5px] font-bold transition-all ${
                      active ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {paintSub === "tira-riscos" && <TiraRiscosPanel onAdd={pushCart} onOpenHelp={() => setShowColorHelp(true)} />}
            {paintSub === "spray" && (
              <div className="grid grid-cols-2 gap-3">
                {filterProducts(SPRAY_PRODUCTS).map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    idx={selectedVariant[p.id] ?? 0}
                    onVariant={(i) => setSelectedVariant((s) => ({ ...s, [p.id]: i }))}
                    onAdd={() => addProductToCart(p)}
                    onOpenLightbox={(i) => setLightbox({ images: p.images, index: i })}
                  />
                ))}
              </div>
            )}
            {paintSub === "prontas" && <ProntasPanel onAdd={pushCart} />}
            {paintSub === "pesadas" && <PesadasPanel onAdd={pushCart} onOpenHelp={() => setShowColorHelp(true)} />}
          </section>
        )}

        {/* Pintura — arquitetura geral (SubCategorySelector + ProductGrid) */}
        {category === "pintura" && (
          <section className="mt-4 space-y-3">
            <SubCategorySelector
              options={PINTURA_SUBCATEGORIES}
              value={pinturaSub}
              onChange={setPinturaSub}
              variant={pinturaSub ? "tabs" : "grid"}
            />
            {pinturaSub === "lixa" ? (
              <LixaPanel search={search} onAdd={pushCart} />
            ) : pinturaSub ? (
              <ProductGrid
                products={filterProducts(pinturaListFor(pinturaSub))}
                selectedVariant={selectedVariant}
                onVariant={(id, i) => setSelectedVariant((s) => ({ ...s, [id]: i }))}
                onAdd={(p) => addProductToCart(p)}
                onOpenLightbox={(images, i) => setLightbox({ images, index: i })}
                emptyLabel="Nenhum produto nesta subcategoria."
              />
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Selecione uma subcategoria acima para ver os produtos.
              </p>
            )}
          </section>
        )}

        {/* Sticky cart summary */}
        {cartCount > 0 && (
          <div className="fixed inset-x-0 bottom-3 z-40 mx-auto max-w-2xl px-4">
            <button
              onClick={() => setShowCart(true)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-card/95 px-4 py-3 text-left shadow-[var(--shadow-glow)] backdrop-blur transition-transform active:scale-[0.99]"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {cartCount} {cartCount === 1 ? "item" : "itens"} · {sobConsultaCount > 0 ? `${sobConsultaCount} sob consulta · ` : ""}total
                </p>
                <p className="font-display text-lg font-bold text-primary">{BRL(cartTotal)}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
                <ShoppingCart className="h-4 w-4" /> Finalizar
              </span>
            </button>
          </div>
        )}

        {toast && (
          <div className="pointer-events-none fixed inset-x-0 top-20 z-50 mx-auto max-w-2xl px-4">
            <div className="mx-auto inline-flex w-full items-center gap-2 rounded-xl border border-primary/50 bg-card/95 px-3 py-2 text-xs font-semibold shadow-[var(--shadow-glow)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {toast}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-6 text-center text-sm">
          <p className="font-display font-bold text-primary">DNS Tintas</p>
          <p className="text-xs text-muted-foreground">Especialistas em tintas automotivas</p>
          <div className="mt-3 flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <a href="tel:+551156237320" className="inline-flex items-center gap-1.5 hover:text-primary">
              <Phone className="h-3.5 w-3.5" /> (11) 5623-7320
            </a>
            <a href="https://wa.me/5511947256647" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary">
              <MessageCircle className="h-3.5 w-3.5" /> (11) 94725-6647
            </a>
            <p>🕒 Seg–Sex 08:30–18:00 · Sáb 08:30–14:00</p>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs">
            <a href="https://instagram.com/dnstintas" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:opacity-80">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href="https://wa.me/5511947256647" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:opacity-80">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground/70">© 2025 DNS Tintas · Catálogo Inteligente</p>
        </div>
      </footer>

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Anterior">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img src={lightbox.images[lightbox.index]} alt="Produto" className="max-h-[85vh] max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Próximo">
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            {lightbox.index + 1} / {lightbox.images.length}
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setShowCart(false)}>
          <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-primary/40 bg-card shadow-[var(--shadow-glow)] sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--gradient-promo)" }}>
              <div className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                <p className="font-display text-base font-bold">Seu Pedido</p>
              </div>
              <button onClick={() => setShowCart(false)} className="rounded-full p-1 text-white/90 hover:bg-white/15" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="space-y-2">
                {cartItems.length === 0 && <p className="text-center text-sm text-muted-foreground">Carrinho vazio.</p>}
                {cartItems.map((it, i) => (
                  <div key={it.uid} className="rounded-xl border border-border bg-background/60 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{it.name}</p>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{it.variant}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <p className="font-display text-sm font-bold text-primary">
                          {it.sobConsulta ? "Sob consulta" : BRL(it.price)}
                        </p>
                        <button onClick={() => removeCartItem(i)} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Remover">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {(it.meta?.length || it.photo) && (
                      <div className="mt-2 space-y-1 rounded-lg border border-primary/30 bg-primary/5 p-2 text-[11px]">
                        {it.meta?.map((m) => (
                          <p key={m.label}>
                            <span className="text-muted-foreground">{m.label}:</span>{" "}
                            <span className="font-semibold">{m.value}</span>
                          </p>
                        ))}
                        {it.photo && (
                          <div className="flex items-center gap-2 pt-1">
                            <img src={it.photo.dataUrl} alt="Etiqueta" className="h-10 w-10 rounded object-cover ring-1 ring-border" />
                            <span className="flex-1 truncate text-muted-foreground">{it.photo.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">Loja para retirada / atendimento</p>
                <div className="grid gap-2">
                  {LOJAS.map((l) => {
                    const active = storeId === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => setStoreId(l.id)}
                        className={`rounded-lg border p-3 text-left text-xs transition-all ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"}`}
                      >
                        <p className="font-bold text-primary">{l.nome}</p>
                        <p className="text-muted-foreground">{l.endereco}</p>
                        <p className="text-[10px] text-muted-foreground">{l.horario}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">Forma de Entrega</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "retirar" as const, label: "Retirar na Loja", icon: Store },
                    { id: "motoboy" as const, label: "Entrega via Motoboy", icon: Bike },
                  ].map(({ id, label, icon: Icon }) => {
                    const active = delivery === id;
                    return (
                      <button
                        key={id}
                        onClick={() => { setDelivery(id); setDeliveryError(false); }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"}`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>
                {delivery === "motoboy" && (
                  <input
                    type="text"
                    value={motoboyAddress}
                    onChange={(e) => setMotoboyAddress(e.target.value.slice(0, 200))}
                    placeholder="Endereço completo p/ entrega"
                    className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                )}
                {deliveryError && (
                  <p className="mt-1 text-[11px] text-destructive">Selecione a entrega{delivery === "motoboy" ? " e informe o endereço" : ""}.</p>
                )}
              </div>

              {cartItems.some((it) => it.photo) && (
                <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-[11px] text-foreground">
                  <Download className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>A foto da etiqueta será baixada automaticamente — basta anexá-la na conversa do WhatsApp após enviar.</p>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-background/60 p-4 space-y-2">
              {sobConsultaCount > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-[11px]">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <p><span className="font-bold">{sobConsultaCount} item(ns) sob consulta</span> — o atendente confirma o valor no WhatsApp.</p>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Subtotal (itens com preço)</span>
                <span className="font-semibold">{BRL(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">PIX (-3%)</span>
                <span className="font-semibold text-[color:var(--success)]">{BRL(calcPix(cartTotal))}</span>
              </div>
              {(() => {
                const parc = calcParcelas(cartTotal);
                return parc ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Ou parcelado</span>
                    <span className="font-semibold">
                      {parc.parcelas}x de {BRL(parc.valorParcela)}
                    </span>
                  </div>
                ) : null;
              })()}
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold text-primary">{BRL(cartTotal)}</span>
              </div>
              <button
                onClick={openCheckout}
                disabled={cartItems.length === 0}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Concluir e Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {showIdentity && (
        <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={() => setShowIdentity(false)}>
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-[var(--shadow-glow)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--gradient-promo)" }}>
              <div className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                <p className="font-display text-base font-bold">Identificação</p>
              </div>
              <button onClick={() => setShowIdentity(false)} className="rounded-full p-1 text-white/90 hover:bg-white/15" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-xs text-muted-foreground">Precisamos do seu nome e WhatsApp para enviar o pedido e acumular seus selos do Cartão Fidelidade.</p>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">Nome</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value.slice(0, 80))} placeholder="Nome completo" className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">WhatsApp</label>
                <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(maskPhone(e.target.value))} placeholder="(11) 99999-9999" className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              {identityErr && <p className="text-[11px] text-destructive">{identityErr}</p>}
              <button onClick={confirmIdentityAndSend} className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] active:scale-[0.98]">
                <Send className="h-4 w-4" /> Enviar pedido por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {showColorHelp && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={() => setShowColorHelp(false)}>
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-[var(--shadow-glow)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--gradient-promo)" }}>
              <div className="flex items-center gap-2 text-white">
                <Palette className="h-5 w-5" />
                <p className="font-display text-base font-bold">Onde achar o código da cor</p>
              </div>
              <button onClick={() => setShowColorHelp(false)} className="rounded-full p-1 text-white/90 hover:bg-white/15" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <p className="text-muted-foreground">Toda montadora coloca uma etiqueta com o código da tinta original em pontos específicos do veículo.</p>
              <ul className="space-y-2">
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Fiat / Jeep / RAM</p>
                  <p className="text-xs text-muted-foreground">Etiqueta na coluna da porta do motorista ou tampa do porta-malas.</p>
                </li>
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Volkswagen</p>
                  <p className="text-xs text-muted-foreground">Coluna lateral, vão do motor ou contracapa do manual.</p>
                </li>
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Chevrolet / GM</p>
                  <p className="text-xs text-muted-foreground">Coluna da porta ("PNT/COR") ou manual.</p>
                </li>
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Ford / Hyundai / Toyota</p>
                  <p className="text-xs text-muted-foreground">Coluna da porta ("Paint" / "Color Code").</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function pinturaListFor(sub: PinturaSub): Product[] {
  switch (sub) {
    case "verniz": return VERNIZ_PRODUCTS;
    case "primer": return PRIMER_PRODUCTS;
    case "thinner": return THINNER_PRODUCTS;
    case "massa": return MASSA_PRODUCTS;
    case "complementos": return COMPLEMENTOS_PRODUCTS;
    case "mascaramento": return MASCARAMENTO_PRODUCTS;
    case "acessorios": return ACESSORIOS_PRODUCTS;
    case "cola": return COLA_PRODUCTS;
    default: return [];
  }
}

/* ================= Product Card ================= */
/* ProductCard extracted to src/components/ProductCard.tsx */

/* ================= Tira-Riscos ================= */
function TiraRiscosPanel({ onAdd, onOpenHelp }: { onAdd: (item: Omit<CartItem, "uid">) => void; onOpenHelp: () => void }) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(null);
  const [err, setErr] = useState(false);

  const submit = () => {
    if (!marca.trim() || !modelo.trim() || !ano.trim() || !cor.trim()) { setErr(true); return; }
    onAdd({
      name: "Kit Tira-Riscos (100ml)",
      variant: "100ml",
      price: KIT_TIRA_RISCOS_PRICE,
      meta: [
        { label: "Marca", value: marca.trim() },
        { label: "Modelo", value: modelo.trim() },
        { label: "Ano", value: ano.trim() },
        { label: "Cor", value: cor.trim() },
      ],
      photo,
    });
    setMarca(""); setModelo(""); setAno(""); setCor(""); setPhoto(null); setErr(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
          <img src={canetaImg} alt="Kit Tira-Riscos" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">Kit Tira-Riscos (100ml)</p>
          <p className="font-display text-sm font-bold text-primary">{BRL(KIT_TIRA_RISCOS_PRICE)}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">Preencha os dados do seu veículo.</p>
      <div className="grid grid-cols-2 gap-2">
        <FieldInput label="Marca" value={marca} onChange={setMarca} placeholder="Ex: Fiat" />
        <FieldInput label="Modelo" value={modelo} onChange={setModelo} placeholder="Ex: Argo" />
        <FieldInput label="Ano" value={ano} onChange={setAno} placeholder="Ex: 2022" />
        <FieldInput label="Nome / Código da Cor" value={cor} onChange={setCor} placeholder="Ex: Branco 297" />
      </div>
      <button onClick={onOpenHelp} className="flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-left text-[11px] font-semibold text-primary hover:bg-primary/10">
        <HelpCircle className="h-4 w-4 shrink-0" />
        🔍 Não sabe o código da cor do seu carro?
      </button>
      <PhotoField photo={photo} onChange={setPhoto} />
      {err && <p className="text-[11px] text-destructive">Preencha marca, modelo, ano e cor.</p>}
      <button onClick={submit} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]">
        <Plus className="h-4 w-4" strokeWidth={3} /> Adicionar ao Carrinho
      </button>
    </div>
  );
}

/* ================= Prontas (NOVO FLUXO) ================= */
function ProntasPanel({ onAdd }: { onAdd: (item: Omit<CartItem, "uid">) => void }) {
  // Fluxo: Tipo -> Marca (filtrada) -> Montadora (condicional) -> Cor
  const [tipo, setTipo] = useState<ProntaTipo | "">("");
  const [maisBarata, setMaisBarata] = useState(false);
  const [marca, setMarca] = useState<MarcaPronta | "">("");
  const [endurecedor, setEndurecedor] = useState(false);
  const [montadora, setMontadora] = useState<string>("");
  const [corQuery, setCorQuery] = useState("");
  const [selectedCor, setSelectedCor] = useState<ProntaCor | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Marcas disponíveis para o tipo escolhido
  const marcasDisp: MarcaPronta[] = tipo
    ? (Object.entries(PRONTAS_MARCA_TIPOS)
        .filter(([, tipos]) => tipos.includes(tipo as ProntaTipo))
        .map(([m]) => m as MarcaPronta))
    : [];

  const requerMontadora = tipo === "Poliéster" || tipo === "PU";

  // Cores disponíveis
  const availableColors: ProntaCor[] = useMemo(() => {
    if (!montadora) return [];
    if (maisBarata) {
      // combina cores de todas as marcas disponíveis para o tipo
      const seen = new Set<string>();
      const merged: ProntaCor[] = [];
      marcasDisp.forEach((m) => {
        const list = PRONTAS_COLORS[m]?.[montadora] ?? [];
        list.forEach((c) => {
          if (!seen.has(c.nome)) { seen.add(c.nome); merged.push(c); }
        });
      });
      return merged;
    }
    if (!marca) return [];
    return PRONTAS_COLORS[marca]?.[montadora] ?? [];
  }, [montadora, marca, maisBarata, marcasDisp]);

  const filteredColors = corQuery.trim()
    ? availableColors.filter((c) => c.nome.toLowerCase().includes(corQuery.trim().toLowerCase()))
    : availableColors;

  const resetCor = () => { setSelectedCor(null); setCorQuery(""); };
  const resetAfterTipo = () => { setMarca(""); setMontadora(""); resetCor(); setEndurecedor(false); };

  const marcaImg = marca ? PRONTA_MARCA_IMG[marca] : personalizadaImg;

  const submit = () => {
    if (!tipo) return setErr("Escolha o Tipo de tinta.");
    if (!maisBarata && !marca) return setErr("Escolha a Marca.");
    if (requerMontadora && !montadora) return setErr("Escolha a Montadora.");
    if (requerMontadora && !selectedCor) return setErr("Selecione a Cor.");
    if (tipo === "PU" && !endurecedor) return setErr("Endurecedor é obrigatório para tinta PU.");
    setErr(null);

    const meta: { label: string; value: string }[] = [
      { label: "Tipo", value: tipo },
      { label: "Marca", value: maisBarata ? "🔎 Mais barata (comparativo)" : (marca as string) },
    ];
    if (requerMontadora) {
      meta.push({ label: "Montadora", value: montadora });
      if (selectedCor) meta.push({ label: "Cor (Pronta de Fábrica)", value: selectedCor.nome });
    }
    meta.push({ label: "Tamanho", value: TIPO_TAMANHO[tipo] });
    if (tipo === "PU") meta.push({ label: "Endurecedor (225ml)", value: "Incluso (obrigatório)" });

    const nomeMarca = maisBarata ? "melhor preço" : marca;
    onAdd({
      name: `Tinta Pronta ${nomeMarca} — ${tipo}${requerMontadora ? ` (${montadora})` : ""}`,
      variant: TIPO_TAMANHO[tipo],
      price: 0,
      sobConsulta: true,
      meta,
    });
    setTipo(""); resetAfterTipo(); setMaisBarata(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
          <img src={marcaImg} alt="Tinta Pronta" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">Tintas Prontas de Fábrica</p>
          <p className="text-[11px] text-muted-foreground">Preço <span className="font-bold text-primary">sob consulta</span> — confirmado pelo atendente.</p>
        </div>
      </div>

      {/* 1. Tipo */}
      <FieldGroup label="1. Tipo de Tinta">
        <div className="grid grid-cols-2 gap-1.5">
          {(["Poliéster", "PU", "Sintético", "Duco/LACA"] as ProntaTipo[]).map((t) => (
            <Pill key={t} active={tipo === t} onClick={() => { setTipo(t); resetAfterTipo(); }}>{t}</Pill>
          ))}
        </div>
        {tipo && <p className="mt-1.5 text-[11px] text-muted-foreground">Tamanho: <span className="font-semibold text-foreground">{TIPO_TAMANHO[tipo]}</span></p>}
      </FieldGroup>

      {/* Checkbox "mais barata" */}
      {tipo && (
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-[12px]">
          <input
            type="checkbox"
            checked={maisBarata}
            onChange={(e) => { setMaisBarata(e.target.checked); setMarca(""); resetCor(); }}
            className="h-4 w-4 accent-primary"
          />
          <span>Quero a mais barata <span className="text-muted-foreground">(comparativo entre marcas)</span></span>
        </label>
      )}

      {/* 2. Marca */}
      {tipo && !maisBarata && (
        <FieldGroup label="2. Marca">
          <div className="grid grid-cols-2 gap-1.5">
            {marcasDisp.map((m) => (
              <Pill key={m} active={marca === m} onClick={() => { setMarca(m); setMontadora(""); resetCor(); setEndurecedor(false); }}>{m}</Pill>
            ))}
          </div>
        </FieldGroup>
      )}

      {/* 3. Montadora (condicional) */}
      {tipo && requerMontadora && (maisBarata || marca) && (
        <FieldGroup label="3. Montadora">
          <select
            value={montadora}
            onChange={(e) => { setMontadora(e.target.value); resetCor(); }}
            className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">— Escolha a montadora —</option>
            {MONTADORAS.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
        </FieldGroup>
      )}

      {/* 4. Cor */}
      {tipo && requerMontadora && montadora && (
        <FieldGroup label="4. Cor (busca preditiva)">
          <div className="relative">
            <input
              type="text"
              value={corQuery}
              onChange={(e) => { setCorQuery(e.target.value); setSelectedCor(null); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={`Digite para buscar — ${availableColors.length} cores`}
              className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {showSuggestions && filteredColors.length > 0 && !selectedCor && (
              <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-primary/40 bg-card shadow-[var(--shadow-glow)]">
                {filteredColors.map((c) => (
                  <li key={c.nome}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setSelectedCor(c); setCorQuery(c.nome); setShowSuggestions(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-primary/15"
                    >
                      {c.hex && <span className="h-4 w-4 shrink-0 rounded-full ring-1 ring-border" style={{ background: c.hex }} />}
                      <span className="flex-1 truncate font-semibold">{c.nome}</span>
                      <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">Sob consulta</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedCor && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-2 text-[11px]">
              {selectedCor.hex && <span className="h-5 w-5 shrink-0 rounded-full ring-1 ring-border" style={{ background: selectedCor.hex }} />}
              <span className="flex-1 truncate font-semibold">{selectedCor.nome}</span>
              <span className="font-display text-[11px] font-bold text-primary">Sob consulta</span>
              <button type="button" onClick={resetCor} className="rounded p-0.5 text-muted-foreground hover:text-foreground" aria-label="Limpar cor">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </FieldGroup>
      )}

      {/* Endurecedor obrigatório para PU */}
      {tipo === "PU" && (
        <label className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-sm ${endurecedor ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"}`}>
          <input
            type="checkbox"
            checked={endurecedor}
            onChange={(e) => setEndurecedor(e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-emerald-600"
          />
          <div className="min-w-0">
            <p className="font-bold">⚠️ Endurecedor (225ml) — OBRIGATÓRIO</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Tinta PU só cura com endurecedor. Marque para prosseguir. Valor sob consulta.
            </p>
          </div>
        </label>
      )}

      {err && <p className="text-[11px] text-destructive">{err}</p>}
      <button onClick={submit} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]">
        <Plus className="h-4 w-4" strokeWidth={3} /> Adicionar — Sob consulta
      </button>
    </div>
  );
}

/* ================= Pesadas ================= */
function PesadasPanel({ onAdd, onOpenHelp }: { onAdd: (item: Omit<CartItem, "uid">) => void; onOpenHelp: () => void }) {
  const [marca, setMarca] = useState<(typeof PESADAS_MARCAS)[number] | "">("");
  const [maisBarata, setMaisBarata] = useState(false);
  const [veicMarca, setVeicMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [fracIdx, setFracIdx] = useState(3);
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(null);
  const [err, setErr] = useState(false);
  const frac = FRACTIONS[fracIdx];

  const submit = () => {
    if ((!maisBarata && !marca) || !veicMarca.trim() || !modelo.trim() || !ano.trim() || !cor.trim()) { setErr(true); return; }
    onAdd({
      name: `Tinta Pesada na Hora — ${maisBarata ? "melhor preço" : marca}`,
      variant: `${frac.label} (${frac.ml.toLocaleString("pt-BR")}ml)`,
      price: 0,
      sobConsulta: true,
      meta: [
        { label: "Sistema de Pesagem", value: maisBarata ? "🔎 Mais barata (comparativo)" : (marca as string) },
        { label: "Marca Veículo", value: veicMarca.trim() },
        { label: "Modelo", value: modelo.trim() },
        { label: "Ano", value: ano.trim() },
        { label: "Nome / Código da Cor", value: cor.trim() },
        { label: "Fração", value: `${frac.label} (${frac.ml.toLocaleString("pt-BR")}ml)` },
      ],
      photo,
    });
    setVeicMarca(""); setModelo(""); setAno(""); setCor(""); setPhoto(null); setErr(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
          <img src={tintaImg} alt="Tinta Pesada" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">Tinta Pesada na Hora</p>
          <p className="text-[11px] text-muted-foreground">Preço <span className="font-bold text-primary">sob consulta</span> — fórmula e pesagem de laboratório.</p>
        </div>
      </div>

      <FieldGroup label="Sistema de Pesagem">
        <div className="grid grid-cols-2 gap-1.5">
          {PESADAS_MARCAS.map((m) => (<Pill key={m} active={marca === m} onClick={() => { setMarca(m); setMaisBarata(false); }}>{m}</Pill>))}
        </div>
      </FieldGroup>

      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-[12px]">
        <input type="checkbox" checked={maisBarata} onChange={(e) => { setMaisBarata(e.target.checked); if (e.target.checked) setMarca(""); }} className="h-4 w-4 accent-primary" />
        <span>Quero a mais barata <span className="text-muted-foreground">(comparativo entre sistemas)</span></span>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <FieldInput label="Marca" value={veicMarca} onChange={setVeicMarca} placeholder="Ex: VW" />
        <FieldInput label="Modelo" value={modelo} onChange={setModelo} placeholder="Ex: Polo" />
        <FieldInput label="Ano" value={ano} onChange={setAno} placeholder="Ex: 2023" />
        <FieldInput label="Nome / Código Cor" value={cor} onChange={setCor} placeholder="Ex: LB7W" />
      </div>

      <button onClick={onOpenHelp} className="flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-left text-[11px] font-semibold text-primary hover:bg-primary/10">
        <HelpCircle className="h-4 w-4 shrink-0" />
        🔍 Não sabe o código da cor do seu carro?
      </button>

      <PhotoField photo={photo} onChange={setPhoto} />

      <FieldGroup label="Quantidade (mín. 225ml)">
        <div className="grid grid-cols-3 gap-1.5">
          {FRACTIONS.map((f, i) => (
            <Pill key={f.label} active={fracIdx === i} onClick={() => setFracIdx(i)}>
              <span className="block text-[10px] leading-tight">{f.label}</span>
              <span className="block text-[9px] opacity-70">{f.ml.toLocaleString("pt-BR")}ml</span>
            </Pill>
          ))}
        </div>
      </FieldGroup>

      {err && <p className="text-[11px] text-destructive">Escolha o sistema (ou marque comparativo) e preencha marca, modelo, ano e cor.</p>}
      <button onClick={submit} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]">
        <Plus className="h-4 w-4" strokeWidth={3} /> Adicionar — Sob consulta
      </button>
    </div>
  );
}

/* ================= Lixa (lista rápida) ================= */
function LixaPanel({ search, onAdd }: { search: string; onAdd: (item: Omit<CartItem, "uid">) => void }) {
  const [local, setLocal] = useState("");
  const q = (search || local).trim();
  const filtered = q ? LIXA_NUMERATIONS.filter((n) => String(n).includes(q)) : LIXA_NUMERATIONS;
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">Lixa d'água — lista rápida</p>
        <p className="text-[11px] text-muted-foreground">Preço <span className="font-bold text-primary">sob consulta</span>. Toque em + para adicionar a numeração.</p>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value.replace(/\D/g, ""))}
          placeholder="Buscar numeração (ex: 400)"
          className="w-full rounded-lg border border-border bg-background/40 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {filtered.map((n) => (
          <li key={n} className="flex items-center justify-between px-3 py-2">
            <div>
              <p className="text-sm font-bold">Lixa d'água nº {n}</p>
              <p className="text-[10px] text-muted-foreground">Sob consulta</p>
            </div>
            <button
              onClick={() => onAdd({ name: `Lixa d'água nº ${n}`, variant: "unidade", price: 0, sobConsulta: true, meta: [{ label: "Numeração", value: String(n) }] })}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95"
              aria-label={`Adicionar Lixa ${n}`}
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="px-3 py-4 text-center text-xs text-muted-foreground">Nenhuma numeração encontrada.</li>}
      </ul>
    </div>
  );
}

/* ================= Helpers ================= */
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">{label}</p>
      {children}
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value.slice(0, 60))} placeholder={placeholder} className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/40 text-muted-foreground hover:border-primary/50"}`}>
      {children}
    </button>
  );
}

function PhotoField({ photo, onChange }: { photo: { name: string; dataUrl: string } | null; onChange: (p: { name: string; dataUrl: string } | null) => void }) {
  const id = useMemo(() => `photo-${Math.random().toString(36).slice(2, 9)}`, []);
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground">
        <Upload className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate">{photo ? photo.name : "📸 Anexar foto da etiqueta de cor (Opcional)"}</span>
      </label>
      <input id={id} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onChange({ name: file.name, dataUrl: String(reader.result) });
        reader.readAsDataURL(file);
      }} />
      {photo && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background/40 p-2">
          <img src={photo.dataUrl} alt="Etiqueta" className="h-12 w-12 rounded object-cover ring-1 ring-border" />
          <span className="flex-1 truncate text-xs text-muted-foreground">{photo.name}</span>
          <button onClick={() => onChange(null)} className="rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Remover foto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
