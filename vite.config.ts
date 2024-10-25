import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config.ts";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  plugins: [react(), crx({ manifest })],
  build: {
    outDir: "build",
    emptyOutDir: true,
    manifest: false,
  },
});
