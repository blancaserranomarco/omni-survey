'use client';

import { useState, useEffect, useCallback } from 'react';
import { PERSONAS } from '@/lib/personas';

interface Submission {
  id: string;
  participant_id: string;
  name: string;
  email: string;
  persona_name: string;
  persona_id: string;
  persona_rationale: string;
  tax_familiarity: number;
  intention_priority: string[];
  answers: Record<string, unknown>;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterPersona, setFilterPersona] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const storedPassword = authed ? password : '';

  const handleLogin = async () => {
    setAuthError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setAuthError('Contrasena incorrecta');
    }
  };

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const url = filterPersona
      ? `/api/admin/submissions?persona=${encodeURIComponent(filterPersona)}`
      : '/api/admin/submissions';

    const res = await fetch(url, {
      headers: { 'x-admin-password': storedPassword },
    });

    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions || []);
    }
    setLoading(false);
  }, [filterPersona, storedPassword]);

  useEffect(() => {
    if (authed) fetchSubmissions();
  }, [authed, filterPersona, fetchSubmissions]);

  const handleExport = (format: 'csv' | 'json') => {
    const url = `/api/admin/export?format=${format}${filterPersona ? `&persona=${encodeURIComponent(filterPersona)}` : ''}`;
    const a = document.createElement('a');
    fetch(url, { headers: { 'x-admin-password': storedPassword } })
      .then((r) => r.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = `omni-survey-export.${format}`;
        a.click();
        URL.revokeObjectURL(blobUrl);
      });
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-surface p-8 max-w-sm w-full animate-scale-in">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[3px] w-6 bg-accent rounded-full" />
            <span className="text-[11px] font-mono text-text-muted uppercase tracking-[0.15em]">Admin</span>
          </div>
          <h1 className="text-lg font-bold text-text-primary mb-4">OMNI Survey</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Contrasena"
            className="mb-3"
          />
          {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Admin — <span className="font-serif italic text-accent">Respuestas</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterPersona}
              onChange={(e) => setFilterPersona(e.target.value)}
            >
              <option value="">Todas las personas</option>
              {PERSONAS.filter((p) => p.id !== 'otro').map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} — {p.shortDesc}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-secondary hover:border-border-light hover:text-text-primary transition-all"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-secondary hover:border-border-light hover:text-text-primary transition-all"
            >
              JSON
            </button>
          </div>
        </div>

        <p className="text-sm text-text-muted mb-4 font-mono">
          {loading ? 'Cargando...' : `${submissions.length} respuesta(s)`}
        </p>

        <div className="space-y-2">
          {submissions.map((s) => (
            <div key={s.id} className="card-surface overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                className="w-full text-left p-4 flex items-center gap-4 hover:bg-card-hover transition-colors"
              >
                <span className="font-mono text-[11px] text-text-muted w-28 flex-shrink-0">
                  {s.participant_id}
                </span>
                <span className="text-sm font-semibold text-text-primary flex-1 truncate">
                  {s.name}
                </span>
                <span className="px-2.5 py-1 bg-accent-soft text-accent-text rounded-lg text-[11px] font-semibold">
                  {s.persona_name}
                </span>
                <span className="text-[11px] font-mono text-text-muted w-32 text-right flex-shrink-0">
                  {new Date(s.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-text-muted/40 text-sm">{expandedId === s.id ? '−' : '+'}</span>
              </button>

              {expandedId === s.id && (
                <div className="border-t border-border p-4 bg-surface">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-muted text-[11px] font-mono">Email</span>
                      <p className="text-text-primary">{s.email}</p>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px] font-mono">Familiaridad fiscal</span>
                      <p className="text-text-primary">{s.tax_familiarity}/5</p>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px] font-mono">Persona</span>
                      <p className="text-text-primary">{s.persona_name}</p>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px] font-mono">Rationale</span>
                      <p className="text-text-primary">{s.persona_rationale}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-text-muted text-[11px] font-mono">Intencion (prioridad)</span>
                      <p className="text-text-primary">{(s.intention_priority || []).join(' > ')}</p>
                    </div>
                  </div>
                  <details className="mt-4">
                    <summary className="text-[11px] text-text-muted cursor-pointer hover:text-text-secondary font-mono">
                      Ver todas las respuestas (JSON)
                    </summary>
                    <pre className="mt-2 p-3 bg-bg rounded-lg border border-border text-[11px] overflow-auto max-h-64 text-text-secondary font-mono">
                      {JSON.stringify(s.answers, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          ))}

          {!loading && submissions.length === 0 && (
            <div className="text-center py-16 text-text-muted text-sm">
              No hay respuestas todavia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
