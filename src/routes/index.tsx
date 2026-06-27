import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import tintaImg from "@/assets/tinta-spray.jpg";
import canetaImg from "@/assets/caneta-retoque.jpg";
import primerImg from "@/assets/primer.jpg";
import personalizadaImg from "@/assets/tinta-personalizada.jpg";

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

type Variant = { label: string; price: number };
type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: Category;
  variants: Variant[];
  custom?: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: "shampoo-citrus",
    name: "Shampoo Automotivo Vonixx Citrus",
    description: "Lava-autos neutro com fragrância cítrica. Alto poder de limpeza.",
    image: shampooImg,
    category: "estetica",
    variants: [
      { label: "500ml", price: 24.9 },
      { label: "1L", price: 39.9 },
      { label: "5L", price: 149.9 },
    ],
  },
  {
    id: "cera-carnauba",
    name: "Cera de Carnaúba Vonixx",
    description: "Proteção e brilho intenso para pinturas escuras e claras.",
    image: ceraImg,
    category: "estetica",
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
    category: "estetica",
    variants: [
      { label: "500ml", price: 29.9 },
      { label: "1L", price: 49.9 },
    ],
  },
  {
    id: "tinta-spray",
    name: "Tinta Spray Automotiva",
    description: "Acabamento profissional para retoques e pintura geral.",
    image: tintaImg,
    category: "tintas",
    variants: [
      { label: "150ml", price: 19.9 },
      { label: "400ml", price: 34.9 },
    ],
  },
  {
    id: "caneta-retoque",
    name: "Caneta de Retoque Automotivo",
    description: "Disfarça pequenos riscos. Cor sob consulta pela placa.",
    image: canetaImg,
    category: "tintas",
    variants: [
      { label: "12ml", price: 39.9 },
      { label: "30ml", price: 69.9 },
    ],
  },
  {
    id: "primer",
    name: "Primer Automotivo Cinza",
    description: "Preparador de superfície de alta aderência para repintura.",
    image: primerImg,
    category: "tintas",
    variants: [
      { label: "500ml", price: 44.9 },
      { label: "900ml", price: 74.9 },
    ],
  },
  {
    id: "tinta-personalizada",
    name: "Tinta Automotiva Personalizada",
    description:
      "Base Poliéster ou PU formulada na cor do seu carro. Informe o código ou anexe a etiqueta.",
    image: personalizadaImg,
    category: "tintas",
    custom: true,
    variants: [
      { label: "Lata 900ml", price: 189.9 },
      { label: "Tira-riscos 100ml", price: 49.9 },
    ],
  },
];

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Index() {
  const [category, setCategory] = useState<Category>("estetica");
  const [selectedVariant, setSelectedVariant] = useState<Record<string, number>>({});
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [paintType, setPaintType] = useState<"Poliéster" | "PU">("Poliéster");
  const [colorCode, setColorCode] = useState("");
  const [colorPhoto, setColorPhoto] = useState<{ name: string; dataUrl: string } | null>(null);
  const [showColorHelp, setShowColorHelp] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [customSheetId, setCustomSheetId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [delivery, setDelivery] = useState<"retirar" | "estafeta" | "">("");
  const [nameError, setNameError] = useState(false);
  const [deliveryError, setDeliveryError] = useState(false);
  const WHATSAPP_NUMBER = "5511999999999"; // número da loja (formato internacional, só dígitos)
  const [cartItems, setCartItems] = useState<
    Array<{
      id: string;
      name: string;
      variant: string;
      price: number;
      custom?: { paintType: string; colorCode: string; photo: { name: string; dataUrl: string } | null };
    }>
  >([]);

  const products = useMemo(
    () => PRODUCTS.filter((p) => p.category === category),
    [category],
  );

  const stamps = Math.min(10, Math.floor(cartTotal / 50));

  const addToCart = (p: Product) => {
    const idx = selectedVariant[p.id] ?? 0;
    const v = p.variants[idx];
    const customData = p.custom
      ? {
          paintType,
          colorCode: colorCode.trim(),
          photo: colorPhoto,
        }
      : undefined;
    setCartItems((items) => [
      ...items,
      { id: p.id, name: p.name, variant: v.label, price: v.price, custom: customData },
    ]);
    setCartTotal((t) => t + v.price);
    setCartCount((c) => c + 1);
    setToast(`${p.name} (${v.label}) adicionado!`);
    window.clearTimeout((addToCart as any)._t);
    (addToCart as any)._t = window.setTimeout(() => setToast(null), 2200);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setColorPhoto({ name: file.name, dataUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
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
      lines.push(`${i + 1}. ${it.name} — ${it.variant} — ${BRL(it.price)}`);
      if (it.custom) {
        lines.push(`   🎨 Tipo: ${it.custom.paintType}`);
        if (it.custom.colorCode) {
          lines.push(`   🔢 Código da cor: ${it.custom.colorCode}`);
        }
        if (it.custom.photo) {
          lines.push(
            `   📎 Foto da etiqueta anexada: ${it.custom.photo.name} (enviarei a imagem em seguida nesta conversa)`,
          );
        }
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
      if (it.custom?.photo) downloadPhoto(it.custom.photo.dataUrl, it.custom.photo.name);
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

        {/* Product list */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border/70">
          {products.map((p) => {
            const idx = selectedVariant[p.id] ?? 0;
            const variant = p.variants[idx];
            return (
              <div key={p.id} className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-background/60 ring-1 ring-border">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">
                      {p.name}
                    </p>
                    <p className="mt-0.5 font-display text-sm font-bold text-primary">
                      {BRL(variant.price)}
                      <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {variant.label}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => (p.custom ? setCustomSheetId(p.id) : addToCart(p))}
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
                          onClick={() =>
                            setSelectedVariant((s) => ({ ...s, [p.id]: i }))
                          }
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
                    {it.custom && (
                      <div className="mt-2 space-y-1 rounded-lg border border-primary/30 bg-primary/5 p-2 text-[11px]">
                        <p>
                          <span className="text-muted-foreground">Tipo:</span>{" "}
                          <span className="font-semibold">{it.custom.paintType}</span>
                        </p>
                        {it.custom.colorCode && (
                          <p>
                            <span className="text-muted-foreground">Código:</span>{" "}
                            <span className="font-semibold">{it.custom.colorCode}</span>
                          </p>
                        )}
                        {it.custom.photo && (
                          <div className="flex items-center gap-2 pt-1">
                            <img
                              src={it.custom.photo.dataUrl}
                              alt="Etiqueta"
                              className="h-10 w-10 rounded object-cover ring-1 ring-border"
                            />
                            <span className="flex-1 truncate text-muted-foreground">
                              {it.custom.photo.name}
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

              {cartItems.some((it) => it.custom?.photo) && (
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
      {customSheetId && (() => {
        const p = PRODUCTS.find((x) => x.id === customSheetId);
        if (!p) return null;
        const idx = selectedVariant[p.id] ?? 0;
        const variant = p.variants[idx];
        return (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setCustomSheetId(null)}
          >
            <div
              className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-primary/40 bg-card shadow-[var(--shadow-glow)] sm:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: "var(--gradient-promo)" }}
              >
                <div className="flex min-w-0 items-center gap-2 text-white">
                  <Palette className="h-5 w-5 shrink-0" />
                  <p className="truncate font-display text-base font-bold">{p.name}</p>
                </div>
                <button
                  onClick={() => setCustomSheetId(null)}
                  className="rounded-full p-1 text-white/90 hover:bg-white/15"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                    Tipo de Tinta
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["Poliéster", "PU"] as const).map((t) => {
                      const active = paintType === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setPaintType(t)}
                          className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                    Tamanho da Lata
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {p.variants.map((v, i) => {
                      const active = i === idx;
                      return (
                        <button
                          key={v.label}
                          onClick={() => setSelectedVariant((s) => ({ ...s, [p.id]: i }))}
                          className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Código da Cor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={colorCode}
                    onChange={(e) => setColorCode(e.target.value.slice(0, 40))}
                    placeholder="Ex: 297 / PRD"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowColorHelp(true)}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2.5 text-left text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  <HelpCircle className="h-4 w-4 shrink-0" />
                  🔍 Não sabe o código da cor do seu carro?
                </button>
                <div>
                  <label
                    htmlFor={`photo-${p.id}`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    <Upload className="h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate">
                      {colorPhoto
                        ? colorPhoto.name
                        : "Anexar foto da etiqueta de cor do carro (Opcional)"}
                    </span>
                  </label>
                  <input
                    id={`photo-${p.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  {colorPhoto && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background/60 p-2">
                      <img
                        src={colorPhoto.dataUrl}
                        alt="Etiqueta de cor"
                        className="h-12 w-12 rounded object-cover ring-1 ring-border"
                      />
                      <span className="flex-1 truncate text-xs text-muted-foreground">
                        {colorPhoto.name}
                      </span>
                      <button
                        onClick={() => setColorPhoto(null)}
                        className="rounded p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Remover foto"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-border bg-background/60 p-4">
                <button
                  onClick={() => {
                    addToCart(p);
                    setCustomSheetId(null);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  Adicionar — {BRL(variant.price)}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
