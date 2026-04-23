import { defineCollection, z } from 'astro:content';
// 1. Loader importieren
import { glob } from 'astro/loaders'; 

const wissen = defineCollection({
  // 2. Den Loader hinzufügen. Er sucht im Ordner src/content/wissen nach .md Dateien
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/wissen" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(), // 'coerce' macht das Datum-Format flexibler
    category: z.string(),
  }),
});

export const collections = { wissen };