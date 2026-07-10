import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, X } from "lucide-react";

export type ProductCardVariant = { label: string; price: number; image?: string };
export type ProductCardProduct = {
  id: string;
  name: string;
  subname?: string;
  description: string;
  images: string[];
  variants: ProductCardVariant[];
  brand?: string;
  features?: string[];
  applications?: string[];
  colors?: string[];
  volume?: string;
  oldPrice?: number;
};

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const calcPix = (v: number) => v * 0.97;
const calcParcelas = (v: number) => {
  const parcelas = v >= 100 ? 12 : v >= 50 ? 6 : v >= 20 ? 3 : 1;
  return { parcelas, valorParcela: v / parcelas };
};

type Props = {
  p: ProductCardProduct;
  idx: number;
  onVariant: (i: number) => void;
  onAdd: () => void;
  onOpenLightbox: (i: number) => void;
};

export default function ProductCard({ p, idx, onVariant, onAdd, onOpenLightbox }: Props) {
  const variant = p.variants[idx];
  const price = variant.price;
  const pix = calcPix(price);
  const parc = calcParcelas(price);
  const [imgIdx, setImgIdx] = useState(0);
  const [openDetails, setOpenDetails] = useState(false);
  const carouselRef = useRef<number | null>(null);

  const heroImage = variant.image ?? p.images[imgIdx] ?? p.images[0];

  useEffect(() => {
    if (openDetails || p.images.length <= 1 || variant.image) return;
    carouselRef.current = window.setInterval(
      () => setImgIdx((i) => (i + 1) % p.images.length),
      4000,
    );
    return () => {
      if (carouselRef.current) window.clearInterval(carouselRef.current);
    };
  }, [p.images.length, openDetails, variant.image]);

  return (
    <>
      <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
        {/* Image */}
        <button
          type="button"
          onClick={() => onOpenLightbox(imgIdx)}
          className="relative block aspect-square overflow-hidden bg-white"
          aria-label={`Ver imagem de ${p.name}`}
        >
          <img
            src={heroImage}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            💚 3% OFF no PIX
          </span>
          {p.images.length > 1 && !variant.image && (
            <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
              {imgIdx + 1}/{p.images.length}
            </span>
          )}
        </button>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          {p.brand && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {p.brand}
            </p>
          )}
          <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
            {p.name}
          </h3>
          {p.subname && (
            <p className="text-[11px] font-medium text-muted-foreground line-clamp-1">
              {p.subname}
            </p>
          )}
          <p className="text-[11px] leading-snug text-muted-foreground line-clamp-3">
            {p.description}
          </p>

          <p className="text-[11px] font-semibold text-foreground/80">
            Volume:{" "}
            <span className="font-normal text-muted-foreground">
              {p.volume ?? variant.label}
            </span>
          </p>

          {p.variants.length > 1 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {p.variants.map((v, i) => {
                const active = i === idx;
                return (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => onVariant(i)}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
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

          <div className="mt-1">
            {p.oldPrice && p.oldPrice > price && (
              <p className="text-[11px] text-muted-foreground line-through">
                {BRL(p.oldPrice)}
              </p>
            )}
            <p className="font-display text-lg font-bold leading-none text-primary">
              {BRL(price)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              ou {parc.parcelas}x de {BRL(parc.valorParcela)} sem juros
            </p>
            <p className="text-[11px] font-semibold text-[color:var(--success)]">
              PIX {BRL(pix)}{" "}
              <span className="font-normal opacity-70">(-3%)</span>
            </p>
          </div>

          <div className="mt-auto flex gap-1.5 pt-2">
            <button
              type="button"
              onClick={() => setOpenDetails(true)}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Eye className="h-3.5 w-3.5" /> Ver detalhes
            </button>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-[11px] font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.5} /> Comprar
            </button>
          </div>
        </div>
      </article>

      {openDetails && (
        <DetailsModal
          p={p}
          idx={idx}
          onVariant={onVariant}
          onAdd={() => {
            onAdd();
            setOpenDetails(false);
          }}
          onClose={() => setOpenDetails(false)}
        />
      )}
    </>
  );
}

function DetailsModal({
  p,
  idx,
  onVariant,
  onAdd,
  onClose,
}: {
  p: ProductCardProduct;
  idx: number;
  onVariant: (i: number) => void;
  onAdd: () => void;
  onClose: () => void;
}) {
  const [gi, setGi] = useState(0);
  const variant = p.variants[idx];
  const price = variant.price;
  const images = p.images.length ? p.images : [""];
  const active = variant.image ?? images[gi];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setGi((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setGi((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-foreground shadow hover:bg-background"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Gallery */}
        <div className="relative flex w-full flex-col bg-white md:w-1/2">
          <div className="relative aspect-square w-full">
            <img
              src={active}
              alt={p.name}
              className="h-full w-full object-contain p-6"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setGi((i) => (i - 1 + images.length) % images.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setGi((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                  {gi + 1}/{images.length}
                </span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto p-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGi(i)}
                  className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border bg-white ${
                    i === gi ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 overflow-y-auto p-5">
          {p.brand && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {p.brand}
            </p>
          )}
          <h2 className="mt-0.5 text-xl font-bold text-foreground">{p.name}</h2>
          {p.subname && (
            <p className="text-sm text-muted-foreground">{p.subname}</p>
          )}

          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {p.description}
          </p>

          {p.applications && p.applications.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Aplicações
              </h4>
              <ul className="mt-1 list-disc pl-5 text-sm text-foreground/80">
                {p.applications.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {p.features && p.features.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Características
              </h4>
              <ul className="mt-1 list-disc pl-5 text-sm text-foreground/80">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {p.colors && p.colors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cores disponíveis
              </h4>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {p.colors.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-foreground/80"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {p.variants.length > 1 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Variações
              </h4>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {p.variants.map((v, i) => {
                  const on = i === idx;
                  return (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => onVariant(i)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                        on
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {v.label} · {BRL(v.price)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-border bg-background/60 p-3">
            {p.oldPrice && p.oldPrice > price && (
              <p className="text-xs text-muted-foreground line-through">
                {BRL(p.oldPrice)}
              </p>
            )}
            <p className="font-display text-2xl font-bold text-primary">
              {BRL(price)}
            </p>
            <p className="text-xs font-semibold text-[color:var(--success)]">
              PIX {BRL(calcPix(price))} (-3%)
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow transition-transform active:scale-95 hover:bg-emerald-700"
          >
            <ShoppingCart className="h-4 w-4" /> Comprar pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}