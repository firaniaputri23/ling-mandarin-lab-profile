import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdfjs, Document, Page } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ZoomIn, ZoomOut, BookOpen, Scroll, ChevronLeft } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Wrapper komponen halaman untuk HTMLFlipBook (wajib pakai forwardRef)
const PdfPageWrapper = React.forwardRef<HTMLDivElement, { pageNum: number, height: number }>(
  ({ pageNum, height }, ref) => {
    return (
      <div ref={ref} className="bg-white overflow-hidden shadow-inner cursor-pointer" data-density="soft">
        <Page 
          pageNumber={pageNum} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="pointer-events-none flex items-center justify-center w-full h-full [&_.react-pdf__Page__canvas]:!w-full [&_.react-pdf__Page__canvas]:!h-full [&_.react-pdf__Page__canvas]:!object-fill"
          height={height} // Patokan tinggi dinamis 
        />
      </div>
    );
  }
);
PdfPageWrapper.displayName = 'PdfPageWrapper';

export default function Read() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk fitur advanced
  const [viewMode, setViewMode] = useState<'flip' | 'scroll'>(window.innerWidth < 768 ? 'scroll' : 'flip');
  const [scale, setScale] = useState(1.0);
  const [currentPageScroll, setCurrentPageScroll] = useState(1);
  const [bookDim, setBookDim] = useState({ width: 450, height: 636 });
  
  const buyerEmail = "user@example.com"; 
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    // Responsive otomatis
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      // Jangan paksa ubah viewMode jika user yang klik manual, tapi sesuaikan ukuran buku
      const w = Math.min(450, window.innerWidth - 32); 
      setBookDim({ width: w, height: w * (636 / 450) });
    };
    handleResize(); // trigger once
    window.addEventListener('resize', handleResize);
    
    // Anti klik kanan
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        setLoading(true);
        const productId = slug === 'test' ? 'test-katalog' : slug;
        
        const res = await fetch('/api/get-reader-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, email: buyerEmail })
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to get PDF URL');
        }
        
        const data = await res.json();
        setPdfUrl(data.signedUrl);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUrl();
  }, [slug]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.6));

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">Loading e-book...</div>;
  if (!pdfUrl) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white gap-4">
      <h2>Akses Ditolak / E-Book Tidak Ditemukan</h2>
      <Button variant="outline" onClick={() => navigate('/library')}>Kembali ke Library</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center select-none overflow-hidden">
      
      {/* HEADER / TOOLBAR */}
      <header className="w-full bg-zinc-950 text-white p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-50 border-b border-zinc-800 shadow-xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/library')} className="text-zinc-400 hover:text-white">
            <ChevronLeft className="w-4 h-4 mr-1" /> Library
          </Button>
          <h1 className="font-bold text-sm md:text-base truncate max-w-[150px] md:max-w-xs">{slug}</h1>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <Button 
            variant={viewMode === 'flip' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => { setViewMode('flip'); setScale(1.0); }}
            title="Mode Buku (Desktop)"
            className={viewMode === 'flip' ? 'bg-zinc-800' : ''}
          >
            <BookOpen className="w-4 h-4 mr-2" /> Flip
          </Button>
          <Button 
            variant={viewMode === 'scroll' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('scroll')}
            title="Mode Gulir (Mobile/Zoom)"
            className={viewMode === 'scroll' ? 'bg-zinc-800' : ''}
          >
            <Scroll className="w-4 h-4 mr-2" /> Scroll
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={scale <= 0.6} title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={scale >= 2.5} title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* VIEWER AREA */}
      <main className="flex-1 w-full flex justify-center overflow-auto relative p-4 md:p-8">
        
        {/* WATERMARK ANTI-SCREENSHOT (Tetap di luar container supaya menimpa semuanya) */}
        <div className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center opacity-[0.03] rotate-[-30deg]">
          <p className="text-4xl md:text-8xl font-black text-white break-all text-center">{buyerEmail}</p>
          <p className="text-2xl md:text-6xl font-bold text-white mt-4">Ling Chinese Lab</p>
        </div>

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => toast.error('Gagal memuat PDF: ' + error.message)}
          className={`flex flex-col items-center transition-transform duration-300 w-full`}
          style={{ transform: `scale(${viewMode === 'scroll' ? scale : 1})`, transformOrigin: 'top center' }}
        >
          {numPages && viewMode === 'flip' ? (
            <div className="flex items-center justify-center gap-2 md:gap-8 w-full max-w-7xl relative" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
              
              <Button 
                variant="secondary" 
                size="icon"
                className="hidden md:flex rounded-full shadow-lg z-10 w-12 h-12 bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-110 transition shrink-0" 
                onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <div className="flex justify-center shadow-2xl relative shrink-0">
                {/* @ts-ignore */}
                <HTMLFlipBook 
                  width={bookDim.width} 
                  height={bookDim.height} 
                  size="fixed"
                  maxShadowOpacity={0.3}
                  showCover={true}
                  mobileScrollSupport={false}
                  useMouseEvents={true}
                  usePortrait={true} // Boleh portrait (1 halaman) di HP
                  ref={flipBookRef}
                  className="bg-transparent"
                  style={{ margin: '0 auto' }}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <PdfPageWrapper key={`page_${index + 1}`} pageNum={index + 1} height={bookDim.height} />
                  ))}
                </HTMLFlipBook>
              </div>

              <Button 
                variant="secondary" 
                size="icon"
                className="hidden md:flex rounded-full shadow-lg z-10 w-12 h-12 bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-110 transition shrink-0" 
                onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
              >
                <ChevronLeft className="w-8 h-8 rotate-180" />
              </Button>

              {/* Tombol mobile di bawah buku */}
              <div className="md:hidden absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
                <Button variant="secondary" onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}>&lt; Prev</Button>
                <Button variant="secondary" onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}>Next &gt;</Button>
              </div>
            </div>
          ) : null}

          {numPages && viewMode === 'scroll' ? (
            <div className="flex flex-col gap-6 items-center w-full max-w-4xl pb-20">
              <Page 
                pageNumber={currentPageScroll} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-2xl bg-white rounded-sm overflow-hidden"
                width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 800) : 800}
              />
              
              <div className="flex items-center gap-4 bg-zinc-950 p-2 rounded-full shadow-lg border border-zinc-800 pointer-events-auto">
                <Button 
                  disabled={currentPageScroll <= 1} 
                  onClick={() => setCurrentPageScroll(p => p - 1)}
                  variant="ghost" size="sm" className="text-white hover:bg-zinc-800"
                >
                  &lt; Prev
                </Button>
                <p className="text-sm font-medium text-zinc-300">
                  {currentPageScroll} / {numPages}
                </p>
                <Button 
                  disabled={currentPageScroll >= numPages} 
                  onClick={() => setCurrentPageScroll(p => p + 1)}
                  variant="ghost" size="sm" className="text-white hover:bg-zinc-800"
                >
                  Next &gt;
                </Button>
              </div>
            </div>
          ) : null}
        </Document>

      </main>
    </div>
  );
}
