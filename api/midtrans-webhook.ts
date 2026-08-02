import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { order_id, status_code, gross_amount, transaction_status, fraud_status, signature_key, transaction_id } = req.body;

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hash = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest('hex');

    if (hash !== signature_key) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Process status
    if (transaction_status == 'capture' || transaction_status == 'settlement') {
      if (fraud_status == 'accept' || !fraud_status) {
        // paid
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .update({ 
            status: 'paid', 
            paid_at: new Date().toISOString(),
            midtrans_transaction_id: transaction_id 
          })
          .eq('order_ref', order_id)
          .select()
          .single();
          
        if (!orderError && order) {
          // create entitlement
          await supabase.from('entitlements').upsert({
            buyer_email: order.buyer_email,
            product_id: order.product_id,
            order_id: order.id
          }, { onConflict: 'buyer_email, product_id' });
          
          // Here we could send an email with resend if needed
        }
      }
    } else if (transaction_status == 'cancel' || transaction_status == 'deny' || transaction_status == 'expire') {
      // update status to failed or expired
      await supabase
        .from('orders')
        .update({ status: transaction_status === 'expire' ? 'expired' : 'failed' })
        .eq('order_ref', order_id);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
