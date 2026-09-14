---
name: keystatic-content-creator
description: >-
  Erstellt und erweitert Keystatic-Collections synchron in keystatic.config.ts und
  src/content.config.ts oder generiert validierte Markdown/Markdoc-Inhaltseinträge für Astro.
---

# Keystatic Collection & Content Creator

Verwende diesen Skill, wenn neue Inhaltsbereiche (Collections) oder neue Inhaltsbeiträge für EhrenCode angelegt werden sollen.

## MODUS 1: Neue Collection anlegen (`create-collection`)
Wenn eine neue Inhaltskategorie (z. B. "workshops", "projekte", "team") angelegt werden soll:

1. **Keystatic konfigurieren (`keystatic.config.ts`):**
   - Neue Collection mit `collection({ ... })` definieren.
   - `path`: `src/content/<collection_name>/*`
   - `format`: `{ contentField: 'content' }`
   - Schema-Felder:
     - `title`: `fields.slug({ name: { label: 'Titel' } })`
     - `description`: `fields.text({ label: 'Beschreibung', multiline: true })`
     - `pubDate`: `fields.date({ label: 'Veröffentlichungsdatum' })`
     - `category`: `fields.text({ label: 'Kategorie' })`
     - `content`: `fields.markdoc({ label: 'Inhalt' })`
     - optional `thumbnail`: `fields.image({ label: 'Beitragsbild', directory: 'src/assets/<collection_name>', publicPath: '../../assets/<collection_name>/' })`

2. **Astro Content Layer konfigurieren (`src/content.config.ts`):**
   - Zod-Schema synchron zu Keystatic mit `defineCollection()` ergänzen:
     ```ts
     const <collection_name> = defineCollection({
       loader: glob({ pattern: '**/[^_]*.{md,mdx,mdoc}', base: "./src/content/<collection_name>" }),
       schema: ({ image }) => z.object({
         title: z.string(),
         description: z.string(),
         pubDate: z.coerce.date(),
         category: z.string(),
         thumbnail: image().optional(),
       }),
     });
     ```
   - In `export const collections = { ... }` aufnehmen.

3. **Verifikation:**
   - Im Terminal `npm run build` ausführen, um TypeScript- und Schema-Konflikte auszuschließen.

---

## MODUS 2: Neuen Beitrag erstellen (`create-entry`)
Wenn ein neuer Artikel oder Eintrag erstellt werden soll:

1. **Zieldatei bestimmen:**
   - Pfad: `src/content/<collection_name>/<slug>.md`
   - Dateiname (Slug) strictly lowercase in Kebab-Case (z. B. `digitale-vereinsverwaltung.md`).

2. **Frontmatter validieren & generieren:**
   ```yaml
   ---
   title: "Vollständiger Titel des Beitrags"
   description: "Prägnante Zusammenfassung (1-2 Sätze) für Teaser und OpenGraph."
   pubDate: YYYY-MM-DD
   category: "Kategorie (z. B. Technik, Recht, Organisation)"
   ---
   ```
   *Hinweis: Wenn ein Beitragsbild vorhanden ist, `thumbnail: ../../assets/<collection_name>/<slug>/thumbnail.jpg` ergänzen.*

3. **Inhaltsstruktur verfassen:**
   - Strukturierter Aufbau mit `#` Haupttitel, Einleitung, `##` Zwischenüberschriften, Listen und Info-Boxen.
   - Verständliche Sprache für das Ehrenamt.

4. **Verifikation:**
   - `npm run build` ausführen und sicherstellen, dass die neue Route fehlerfrei vorgerendert wird.
