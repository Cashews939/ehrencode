import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; 

const wissen = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/wissen" }),
  schema: ({ image }) => z.object({ // <-- Wichtig: { image } hier hinzufügen
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    // Hier sagen wir Astro, dass thumbnail ein Bild ist:
    thumbnail: image().optional(), 
  }),
});

export const collections = { wissen };