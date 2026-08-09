import { Menu, Search, MessageCircle, Share2, ShoppingCart } from "lucide-react";

type Props = {
  cartCount: number;
  onMenu: () => void;
  onSearch: () => void;
  whatsappUrl: string;
  onShare: () => void;
  onCart: () => void;
};

const itemCls =
  "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-primary active:text-primary";

export default function BottomNav({ cartCount, onMenu, onSearch, whatsappUrl, onShare, onCart }: Props) {
  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-2xl items-stretch">
        <button type="button" onClick={onMenu} className={itemCls}>
          <Menu className="h-5 w-5" />
          MENU
        </button>
        <button type="button" onClick={onSearch} className={itemCls}>
          <Search className="h-5 w-5" />
          BUSCAR
        </button>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className={itemCls}>
          <MessageCircle className="h-5 w-5" />
          WHATSAPP
        </a>
        <button type="button" onClick={onShare} className={itemCls}>
          <Share2 className="h-5 w-5" />
          COMPARTILHAR
        </button>
        <button type="button" onClick={onCart} className={`${itemCls} relative`}>
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </span>
          CARRINHO
        </button>
      </div>
    </nav>
  );
}
