import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Plugin lokal untuk simulasi Vercel API di Vite dev server
function mockApiPlugin() {
  return {
    name: 'mock-api',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/api/checkout' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ snapToken: 'MOCK-TOKEN-123', orderRef: 'LCL-MOCK-' + Date.now() }));
          return;
        }
        if (req.url?.startsWith('/api/order-status')) {
          res.setHeader('Content-Type', 'application/json');
          // Simulasi: otomatis status 'paid' di lokal
          res.end(JSON.stringify({ status: 'paid' }));
          return;
        }
        if (req.url === '/api/get-reader-url' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ signedUrl: '/Lingchinenese.pdf' }));
          return;
        }
        next();
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mockApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
