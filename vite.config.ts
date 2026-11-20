import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: { port: 5177, strictPort: true },

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@src": path.resolve(import.meta.dirname, "src"),
      "@libs": path.resolve(import.meta.dirname, "src/libs"),
      "@views": path.resolve(import.meta.dirname, "src/views"),
    },
  },
});
