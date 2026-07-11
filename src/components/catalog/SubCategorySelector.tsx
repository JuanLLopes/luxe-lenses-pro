import type { ReactNode } from "react";

export type SubCategoryOption<T extends string = string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  options: SubCategoryOption<T>[];
  value: T | null;
  onChange: (id: T) => void;
  /** "tabs" = compact horizontal scroller (Pintura style). "grid" = tile picker (Estética initial step). */
  variant?: "tabs" | "grid";
  emptyState?: ReactNode;
};

export default function SubCategorySelector<T extends string>({
  options,
  value,
  onChange,
  variant = "tabs",
}: Props<T>) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`rounded-2xl border px-3 py-4 text-center text-sm font-bold transition-all ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`shrink-0 rounded-xl border px-3 py-2 text-[11px] font-bold transition-all ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}