import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Check if running on Windows
const isWindows = process.platform === "win32";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: isWindows ? "localhost" : "0.0.0.0",
    open: true,
    strictPort: false,
    hmr: {
      overlay: true,
      clientPort: 3001,
      host: "localhost",
    },
    watch: {
      usePolling: true, // Enable polling for Windows
      interval: 100, // Check for changes every 100ms
    },
    allowedHosts: [
      "www.erieweddingofficiants.com",
      "erieweddingofficiants.com",
      "localhost",
    ],
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@heroicons/react", "react-icons"],
          stripe: ["@stripe/stripe-js", "@stripe/react-stripe-js"],
          utils: ["axios", "sweetalert2"],
        },
      },
    },
  },
  preview: {
    port: 3001,
    host: "0.0.0.0",
  },
});
