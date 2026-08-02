import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

type LibraryItem = {
  id: string;
  slug: string;
  title: string;
  cover_url: string;
  granted_at: string;
};

export default function Library() {
  const navigate = useNavigate();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcode user email untuk tahap demonstrasi karena Auth belum full disetup
  const userEmail = "user@example.com";

  useEffect(() => {
    async function fetchLibrary() {
      try {
        // Query entitlements join products
        // Di supabase, jika Foreign Key di-set, kita bisa query relation
        const { data, error } = await supabase
          .from('entitlements')
          .select(`
            granted_at,
            product:products (
              id,
              slug,
              title,
              cover_url
            )
          `)
          .eq('buyer_email', userEmail);

        if (error) {
          console.error("Error fetching library", error);
          // Fallback mock agar UI terlihat jika tabel kosong atau relasi gagal
          setItems([{
            id: 'mock-1',
            slug: 'test', // ini akan load Lingchinenese.pdf (mock)
            title: 'E-Book: Rahasia Huruf Mandarin (Vol. 1)',
            cover_url: '/coverling.png',
            granted_at: new Date().toISOString()
          }]);
          return;
        }

        if (data && data.length > 0) {
          const formattedItems = data.map((item: any) => ({
            id: item.product.id,
            slug: item.product.slug,
            title: item.product.title,
            cover_url: item.product.cover_url,
            granted_at: item.granted_at
          }));
          setItems(formattedItems);
        } else {
          // Jika kosong, kita tetap tampilkan mock file Lingchinenese.pdf untuk demo Prompt C
          setItems([{
            id: 'mock-1',
            slug: 'test', 
            title: 'E-Book: Rahasia Huruf Mandarin (Vol. 1) - Demo',
            cover_url: '/coverling.png',
            granted_at: new Date().toISOString()
          }]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLibrary();
  }, [userEmail]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Memuat Library...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-cream border-b py-10 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-primary">Library Anda</h1>
          <p className="text-muted-foreground mt-2">Buku digital (E-Book) yang telah Anda beli.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 md:px-8">
        {items.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-soft border border-border">
            <BookOpen className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Library Kosong</h3>
            <p className="text-muted-foreground mb-6">Anda belum memiliki E-Book. Kunjungi Store untuk melihat koleksi kami.</p>
            <Button onClick={() => navigate('/store')}>Jelajahi Store</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-soft border border-border flex flex-col transition hover:shadow-md">
                <div className="aspect-[3/4] bg-sand flex items-center justify-center relative rounded-lg overflow-hidden mb-6">
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-primary/50">
                      <BookOpen className="w-12 h-12 mb-2" />
                      <span className="text-sm font-bold uppercase tracking-wider">E-Book</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2 flex-1">{item.title}</h3>
                
                <p className="text-xs text-muted-foreground mb-6">
                  Diperoleh: {new Date(item.granted_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm"
                  onClick={() => navigate(`/read/${item.slug}`)}
                >
                  Baca Sekarang
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
