// supabase/functions/webhook-midtrans/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Map Midtrans transaction_status → internal order status
function resolveOrderStatus(
  transactionStatus: string,
  fraudStatus?: string
): "SUCCESS" | "SETTLEMENT" | "FAILED" | "EXPIRED" | "PENDING" {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "SUCCESS" : "FAILED";
  }
  if (transactionStatus === "settlement") return "SETTLEMENT";
  if (transactionStatus === "cancel" || transactionStatus === "deny") return "FAILED";
  if (transactionStatus === "expire") return "EXPIRED";
  if (transactionStatus === "pending") return "PENDING";
  return "PENDING";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const notification = await req.json();
    console.log("[Webhook] Received Midtrans notification:", notification);

    const {
      order_id,
      transaction_status,
      fraud_status,
      signature_key,
      status_code,
      gross_amount,
    } = notification;

    // 1. Signature Verification for Security
    // Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY") ?? "";
    const rawString = `${order_id}${status_code}${gross_amount}${serverKey}`;
    
    // Use Web Crypto API native to Deno
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    if (signature_key !== expectedSignature) {
      console.error("[Webhook] Signature verification failed!");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Resolve Status
    const orderStatus = resolveOrderStatus(transaction_status, fraud_status);
    console.log(`[Webhook] Order ${order_id} → updating status to: ${orderStatus}`);

    // 3. Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Update the `status` column in the Supabase `orders` table
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: orderStatus })
      .eq("id", order_id);

    if (updateError) {
      console.error("[Webhook] Supabase update error:", updateError);
      throw new Error("Failed to update order status in database");
    }

    return new Response(JSON.stringify({ ok: true, status: orderStatus }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("[Webhook] Error:", err.message);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
