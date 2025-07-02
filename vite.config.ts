/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "@bangjelkoski/vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["buffer"],
  },
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    nodePolyfills({ protocolImports: true }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer/",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
