import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart, CartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// Tipe untuk data produk dari tabel public.products
type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  cover_url: string;
};

// Mock data untuk fallback jika tabel products kosong
const mockProduct: Product = {
  id: "mock-123",
  slug: "test-katalog",
  title: "E-Book: Rahasia Huruf Mandarin (Vol. 1)",
  description: "Buku panduan komprehensif menguasai dasar-dasar huruf Mandarin (Hanzi). Cocok pemula–menengah, 10 unsur radikal, Step menulis, Latihan soal + kunci.",
  price: 60000,
  cover_url: "/coverling.png"
};

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, slug, title, description, price, cover_url')
          .eq('is_active', true);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Jika kosong, pakai mock untuk testing UI
          setProducts([mockProduct]);
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setProducts([mockProduct]); // Fallback ke mock
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const item: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      cover_url: product.cover_url,
      slug: product.slug
    };
    addToCart(item);
    toast.success("Berhasil ditambahkan ke keranjang");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Store */}
      <div className="bg-cream border-b py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary">OFFICIAL STORE</h1>
            <p className="text-muted-foreground mt-2 text-lg">Ling Chinese Lab</p>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 relative bg-white"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </div>

      {/* Catalog */}
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
        {loading ? (
          <div className="text-center text-muted-foreground py-20">Memuat katalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-soft overflow-hidden border border-border transition-smooth hover:shadow-lg flex flex-col">
                <div className="aspect-[3/4] bg-sand flex items-center justify-center relative p-6">
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border-none">
                    BEST SELLER
                  </Badge>
                  {product.cover_url ? (
                    <img src={product.cover_url} alt={product.title} className="w-full h-full object-cover rounded-lg shadow-sm" />
                  ) : (
                    <div className="w-full h-full bg-cream rounded-lg shadow-inner flex flex-col items-center justify-center text-primary/40 border-2 border-dashed border-primary/20">
                      <span className="text-xl font-bold tracking-widest uppercase">E-Book</span>
                      <span className="mt-2 text-sm text-center px-4">{product.title}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    
                    {/* Mock fitur */}
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-foreground/80 gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Cocok pemula–menengah</li>
                      <li className="flex items-center text-sm text-foreground/80 gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 10 unsur radikal & Step menulis</li>
                      <li className="flex items-center text-sm text-foreground/80 gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Latihan soal + kunci</li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-2xl font-black text-primary mb-4">{formatPrice(product.price)}</p>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
