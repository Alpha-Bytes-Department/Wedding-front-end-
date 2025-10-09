import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    strictPort: true,
    hmr: {
      clientPort: 3000
    },
    allowedHosts: ['www.erieweddingofficiants.com', 'erieweddingofficiants.com', 'localhost']
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@heroicons/react', 'react-icons'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          utils: ['axios', 'sweetalert2']
        }
      }
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  }
});
