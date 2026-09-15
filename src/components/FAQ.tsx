import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Warum ist die Unterstützung für Vereine wirklich 100 % kostenlos?',
    answer:
      'EhrenCode ist ein ehrenamtliches Herzensprojekt. Ich unterstütze gemeinnützige Vereine und Initiativen in meiner Freizeit, weil das bürgerschaftliche Engagement zeitgemäße digitale Werkzeuge verdient. Es gibt keine versteckten Kosten, keine Abonnements und keine Agenturhonorare.',
  },
  {
    question: 'Müssen wir unsere bestehende Domain oder E-Mail-Adressen aufgeben?',
    answer:
      'Nein, keineswegs! Eure vertraute Webadresse (z. B. verein-musterstadt.de) und eure Vereins-Postfächer bleiben vollständig in eurem Besitz. Wir verknüpfen die neue, moderne Website einfach mit eurer Domain. Ihr behaltet zu jedem Zeitpunkt die volle Kontrolle.',
  },
  {
    question: 'Wie viel Zeit muss unser Verein für das Projekt einplanen?',
    answer:
      'Sehr wenig. In einem unkomplizierten Vorgespräch stimmen wir eure Wünsche, Vereinsfarben und Kernbereiche ab. Vorhandene Texte, Logos und Bilder können meist direkt übernommen werden. Die komplette technische Umsetzung und Optimierung übernehme ich.',
  },
  {
    question: 'Können wir Termine, News und Inhalte später selbst aktualisieren?',
    answer:
      'Ja, genau darauf lege ich großen Wert. Ihr bekommt eine einfache und übersichtliche Oberfläche an die Hand, mit der Vorstandsmitglieder oder Übungsleiter neue Termine, Spielberichte oder Ansprechpartner in wenigen Klicks selbst einpflegen können – ganz ohne Programmierwissen.',
  },
  {
    question: 'Welche Vorteile hat moderne Webtechnik gegenüber altem WordPress?',
    answer:
      'Klassische WordPress-Installationen leiden oft unter Sicherheitslücken veralteter Plugins, langsamen Ladezeiten auf Handys und teuren Hosting-Gebühren. Mit moderner Architektur (Astro) ist eure Website extrem schnell, optimal für Google vorbereitet, barrierearm und benötigt keine teuren Server.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="px-4 py-1.5 bg-brand-secondary/10 text-brand-secondary text-xs font-bold uppercase tracking-widest rounded-full border border-brand-secondary/20 inline-block mb-3">
          Häufige Fragen
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Transparente Antworten für euren Verein
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Hier findest du Antworten auf die wichtigsten Fragen, die sich Vereinsvorstände vor einer Zusammenarbeit stellen.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-slate-900/80 border-brand-primary/40 shadow-lg shadow-brand-primary/5'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-bold text-base md:text-lg text-white leading-snug">
                  {faq.question}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? 'bg-brand-primary text-white rotate-180'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
