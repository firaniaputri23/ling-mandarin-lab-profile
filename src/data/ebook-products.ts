import type { Product } from "@/types/ebook";
import bukuLiveMandarin from "@/assets/buku_live_mandarin.png";

export const FEATURED_PRODUCT: Product = {
  id: "prod-001",
  name: "BUKU LIVE MANDARIN",
  description: "Easy Learning Chinese — buku panduan belajar Mandarin lengkap dari Ling Chinese Lab, cocok untuk pemula hingga tingkat menengah.",
  price: 175000,
  originalPrice: 259000,
  imageUrl: bukuLiveMandarin,
  category: "featured",
  badge: "BEST SELLER",
};

export const ADDON_PRODUCTS: Product[] = [
  {
    id: "prod-hsk1",
    name: "NEW HSK 1 TEXTBOOK",
    description: "Buku teks resmi HSK Level 1 — kuasai 150 kosakata dasar Mandarin.",
    price: 25000,
    imageUrl: "",
    category: "addon",
    badge: "NEW",
  },
  {
    id: "prod-hsk2",
    name: "NEW HSK 2 TEXTBOOK",
    description: "Buku teks resmi HSK Level 2 — tingkatkan kemampuan dengan 300 kosakata.",
    price: 35000,
    imageUrl: "",
    category: "addon",
    badge: "NEW",
  },
  {
    id: "prod-hsk3",
    name: "NEW HSK 3 TEXTBOOK",
    description: "Buku teks resmi HSK Level 3 — capai 600 kosakata dan komunikasi aktif.",
    price: 35000,
    imageUrl: "",
    category: "addon",
    badge: "NEW",
  },
];

export const ALL_PRODUCTS: Product[] = [FEATURED_PRODUCT, ...ADDON_PRODUCTS];

/** Server-side price map untuk validasi (id → price in IDR) */
export const PRODUCT_PRICE_MAP: Record<string, number> = Object.fromEntries(
  ALL_PRODUCTS.map((p) => [p.id, p.price])
);

export const CONVENIENCE_FEE = 2500; // IDR

export const formatIDR = (amount: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
