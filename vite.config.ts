import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 3000, // Adjust the limit as needed (in KB)
  },
});
