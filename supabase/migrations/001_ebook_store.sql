-- ============================================================
-- Ling Chinese Lab — E-Book HSK Store Schema
-- Run these SQL commands in Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Products ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,              -- matches frontend product IDs e.g. "prod-001"
  name        TEXT NOT NULL,
  description TEXT,
  price       INTEGER NOT NULL,              -- in IDR (Rupiah), no decimals
  image_url   TEXT,
  category    TEXT NOT NULL DEFAULT 'addon', -- 'featured' | 'addon'
  badge       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial products (must match PRODUCT_PRICES in Edge Function)
INSERT INTO products (id, name, description, price, category, badge) VALUES
  ('prod-001',  'BUKU LIVE MANDARIN', 'Easy Learning Chinese — buku panduan belajar Mandarin lengkap dari Ling Chinese Lab.', 175000, 'featured', 'BEST SELLER'),
  ('prod-hsk1', 'NEW HSK 1 TEXTBOOK', 'Buku teks resmi HSK Level 1 — kuasai 150 kosakata dasar Mandarin.',                25000,  'addon',    'NEW'),
  ('prod-hsk2', 'NEW HSK 2 TEXTBOOK', 'Buku teks resmi HSK Level 2 — tingkatkan kemampuan dengan 300 kosakata.',             35000,  'addon',    'NEW'),
  ('prod-hsk3', 'NEW HSK 3 TEXTBOOK', 'Buku teks resmi HSK Level 3 — capai 600 kosakata dan komunikasi aktif.',              35000,  'addon',    'NEW')
ON CONFLICT (id) DO NOTHING;

-- ── Orders ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name       TEXT NOT NULL,
  buyer_email      TEXT NOT NULL,
  buyer_phone      TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  total_amount     INTEGER NOT NULL,          -- in IDR
  discount_amount  INTEGER NOT NULL DEFAULT 0,
  convenience_fee  INTEGER NOT NULL DEFAULT 2500,
  status           TEXT NOT NULL DEFAULT 'PENDING',
  -- Allowed statuses: PENDING | SUCCESS | SETTLEMENT | FAILED | EXPIRED
  midtrans_id      TEXT UNIQUE,               -- Midtrans order_id (e.g. LCL-1234567890-ABCD)
  snap_token       TEXT,
  voucher_code     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Order Items ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price       INTEGER NOT NULL,              -- snapshot of price at purchase time
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ───────────────────────────────────────
-- Only allow service_role (Edge Functions) to write; public cannot read orders
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);

-- Orders: only service role can access (Edge Functions use service_role key)
CREATE POLICY "Orders accessible by service role only" ON orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Order items accessible by service role only" ON order_items
  FOR ALL USING (auth.role() = 'service_role');

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_midtrans_id ON orders(midtrans_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);
