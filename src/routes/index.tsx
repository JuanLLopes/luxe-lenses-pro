import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Gift, ShoppingCart, Plus, Award, Trophy } from "lucide-react";
import shampooImg from "@/assets/shampoo-citrus.jpg";
import ceraImg from "@/assets/cera-carnauba.jpg";
import pretinhoImg from "@/assets/pretinho.jpg";
import tintaImg from "@/assets/tinta-spray.jpg";
import canetaImg from "@/assets/caneta-retoque.jpg";
import primerImg from "@/assets/primer.jpg";

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
];

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Index() {
  const [category, setCategory] = useState<Category>("estetica");
  const [selectedVariant, setSelectedVariant] = useState<Record<string, number>>({});
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const products = useMemo(
    () => PRODUCTS.filter((p) => p.category === category),
    [category],
  );

  const stamps = Math.min(10, Math.floor(cartTotal / 50));

  const addToCart = (p: Product) => {
    const idx = selectedVariant[p.id] ?? 0;
    const v = p.variants[idx];
    setCartTotal((t) => t + v.price);
    setCartCount((c) => c + 1);
    setToast(`${p.name} (${v.label}) adicionado!`);
    window.clearTimeout((addToCart as any)._t);
    (addToCart as any)._t = window.setTimeout(() => setToast(null), 2200);
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
          <button className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card transition-colors hover:border-primary">
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
        <section className="mt-5 space-y-3">
          {products.map((p) => {
            const idx = selectedVariant[p.id] ?? 0;
            const variant = p.variants[idx];
            return (
              <article
                key={p.id}
                className="overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-card)] shadow-[var(--shadow-card)] transition-colors hover:border-primary/40"
              >
                <div className="flex gap-3 p-3">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-background/60 ring-1 ring-border">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-display text-sm font-bold leading-snug">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {variant.label}
                        </p>
                        <p className="font-display text-xl font-bold text-primary">
                          {BRL(variant.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/70 bg-background/30 p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {p.variants.map((v, i) => {
                      const active = i === idx;
                      return (
                        <button
                          key={v.label}
                          onClick={() =>
                            setSelectedVariant((s) => ({ ...s, [p.id]: i }))
                          }
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => addToCart(p)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.97]"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                      Adicionar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Cart summary footer (sticky) */}
        {cartCount > 0 && (
          <div className="fixed inset-x-0 bottom-3 z-40 mx-auto max-w-2xl px-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-card/95 px-4 py-3 shadow-[var(--shadow-glow)] backdrop-blur">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {cartCount} {cartCount === 1 ? "item" : "itens"} · total
                </p>
                <p className="font-display text-lg font-bold text-primary">
                  {BRL(cartTotal)}
                </p>
              </div>
              <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
                Finalizar
              </button>
            </div>
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
    </div>
  );
}
