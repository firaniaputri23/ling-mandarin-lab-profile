-- ============================================================
-- Ling Chinese Lab — E-Book HSK Store Schema & RPC
-- Execute this entirely in your Supabase SQL Editor.
-- ============================================================

-- 1. Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 2. DDL: TABLE DEFINITIONS
-- ==========================================

-- A. Products Table
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  price       NUMERIC NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial products
-- (Using specific UUIDs so we can reference them from frontend if needed, 
-- or you can replace these IDs in frontend to match whatever gets generated)
INSERT INTO products (id, name, price, image_url) VALUES
  ('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'BUKU LIVE MANDARIN', 175000, ''),
  ('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'NEW HSK 1 TEXTBOOK', 25000, ''),
  ('c1d2e3f4-a5b6-4c7d-8e9f-1a2b3c4d5e6f', 'NEW HSK 2 TEXTBOOK', 35000, ''),
  ('d1e2f3a4-b5c6-4d7e-8f9a-2b3c4d5e6f7a', 'NEW HSK 3 TEXTBOOK', 35000, '')
ON CONFLICT (id) DO NOTHING;


-- B. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name          TEXT NOT NULL,
  buyer_email         TEXT NOT NULL,
  buyer_phone         TEXT NOT NULL,
  shipping_address    TEXT NOT NULL,
  total_amount        NUMERIC NOT NULL,
  status              TEXT NOT NULL DEFAULT 'PENDING',
  midtrans_snap_token TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- C. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  price       NUMERIC NOT NULL
);


-- ==========================================
-- 3. ATOMIC RPC FUNCTION
-- ==========================================
-- Creates an order and its items in a single atomic transaction.
-- If any part fails, the entire transaction rolls back.
-- SECURITY DEFINER allows it to bypass RLS when called via the API.

CREATE OR REPLACE FUNCTION create_order_atomic(
  p_buyer_name       TEXT,
  p_buyer_email      TEXT,
  p_buyer_phone      TEXT,
  p_shipping_address TEXT,
  p_total_amount     NUMERIC,
  p_items            JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item     JSONB;
BEGIN
  -- 1. Insert the parent order
  INSERT INTO orders (
    buyer_name, buyer_email, buyer_phone, shipping_address, total_amount, status
  ) VALUES (
    p_buyer_name, p_buyer_email, p_buyer_phone, p_shipping_address, p_total_amount, 'PENDING'
  )
  RETURNING id INTO v_order_id;

  -- 2. Loop through the items JSONB array and insert order_items
  -- Expecting p_items format: [{"product_id": "uuid...", "quantity": 1, "price": 175000}, ...]
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id, product_id, quantity, price
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      (v_item->>'quantity')::INTEGER,
      (v_item->>'price')::NUMERIC
    );
  END LOOP;

  -- 3. Return the generated Order ID
  RETURN v_order_id;
END;
$$;


-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

-- Orders and Items are fully locked down by default.
-- Only accessible via the `create_order_atomic` RPC (Security Definer) 
-- and via Edge Functions using the SERVICE_ROLE key.
CREATE POLICY "Service role can manage orders" ON orders 
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage order items" ON order_items 
  FOR ALL USING (auth.role() = 'service_role');
