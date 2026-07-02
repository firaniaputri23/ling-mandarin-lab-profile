import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "@/types/ebook";
import { formatIDR, CONVENIENCE_FEE } from "@/data/ebook-products";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  grandTotal: number;
  totalItems: number;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
  grandTotal,
  totalItems,
  onUpdateQty,
  onRemove,
}: CartDrawerProps) {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    onClose();
    navigate("/ebook-hsk/checkout", { state: { items, subtotal, grandTotal } });
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="max-h-[90vh] bg-[hsl(37,30%,97%)] border-t border-[hsl(31,15%,85%)]">
        <DrawerHeader className="pb-2 border-b border-[hsl(31,15%,88%)]">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-[hsl(25,21%,35%)] text-lg font-bold">
              <ShoppingBag size={20} className="text-[hsl(25,21%,59%)]" />
              Keranjang
              {totalItems > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(0,45%,40%)] text-white text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </DrawerTitle>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[hsl(31,15%,88%)] transition-colors"
              aria-label="Tutup keranjang"
            >
              <X size={18} className="text-[hsl(25,21%,50%)]" />
            </button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-[hsl(25,21%,60%)]">
              <ShoppingBag size={48} strokeWidth={1.2} />
              <p className="text-sm font-medium">Keranjangmu masih kosong</p>
              <p className="text-xs text-center max-w-[200px]">Tambahkan buku atau HSK textbook dari katalog!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-[hsl(31,15%,90%)]"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[hsl(37,30%,93%)]">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[hsl(25,21%,30%)] truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm font-bold text-[hsl(0,45%,40%)] mt-0.5">
                    {formatIDR(item.product.price)}
                  </p>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 flex-shrink-0 rounded-full border border-[hsl(31,15%,80%)] flex items-center justify-center hover:bg-[hsl(31,15%,90%)] transition-colors"
                    aria-label="Kurang"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 size={12} className="text-[hsl(0,45%,50%)]" />
                    ) : (
                      <Minus size={12} className="text-[hsl(25,21%,40%)]" />
                    )}
                  </button>
                  <span className="text-sm font-bold text-[hsl(25,21%,30%)] min-w-[16px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 flex-shrink-0 rounded-full border border-[hsl(31,15%,80%)] flex items-center justify-center hover:bg-[hsl(31,15%,90%)] transition-colors"
                    aria-label="Tambah"
                  >
                    <Plus size={12} className="text-[hsl(25,21%,40%)]" />
                  </button>
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors ml-1"
                    aria-label="Hapus"
                  >
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-4 pt-2 pb-1 border-t border-[hsl(31,15%,88%)] space-y-1.5">
            <div className="flex justify-between text-sm text-[hsl(25,21%,50%)]">
              <span>Subtotal ({totalItems} item)</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[hsl(25,21%,50%)]">
              <span>Biaya layanan</span>
              <span>{formatIDR(CONVENIENCE_FEE)}</span>
            </div>
            <div className="flex justify-between font-bold text-[hsl(25,21%,25%)] pt-1 border-t border-[hsl(31,15%,88%)]">
              <span>Grand Total</span>
              <span className="text-[hsl(0,45%,40%)]">{formatIDR(grandTotal)}</span>
            </div>
          </div>
        )}

        <DrawerFooter className="pt-2 gap-2">
          {items.length > 0 ? (
            <>
              <Button
                id="cart-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-6 rounded-full bg-[hsl(120,40%,38%)] hover:bg-[hsl(120,40%,32%)] text-white font-bold text-base shadow-lg transition-all"
              >
                🛒 Lanjut Pembayaran — {formatIDR(grandTotal)}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full py-5 rounded-full border-[hsl(25,21%,59%)] text-[hsl(25,21%,40%)] hover:bg-[hsl(31,15%,92%)] font-medium"
              >
                Lanjut Belanja
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full py-5 rounded-full border-[hsl(25,21%,59%)] text-[hsl(25,21%,40%)] hover:bg-[hsl(31,15%,92%)] font-medium"
            >
              Lihat Katalog
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
