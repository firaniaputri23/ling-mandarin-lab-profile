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
    const { productId, email } = req.body;

    // For testing/mock purposes as requested by user
    if (productId === 'test-katalog' || productId === 'rahasia-huruf-mandarin-vol-1') {
      return res.status(200).json({ signedUrl: '/Katalog.pdf' });
    }

    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check entitlement
    const { data: entitlement, error: entError } = await supabase
      .from('entitlements')
      .select('*')
      .eq('product_id', productId)
      .eq('buyer_email', email)
      .single();

    if (entError || !entitlement) {
      return res.status(403).json({ error: 'Forbidden. You do not have access to this product.' });
    }

    // Get the product pdf_path
    const { data: product } = await supabase
      .from('products')
      .select('pdf_path')
      .eq('id', productId)
      .single();

    if (!product || !product.pdf_path) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Create signed url
    const { data: signedUrlData, error: signError } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(product.pdf_path, 120); // 120 seconds

    if (signError || !signedUrlData) {
      return res.status(500).json({ error: 'Failed to generate signed URL' });
    }

    return res.status(200).json({ signedUrl: signedUrlData.signedUrl });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
