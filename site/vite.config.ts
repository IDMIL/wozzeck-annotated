import { defineConfig } from "vite";
import { resolve } from 'node:path';

export default defineConfig({
    root: ".",
    base: './', // Add this line to set the base path to relative
    build: {
      rollupOptions: {
          input: {
              main: resolve(__dirname, 'index.html'),
              // Add other HTML files here
              french: resolve(__dirname, 'fr.html'),
              english: resolve(__dirname, 'en.html'),
          },
      },
    outDir: "dist",
  },
});
