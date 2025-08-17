import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    open: true,
    https: false,
    // proxy: {
    //   "/api": "http://localhost:8080",
    // },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust the limit as needed (in KB)
  },
});
