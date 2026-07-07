import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  ShoppingCart,
  Plus,
  Award,
  Trophy,
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
} from "lucide-react";

import canetaImg from "@/assets/caneta-retoque.jpg";
import personalizadaImg from "@/assets/tinta-personalizada.jpg";
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
          "Catálogo de tintas e produtos de estética automotiva. Concorra ao Kit Vonixx no sorteio mensal e acumule selos no Cartão Fidelidade.",
      },
      { property: "og:title", content: "DNS TINTAS — Catálogo Inteligente" },
      {
        property: "og:description",
        content:
          "Faça pedidos pelo catálogo, concorra ao Kit Vonixx e ganhe brindes premium com o Cartão Fidelidade.",
      },
    ],
  }),
  component: Index,
});

type Category = "estetica" | "tintas" | "complementos";
type PaintSub = "tira-riscos" | "prontas" | "pesadas";

type Variant = { label: string; price: number; image?: string };
type Product = {
  id: string;
  name: string;
  subname?: string;
  description: string;
  images: string[];
  variants: Variant[];
};

const ph = (t: string) =>
  `https://via.placeholder.com/400x400/1e3a5f/ffffff?text=${encodeURIComponent(t)}`;

const ESTETICA_PRODUCTS: Product[] = [
  {
    id: "blend-paste",
    name: "BLEND PASTE WAX — VONIXX",
    subname: "Cera em pasta com SiO2 & Carnaúba",
    description: "Brilho e hidrorrepelência. Rende até 25 aplicações. Até 7 meses de proteção.",
    images: [
      "https://i.imgur.com/PDgVqh7.jpeg",
      ph("BLEND+1"),
      ph("BLEND+2"),
    ],
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
  { id: "polimento-corte", name: "Polidor de Corte Médio", description: "Remove riscos profundos e oxidação. Ideal para restauração.", images: [ph("Polidor+Corte")], variants: [{ label: "500ml", price: 45.9 }, { label: "1L", price: 79.9 }] },
  { id: "polimento-fino", name: "Polidor de Acabamento", description: "Brilho final, remove marcas de polimento e swirls.", images: [ph("Polidor+Fino")], variants: [{ label: "500ml", price: 39.9 }, { label: "1L", price: 69.9 }] },
  { id: "vitrificador", name: "Vitrificador Nano", description: "Proteção cerâmica de alta durabilidade (até 3 anos).", images: [ph("Vitrificador")], variants: [{ label: "30ml", price: 129.9 }, { label: "50ml", price: 189.9 }] },
  { id: "primer", name: "Primer Spray", description: "Prepara a superfície para pintura, plástico e metal.", images: [ph("Primer")], variants: [{ label: "400ml", price: 34.9 }] },
  { id: "desengraxante", name: "Desengraxante Multiuso", description: "Remove gordura, óleo e silicone antes da pintura.", images: [ph("Desengraxante")], variants: [{ label: "500ml", price: 19.9 }, { label: "1L", price: 32.9 }] },
  { id: "limpa-pneus", name: "Limpa Pneus e Borrachas", description: "Revitaliza pneus e plásticos externos.", images: [ph("Limpa+Pneus")], variants: [{ label: "500ml", price: 24.9 }, { label: "1L", price: 39.9 }] },
];

const COMPLEMENTOS_PRODUCTS: Product[] = [
  { id: "microfibra", name: "Kit Microfibra Premium (2un)", description: "Pano dupla face, alta absorção.", images: [ph("Microfibra")], variants: [{ label: "1 Kit", price: 19.9 }, { label: "3 Kits", price: 49.9 }] },
  { id: "esponja", name: "Esponja Aplicadora Profissional", description: "Ideal para ceras, polidores e selantes.", images: [ph("Esponja")], variants: [{ label: "1 un", price: 8.9 }, { label: "5 un", price: 35.0 }] },
  { id: "fita-crepe", name: "Fita Crepe Automotiva (50m)", description: "Alta aderência, resistente a solventes.", images: [ph("Fita+Crepe")], variants: [{ label: "1 rolo", price: 12.5 }, { label: "3 rolos", price: 32.0 }] },
  { id: "lixa-agua", name: "Kit Lixa d'água (600/1200/2000)", description: "Acabamento perfeito para retoques.", images: [ph("Lixa")], variants: [{ label: "6 folhas", price: 18.9 }, { label: "12 folhas", price: 32.9 }] },
  { id: "polidor-comp", name: "Polidor de Corte Médio (500ml)", description: "Remove riscos leves e manchas.", images: [ph("Polidor")], variants: [{ label: "500ml", price: 34.9 }, { label: "1L", price: 59.9 }] },
];

// Subcategoria: Tira-Riscos / Pequenos Retoques
const KIT_TIRA_RISCOS_PRICE = 49.9;

// Subcategoria: Tintas Prontas de Fábrica
type ProntaTipo = "Poliéster" | "PU" | "Sintético" | "Duco/LACA";
const PRONTAS_TIPOS: { tipo: ProntaTipo; tamanho: string; ml: number; price: number }[] = [
  { tipo: "Poliéster", tamanho: "1/4 (900ml)", ml: 900, price: 89.9 },
  { tipo: "PU", tamanho: "1/4 (675ml)", ml: 675, price: 149.9 },
  { tipo: "Sintético", tamanho: "1/4 (900ml)", ml: 900, price: 69.9 },
  { tipo: "Duco/LACA", tamanho: "1/4 (900ml)", ml: 900, price: 79.9 },
];
const ENDURECEDOR_PRICE = 39.9;
const PRONTAS_MARCAS = ["Brazilian", "Lazzuril"] as const;

const PESADAS_MARCAS = ["Brazilian", "Wanda"] as const;
const FRACTIONS: { label: string; ml: number }[] = [
  { label: "1/8", ml: 112.5 },
  { label: "1/6", ml: 150 },
  { label: "1/5", ml: 180 },
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
const PESADAS_PRICE_PER_ML = 0.22;

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

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const calcParcelas = (valor: number) => {
  const max = 12;
  const parcelas = valor >= 100 ? max : Math.max(1, Math.min(max, Math.floor(valor / 20)));
  const p = Math.max(1, parcelas);
  return { parcelas: p, valorParcela: valor / p };
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
  meta?: { label: string; value: string }[];
  photo?: { name: string; dataUrl: string } | null;
};

let __uid = 0;
const nextUid = () => ++__uid;

type Lightbox = { images: string[]; index: number } | null;

function Index() {
  const [category, setCategory] = useState<Category>("estetica");
  const [paintSub, setPaintSub] = useState<PaintSub>("tira-riscos");
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

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((s, it) => s + it.price, 0);
  const stamps = Math.min(10, Math.floor((accumulated + cartTotal) / 100));

  // Restaurar cliente salvo
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

  // Back-to-top scroll
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lightbox keyboard nav
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
    lines.push(
      `🚚 *Entrega:* ${delivery === "retirar" ? "Retirar na loja" : "Motoboy"}`,
    );
    if (delivery === "motoboy" && motoboyAddress.trim())
      lines.push(`📍 *Endereço:* ${motoboyAddress.trim()}`);
    lines.push("");
    lines.push("📦 *Itens do pedido:*");
    cartItems.forEach((it, i) => {
      const variant = it.variant ? ` — ${it.variant}` : "";
      lines.push(`${i + 1}. ${it.name}${variant} — ${BRL(it.price)}`);
      if (it.meta) it.meta.forEach((m) => lines.push(`   • ${m.label}: ${m.value}`));
      if (it.photo)
        lines.push(`   📎 Foto anexada: ${it.photo.name} (enviarei em seguida)`);
    });
    lines.push("");
    lines.push(`💰 *Subtotal:* ${BRL(cartTotal)}`);
    lines.push(`💠 *PIX (-3%):* ${BRL(pix)}`);
    lines.push(`💳 *Ou até ${parc.parcelas}x de ${BRL(parc.valorParcela)} sem juros*`);
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

    // Persist client + accumulated total (fidelidade)
    try {
      const key = `dns_cliente_${phoneDigits}`;
      const raw = localStorage.getItem(key);
      const prev = raw ? (JSON.parse(raw) as { total?: number }) : {};
      const newTotal = (prev.total || 0) + cartTotal;
      localStorage.setItem(
        key,
        JSON.stringify({ nome: name, telefone: phoneDigits, total: newTotal, updated: Date.now() }),
      );
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
        {/* Promo banner — PRESERVADO */}
        <section
          className="relative overflow-hidden rounded-3xl p-5 shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-promo)" }}
        >
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
              <Trophy className="h-3 w-3" /> Sorteio Mensal
            </div>
            <h1 className="mt-3 font-display text-xl font-bold leading-tight text-white sm:text-2xl">
              Pedidos pelo catálogo concorrem a 1 Kit de Estética{" "}
              <span className="text-cyan-200">Vonixx</span>!
            </h1>
            <p className="mt-1.5 text-sm text-white/85">
              A cada compra, um cupom automático para o sorteio do mês.
            </p>
          </div>
        </section>

        {/* Loyalty card — PRESERVADO */}
        <section className="mt-4 rounded-3xl border border-border bg-[image:var(--gradient-card)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold">Cartão Fidelidade</p>
                <p className="text-xs text-muted-foreground">
                  R$ 100 = 1 selo · 10 selos = brinde premium
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
              {stamps}/10
            </span>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => {
              const active = i < stamps;
              const isGift = i === 9;
              const activeColor = isGift ? "var(--success)" : "var(--paint-filled)";
              const bg = active
                ? isGift
                  ? "#f0fdf4"
                  : "#fff5f5"
                : "var(--muted)";
              const borderColor = active ? activeColor : "var(--border)";
              const shadow = active
                ? isGift
                  ? "0 4px 12px rgba(34, 197, 94, 0.15)"
                  : "0 4px 12px rgba(239, 68, 68, 0.15)"
                : "none";
              const canPath =
                "M19,20H5V8H19M19,3H14V5H10V3H5A2,2 0 0,0 3,5V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V5A2,2 0 0,0 19,3Z";
              return (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-xl transition-all duration-300"
                  style={{ background: bg, border: `2px ${active ? "solid" : "dashed"} ${borderColor}`, boxShadow: shadow }}
                >
                  <div
                    className="relative h-8 w-8"
                    style={{ animation: active ? "can-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1) both" : undefined }}
                  >
                    <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" style={{ fill: "var(--can-empty)" }}>
                      <path d={canPath} />
                    </svg>
                    {active && (
                      <svg
                        viewBox="0 0 24 24"
                        className="absolute inset-0 h-full w-full"
                        style={{ fill: activeColor, animation: "can-fill-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
                      >
                        <path d={canPath} />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Category tabs */}
        <section className="mt-5">
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border bg-card p-1.5">
            {[
              { id: "estetica" as const, label: "✨ Estética" },
              { id: "tintas" as const, label: "🎨 Tintas" },
              { id: "complementos" as const, label: "🧰 Complementos" },
            ].map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategory(tab.id)}
                  className={`rounded-xl px-2 py-2.5 text-[12px] font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Estética */}
        {category === "estetica" && (
          <section className="mt-4 grid grid-cols-2 gap-3">
            {ESTETICA_PRODUCTS.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                idx={selectedVariant[p.id] ?? 0}
                onVariant={(i) => setSelectedVariant((s) => ({ ...s, [p.id]: i }))}
                onAdd={() => addProductToCart(p)}
                onOpenLightbox={(i) => setLightbox({ images: p.images, index: i })}
              />
            ))}
          </section>
        )}

        {/* Complementos */}
        {category === "complementos" && (
          <section className="mt-4 grid grid-cols-2 gap-3">
            {COMPLEMENTOS_PRODUCTS.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                idx={selectedVariant[p.id] ?? 0}
                onVariant={(i) => setSelectedVariant((s) => ({ ...s, [p.id]: i }))}
                onAdd={() => addProductToCart(p)}
                onOpenLightbox={(i) => setLightbox({ images: p.images, index: i })}
              />
            ))}
          </section>
        )}

        {/* Tintas section */}
        {category === "tintas" && (
          <section className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border bg-card p-1.5">
              {[
                { id: "tira-riscos" as const, label: "🚗 Retoques" },
                { id: "prontas" as const, label: "🧑‍🎨 Prontas" },
                { id: "pesadas" as const, label: "⚖️ Pesadas" },
              ].map((tab) => {
                const active = paintSub === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPaintSub(tab.id)}
                    className={`rounded-xl px-2 py-2 text-[11px] font-bold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {paintSub === "tira-riscos" && (
              <TiraRiscosPanel onAdd={pushCart} onOpenHelp={() => setShowColorHelp(true)} />
            )}
            {paintSub === "prontas" && <ProntasPanel onAdd={pushCart} />}
            {paintSub === "pesadas" && (
              <PesadasPanel onAdd={pushCart} onOpenHelp={() => setShowColorHelp(true)} />
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
                  {cartCount} {cartCount === 1 ? "item" : "itens"} · total
                </p>
                <p className="font-display text-lg font-bold text-primary">{BRL(cartTotal)}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
                <ShoppingCart className="h-4 w-4" /> Finalizar
              </span>
            </button>
          </div>
        )}

        {/* Toast */}
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
            <a
              href="https://wa.me/5511947256647"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary"
            >
              <MessageCircle className="h-3.5 w-3.5" /> (11) 94725-6647
            </a>
            <p>🕒 Seg–Sex 08:30–18:00 · Sáb 08:30–14:00</p>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs">
            <a
              href="https://instagram.com/dnstintas"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:opacity-80"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a
              href="https://wa.me/5511947256647"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:opacity-80"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground/70">
            © 2025 DNS Tintas · Catálogo Inteligente
          </p>
        </div>
      </footer>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) =>
                lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb,
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={lightbox.images[lightbox.index]}
            alt="Produto"
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Próximo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            {lightbox.index + 1} / {lightbox.images.length}
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowCart(false)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-primary/40 bg-card shadow-[var(--shadow-glow)] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--gradient-promo)" }}>
              <div className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                <p className="font-display text-base font-bold">Seu Pedido</p>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="rounded-full p-1 text-white/90 hover:bg-white/15"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="space-y-2">
                {cartItems.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">Carrinho vazio.</p>
                )}
                {cartItems.map((it, i) => (
                  <div key={it.uid} className="rounded-xl border border-border bg-background/60 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{it.name}</p>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{it.variant}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <p className="font-display text-sm font-bold text-primary">{BRL(it.price)}</p>
                        <button
                          onClick={() => removeCartItem(i)}
                          className="rounded p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Remover"
                        >
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
                            <img
                              src={it.photo.dataUrl}
                              alt="Etiqueta"
                              className="h-10 w-10 rounded object-cover ring-1 ring-border"
                            />
                            <span className="flex-1 truncate text-muted-foreground">{it.photo.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Loja para retirada */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Loja para retirada / atendimento
                </p>
                <div className="grid gap-2">
                  {LOJAS.map((l) => {
                    const active = storeId === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => setStoreId(l.id)}
                        className={`rounded-lg border p-3 text-left text-xs transition-all ${
                          active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <p className="font-bold text-primary">{l.nome}</p>
                        <p className="text-muted-foreground">{l.endereco}</p>
                        <p className="text-[10px] text-muted-foreground">{l.horario}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Entrega */}
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
                        onClick={() => {
                          setDelivery(id);
                          setDeliveryError(false);
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
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
                  <p className="mt-1 text-[11px] text-destructive">
                    Selecione a entrega{delivery === "motoboy" ? " e informe o endereço" : ""}.
                  </p>
                )}
              </div>

              {cartItems.some((it) => it.photo) && (
                <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-[11px] text-foreground">
                  <Download className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>
                    A foto da etiqueta será baixada automaticamente — basta anexá-la na conversa do WhatsApp após enviar.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{BRL(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">PIX (-3%)</span>
                <span className="font-semibold text-[color:var(--success)]">{BRL(calcPix(cartTotal))}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ou parcelado</span>
                <span className="font-semibold">
                  {calcParcelas(cartTotal).parcelas}x de {BRL(calcParcelas(cartTotal).valorParcela)}
                </span>
              </div>
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

      {/* Identity modal */}
      {showIdentity && (
        <div
          className="fixed inset-0 z-[55] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowIdentity(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-[var(--shadow-glow)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--gradient-promo)" }}>
              <div className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                <p className="font-display text-base font-bold">Identificação</p>
              </div>
              <button
                onClick={() => setShowIdentity(false)}
                className="rounded-full p-1 text-white/90 hover:bg-white/15"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-xs text-muted-foreground">
                Precisamos do seu nome e WhatsApp para enviar o pedido e acumular seus selos do Cartão Fidelidade.
              </p>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">Nome</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value.slice(0, 80))}
                  placeholder="Nome completo"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">WhatsApp</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              {identityErr && <p className="text-[11px] text-destructive">{identityErr}</p>}
              <button
                onClick={confirmIdentityAndSend}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] active:scale-[0.98]"
              >
                <Send className="h-4 w-4" /> Enviar pedido por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color help modal */}
      {showColorHelp && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowColorHelp(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-[var(--shadow-glow)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--gradient-promo)" }}>
              <div className="flex items-center gap-2 text-white">
                <Palette className="h-5 w-5" />
                <p className="font-display text-base font-bold">Onde achar o código da cor</p>
              </div>
              <button
                onClick={() => setShowColorHelp(false)}
                className="rounded-full p-1 text-white/90 hover:bg-white/15"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <p className="text-muted-foreground">
                Toda montadora coloca uma etiqueta com o código da tinta original em pontos específicos do veículo.
              </p>
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

/* =========================================================
   Product card (Estética & Complementos)
========================================================= */
function ProductCard({
  p,
  idx,
  onVariant,
  onAdd,
  onOpenLightbox,
}: {
  p: Product;
  idx: number;
  onVariant: (i: number) => void;
  onAdd: () => void;
  onOpenLightbox: (i: number) => void;
}) {
  const variant = p.variants[idx];
  const parc = calcParcelas(variant.price);
  const pix = calcPix(variant.price);
  const [imgIdx, setImgIdx] = useState(0);
  const carouselRef = useRef<number | null>(null);
  useEffect(() => {
    if (p.images.length <= 1) return;
    carouselRef.current = window.setInterval(
      () => setImgIdx((i) => (i + 1) % p.images.length),
      3500,
    );
    return () => {
      if (carouselRef.current) window.clearInterval(carouselRef.current);
    };
  }, [p.images.length]);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <button
        onClick={() => onOpenLightbox(imgIdx)}
        className="relative block aspect-square overflow-hidden bg-background"
      >
        <img
          src={p.images[imgIdx]}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity"
        />
        {p.images.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {imgIdx + 1}/{p.images.length}
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <p className="text-[12px] font-bold leading-tight line-clamp-2">{p.name}</p>
        {p.subname && <p className="text-[10px] text-muted-foreground line-clamp-1">{p.subname}</p>}
        <p className="font-display text-base font-bold text-primary">{BRL(variant.price)}</p>
        <p className="text-[10px] text-muted-foreground">
          {parc.parcelas}x de {BRL(parc.valorParcela)} sem juros
        </p>
        <p className="text-[10px] font-semibold text-[color:var(--success)]">
          PIX: {BRL(pix)} <span className="opacity-70">(-3%)</span>
        </p>
        {p.variants.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {p.variants.map((v, i) => {
              const active = i === idx;
              return (
                <button
                  key={v.label}
                  onClick={() => onVariant(i)}
                  className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background/40 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={onAdd}
          className="mt-auto inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={3} /> Adicionar
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   Panel: Tira-Riscos / Pequenos Retoques
========================================================= */
function TiraRiscosPanel({
  onAdd,
  onOpenHelp,
}: {
  onAdd: (item: Omit<CartItem, "uid">) => void;
  onOpenHelp: () => void;
}) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(null);
  const [err, setErr] = useState(false);

  const submit = () => {
    if (!marca.trim() || !modelo.trim() || !ano.trim() || !cor.trim()) {
      setErr(true);
      return;
    }
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
      <button
        onClick={onOpenHelp}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-left text-[11px] font-semibold text-primary hover:bg-primary/10"
      >
        <HelpCircle className="h-4 w-4 shrink-0" />
        🔍 Não sabe o código da cor do seu carro?
      </button>
      <PhotoField photo={photo} onChange={setPhoto} />
      {err && <p className="text-[11px] text-destructive">Preencha marca, modelo, ano e cor.</p>}
      <button
        onClick={submit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" strokeWidth={3} /> Adicionar ao Carrinho
      </button>
    </div>
  );
}

/* =========================================================
   Panel: Tintas Prontas de Fábrica
========================================================= */
function ProntasPanel({ onAdd }: { onAdd: (item: Omit<CartItem, "uid">) => void }) {
  const [marca, setMarca] = useState<(typeof PRONTAS_MARCAS)[number]>("Brazilian");
  const [tipoIdx, setTipoIdx] = useState(0);
  const [endurecedor, setEndurecedor] = useState(false);
  const [err, setErr] = useState(false);
  const tipo = PRONTAS_TIPOS[tipoIdx];

  const [montadora, setMontadora] = useState<string>("");
  const [corQuery, setCorQuery] = useState("");
  const [selectedCor, setSelectedCor] = useState<ProntaCor | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableColors: ProntaCor[] = montadora
    ? PRONTAS_COLORS[marca]?.[montadora] ?? []
    : [];
  const filteredColors = corQuery.trim()
    ? availableColors.filter((c) => c.nome.toLowerCase().includes(corQuery.trim().toLowerCase()))
    : availableColors;

  const basePrice = selectedCor ? selectedCor.preco : tipo.price;
  const finalPrice = basePrice + (tipo.tipo === "PU" && endurecedor ? ENDURECEDOR_PRICE : 0);

  const resetCor = () => { setSelectedCor(null); setCorQuery(""); };

  const submit = () => {
    if (!montadora || !selectedCor) { setErr(true); return; }
    const meta = [
      { label: "Marca", value: marca },
      { label: "Montadora", value: montadora },
      { label: "Cor (Pronta de Fábrica)", value: selectedCor.nome },
      { label: "Tipo", value: tipo.tipo },
      { label: "Tamanho", value: tipo.tamanho },
    ];
    if (tipo.tipo === "PU" && endurecedor) {
      meta.push({ label: "Endurecedor (225ml)", value: `Incluso (+${BRL(ENDURECEDOR_PRICE)})` });
    }
    onAdd({
      name: `Tinta Pronta ${marca} — ${tipo.tipo} (${montadora})`,
      variant: tipo.tamanho,
      price: finalPrice,
      meta,
    });
    setSelectedCor(null); setCorQuery(""); setEndurecedor(false); setErr(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
          <img src={personalizadaImg} alt="Tinta Pronta" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">Tintas Prontas de Fábrica</p>
          <p className="text-[11px] text-muted-foreground">Embalagens fechadas, cores de catálogo.</p>
        </div>
      </div>

      <FieldGroup label="Marca">
        <div className="grid grid-cols-2 gap-1.5">
          {PRONTAS_MARCAS.map((m) => (
            <Pill key={m} active={marca === m} onClick={() => { setMarca(m); resetCor(); }}>{m}</Pill>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Selecione a Montadora">
        <select
          value={montadora}
          onChange={(e) => { setMontadora(e.target.value); resetCor(); }}
          className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">— Escolha a montadora —</option>
          {MONTADORAS.map((m) => (<option key={m} value={m}>{m}</option>))}
        </select>
      </FieldGroup>

      <FieldGroup label="Cor (busca preditiva)">
        <div className="relative">
          <input
            type="text"
            value={corQuery}
            disabled={!montadora}
            onChange={(e) => { setCorQuery(e.target.value); setSelectedCor(null); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={montadora ? `Digite para buscar — ${availableColors.length} cores` : "Escolha a montadora primeiro"}
            className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-60"
          />
          {showSuggestions && montadora && filteredColors.length > 0 && !selectedCor && (
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
                    <span className="shrink-0 font-display text-[11px] font-bold text-primary">{BRL(c.preco)}</span>
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
            <span className="font-display font-bold text-primary">{BRL(selectedCor.preco)}</span>
            <button type="button" onClick={resetCor} className="rounded p-0.5 text-muted-foreground hover:text-foreground" aria-label="Limpar cor">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </FieldGroup>

      <FieldGroup label="Tipo de Tinta">
        <div className="grid grid-cols-2 gap-1.5">
          {PRONTAS_TIPOS.map((t, i) => (
            <Pill key={t.tipo} active={tipoIdx === i} onClick={() => { setTipoIdx(i); setEndurecedor(false); }}>{t.tipo}</Pill>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Tamanho: <span className="font-semibold text-foreground">{tipo.tamanho}</span>
        </p>
      </FieldGroup>

      {tipo.tipo === "PU" && (
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-[12px]">
          <input type="checkbox" checked={endurecedor} onChange={(e) => setEndurecedor(e.target.checked)} className="h-4 w-4 accent-primary" />
          <span>Acompanhar Endurecedor (225ml) <span className="text-muted-foreground">+ {BRL(ENDURECEDOR_PRICE)}</span></span>
        </label>
      )}

      {err && <p className="text-[11px] text-destructive">Selecione a montadora e escolha uma cor.</p>}
      <button
        onClick={submit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" strokeWidth={3} /> Adicionar — {BRL(finalPrice)}
      </button>
    </div>
  );
}

/* =========================================================
   Panel: Tintas Pesadas na Hora (Laboratório)
========================================================= */
function PesadasPanel({
  onAdd,
  onOpenHelp,
}: {
  onAdd: (item: Omit<CartItem, "uid">) => void;
  onOpenHelp: () => void;
}) {
  const [marca, setMarca] = useState<(typeof PESADAS_MARCAS)[number]>("Brazilian");
  const [veicMarca, setVeicMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [fracIdx, setFracIdx] = useState(6);
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(null);
  const [err, setErr] = useState(false);
  const frac = FRACTIONS[fracIdx];
  const price = Math.round(frac.ml * PESADAS_PRICE_PER_ML * 10) / 10;

  const submit = () => {
    if (!veicMarca.trim() || !modelo.trim() || !ano.trim() || !cor.trim()) { setErr(true); return; }
    onAdd({
      name: `Tinta Pesada na Hora — ${marca}`,
      variant: `${frac.label} (${frac.ml.toLocaleString("pt-BR")}ml)`,
      price,
      meta: [
        { label: "Sistema de Pesagem", value: marca },
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
          <p className="text-[11px] text-muted-foreground">Fórmula e pesagem por laboratório.</p>
        </div>
      </div>

      <FieldGroup label="Sistema de Pesagem">
        <div className="grid grid-cols-2 gap-1.5">
          {PESADAS_MARCAS.map((m) => (<Pill key={m} active={marca === m} onClick={() => setMarca(m)}>{m}</Pill>))}
        </div>
      </FieldGroup>

      <div className="grid grid-cols-2 gap-2">
        <FieldInput label="Marca" value={veicMarca} onChange={setVeicMarca} placeholder="Ex: VW" />
        <FieldInput label="Modelo" value={modelo} onChange={setModelo} placeholder="Ex: Polo" />
        <FieldInput label="Ano" value={ano} onChange={setAno} placeholder="Ex: 2023" />
        <FieldInput label="Nome / Código Cor" value={cor} onChange={setCor} placeholder="Ex: LB7W" />
      </div>

      <button
        onClick={onOpenHelp}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-left text-[11px] font-semibold text-primary hover:bg-primary/10"
      >
        <HelpCircle className="h-4 w-4 shrink-0" />
        🔍 Não sabe o código da cor do seu carro?
      </button>

      <PhotoField photo={photo} onChange={setPhoto} />

      <FieldGroup label="Quantidade (Frações de Lata 900ml)">
        <div className="grid grid-cols-3 gap-1.5">
          {FRACTIONS.map((f, i) => (
            <Pill key={f.label} active={fracIdx === i} onClick={() => setFracIdx(i)}>
              <span className="block text-[10px] leading-tight">{f.label}</span>
              <span className="block text-[9px] opacity-70">{f.ml.toLocaleString("pt-BR")}ml</span>
            </Pill>
          ))}
        </div>
      </FieldGroup>

      {err && <p className="text-[11px] text-destructive">Preencha marca, modelo, ano e cor.</p>}
      <button
        onClick={submit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" strokeWidth={3} /> Adicionar — {BRL(price)}
      </button>
    </div>
  );
}

/* =========================================================
   Helpers / micro-components
========================================================= */
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">{label}</p>
      {children}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 60))}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background/40 text-muted-foreground hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

function PhotoField({
  photo,
  onChange,
}: {
  photo: { name: string; dataUrl: string } | null;
  onChange: (p: { name: string; dataUrl: string } | null) => void;
}) {
  const id = useMemo(() => `photo-${Math.random().toString(36).slice(2, 9)}`, []);
  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground"
      >
        <Upload className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate">
          {photo ? photo.name : "📸 Anexar foto da etiqueta de cor (Opcional)"}
        </span>
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onChange({ name: file.name, dataUrl: String(reader.result) });
          reader.readAsDataURL(file);
        }}
      />
      {photo && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background/40 p-2">
          <img src={photo.dataUrl} alt="Etiqueta" className="h-12 w-12 rounded object-cover ring-1 ring-border" />
          <span className="flex-1 truncate text-xs text-muted-foreground">{photo.name}</span>
          <button
            onClick={() => onChange(null)}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
            aria-label="Remover foto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
