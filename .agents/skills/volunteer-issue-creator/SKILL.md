---
name: volunteer-issue-creator
description: >-
  Übersetzt Feature-Wünsche, Refactorings oder Aufgaben in modulare „Good First Issues“
  für GitHub/Jira mit Akzeptanzkriterien, Testanleitung und minimalem Onboarding-Aufwand.
---

# Volunteer Issue Creator

Verwende diesen Skill, wenn Ideen, Features oder Wartungsaufgaben in leicht verständliche Mitmach-Aufgaben („Good First Issues“) für ehrenamtliche Unterstützer zerlegt werden sollen.

## 1. Kriterien für ein gutes Helfer-Issue
- **Modularität:** Die Aufgabe sollte in 1–3 Stunden von einer einzelnen Person lösbar sein.
- **Keine impliziten Annahmen:** Alle nötigen Pfade, Werkzeuge und Anforderungen sind explizit genannt.
- **Freundlicher Ton:** Einladende Sprache, die ehrenamtliches Engagement wertschätzt.

## 2. Standard-Issue-Template

Erstelle das Issue nach folgendem strukturierten Schema:

```markdown
### 🎯 Was ist das Ziel?
[Kurze, prägnante Beschreibung des Problems und was am Ende anders/besser sein soll.]

### 💡 Kontext & Warum das dem Ehrenamt hilft
[1-2 Sätze dazu, warum diese Verbesserung für Vereine auf ehrencode.org einen echten Mehrwert bietet.]

### 📂 Betroffene Dateien
- \`src/components/...\`
- \`src/pages/...\`
- \`src/styles/global.css\`

### ✅ Akzeptanzkriterien (Definition of Done)
- [ ] Kriterium 1 (z. B. Komponente reagiert auf Bildschirmbreiten ab 375px)
- [ ] Kriterium 2 (z. B. Farbkontraste erfüllen WCAG 2.1 AA)
- [ ] Kriterium 3 (z. B. Keine neuen Konsolen-Warnungen)
- [ ] Lokaler Build (\`npm run build\`) läuft ohne Fehler durch

### 🛠️ Lokale Test-Anleitung für Helfer
1. Repository klonen und neuen Branch erstellen:
   \`git checkout -b feature/mein-beitrag\`
2. Abhängigkeiten installieren & Entwicklungsserver starten:
   \`npm install\`
   \`npm run dev\`
3. Im Browser unter \`http://localhost:4321\` prüfen.
4. Vor dem Pull-Request den Produktions-Build testen:
   \`npm run build\`

### 🏷️ Empfohlene Labels
- \`good-first-issue\`
- \`help-wanted\`
- [Bereichs-Label: \`frontend\`, \`design\`, \`content\`, \`accessibility\`, \`documentation\`]
```

## 3. Ausgabe & Ablage
- Gib das fertige Markdown-Issue direkt im Chat aus, damit es in GitHub Issues oder Jira kopiert werden kann, oder erstelle auf Wunsch eine Datei unter `docs/issues/<issue-slug>.md`.
