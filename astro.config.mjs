// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react'; 
// 1. Den Vercel-Adapter importieren
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ehrencode.org',  

  // 2. Den Server-Modus aktivieren (wichtig für Keystatic)
  output: 'server',

  // 3. Den Vercel-Adapter hinzufügen
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap(),
    react(), 
    keystatic()
  ]
});