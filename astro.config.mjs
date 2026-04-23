// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react'; 

export default defineConfig({
  site: 'https://ehrencode.org',  

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap(),
    react(), 
    keystatic()
  ]
});