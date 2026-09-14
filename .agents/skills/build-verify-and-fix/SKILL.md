---
name: build-verify-and-fix
description: >-
  Führt defensive Build- und Typprüfungen im Terminal aus, fängt Astro-, TypeScript-
  und SSR-Fehler automatisch ab und behebt sie vor jedem Commit.
---

# Build Verify and Fix

Verwende diesen Skill als defensiven Qualitätssicherungs-Schritt vor jedem Git-Commit, Push oder nach Codeänderungen an Komponenten, Konfigurationen und Inhalten.

## 1. Ausführung des Build-Checks
Führe im Projektordner `D:\Ehrencode` folgenden Befehl aus:
```bash
npm run build
```

## 2. Automatische Fehler-Diagnose & Korrektur

Wenn der Build mit Exit-Code != 0 fehlschlägt oder Warnungen wirft, analysiere die Konsole und wende die passende Korrektur an:

### A) SSR & Routing-Warnung (`getStaticPaths() ignored in dynamic page`)
- **Ursache:** In `astro.config.mjs` ist `output: 'server'` aktiv, aber eine dynamische Route (z. B. `src/pages/wissen/[...slug].astro`) deklariert `getStaticPaths()` ohne Prerender-Flag.
- **Korrektur:** Füge ganz oben im Frontmatter der betroffenen Seite `export const prerender = true;` ein.

### B) Content-Schema / Zod-Validierungsfehler
- **Ursache:** Eine Markdown-/MDX-Datei in `src/content/` enthält fehlende Pflichtfelder oder abweichende Feldnamen.
- **Korrektur:** Öffne die beanstandete Datei und gleiche das Frontmatter mit `src/content.config.ts` ab:
  - Datum heißt `pubDate` (nicht `publishedDate`).
  - Kurzbeschreibung heißt `description` (nicht `summary`).
  - Bildpfad heißt `thumbnail`.
  - Bei Pflichtfeldern sicherstellen, dass keine leeren Werte vorhanden sind.

### C) Nicht geschlossene oder falsch geschachtelte HTML/Astro-Tags
- **Ursache:** Mismatched Tags (z. B. `<MainLayout>` geöffnet, aber mit `</Layout>` geschlossen) oder Syntaxfehler.
- **Korrektur:** Korrigiere das schließende Tag exakt auf den Namen der importierten Komponente.

### D) Fehlende Imports oder TypeScript-Typisierungsfehler
- **Ursache:** Eine Komponente oder ein Modul wird verwendet, ist aber nicht importiert.
- **Korrektur:** Ergänze den passenden Import im Frontmatter (`---`) der Datei.

## 3. Wiederholungsschleife & Freigabe
1. Nach jeder automatischen Korrektur erneut `npm run build` ausführen.
2. Wiederholen, bis der Build mit **Code 0** und ohne Fehler durchläuft.
3. Erst wenn der Build erfolgreich ist, darf der Git-Commit (`git commit`) und Push (`git push`) durchgeführt werden.
