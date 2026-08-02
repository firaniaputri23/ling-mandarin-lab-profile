import { createClient } from '@supabase/supabase-js';
import midtransClient from 'midtrans-client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || ''
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { productId, buyerEmail, buyerName, buyerWhatsapp } = req.body;

    if (!productId || !buyerEmail || !buyerName || !buyerWhatsapp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const orderRef = `LCL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_ref: orderRef,
        product_id: productId,
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        buyer_whatsapp: buyerWhatsapp,
        amount: product.price,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const parameter = {
      transaction_details: {
        order_id: orderRef,
        gross_amount: product.price
      },
      customer_details: {
        first_name: buyerName,
        email: buyerEmail,
        phone: buyerWhatsapp
      },
      item_details: [{
        id: product.id,
        price: product.price,
        quantity: 1,
        name: product.title
      }]
    };

    const transaction = await snap.createTransaction(parameter);

    await supabase
      .from('orders')
      .update({ snap_token: transaction.token })
      .eq('id', order.id);

    return res.status(200).json({
      snapToken: transaction.token,
      orderRef
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
