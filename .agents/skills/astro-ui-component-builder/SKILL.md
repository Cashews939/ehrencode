---
name: astro-ui-component-builder
description: >-
  Erstellt standardisierte, barrierefreie UI-Komponenten in Astro oder React mit
  Tailwind CSS, TypeScript-Props und WCAG 2.1 AA Konformität für EhrenCode.
---

# Astro UI Component Builder

Verwende diesen Skill, wenn neue UI-Komponenten oder Layout-Elemente für EhrenCode erstellt oder erweitert werden sollen.

## 1. Zieldatei & Technologie-Wahl
- **Speicherort:** `src/components/` bzw. `src/components/ui/<ComponentName>.[astro|tsx]`
- **Framework-Wahl:**
  - Standard: **`.astro`** für alle rein präsentationalen Komponenten (Buttons, Cards, Badges, Header, Footer).
  - Nur **`.tsx` (React)**, wenn zwingend clientseitiger Zustand oder interaktive React-Hooks erforderlich sind (z. B. komplexe Formular-Validierung, dynamische Modals). Bei React in Astro immer die passende Client-Direktive (`client:load`, `client:visible`) mitdenken.

## 2. TypeScript Props-Definition
Jede Komponente definiert ein strikt typisiertes Interface:
```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  id?: string;
}

const {
  variant = 'primary',
  size = 'md',
  class: className = '',
  ...rest
} = Astro.props;
---
```

## 3. Styling & Tailwind Design-Tokens
- **Keine Inline-Styles:** Alle Formatierungen erfolgen über Tailwind-Utility-Klassen.
- **Design-Tokens beachten:**
  - Primärfarbe: `bg-brand-primary` / `text-brand-primary` / `border-brand-primary` (`#8b5cf6`)
  - Sekundärfarbe: `bg-brand-secondary` / `text-brand-secondary` (`#06b6d4`)
  - Hintergrund: `bg-slate-950` / `bg-slate-900/50`
  - Rahmen: `border-slate-800`
  - Text: `text-white` (Überschriften), `text-slate-300` / `text-slate-400` (Fließtext)
  - Hover-Effekte: `hover:scale-105 transition-all duration-200 glow-hover`

## 4. Barrierefreiheit (WCAG 2.1 AA Pflichtkriterien)
- **Semantische HTML-Tags:** Buttons als `<button>`, Links als `<a>`. Niemals `<div>` mit Klick-Event ohne Tastatur-Fallback.
- **Tastaturbedienbarkeit:** Alle interaktiven Elemente müssen über `Tab` erreichbar sein und sichtbare Fokus-Zustände besitzen (`focus-visible:ring-2 focus-visible:ring-brand-primary`).
- **ARIA-Attribute:**
  - Icons ohne Text müssen `aria-label` oder `title` tragen.
  - Dekorative Grafiken oder Emojis erhalten `aria-hidden="true"`.
- **Valide Hierarchie:** Keine verschachtelten `<main>`-Tags erzeugen.
- **Kontraste:** Mindestens 4.5:1 Kontrastverhältnis zwischen Text und Hintergrund.

## 5. Verifikationsschritt
- Nach dem Anlegen der Komponente einen Test-Aufruf in einer Beispielseite platzieren und `npm run build` ausführen, um TypeScript- und Syntax-Fehler auszuschließen.
