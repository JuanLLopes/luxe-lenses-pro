import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";

export type PromoSlide = {
  /** URL da imagem promocional */
  src: string;
  /** Texto alternativo da imagem */
  alt?: string;
  /** Link opcional ao clicar no slide */
  href?: string;
};

type Props = {
  slides?: PromoSlide[];
  /** Intervalo da troca automática (ms). 0 desativa. */
  interval?: number;
  className?: string;
};

/**
 * Carrossel promocional reutilizável.
 * Preparado para receber as imagens da DNS posteriormente:
 * <PromoCarousel slides={[{ src: "/promo-1.jpg", alt: "..." }]} />
 */
export default function PromoCarousel({ slides = [], interval = 5000, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || !interval) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearInterval(t);
  }, [count, interval]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  return (
    <section
      aria-label="Destaques"
      className={`relative overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {count === 0 ? (
          <div className="grid h-full w-full place-items-center bg-[image:var(--gradient-card)]">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" aria-hidden />
          </div>
        ) : (
          slides.map((s, i) => {
            const img = (
              <img
                src={s.src}
                alt={s.alt ?? ""}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            );
            return (
              <div
                key={`${s.src}-${i}`}
                className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
                aria-hidden={i !== index}
              >
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noreferrer" className="block h-full w-full">
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })
        )}
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-primary" : "w-2 bg-white/70 ring-1 ring-black/10"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
