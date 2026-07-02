import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Mail, Phone, MapPin, Tag, ShieldCheck,
  ArrowLeft, Loader2, BookOpen, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import type { CartItem } from "@/types/ebook";
import { formatIDR, CONVENIENCE_FEE } from "@/data/ebook-products";

// Global Midtrans Snap type declaration
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(9, "Nomor HP tidak valid").max(15, "Nomor HP terlalu panjang"),
  shippingAddress: z.string().min(10, "Alamat pengiriman wajib diisi minimal 10 karakter"),
  voucherCode: z.string().optional(),
  agreeTerms: z.boolean().refine((v) => v, "Kamu harus menyetujui syarat & ketentuan"),
  agreePrivacy: z.boolean().refine((v) => v, "Kamu harus menyetujui kebijakan privasi"),
});

type FormValues = z.infer<typeof schema>;

interface LocationState {
  items: CartItem[];
  subtotal: number;
  grandTotal: number;
}

async function createTransaction(payload: object): Promise<{ snapToken: string; orderId: string }> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase credentials are missing in environment variables");
  }

  // Calls the Supabase Edge Function we just created
  const res = await fetch(`${supabaseUrl}/functions/v1/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${anonKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create transaction");
  }

  return res.json();
}

export default function EbookCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [discountAmount] = useState(0); // TODO: implement voucher validation

  const items: CartItem[] = state?.items ?? [];
  const subtotal = state?.subtotal ?? 0;
  const grandTotal = subtotal - discountAmount + (subtotal > 0 ? CONVENIENCE_FEE : 0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Sending totalAmount alongside items so backend can validate
      const payload = {
        buyerInfo: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          shippingAddress: data.shippingAddress,
        },
        cartItems: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.price, // sending price for the backend to double check
          name: i.product.name,
        })),
        totalAmount: grandTotal,
        voucherCode: data.voucherCode || undefined,
      };

      const { snapToken, orderId } = await createTransaction(payload);
      console.log("Order ID:", orderId, "Snap Token:", snapToken);

      // Trigger Midtrans Snap Popup
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: (result) => {
            console.log("Payment success:", result);
            setPaymentSuccess(true);
            setIsSubmitting(false);
          },
          onPending: (result) => {
            console.log("Payment pending:", result);
            // Optional: redirect to a pending page or show info
            setIsSubmitting(false);
          },
          onError: (result) => {
            console.error("Payment error:", result);
            alert("Terjadi kesalahan saat memproses pembayaran.");
            setIsSubmitting(false);
          },
          onClose: () => {
            console.log("Payment popup closed");
            setIsSubmitting(false);
          },
        });
      } else {
        throw new Error("Midtrans Snap.js is not loaded properly.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err.message || "Gagal membuat pesanan.");
      setIsSubmitting(false);
    }
  };

  // ─── Success State ─────────────────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[hsl(37,30%,95%)] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-[hsl(31,15%,88%)] p-8 max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[hsl(120,40%,38%)]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={44} className="text-[hsl(120,40%,38%)]" />
          </div>
          <h2 className="text-xl font-extrabold text-[hsl(25,21%,25%)] mb-2">Pesanan Berhasil! 🎉</h2>
          <p className="text-sm text-[hsl(25,21%,50%)] mb-6">
            Terima kasih! Pesananmu sedang diproses. Kami akan menghubungimu via email & WhatsApp.
          </p>
          <Button
            onClick={() => navigate("/ebook-hsk")}
            className="w-full py-5 rounded-full bg-[hsl(0,45%,40%)] hover:bg-[hsl(0,45%,34%)] text-white font-bold"
          >
            Kembali ke Katalog
          </Button>
        </div>
      </div>
    );
  }

  // ─── Empty cart guard ──────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[hsl(37,30%,95%)] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-[hsl(31,15%,88%)] p-8 max-w-sm w-full text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-[hsl(25,21%,60%)]" strokeWidth={1.2} />
          <h2 className="text-lg font-bold text-[hsl(25,21%,30%)] mb-2">Keranjang Kosong</h2>
          <p className="text-sm text-[hsl(25,21%,55%)] mb-6">Pilih dulu bukunya ya!</p>
          <Button
            onClick={() => navigate("/ebook-hsk")}
            className="w-full py-5 rounded-full bg-[hsl(0,45%,40%)] hover:bg-[hsl(0,45%,34%)] text-white font-bold"
          >
            Ke Katalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(37,30%,95%)]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[hsl(25,21%,50%)] hover:text-[hsl(25,21%,30%)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Keranjang
        </button>

        <h1 className="text-2xl font-extrabold text-[hsl(25,21%,25%)] mb-6">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

            {/* ═══ LEFT: Buyer Info ═══ */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl border border-[hsl(31,15%,88%)] shadow-sm p-6">
                <h2 className="font-bold text-[hsl(25,21%,28%)] text-base mb-5 flex items-center gap-2">
                  <User size={18} className="text-[hsl(0,45%,40%)]" />
                  Data Pembeli
                </h2>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-[hsl(25,21%,40%)] flex items-center gap-1.5 mb-1.5">
                      <Mail size={13} /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      {...register("email")}
                      className="rounded-xl border-[hsl(31,15%,82%)] focus:border-[hsl(0,45%,40%)] bg-[hsl(37,30%,97%)]"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-[hsl(25,21%,40%)] flex items-center gap-1.5 mb-1.5">
                      <User size={13} /> Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nama lengkap kamu"
                      {...register("name")}
                      className="rounded-xl border-[hsl(31,15%,82%)] focus:border-[hsl(0,45%,40%)] bg-[hsl(37,30%,97%)]"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-[hsl(25,21%,40%)] flex items-center gap-1.5 mb-1.5">
                      <Phone size={13} /> Nomor HP / WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      {...register("phone")}
                      className="rounded-xl border-[hsl(31,15%,82%)] focus:border-[hsl(0,45%,40%)] bg-[hsl(37,30%,97%)]"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <Label htmlFor="shippingAddress" className="text-sm font-semibold text-[hsl(25,21%,40%)] flex items-center gap-1.5 mb-1.5">
                      <MapPin size={13} />
                      <span>
                        Alamat Pengiriman{" "}
                        <span className="text-[hsl(0,45%,40%)] font-bold">⚠ WAJIB ISI UTK PENGIRIMAN BUKU</span>
                      </span>
                    </Label>
                    <Textarea
                      id="shippingAddress"
                      placeholder="Jl. contoh no. 123, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi, Kode Pos"
                      rows={4}
                      {...register("shippingAddress")}
                      className="rounded-xl border-[hsl(31,15%,82%)] focus:border-[hsl(0,45%,40%)] bg-[hsl(37,30%,97%)] resize-none"
                    />
                    {errors.shippingAddress && (
                      <p className="text-xs text-red-500 mt-1">{errors.shippingAddress.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Voucher */}
              <div className="bg-white rounded-3xl border border-[hsl(31,15%,88%)] shadow-sm p-5">
                <h2 className="font-bold text-[hsl(25,21%,28%)] text-sm mb-3 flex items-center gap-2">
                  <Tag size={15} className="text-[hsl(0,45%,40%)]" />
                  Kode Voucher (Opsional)
                </h2>
                <div className="flex gap-2">
                  <Input
                    id="voucherCode"
                    placeholder="Masukkan kode voucher"
                    {...register("voucherCode")}
                    className="rounded-xl border-[hsl(31,15%,82%)] bg-[hsl(37,30%,97%)] flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-[hsl(0,45%,40%)] text-[hsl(0,45%,40%)] hover:bg-[hsl(0,45%,40%)]/5 font-semibold px-5"
                  >
                    Pakai
                  </Button>
                </div>
                <p className="text-xs text-[hsl(25,21%,55%)] mt-2">
                  * Voucher dari konten TikTok atau promo khusus Ling Chinese Lab
                </p>
              </div>

              {/* T&C */}
              <div className="bg-white rounded-3xl border border-[hsl(31,15%,88%)] shadow-sm p-5 space-y-3">
                <h2 className="font-bold text-[hsl(25,21%,28%)] text-sm flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[hsl(0,45%,40%)]" />
                  Syarat & Ketentuan
                </h2>
                <div className="flex items-start gap-3">
                  <Controller
                    name="agreeTerms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="agreeTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 border-[hsl(31,15%,70%)] data-[state=checked]:bg-[hsl(0,45%,40%)] data-[state=checked]:border-[hsl(0,45%,40%)]"
                      />
                    )}
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-[hsl(25,21%,45%)] leading-relaxed cursor-pointer">
                    Saya menyetujui <span className="text-[hsl(0,45%,40%)] font-semibold underline cursor-pointer">Syarat & Ketentuan</span> pembelian, termasuk kebijakan pengembalian dan pengiriman Ling Chinese Lab.
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>}

                <div className="flex items-start gap-3">
                  <Controller
                    name="agreePrivacy"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="agreePrivacy"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 border-[hsl(31,15%,70%)] data-[state=checked]:bg-[hsl(0,45%,40%)] data-[state=checked]:border-[hsl(0,45%,40%)]"
                      />
                    )}
                  />
                  <label htmlFor="agreePrivacy" className="text-xs text-[hsl(25,21%,45%)] leading-relaxed cursor-pointer">
                    Saya menyetujui <span className="text-[hsl(0,45%,40%)] font-semibold underline cursor-pointer">Kebijakan Privasi</span> dan pembagian data kepada mitra pengiriman untuk keperluan pengiriman produk.
                  </label>
                </div>
                {errors.agreePrivacy && <p className="text-xs text-red-500">{errors.agreePrivacy.message}</p>}
              </div>
            </div>

            {/* ═══ RIGHT: Order Summary ═══ */}
            <div className="space-y-4">
              {/* Items list */}
              <div className="bg-white rounded-3xl border border-[hsl(31,15%,88%)] shadow-sm p-5 sticky top-24">
                <h2 className="font-bold text-[hsl(25,21%,28%)] text-base mb-4 flex items-center gap-2">
                  <BookOpen size={16} className="text-[hsl(0,45%,40%)]" />
                  Rincian Pesanan
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[hsl(37,30%,93%)]">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base">📚</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[hsl(25,21%,30%)] truncate">{item.product.name}</p>
                        <p className="text-xs text-[hsl(25,21%,55%)]">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[hsl(25,21%,30%)] flex-shrink-0">
                        {formatIDR(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[hsl(31,15%,88%)] pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-[hsl(25,21%,50%)]">
                    <span>Subtotal</span>
                    <span>{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[hsl(25,21%,50%)]">
                    <span>Diskon Voucher</span>
                    <span className="text-[hsl(120,40%,38%)]">
                      {discountAmount > 0 ? `-${formatIDR(discountAmount)}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[hsl(25,21%,50%)]">
                    <span>Biaya Layanan</span>
                    <span>{formatIDR(CONVENIENCE_FEE)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-[hsl(25,21%,22%)] text-base pt-2 border-t border-[hsl(31,15%,88%)]">
                    <span>Grand Total</span>
                    <span className="text-[hsl(0,45%,38%)]">{formatIDR(grandTotal)}</span>
                  </div>
                </div>

                {/* Payment method note */}
                <div className="mt-4 bg-[hsl(37,30%,93%)] rounded-2xl px-4 py-3 text-xs text-[hsl(25,21%,50%)] text-center border border-[hsl(31,15%,85%)]">
                  🔒 Pembayaran diproses aman via <span className="font-semibold text-[hsl(25,21%,35%)]">Midtrans</span>
                  <br />
                  Transfer Bank · QRIS · GoPay · OVO · Dana · dll.
                </div>

                {/* Submit */}
                <Button
                  id="checkout-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-6 rounded-2xl font-bold text-base bg-[hsl(0,45%,40%)] hover:bg-[hsl(0,45%,34%)] text-white shadow-lg transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    `Bayar Sekarang — ${formatIDR(grandTotal)}`
                  )}
                </Button>

                <p className="text-center text-[10px] text-[hsl(25,21%,60%)] mt-3">
                  Dengan menekan tombol di atas, kamu menyetujui T&C kami
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
