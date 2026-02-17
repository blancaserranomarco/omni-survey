'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-40%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-accent/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold/[0.03] blur-[100px]" />
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Main card */}
        <div className="card-surface p-8 sm:p-10 animate-scale-in">
          {/* Accent notch */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[3px] w-10 bg-accent rounded-full" />
            <span className="text-[11px] font-mono text-text-muted uppercase tracking-[0.15em]">
              Pre-Survey
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary leading-tight mb-3 animate-fade-in-up stagger-1">
            Cuestionario breve
            <br />
            <span className="font-serif italic text-accent">sobre OMNI</span>
          </h1>

          <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-md animate-fade-in-up stagger-2">
            Queremos entender tus expectativas sobre un nuevo tipo de asistente fiscal.
            No es un examen — solo queremos escucharte.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              'Nos ayudas a entender qué esperas de un asistente fiscal con IA y qué necesitas para confiar en él.',
              'Son 5–8 minutos. 3 pasos cortos con opciones para elegir.',
              'Tus respuestas son confidenciales y se usan solo para esta investigación interna.',
            ].map((text, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 animate-fade-in-up stagger-${i + 3}`}
              >
                <span className="w-6 h-6 rounded-full border border-border-light text-text-muted flex items-center justify-center text-[11px] font-mono flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[13px] text-text-secondary leading-relaxed">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          {/* Consent */}
          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer mb-6 transition-all duration-200 animate-fade-in-up stagger-6 ${
              consent
                ? 'bg-accent-soft border-accent/30'
                : 'bg-surface border-border hover:border-border-light'
            }`}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 mt-0.5 flex-shrink-0 rounded"
            />
            <span className="text-xs text-text-muted leading-relaxed">
              Acepto que mis respuestas se almacenen durante 90 días con fines de investigación
              interna. No se usarán con fines de marketing. Si tienes preguntas, puedes
              escribirnos al email del equipo organizador.
            </span>
          </label>

          <button
            onClick={() => consent && router.push('/survey')}
            disabled={!consent}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 animate-fade-in-up stagger-7 ${
              consent
                ? 'bg-accent text-white hover:bg-accent-hover cursor-pointer hover:shadow-[0_0_24px_rgba(200,89,62,0.25)]'
                : 'bg-card text-text-muted cursor-not-allowed border border-border'
            }`}
          >
            Empezar
          </button>
        </div>

        <p className="text-center text-[11px] text-text-muted mt-8 font-mono tracking-wide">
          OMNI (TaxDown) — Workshop Pre-Survey
        </p>
      </div>
    </div>
  );
}
