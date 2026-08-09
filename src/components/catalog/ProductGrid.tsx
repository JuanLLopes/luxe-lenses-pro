import ProductCard, { type ProductCardProduct } from "@/components/ProductCard";

type Props<P extends ProductCardProduct> = {
  products: P[];
  selectedVariant: Record<string, number>;
  onVariant: (productId: string, index: number) => void;
  onAdd: (product: P) => void;
  onOpenLightbox: (images: string[], index: number) => void;
  emptyLabel?: string;
};

export default function ProductGrid<P extends ProductCardProduct>({
  products,
  selectedVariant,
  onVariant,
  onAdd,
  onOpenLightbox,
  emptyLabel = "Nenhum produto encontrado.",
}: Props<P>) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 items-stretch gap-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          p={p}
          idx={selectedVariant[p.id] ?? 0}
          onVariant={(i) => onVariant(p.id, i)}
          onAdd={() => onAdd(p)}
          onOpenLightbox={(i) => onOpenLightbox(p.images, i)}
        />
      ))}
    </div>
  );
}