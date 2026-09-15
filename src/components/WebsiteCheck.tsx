import React, { useState } from 'react';

interface Question {
  id: string;
  title: string;
  description: string;
  icon: string;
  weight: number;
}

const QUESTIONS: Question[] = [
  {
    id: 'mobile',
    title: 'Mobile Optimierung',
    description: 'Lässt sich eure Vereinswebsite auf dem Smartphone einwandfrei bedienen, ohne zoomen oder seitlich scrollen zu müssen?',
    icon: '📱',
    weight: 25,
  },
  {
    id: 'recht',
    title: 'Rechtssicherheit & Datenschutz',
    description: 'Sind Impressum und Datenschutzerklärung aktuell, vollständig und ohne ungesicherte externe Tracker hinterlegt?',
    icon: '⚖️',
    weight: 25,
  },
  {
    id: 'barrierefreiheit',
    title: 'Barrierefreiheit & Lesbarkeit',
    description: 'Sind Schriften groß und kontrastreich genug, damit auch ältere oder sehbehinderte Mitglieder Inhalte problemlos erfassen können?',
    icon: '👁️',
    weight: 25,
  },
  {
    id: 'wartung',
    title: 'Pflegeaufwand & Sicherheit',
    description: 'Könnt ihr Termine und News selbst stressfrei einpflegen, ohne ständige Angst vor gehackten WordPress-Plugins oder Serverausfällen?',
    icon: '🛡️',
    weight: 25,
  },
];

type AnswerValue = 'yes' | 'partial' | 'no' | null;

export default function WebsiteCheck() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({
    mobile: null,
    recht: null,
    barrierefreiheit: null,
    wartung: null,
  });

  const handleSelect = (id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const isCompleted = answeredCount === QUESTIONS.length;

  // Score-Berechnung: yes = 100%, partial = 50%, no = 0%
  const score = Math.round(
    QUESTIONS.reduce((acc, q) => {
      const val = answers[q.id];
      if (val === 'yes') return acc + q.weight;
      if (val === 'partial') return acc + q.weight * 0.5;
      return acc;
    }, 0)
  );

  const getResultBadge = () => {
    if (score >= 80) {
      return {
        title: 'Sehr gut aufgestellt!',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
        text: 'Eure Vereinswebsite erfüllt bereits viele moderne Standards. Mit kleinen Feinjustierungen bei Barrierefreiheit oder Performance könnt ihr das Maximum herausholen.',
        icon: '🎉',
      };
    }
    if (score >= 50) {
      return {
        title: 'Solide Basis mit Modernisierungspotenzial',
        color: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
        text: 'Eure Seite funktioniert, hinkt modernen Standards bei Mobilgeräten, Barrierefreiheit oder Wartungsfreiheit jedoch hinterher. Hier kann EhrenCode euch spürbar entlasten.',
        icon: '⚡',
      };
    }
    return {
      title: 'Dringender Modernisierungsbedarf',
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
      text: 'Eure Website ist technisch oder rechtlich gefährdet, Besucher und neue Mitglieder zu verlieren. Eine ehrenamtliche Neugestaltung mit EhrenCode bringt euren Verein sofort ins moderne Web.',
      icon: '🚀',
    };
  };

  const handleReset = () => {
    setAnswers({
      mobile: null,
      recht: null,
      barrierefreiheit: null,
      wartung: null,
    });
  };

  const result = getResultBadge();

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Hintergrund-Akzente */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest rounded-full border border-brand-primary/20 inline-block mb-3">
          Interaktiver Schnell-Check
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Wie fit ist die Website deines Vereins?
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Beantworte 4 kurze Fragen und erfahre in 30 Sekunden, wo eure Vereinspräsenz technisch, rechtlich und optisch steht.
        </p>
      </div>

      {/* Fortschrittsanzeige */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <span>Fortschritt: {answeredCount} von {QUESTIONS.length} beantwortet</span>
          {isCompleted && <span className="text-brand-secondary font-bold">Ergebnis berechnet!</span>}
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500"
            style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Fragen-Liste */}
      <div className="space-y-4 mb-8">
        {QUESTIONS.map((q) => {
          const currentAnswer = answers[q.id];
          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                currentAnswer !== null
                  ? 'bg-slate-950/70 border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{q.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{q.title}</h3>
                    <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">{q.description}</p>
                  </div>
                </div>

                {/* Antwort-Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, 'yes')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      currentAnswer === 'yes'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    ✓ Ja
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, 'partial')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      currentAnswer === 'partial'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    ~ Teilweise
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, 'no')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      currentAnswer === 'no'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    ✗ Nein
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auswertung bei vollständiger Beantwortung */}
      {isCompleted && (
        <div className={`p-6 md:p-8 rounded-3xl border ${result.color} animate-in fade-in zoom-in-95 duration-400 mb-4`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <span className="text-3xl">{result.icon}</span>
                <h3 className="text-2xl font-bold text-white">{result.title}</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                {result.text}
              </p>
            </div>

            {/* Score-Anzeige */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 min-w-[130px]">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                {score}%
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                Fitness-Score
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <a
              href="#kontakt"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:scale-105 transition-all text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20"
            >
              Jetzt unverbindlich anfragen →
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white transition underline underline-offset-4"
            >
              Check zurücksetzen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
