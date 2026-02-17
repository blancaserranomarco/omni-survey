'use client';

import type { PersonaResult as PersonaResultType } from '@/lib/personas';
import { PERSONAS } from '@/lib/personas';

export default function PersonaResult({ result }: { result: PersonaResultType }) {
  const persona = PERSONAS.find((p) => p.id === result.personaId);
  const color = persona?.color || '#C8593E';

  return (
    <div className="mt-6 rounded-xl border border-accent/25 bg-accent-soft p-5 animate-scale-in">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-3">
        Tu perfil aproximado
      </p>
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-serif italic font-medium shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 8px 24px ${color}40`,
          }}
        >
          {result.personaName[0]}
        </div>
        <div>
          <p className="text-xl font-bold text-text-primary font-serif">{result.personaName}</p>
          <p className="text-[13px] text-text-secondary">{persona?.shortDesc}</p>
        </div>
      </div>
      <p className="mt-4 text-[13px] text-text-secondary leading-relaxed border-t border-border/50 pt-3">
        {result.rationale}
      </p>
      <p className="mt-2 text-[11px] text-text-muted">
        Esta asignacion es automatica y orientativa.
      </p>
    </div>
  );
}
