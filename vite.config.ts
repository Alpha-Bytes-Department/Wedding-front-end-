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
    target: "esnext",
    minify: "esbuild", // Use esbuild for faster builds (already included in Vite)
    cssCodeSplit: true, // Split CSS for better caching
    sourcemap: false, // Disable sourcemaps in production for smaller files
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],

          // UI libraries
          "vendor-icons": ["@heroicons/react", "react-icons"],

          // Heavy dependencies that should be separate
          "vendor-firebase": ["firebase/app", "firebase/auth"],
          "vendor-socket": ["socket.io-client"],
          "vendor-stripe": ["@stripe/stripe-js", "@stripe/react-stripe-js"],
          "vendor-swal": ["sweetalert2"],

          // Utilities
          "vendor-utils": ["axios", "react-hook-form"],
          "vendor-pdf": ["jspdf", "html2canvas"],

          // Swiper for slider
          "vendor-swiper": ["swiper"],
        },
        // Optimize chunk file names for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  preview: {
    port: 3001,
    host: "0.0.0.0",
  },
});
