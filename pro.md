# Prompt Pengembangan — E-Book Berbayar + Checkout Midtrans + In-Browser PDF Reader (Serverless)

> Dokumen ini berisi **3 prompt siap-pakai** untuk dipaste ke AI coding tool (Lovable / Cursor / Claude Code / v0):
> 1. **Prompt A — Arsitektur & Backend Serverless** (Supabase + Vercel Functions, tanpa VPS)
> 2. **Prompt B — Frontend UI** (Store, Cart, Checkout, halaman unlock)
> 3. **Prompt C — In-Browser PDF Reader** (baca e-book di web, anti-download langsung)
>
> Codebase sudah ada: **Vite + React 18 + TypeScript + Tailwind + shadcn/ui**, deploy ke **Vercel**, palet warna nude pastel (cream `#F5F5EB`, warm-brown `#B3907A`, beige, sand — sudah jadi CSS variables di `src/index.css`). Routing pakai `react-router-dom`. Belum ada halaman store/checkout/reader/backend.

---

## Konteks Arsitektur (WAJIB dibaca AI sebelum coding)

**Kendala keras:** TIDAK BOLEH pakai VPS / server yang selalu menyala. Harus 100% serverless.

**Solusi stack (semua serverless, free-tier friendly):**

| Kebutuhan | Teknologi | Kenapa |
|---|---|---|
| Hosting frontend | **Vercel** (sudah dipakai, ada `vercel.json`) | Static + serverless functions |
| API / backend logic | **Vercel Serverless Functions** (folder `/api`) | Jalan on-demand, no VPS |
| Database | **Supabase Postgres** | Managed, serverless, gratis 500MB |
| Auth pembeli | **Supabase Auth (magic link / OTP email)** | Tanpa password, cocok e-book |
| Penyimpanan file PDF | **Supabase Storage (private bucket)** | File PDF TIDAK public, hanya diakses via signed URL |
| Payment gateway | **Midtrans Snap** | Sesuai requirement |
| Pengiriman produk | Email/WhatsApp + akses in-app | Setelah `settlement` |

**Prinsip keamanan inti:** PDF asli **tidak pernah** diletakkan di folder `public/` atau bucket publik. PDF disimpan di **private Supabase Storage**. User hanya bisa membacanya lewat **signed URL berumur pendek** yang di-generate serverless function SETELAH memverifikasi bahwa user sudah membayar (cek tabel `orders.status = 'paid'`). Jadi meski frontend statis, file tetap terkunci di server.

---

## PROMPT A — Arsitektur & Backend Serverless (Supabase + Vercel Functions)

```
Kamu adalah senior full-stack engineer. Aku punya project Vite + React 18 + TypeScript + Tailwind + shadcn/ui yang di-deploy ke Vercel. Aku mau menambahkan sistem penjualan e-book PDF berbayar dengan syarat MUTLAK: arsitektur 100% SERVERLESS, TIDAK BOLEH pakai VPS atau server yang selalu menyala. Gunakan Supabase (Postgres + Auth + Storage) dan Vercel Serverless Functions (folder /api).

TUGAS: Rancang & buat seluruh backend + skema database + serverless functions.

=== 1. SKEMA DATABASE (Supabase Postgres) ===
Buat file migration SQL. Tabel yang dibutuhkan:

- products
  - id (uuid, pk)
  - slug (text, unique)            -- "rahasia-huruf-mandarin-vol-1"
  - title (text)
  - description (text)
  - price (integer)               -- dalam rupiah, cth 60000
  - cover_url (text)              -- boleh public (cover only)
  - pdf_path (text)               -- path di private bucket, cth "ebooks/rahasia-vol1.pdf"
  - is_active (boolean, default true)
  - created_at (timestamptz, default now())

- orders
  - id (uuid, pk)
  - order_ref (text, unique)      -- yang dikirim ke Midtrans (order_id), cth "LCL-<timestamp>-<rand>"
  - product_id (uuid, fk -> products)
  - buyer_email (text)
  - buyer_name (text)
  - buyer_whatsapp (text)
  - amount (integer)
  - status (text)                 -- 'pending' | 'paid' | 'failed' | 'expired'
  - midtrans_transaction_id (text, nullable)
  - snap_token (text, nullable)
  - paid_at (timestamptz, nullable)
  - created_at (timestamptz, default now())

- entitlements  (siapa boleh baca apa)
  - id (uuid, pk)
  - user_id (uuid, nullable, fk -> auth.users)  -- diisi saat user login
  - buyer_email (text)                          -- fallback identifikasi via email
  - product_id (uuid, fk -> products)
  - order_id (uuid, fk -> orders)
  - granted_at (timestamptz, default now())
  - UNIQUE(buyer_email, product_id)

Aktifkan Row Level Security (RLS):
- products: SELECT boleh untuk semua (public read; tapi kolom pdf_path JANGAN diekspos ke client — gunakan view/kolom terpisah, atau hanya di-query dari service role di server).
- orders & entitlements: TIDAK ADA akses langsung dari anon client. Semua akses lewat serverless function pakai SERVICE ROLE KEY (disimpan di Vercel env var, bukan di client).

=== 2. SUPABASE STORAGE ===
Buat bucket PRIVATE bernama "ebooks" (public = false). PDF asli diupload ke sini. Client TIDAK PERNAH punya akses langsung; hanya bisa via signed URL yang di-generate function di poin 3d.

=== 3. VERCEL SERVERLESS FUNCTIONS (folder /api) ===
Semua pakai TypeScript. Baca secret dari process.env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION.

a) POST /api/checkout
   - Terima: { productId, buyerEmail, buyerName, buyerWhatsapp }
   - Validasi input (zod). Ambil harga produk dari DB (JANGAN percaya harga dari client).
   - Buat order_ref unik. Insert row orders (status 'pending').
   - Panggil Midtrans Snap API (create transaction) pakai MIDTRANS_SERVER_KEY, item_details = produk, customer_details = buyer.
   - Simpan snap_token ke order. Return { snapToken, orderRef } ke client.

b) POST /api/midtrans-webhook  (HTTP Notification dari Midtrans — INI KUNCI serverless-nya)
   - Endpoint publik yang dipanggil server Midtrans saat status pembayaran berubah.
   - WAJIB verifikasi signature_key = sha512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY). Tolak kalau tidak cocok.
   - Kalau transaction_status == 'settlement' atau 'capture' (fraud_status 'accept'):
       * update orders.status = 'paid', paid_at = now(), simpan midtrans_transaction_id
       * insert/upsert row entitlements (buyer_email + product_id)
       * trigger pengiriman notifikasi (lihat poin e)
   - Kalau 'expire'/'cancel'/'deny' -> update status sesuai.
   - Idempotent: aman kalau webhook dipanggil berkali-kali (jangan dobel-grant).

c) GET /api/order-status?orderRef=...
   - Return { status } untuk polling dari halaman "menunggu pembayaran".

d) POST /api/get-reader-url
   - Terima: { productId } + auth (token Supabase user ATAU email terverifikasi via magic link).
   - Cek di entitlements apakah user/email ini punya akses ke productId.
   - Kalau YA: generate SIGNED URL Supabase Storage untuk pdf_path, expiry SINGKAT (cth 60–120 detik). Return { signedUrl }.
   - Kalau TIDAK: return 403.
   - Ini memastikan hanya pembeli yang bisa mengakses PDF, meski frontend statis.

e) Pengiriman produk setelah bayar (dipanggil dari webhook):
   - Kirim email ke buyer_email berisi link "Baca E-Book" (mengarah ke /library atau /read/:slug) + magic link login Supabase.
   - Gunakan Supabase Auth admin generateLink (magic link) ATAU layanan email serverless (Resend API). Jangan pakai SMTP server sendiri.
   - (Opsional) trigger pesan WhatsApp via API pihak ketiga yang berbasis HTTP (mis. Fonnte/Wablas) — cukup HTTP call dari function, tetap serverless.

=== 4. ENV & KEAMANAN ===
- Buat file .env.example berisi semua nama env var (tanpa nilai).
- SUPABASE_SERVICE_ROLE_KEY & MIDTRANS_SERVER_KEY HANYA dipakai di /api (server-side). JANGAN pernah di-bundle ke client. Client cukup pakai VITE_SUPABASE_ANON_KEY & VITE_MIDTRANS_CLIENT_KEY.
- Tambahkan dokumentasi singkat di README: cara set env di Vercel, cara set URL webhook di dashboard Midtrans, cara upload PDF ke bucket private.

DELIVERABLE: file SQL migration, semua file di /api, helper client Supabase (src/lib/supabase.ts), .env.example, dan update README. Beri komentar jelas di tiap function.
```

---

## PROMPT B — Frontend UI (Store, Cart, Checkout, Unlock)

```
Lanjutkan project yang sama (Vite + React + TS + Tailwind + shadcn/ui, deploy Vercel, backend Supabase + Vercel Functions sudah dibuat di prompt sebelumnya). Sekarang buat UI frontend-nya.

BRAND & DESIGN SYSTEM (WAJIB dipatuhi, sudah ada di src/index.css):
- Palet nude pastel: cream #F5F5EB (background), sand #EFE7DA, beige #C1B6A3, warm-brown #B3907A (primary), teks warm-brown gelap. Gunakan CSS variables yang sudah ada (bg-background, text-foreground, bg-primary, dst) dan token custom (cream, sand, beige, warm-brown, light-beige).
- Aksen merah maroon untuk tombol utama & harga (gunakan warna existing brand seperti di HeroSection). Sudut membulat (--radius: 1rem). Font & tone hangat, ramah, sedikit playful (ada maskot panda "Ling"). Logo di public/logo.png & public/logoPandaOnly.png.
- Gunakan komponen shadcn/ui yang SUDAH ADA di src/components/ui (button, card, input, label, dialog, drawer, sonner/toast, checkbox, form, badge, separator, dll). Reuse Navbar & Footer yang sudah ada.
- Responsive mobile-first. Bahasa Indonesia.

TAMBAHKAN ROUTE BARU di src/App.tsx (di atas catch-all "*"):
- /store            -> halaman katalog/produk
- /checkout         -> halaman checkout
- /payment/pending  -> menunggu konfirmasi pembayaran (polling /api/order-status)
- /library          -> daftar e-book milik user (setelah login/beli)
- /read/:slug       -> reader (dibuat di prompt C)

=== HALAMAN 1: /store (Official Store) ===
Tiru gaya screenshot yang sudah kami buat:
- Header "OFFICIAL STORE — Ling Chinese Lab".
- Kartu produk unggulan "E-Book: Rahasia Huruf Mandarin (Vol. 1)" dengan:
  * gambar cover (cover_url), badge "BEST SELLER"
  * judul, deskripsi singkat, bullet fitur (✓ Cocok pemula–menengah, ✓ 10 unsur radikal, ✓ Step menulis, ✓ Latihan soal + kunci)
  * harga "Rp 60.000"
  * tombol "Tambah ke Keranjang" (warm/maroon)
- Ambil data produk dari Supabase (tabel products, hanya kolom aman: title, description, price, cover_url, slug — JANGAN pdf_path).

=== HALAMAN 2: Keranjang (Cart) ===
- Implement sebagai Drawer/Sheet (shadcn `drawer` atau `sheet`) yang muncul dari bawah/samping.
- Tampilkan: thumbnail + judul + harga, qty (untuk e-book kunci qty=1), subtotal, biaya layanan (opsional, cth Rp 2.500), Grand Total.
- Tombol hijau "Lanjut Pembayaran — Rp XX.XXX" -> ke /checkout.
- State cart pakai React state / context (produk digital, boleh cukup 1 item). JANGAN pakai localStorage untuk data sensitif; cart boleh di memory.

=== HALAMAN 3: /checkout ===
Tiru layout screenshot checkout kami, 2 kolom (di mobile jadi 1 kolom):
- Kolom kiri "Data Pembeli" (react-hook-form + zod):
  * Email (required, validasi email)
  * Nama Lengkap (required)
  * Nomor HP / WhatsApp (required, validasi angka)
  * Alamat Pengiriman: karena produk DIGITAL (PDF), TAMPILKAN CATATAN "Produk digital — tidak perlu alamat pengiriman fisik." dan sembunyikan/opsional-kan field alamat. (Jangan wajibkan alamat.)
  * Kode Voucher (opsional).
- Kolom kanan "Rincian Pesanan":
  * item + harga, subtotal, diskon voucher, biaya layanan, Grand Total (maroon, tebal).
  * Badge "Pembayaran diproses aman via Midtrans · QRIS · Transfer Bank · GoPay · OVO · Dana".
  * Checkbox WAJIB: "Saya menyetujui Syarat & Ketentuan" + "Saya menyetujui Kebijakan Privasi".
  * Tombol "Bayar Sekarang — Rp XX.XXX" (disabled sampai form valid & checkbox dicentang).
- Saat submit:
  1. POST ke /api/checkout dengan data pembeli + productId.
  2. Terima { snapToken }.
  3. Muat Midtrans Snap.js (script https://app.sandbox.midtrans.com/snap/snap.js untuk sandbox, atau production URL; pakai VITE_MIDTRANS_CLIENT_KEY di atribut data-client-key).
  4. Panggil window.snap.pay(snapToken, { onSuccess, onPending, onError, onClose }).
  5. onSuccess/onPending -> navigate ke /payment/pending?orderRef=...

ALUR UX YANG HARUS TERGAMBAR (tampilkan juga sebagai stepper/indikator di UI kalau memungkinkan):
  1. Customer memilih produk E-Book PDF di store.
  2. Masukkan ke keranjang -> halaman Checkout.
  3. Isi Data Pembeli (Email, Nama, WhatsApp). Alamat fisik diabaikan karena produk digital.
  4. Setujui S&K -> klik "Bayar Sekarang".
  5. Diarahkan ke Midtrans (Snap popup) untuk memilih & menyelesaikan pembayaran (QRIS/Transfer/GoPay/OVO/Dana).
  6. Setelah pembayaran settlement, akses/file PDF dikirim via Email/WhatsApp DAN e-book langsung bisa dibuka di /library.

=== HALAMAN 4: /payment/pending ===
- Ambil orderRef dari query.
- Polling GET /api/order-status?orderRef=... setiap 3–5 detik.
- Tampilkan animasi loading + langkah alur di atas (stepper aktif di langkah 5).
- Jika status 'paid' -> tampilkan sukses + tombol "Buka E-Book Saya" -> /library, dan info "Link juga dikirim ke email & WhatsApp".
- Jika 'expired'/'failed' -> tampilkan gagal + tombol coba lagi -> /checkout.

=== HALAMAN 5: /library ===
- Butuh identitas user: login via Supabase magic link (masukkan email -> terima link). Atau kalau datang dari email dengan magic link, langsung ter-login.
- Setelah login, query entitlements milik user/email -> tampilkan daftar e-book yang dimiliki sebagai kartu, tombol "Baca" -> /read/:slug.
- Kalau belum punya e-book: empty state ramah + tombol ke /store.

DELIVERABLE: semua komponen halaman di src/pages & src/components, integrasi Snap.js, form validation, state cart, dan konsisten dengan design system nude pastel. Reuse Navbar/Footer. Beri toast (sonner) untuk feedback aksi.
```

---

## PROMPT C — In-Browser PDF Reader (baca e-book di web, anti-download langsung)

```
Lanjutkan project yang sama. Buat halaman reader e-book /read/:slug yang menampilkan PDF LANGSUNG DI DALAM WEB (bukan link download mentah), dengan proteksi agar hanya pembeli yang bisa membacanya dan file tidak gampang di-download utuh.

STACK: Tetap serverless. PDF asli ada di Supabase Storage PRIVATE bucket. Gunakan library render PDF sisi-client: react-pdf (berbasis pdf.js) atau @react-pdf-viewer/core. Tambahkan dependency yang perlu.

ALUR:
1. Saat halaman /read/:slug dibuka:
   - Pastikan user ter-autentikasi (Supabase session). Kalau belum, redirect ke /library untuk login magic link.
   - Panggil POST /api/get-reader-url dengan { productId (dari slug) } + auth token.
   - Backend cek entitlement. Kalau valid -> balikin SIGNED URL berumur pendek (60–120 detik). Kalau tidak -> 403 -> tampilkan halaman "Kamu belum memiliki e-book ini" + tombol ke /store.
2. Render PDF dari signed URL memakai react-pdf:
   - Tampilkan per halaman, dengan kontrol: << halaman sebelumnya, indikator "Halaman X / Total", halaman berikutnya >>, zoom +/-, dan mode continuous scroll (opsional).
   - Lazy-load halaman biar cepat.
   - Karena signed URL bisa expired saat sesi baca panjang, siapkan mekanisme "refresh signed URL" (panggil ulang /api/get-reader-url) saat load gagal / expired.
3. PROTEKSI (best-effort, akui keterbatasannya):
   - Nonaktifkan tombol download & print bawaan viewer.
   - Disable context menu (klik kanan) di area reader, disable text selection kalau perlu.
   - JANGAN pernah expose signed URL di UI yang gampang dicopy; render langsung.
   - Tambahkan watermark tipis overlay berisi email pembeli + "Ling Chinese Lab" di setiap halaman (menempel di layer atas canvas) sebagai deterrent.
   - Beri komentar jujur di kode: proteksi client-side tidak 100% anti-screenshot; keamanan utama = file di private storage + akses hanya via entitlement + signed URL pendek.

DESAIN:
- Konsisten dengan brand nude pastel. Toolbar reader minimalis di atas/bawah, sticky. Loading state pakai skeleton. Mobile-friendly (bisa swipe halaman).
- Header kecil: judul e-book + tombol "Kembali ke Library".

DELIVERABLE: src/pages/Read.tsx (atau ReaderPage), komponen viewer, integrasi react-pdf + pdf.js worker (set worker via CDN atau bundling agar tetap jalan di Vercel static), penanganan expiry signed URL, watermark overlay, dan proteksi context-menu/print/download. Update package.json dengan dependency baru.
```

---

## Catatan Implementasi Penting (untuk kamu, bukan buat AI)

1. **Webhook Midtrans adalah jantung sistem serverless.** Karena tidak ada server yang "menunggu", Midtrans yang **memanggil** endpoint `/api/midtrans-webhook` kamu saat status berubah. Set URL-nya di dashboard Midtrans → Settings → Configuration → Payment Notification URL: `https://www.lingchineselab.com/api/midtrans-webhook`.

2. **Upload PDF** dilakukan manual sekali ke bucket private `ebooks` (via dashboard Supabase atau script), lalu isi kolom `products.pdf_path`. PDF **tidak pernah** masuk ke `public/` atau git.

3. **Sandbox dulu.** Kembangkan pakai Midtrans Sandbox (`MIDTRANS_IS_PRODUCTION=false`) sebelum ganti ke production key.

4. **Free-tier cukup.** Vercel Hobby + Supabase Free bisa menjalankan ini tanpa biaya server bulanan — benar-benar tanpa VPS.

5. **Urutan pengerjaan:** Prompt A (backend + DB) → Prompt B (UI checkout) → Prompt C (reader). Uji tiap tahap sebelum lanjut.

6. **Env vars yang harus diset di Vercel:**
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MIDTRANS_SERVER_KEY`, `MIDTRANS_IS_PRODUCTION`, dan untuk client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_MIDTRANS_CLIENT_KEY`. (Opsional: `RESEND_API_KEY`, `WHATSAPP_API_KEY`.)
