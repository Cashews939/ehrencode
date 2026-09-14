import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isConfigError?: boolean;
}

const SUGGESTIONS = [
  'Wie unterstützt ihr Vereine?',
  'Kostet das wirklich nichts?',
  'Was bedeutet Barrierefreiheit?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hallo! 👋 Ich bin der digitale Assistent von **EhrenCode**.\n\nIch helfe dir gerne bei Fragen zu moderner Web-Entwicklung für Vereine, Barrierefreiheit oder einer ehrenamtlichen Zusammenarbeit weiter. Was kann ich für dich tun?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Automatisches Scrollen ans Ende bei neuen Nachrichten
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Fokus ins Eingabefeld setzen beim Öffnen
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Schließen mit ESC-Taste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Vorherige Nachrichten als Kontext mitsenden (ohne Willkommensgruß)
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: history,
        }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || 'Keine Antwort erhalten.',
        timestamp: new Date(),
        isConfigError: data.isConfigError,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'Entschuldigung, es gab einen Fehler bei der Übertragung. Bitte überprüfe deine Internetverbindung oder versuche es später noch einmal.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: 'Hallo! 👋 Chatverlauf zurückgesetzt. Wie kann ich dir oder deinem Verein weiterhelfen?',
        timestamp: new Date(),
      },
    ]);
  };

  // Einfacher Text-Renderer für Markdown-Formatierungen (Links & Zeilenumbrüche)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      // Formatierung für Links: [Text](URL)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIdx = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIdx) {
          parts.push(line.slice(lastIdx, match.index));
        }
        const [, label, href] = match;
        parts.push(
          <a
            key={`${lineIndex}-${match.index}`}
            href={href}
            className="text-brand-secondary underline hover:text-white transition-colors"
            target={href.startsWith('http') ? '_blank' : '_self'}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {label}
          </a>
        );
        lastIdx = match.index + match[0].length;
      }

      if (lastIdx < line.length) {
        parts.push(line.slice(lastIdx));
      }

      // Fettgedrucktes: **text**
      const processedParts = parts.map((part, pIdx) => {
        if (typeof part === 'string') {
          const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
          return boldParts.map((bPart, bIdx) => {
            if (bPart.startsWith('**') && bPart.endsWith('**')) {
              return <strong key={`${pIdx}-${bIdx}`} className="font-bold text-white">{bPart.slice(2, -2)}</strong>;
            }
            return bPart;
          });
        }
        return part;
      });

      return (
        <span key={lineIndex} className="block min-h-[1.25rem]">
          {processedParts.length > 0 ? processedParts : '\u00A0'}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chatfenster Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="EhrenCode KI-Chatbot"
          className="w-[92vw] sm:w-[380px] max-h-[580px] h-[78vh] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white text-lg shadow-md shadow-brand-primary/20">
                  ✨
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white leading-tight">EhrenCode Assistent</h3>
                <p className="text-[11px] text-slate-400">Ehrenamtlich & digital</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                title="Chat zurücksetzen"
                aria-label="Chat zurücksetzen"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Chat schließen"
                aria-label="Chat schließen"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Nachrichtenbereich */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md'
                      : msg.isConfigError
                      ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            ))}

            {/* Ladeanzeige / Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Vorschläge bei wenigen Nachrichten */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Häufige Fragen:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="text-left text-xs bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white p-2.5 rounded-xl transition"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Eingabebereich */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900/50 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Frage stellen..."
              disabled={isLoading}
              aria-label="Frage an den Chatbot"
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-brand-primary rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Nachricht senden"
              className="p-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:scale-105 transition disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md shadow-brand-primary/20"
            >
              <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Chatbot schließen' : 'Chatbot öffnen'}
        aria-expanded={isOpen}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white flex items-center justify-center shadow-xl shadow-brand-primary/25 hover:scale-105 active:scale-95 transition-all glow-hover"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
