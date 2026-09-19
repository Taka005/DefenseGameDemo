import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    port: 8080,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
      manualChunks(id) {
          if (id.includes("node_modules/phaser")) {
            return "phaser";
          }
          
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  }
});