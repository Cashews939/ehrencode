import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_INSTRUCTION = `Du bist der offizielle, hilfsbereite und sympathische KI-Assistent von "EhrenCode" (ehrencode.org).

Über EhrenCode:
- Zweck: Gemeinnützige Unterstützung von Vereinen und ehrenamtlichen Organisationen bei der Digitalisierung und Web-Modernisierung.
- Kosten: Für gemeinnützige Vereine bietet EhrenCode seine Expertise komplett ehrenamtlich und kostenfrei an.
- Werte: Barrierefreiheit (WCAG 2.1 AA), Datenschutz, Unabhängigkeit, keine teuren Serverkosten oder unnötigen Abhängigkeiten.

Deine Aufgaben & Richtlinien:
1. Beantworte Fragen von Vereinsmitgliedern, Vorständen und Interessierten kompetent und verständlich.
2. Sprache: Antworte immer in der Sprache, in der die Frage gestellt wurde (primär Deutsch oder Englisch).
3. Themen:
   - Webseiten-Modernisierung für Vereine (Technik, Mobiloptimierung, Wartung)
   - Barrierefreiheit (einfache Sprache, Screenreader, Farbkontraste, Tastaturbedienung)
   - Web-Sicherheit & Datenschutz-Grundlagen für Vereine (Hinweis: keine formale Rechtsberatung)
   - Ablauf von Projekten mit EhrenCode
4. Call to Action: Wenn jemand Interesse an Unterstützung hat oder ein Projekt starten möchte, lade ihn herzlich ein, das Kontaktformular auf der Startseite zu nutzen (Link: /#kontakt).
5. Halte Antworten prägnant, strukturiert und gut lesbar für den Chat. Nutze bei Bedarf kurze Aufzählungspunkte.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Schnelle Modelle mit automatischer Ausfallsicherung bei temporären Google-Lastspitzen (503)
const FALLBACK_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const preferredModel = import.meta.env.GEMINI_MODEL || process.env.GEMINI_MODEL;

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('dein_gemini_api_key')) {
      return new Response(
        JSON.stringify({
          isConfigError: true,
          reply: '⚠️ Der Gemini API-Key ist noch nicht hinterlegt. Bitte erstelle einen kostenlosen Schlüssel unter https://aistudio.google.com/ und trage ihn in die `.env`-Datei (oder in Vercel) als `GEMINI_API_KEY` ein.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Anfrage: Nachricht fehlt.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userMessage = body.message.trim();
    if (userMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Nachricht ist zu lang (maximal 2000 Zeichen erlaubt).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verlauf aufbereiten (maximal die letzten 8 Nachrichten für Kontext und Ressourceneffizienz)
    const rawHistory: ChatMessage[] = Array.isArray(body.history) ? body.history.slice(-8) : [];
    
    // In das von Gemini erwartete Format umwandeln (role: 'user' | 'model')
    const contents = rawHistory
      .filter((msg) => typeof msg.content === 'string' && msg.content.trim())
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content.trim() }],
      }));

    // Aktuelle Nachricht anfügen
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    };

    // Modell-Kette: Bevorzugtes Modell zuerst, dann Fallbacks
    const modelsToTry = preferredModel
      ? [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)]
      : FALLBACK_MODELS;

    let replyText = '';
    let lastErrorStatus = 0;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(geminiPayload),
          }
        );

        if (response.ok) {
          const data = await response.json();
          replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (replyText) break; // Erfolgreich!
        } else {
          lastErrorStatus = response.status;
          console.warn(`Modell ${model} meldete Status ${response.status}. Probiere Fallback...`);
          // Bei 503 (High Demand) oder 404 (Modell nicht verfügbar) nächsten Kandidaten probieren
        }
      } catch (err) {
        console.warn(`Verbindungsfehler bei Modell ${model}:`, err);
      }
    }

    if (!replyText) {
      if (lastErrorStatus === 429) {
        return new Response(
          JSON.stringify({
            reply: 'Entschuldigung, das Anfragelimit wurde gerade erreicht. Bitte versuche es in einem kurzen Moment noch einmal.',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          reply: 'Es gab ein technisches Problem bei der Verbindung zum KI-Dienst. Bitte versuche es in wenigen Momenten erneut oder nutze direkt das Kontaktformular.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ reply: replyText }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Serverfehler in /api/chat:', error);
    return new Response(
      JSON.stringify({
        error: 'Interner Serverfehler',
        reply: 'Es gab ein unerwartetes Problem beim Verarbeiten deiner Anfrage.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
