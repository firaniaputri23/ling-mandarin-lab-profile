import { useState } from "react";
import { ShoppingCart, Tag, Star, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/ebook/CartDrawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { FEATURED_PRODUCT, ADDON_PRODUCTS, formatIDR } from "@/data/ebook-products";
import type { Product } from "@/types/ebook";

export default function EbookHSK() {
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const cart = useCart();

  const handleAddToCart = (product: Product) => {
    cart.addItem(product);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
      setCartOpen(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[hsl(37,30%,95%)]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[hsl(25,21%,55%)] mb-1">
            Official Store
          </p>
          <h1 className="text-xl font-bold text-[hsl(25,21%,30%)]">
            Ling Chinese Lab
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 bg-[hsl(0,45%,40%)]/10 text-[hsl(0,45%,38%)] px-4 py-1.5 rounded-full text-xs font-semibold border border-[hsl(0,45%,40%)]/20">
            <Star size={12} fill="currentColor" />
            Buku Official Ling Chinese Lab
          </div>
        </div>

        {/* Floating Cart Button */}
        {cart.totalItems > 0 && (
          <button
            id="floating-cart-btn"
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-4 z-40 flex items-center gap-2.5 bg-[hsl(0,45%,38%)] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-[hsl(0,45%,32%)] active:scale-95 transition-all duration-200 font-semibold text-sm"
          >
            <ShoppingCart size={18} />
            <span>{cart.totalItems} item</span>
            <span className="text-[hsl(0,45%,80%)]">·</span>
            <span>{formatIDR(cart.grandTotal)}</span>
          </button>
        )}

        {/* ═══════════ FEATURED PRODUCT CARD ═══════════ */}
        <div className="bg-white rounded-3xl shadow-md border border-[hsl(31,15%,88%)] overflow-hidden mb-6 group">
          {/* Badge */}
          <div className="relative">
            <div className="absolute top-3 left-3 z-10 bg-[hsl(0,45%,40%)] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow">
              {FEATURED_PRODUCT.badge}
            </div>
            <img
              src={FEATURED_PRODUCT.imageUrl}
              alt={FEATURED_PRODUCT.name}
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          <div className="p-5">
            <p className="text-xs font-semibold text-[hsl(25,21%,55%)] uppercase tracking-widest mb-1">
              Featured Product
            </p>
            <h2 className="text-xl font-extrabold text-[hsl(25,21%,25%)] mb-3 leading-tight">
              {FEATURED_PRODUCT.name}
            </h2>
            <p className="text-sm text-[hsl(25,21%,50%)] mb-4 leading-relaxed">
              {FEATURED_PRODUCT.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-2xl font-extrabold text-[hsl(0,45%,38%)]">
                {formatIDR(FEATURED_PRODUCT.price)}
              </span>
              {FEATURED_PRODUCT.originalPrice && (
                <span className="text-base text-[hsl(25,21%,60%)] line-through">
                  {formatIDR(FEATURED_PRODUCT.originalPrice)}
                </span>
              )}
              {FEATURED_PRODUCT.originalPrice && (
                <span className="text-xs font-bold bg-[hsl(120,40%,38%)]/10 text-[hsl(120,40%,32%)] px-2 py-0.5 rounded-full">
                  Hemat {Math.round((1 - FEATURED_PRODUCT.price / FEATURED_PRODUCT.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Features list */}
            <ul className="space-y-1.5 mb-5">
              {[
                "Cocok untuk pemula s.d. menengah",
                "Dilengkapi audio & latihan soal",
                "Materi HSK-aligned",
                "Dikirim dalam 2–5 hari kerja",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-[hsl(25,21%,40%)]">
                  <CheckCircle2 size={14} className="text-[hsl(120,40%,38%)] flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <Button
              id={`add-to-cart-${FEATURED_PRODUCT.id}`}
              onClick={() => handleAddToCart(FEATURED_PRODUCT)}
              className={`w-full py-6 rounded-2xl font-bold text-base shadow-sm transition-all duration-300 ${
                addedId === FEATURED_PRODUCT.id
                  ? "bg-[hsl(120,40%,38%)] text-white scale-95"
                  : "bg-[hsl(0,45%,40%)] hover:bg-[hsl(0,45%,34%)] text-white"
              }`}
            >
              {addedId === FEATURED_PRODUCT.id ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} /> Ditambahkan!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} /> Tambah ke Keranjang
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* ═══════════ ADD-ON PRODUCTS ═══════════ */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={16} className="text-[hsl(0,45%,40%)]" />
            <h3 className="font-bold text-[hsl(25,21%,30%)] text-base">Tambah HSK Textbook</h3>
          </div>

          <div className="space-y-3">
            {ADDON_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-white border-2 border-[hsl(0,45%,40%)]/25 rounded-2xl px-4 py-3.5 shadow-sm hover:border-[hsl(0,45%,40%)]/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl">📖</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm text-[hsl(25,21%,28%)]">{product.name}</p>
                      {product.badge && (
                        <span className="text-[9px] font-bold bg-[hsl(0,45%,40%)] text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[hsl(0,45%,40%)] mt-0.5">
                      {formatIDR(product.price)}
                    </p>
                  </div>
                </div>

                <button
                  id={`add-addon-${product.id}`}
                  onClick={() => handleAddToCart(product)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    addedId === product.id
                      ? "bg-[hsl(120,40%,38%)] text-white scale-95"
                      : "bg-[hsl(0,45%,40%)]/10 text-[hsl(0,45%,38%)] hover:bg-[hsl(0,45%,40%)] hover:text-white"
                  }`}
                >
                  {addedId === product.id ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <>
                      <ChevronRight size={14} />
                      Pilih
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="mt-6 bg-[hsl(37,30%,92%)] border border-[hsl(31,15%,82%)] rounded-2xl px-4 py-3 text-xs text-[hsl(25,21%,50%)] text-center">
          📦 Pengiriman ke seluruh Indonesia · 🔒 Pembayaran aman via Midtrans · 💬 CS tersedia di WhatsApp
        </div>
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        grandTotal={cart.grandTotal}
        totalItems={cart.totalItems}
        onUpdateQty={cart.updateQty}
        onRemove={cart.removeItem}
      />
    </div>
  );
}
