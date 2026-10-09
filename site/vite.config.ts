import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    base: './', // Add this line to set the base path to relative
    build: {
      rollupOptions: {
          input: {
              main: 'index.html',
              // Add other HTML files here
              french: 'fr.html',
              english: 'en.html',
              german: 'de.html',
              portuguese: 'pt.html',
              info_french: 'info/fr.html',
              info_english: 'info/en.html',
              info_german: 'info/de.html',
              info_portuguese: 'info/pt.html'
          },
      },
    outDir: "dist",
  },
});
