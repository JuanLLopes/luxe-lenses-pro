import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Gift,
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
} from "lucide-react";
import shampooImg from "@/assets/shampoo-citrus.jpg";
import ceraImg from "@/assets/cera-carnauba.jpg";
import pretinhoImg from "@/assets/pretinho.jpg";
import canetaImg from "@/assets/caneta-retoque.jpg";
import personalizadaImg from "@/assets/tinta-personalizada.jpg";
import tintaImg from "@/assets/tinta-spray.jpg";
import { PRONTAS_COLORS, MONTADORAS, type ProntaCor } from "@/data/prontas-colors";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo Inteligente | Tintas & Estética Automotiva" },
      {
        name: "description",
        content:
          "Catálogo de tintas e produtos de estética automotiva. Concorra ao Kit Vonixx no sorteio mensal e acumule selos no Cartão Fidelidade.",
      },
      { property: "og:title", content: "Catálogo Inteligente | Tintas & Estética Automotiva" },
      {
        property: "og:description",
        content:
          "Faça pedidos pelo catálogo, concorra ao Kit Vonixx e ganhe brindes premium com o Cartão Fidelidade.",
      },
    ],
  }),
  component: Index,
});

type Category = "estetica" | "tintas";
type PaintSub = "tira-riscos" | "prontas" | "pesadas";

type Variant = { label: string; price: number; image?: string };
type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  variants: Variant[];
};

const ESTETICA_PRODUCTS: Product[] = [
  {
    id: "v-mol",
    name: "Lava Auto Desincrustante V-Mol - VONIXX",
    description: "Lava-autos desincrustante com fragrância cereja intensa. Alto poder de limpeza.",
    image: "https://www.vonixx.com.br/wp-content/uploads/2023/07/v-mol-500ml-1.png",
    variants: [
      { label: "500ml", price: 25.0, image: "https://www.vonixx.com.br/wp-content/uploads/2023/07/v-mol-500ml-1.png" },
      { label: "1,5L", price: 39.0, image: "https://images.tcdn.com.br/img/img_prod/1060217/v_mol_cereja_intenso_899_variacao_905_1_4cdb026dfd442115a5dfe5a814c3a4b0.png" },
      { label: "5L", price: 96.0, image: "https://stgecomm.blob.core.windows.net/imagesprod2/0438086_v-mol-lava-auto-desincrustante-5l-vonixxvintex-2050117.jpeg" },
    ],
  },
  {
    id: "cera-carnauba",
    name: "Cera de Carnaúba Vonixx",
    description: "Proteção e brilho intenso para pinturas escuras e claras.",
    image: ceraImg,
    variants: [
      { label: "300g", price: 59.9 },
      { label: "500g", price: 89.9 },
    ],
  },
  {
    id: "pretinho",
    name: "Pretinho Premium para Pneus",
    description: "Renova o aspecto dos pneus com brilho duradouro e antiozônio.",
    image: pretinhoImg,
    variants: [
      { label: "500ml", price: 29.9 },
      { label: "1L", price: 49.9 },
    ],
  },
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

// Subcategoria: Tintas Pesadas
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
const PESADAS_PRICE_PER_ML = 0.22; // R$/ml — laboratório

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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

function Index() {
  const [category, setCategory] = useState<Category>("estetica");
  const [paintSub, setPaintSub] = useState<PaintSub>("tira-riscos");
  const [selectedVariant, setSelectedVariant] = useState<Record<string, number>>({});
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [showColorHelp, setShowColorHelp] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [delivery, setDelivery] = useState<"retirar" | "estafeta" | "">("");
  const [nameError, setNameError] = useState(false);
  const [deliveryError, setDeliveryError] = useState(false);
  const WHATSAPP_NUMBER = "5511999999999"; // número da loja (formato internacional, só dígitos)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const stamps = Math.min(10, Math.floor(cartTotal / 50));

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2200);
  };

  const pushCart = (item: Omit<CartItem, "uid">) => {
    const ci: CartItem = { ...item, uid: nextUid() };
    setCartItems((items) => [...items, ci]);
    setCartTotal((t) => t + ci.price);
    setCartCount((c) => c + 1);
    showToast(`${ci.name} adicionado!`);
  };

  const addEsteticaToCart = (p: Product) => {
    const idx = selectedVariant[p.id] ?? 0;
    const v = p.variants[idx];
    pushCart({ name: p.name, variant: v.label, price: v.price });
  };

  const removeCartItem = (index: number) => {
    setCartItems((items) => {
      const removed = items[index];
      if (removed) {
        setCartTotal((t) => Math.max(0, t - removed.price));
        setCartCount((c) => Math.max(0, c - 1));
      }
      return items.filter((_, i) => i !== index);
    });
  };

  const downloadPhoto = (dataUrl: string, name: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = name || "etiqueta-cor.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push("🛒 *NOVO PEDIDO — Catálogo Inteligente*");
    lines.push("");
    lines.push(`👤 *Cliente:* ${customerName.trim()}`);
    lines.push(
      `🚚 *Entrega:* ${delivery === "retirar" ? "Retirar na Loja" : "Entrega via Estafeta/Motoboy"}`,
    );
    lines.push("");
    lines.push("📦 *Itens do pedido:*");
    cartItems.forEach((it, i) => {
      const variant = it.variant ? ` — ${it.variant}` : "";
      lines.push(`${i + 1}. ${it.name}${variant} — ${BRL(it.price)}`);
      if (it.meta) {
        it.meta.forEach((m) => lines.push(`   • ${m.label}: ${m.value}`));
      }
      if (it.photo) {
        lines.push(
          `   📎 Foto da etiqueta anexada: ${it.photo.name} (enviarei a imagem em seguida nesta conversa)`,
        );
      }
    });
    lines.push("");
    lines.push(`💰 *Total: ${BRL(cartTotal)}*`);
    lines.push("");
    lines.push("✅ Pedido feito pelo catálogo — concorrendo ao sorteio mensal Vonixx!");
    return lines.join("\n");
  };

  const sendOrder = () => {
    const validName = customerName.trim().length >= 2;
    const validDelivery = delivery === "retirar" || delivery === "estafeta";
    setNameError(!validName);
    setDeliveryError(!validDelivery);
    if (!validName || !validDelivery) return;

    // Se houver fotos anexadas, dispara download para o cliente reenviar no WhatsApp
    cartItems.forEach((it) => {
      if (it.photo) downloadPhoto(it.photo.dataUrl, it.photo.name);
    });

    const text = encodeURIComponent(buildWhatsAppMessage());
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-sm font-bold tracking-tight">
                Catálogo Inteligente
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Tintas & Estética
              </p>
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

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        {/* Promo banner */}
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

        {/* Loyalty card */}
        <section className="mt-4 rounded-3xl border border-border bg-[image:var(--gradient-card)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold">Cartão Fidelidade</p>
                <p className="text-xs text-muted-foreground">
                  R$ 50 = 1 selo · 10 selos = brinde premium
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
              {stamps}/10
            </span>
          </div>
          <div className="mt-3 grid grid-cols-10 gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md border transition-colors ${
                  i < stamps
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "border-border bg-background/40"
                }`}
              >
                {i < stamps && (
                  <Gift className="m-auto mt-[3px] h-3 w-3" strokeWidth={2.5} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Category tabs */}
        <section className="mt-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
            {[
              { id: "estetica" as const, label: "✨ Estética" },
              { id: "tintas" as const, label: "🎨 Tintas" },
            ].map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategory(tab.id)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
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

        {/* Estética list */}
        {category === "estetica" && (
          <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border/70">
            {ESTETICA_PRODUCTS.map((p) => {
              const idx = selectedVariant[p.id] ?? 0;
              const variant = p.variants[idx];
              return (
                <div key={p.id} className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg bg-background/60 ring-1 ring-border">
                      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold leading-tight">{p.name}</p>
                      <p className="mt-0.5 font-display text-sm font-bold text-primary">
                        {BRL(variant.price)}
                        <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {variant.label}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => addEsteticaToCart(p)}
                      aria-label={`Adicionar ${p.name}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-90"
                    >
                      <Plus className="h-5 w-5" strokeWidth={3} />
                    </button>
                  </div>
                  {p.variants.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 pl-[68px]">
                      {p.variants.map((v, i) => {
                        const active = i === idx;
                        return (
                          <button
                            key={v.label}
                            onClick={() => setSelectedVariant((s) => ({ ...s, [p.id]: i }))}
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors ${
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
                </div>
              );
            })}
          </section>
        )}

        {/* Tintas section */}
        {category === "tintas" && (
          <section className="mt-4 space-y-3">
            {/* Subcategory tabs */}
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
              <TiraRiscosPanel
                onAdd={pushCart}
                onOpenHelp={() => setShowColorHelp(true)}
              />
            )}
            {paintSub === "prontas" && <ProntasPanel onAdd={pushCart} />}
            {paintSub === "pesadas" && (
              <PesadasPanel onAdd={pushCart} onOpenHelp={() => setShowColorHelp(true)} />
            )}
          </section>
        )}

        {/* Cart summary footer (sticky) */}
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
                <p className="font-display text-lg font-bold text-primary">
                  {BRL(cartTotal)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
                <ShoppingCart className="h-4 w-4" />
                Finalizar
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
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: "var(--gradient-promo)" }}
            >
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
              {/* Itens */}
              <div className="space-y-2">
                {cartItems.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    Carrinho vazio.
                  </p>
                )}
                {cartItems.map((it, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-background/60 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{it.name}</p>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                          {it.variant}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <p className="font-display text-sm font-bold text-primary">
                          {BRL(it.price)}
                        </p>
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
                            <span className="flex-1 truncate text-muted-foreground">
                              {it.photo.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Nome */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-primary">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value.slice(0, 80));
                    if (nameError) setNameError(false);
                  }}
                  placeholder="Nome completo"
                  className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                    nameError ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                />
                {nameError && (
                  <p className="mt-1 text-[11px] text-destructive">Informe seu nome.</p>
                )}
              </div>

              {/* Entrega */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Forma de Entrega
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "retirar" as const, label: "Retirar na Loja", icon: Store },
                    { id: "estafeta" as const, label: "Entrega via Estafeta/Motoboy", icon: Bike },
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
                {deliveryError && (
                  <p className="mt-1 text-[11px] text-destructive">
                    Selecione uma forma de entrega.
                  </p>
                )}
              </div>

              {cartItems.some((it) => it.photo) && (
                <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-[11px] text-foreground">
                  <Download className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>
                    A foto da etiqueta de cor será baixada automaticamente — basta
                    anexá-la na conversa do WhatsApp após enviar o pedido.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-background/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Total
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  {BRL(cartTotal)}
                </span>
              </div>
              <button
                onClick={sendOrder}
                disabled={cartItems.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Concluir e Enviar Pedido por WhatsApp
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
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: "var(--gradient-promo)" }}
            >
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
                Toda montadora coloca uma etiqueta com o código da tinta original em
                pontos específicos do veículo. Confira por marca:
              </p>
              <ul className="space-y-2">
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Fiat / Jeep / RAM</p>
                  <p className="text-xs text-muted-foreground">
                    Etiqueta na coluna da porta do motorista ou no interior da tampa do porta-malas.
                  </p>
                </li>
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Volkswagen</p>
                  <p className="text-xs text-muted-foreground">
                    Coluna lateral do motorista, vão do motor ou na contracapa do manual do proprietário.
                  </p>
                </li>
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Chevrolet / GM</p>
                  <p className="text-xs text-muted-foreground">
                    Coluna da porta do motorista (etiqueta "PNT/COR") ou manual do veículo.
                  </p>
                </li>
                <li className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-bold text-primary">Ford / Hyundai / Toyota</p>
                  <p className="text-xs text-muted-foreground">
                    Geralmente na coluna da porta do motorista, identificada como "Paint" ou "Color Code".
                  </p>
                </li>
              </ul>
              <p className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-foreground">
                💡 Dica: se não encontrar, tire uma foto da etiqueta e anexe no campo
                acima — nossa equipe identifica para você.
              </p>
            </div>
          </div>
        </div>
      )}
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
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
          <img src={canetaImg} alt="Kit Tira-Riscos" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">Kit Tira-Riscos (100ml)</p>
          <p className="font-display text-sm font-bold text-primary">{BRL(KIT_TIRA_RISCOS_PRICE)}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Preencha os dados do seu veículo para formularmos a cor exata.
      </p>
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
    ? availableColors.filter((c) =>
        c.nome.toLowerCase().includes(corQuery.trim().toLowerCase()),
      )
    : availableColors;

  // preço dinâmico: cor selecionada sobrescreve preço-base do tipo
  const basePrice = selectedCor ? selectedCor.preco : tipo.price;
  const finalPrice = basePrice + (tipo.tipo === "PU" && endurecedor ? ENDURECEDOR_PRICE : 0);

  // reset cor ao trocar marca/montadora
  const resetCor = () => {
    setSelectedCor(null);
    setCorQuery("");
  };

  const submit = () => {
    if (!montadora || !selectedCor) {
      setErr(true);
      return;
    }
    const isPU = tipo.tipo === "PU";
    const total = finalPrice;
    const meta = [
      { label: "Marca", value: marca },
      { label: "Montadora", value: montadora },
      { label: "Cor (Pronta de Fábrica)", value: selectedCor.nome },
      { label: "Tipo", value: tipo.tipo },
      { label: "Tamanho", value: tipo.tamanho },
    ];
    if (isPU && endurecedor) {
      meta.push({ label: "Endurecedor (225ml)", value: `Incluso (+${BRL(ENDURECEDOR_PRICE)})` });
    }
    onAdd({
      name: `Tinta Pronta ${marca} — ${tipo.tipo} (${montadora})`,
      variant: tipo.tamanho,
      price: total,
      meta,
    });
    setSelectedCor(null);
    setCorQuery("");
    setEndurecedor(false);
    setErr(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
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
            <Pill
              key={m}
              active={marca === m}
              onClick={() => {
                setMarca(m);
                resetCor();
              }}
            >
              {m}
            </Pill>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Selecione a Montadora">
        <select
          value={montadora}
          onChange={(e) => {
            setMontadora(e.target.value);
            resetCor();
          }}
          className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">— Escolha a montadora —</option>
          {MONTADORAS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </FieldGroup>

      <FieldGroup label="Cor (busca preditiva)">
        <div className="relative">
          <input
            type="text"
            value={corQuery}
            disabled={!montadora}
            onChange={(e) => {
              setCorQuery(e.target.value);
              setSelectedCor(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={
              montadora
                ? `Digite para buscar (ex: Prat...) — ${availableColors.length} cores`
                : "Escolha a montadora primeiro"
            }
            className="w-full rounded-lg border border-border bg-background/40 px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-60"
          />
          {showSuggestions && montadora && filteredColors.length > 0 && !selectedCor && (
            <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-primary/40 bg-card shadow-[var(--shadow-glow)]">
              {filteredColors.map((c) => (
                <li key={c.nome}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSelectedCor(c);
                      setCorQuery(c.nome);
                      setShowSuggestions(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-primary/15"
                  >
                    {c.hex && (
                      <span
                        className="h-4 w-4 shrink-0 rounded-full ring-1 ring-border"
                        style={{ background: c.hex }}
                      />
                    )}
                    <span className="flex-1 truncate font-semibold">{c.nome}</span>
                    <span className="shrink-0 font-display text-[11px] font-bold text-primary">
                      {BRL(c.preco)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showSuggestions && montadora && filteredColors.length === 0 && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Nenhuma cor encontrada para "{corQuery}".
            </p>
          )}
        </div>
        {selectedCor && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-2 text-[11px]">
            {selectedCor.hex && (
              <span
                className="h-5 w-5 shrink-0 rounded-full ring-1 ring-border"
                style={{ background: selectedCor.hex }}
              />
            )}
            <span className="flex-1 truncate font-semibold">{selectedCor.nome}</span>
            <span className="font-display font-bold text-primary">{BRL(selectedCor.preco)}</span>
            <button
              type="button"
              onClick={resetCor}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Limpar cor"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </FieldGroup>

      <FieldGroup label="Tipo de Tinta">
        <div className="grid grid-cols-2 gap-1.5">
          {PRONTAS_TIPOS.map((t, i) => (
            <Pill key={t.tipo} active={tipoIdx === i} onClick={() => { setTipoIdx(i); setEndurecedor(false); }}>
              {t.tipo}
            </Pill>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Tamanho: <span className="font-semibold text-foreground">{tipo.tamanho}</span>
          {selectedCor ? (
            <> · Cor: <span className="font-semibold text-foreground">{BRL(selectedCor.preco)}</span></>
          ) : (
            <> · base {BRL(tipo.price)}</>
          )}
        </p>
      </FieldGroup>

      {tipo.tipo === "PU" && (
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-[12px]">
          <input
            type="checkbox"
            checked={endurecedor}
            onChange={(e) => setEndurecedor(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <span>Acompanhar Endurecedor (225ml) <span className="text-muted-foreground">+ {BRL(ENDURECEDOR_PRICE)}</span></span>
        </label>
      )}

      {err && (
        <p className="text-[11px] text-destructive">
          Selecione a montadora e escolha uma cor na lista.
        </p>
      )}
      <button
        onClick={submit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" strokeWidth={3} />
        Adicionar — {BRL(finalPrice)}
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
  const [fracIdx, setFracIdx] = useState(6); // 1 Quarto default
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(null);
  const [err, setErr] = useState(false);
  const frac = FRACTIONS[fracIdx];
  const price = Math.round(frac.ml * PESADAS_PRICE_PER_ML * 10) / 10;

  const submit = () => {
    if (!veicMarca.trim() || !modelo.trim() || !ano.trim() || !cor.trim()) {
      setErr(true);
      return;
    }
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
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
          <img src={tintaImg} alt="Tinta Pesada" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">Tinta Pesada na Hora</p>
          <p className="text-[11px] text-muted-foreground">Fórmula e pesagem por laboratório.</p>
        </div>
      </div>

      <FieldGroup label="Sistema de Pesagem">
        <div className="grid grid-cols-2 gap-1.5">
          {PESADAS_MARCAS.map((m) => (
            <Pill key={m} active={marca === m} onClick={() => setMarca(m)}>{m}</Pill>
          ))}
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
        <Plus className="h-4 w-4" strokeWidth={3} />
        Adicionar — {BRL(price)}
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
  const id = `photo-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground"
      >
        <Upload className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate">
          {photo ? photo.name : "📸 Anexar foto da etiqueta de cor do carro (Opcional)"}
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
