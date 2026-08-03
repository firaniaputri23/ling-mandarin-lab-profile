import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderRef } = req.query;

    if (!orderRef || typeof orderRef !== 'string') {
      return res.status(400).json({ error: 'orderRef is required' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('status')
      .eq('order_ref', orderRef)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({ status: order.status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
