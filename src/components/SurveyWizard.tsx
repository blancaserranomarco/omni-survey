'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateParticipantId } from '@/lib/participant-id';
import type { PersonaResult as PersonaResultType } from '@/lib/personas';
import type { ProfilingData, ExpectationsData, TrustData } from '@/lib/schema';
import ProgressBar from './ProgressBar';
import StepProfiling from './StepProfiling';
import StepExpectations from './StepExpectations';
import StepTrust from './StepTrust';

export default function SurveyWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [participantId, setParticipantId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [profiling, setProfiling] = useState<ProfilingData | null>(null);
  const [persona, setPersona] = useState<PersonaResultType | null>(null);
  const [expectations, setExpectations] = useState<ExpectationsData | null>(null);

  useEffect(() => {
    setParticipantId(generateParticipantId());
  }, []);

  const handleProfilingNext = (data: ProfilingData, personaResult: PersonaResultType) => {
    setProfiling(data);
    setPersona(personaResult);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpectationsNext = (data: ExpectationsData) => {
    setExpectations(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (trustData: TrustData) => {
    if (!profiling || !persona || !expectations) return;

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      participantId,
      consent: true,
      ...profiling,
      personaId: persona.personaId,
      personaName: persona.personaName,
      personaRationale: persona.rationale,
      ...expectations,
      ...trustData,
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(err.error || 'Error al enviar');
      }

      router.push('/success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al enviar la encuesta';
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-accent/[0.03] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold/[0.02] blur-[80px]" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-xl font-bold text-text-primary">
            Cuestionario <span className="font-serif italic text-accent">OMNI</span>
          </h1>
          <p className="text-[11px] font-mono text-text-muted mt-1 tracking-wide">5–8 minutos</p>
        </div>

        <ProgressBar currentStep={step} />

        <div className="card-surface p-6 sm:p-8 animate-fade-in-up">
          {step === 0 && (
            <StepProfiling
              participantId={participantId}
              defaultValues={profiling || undefined}
              onNext={handleProfilingNext}
            />
          )}

          {step === 1 && (
            <StepExpectations
              defaultValues={expectations || undefined}
              onNext={handleExpectationsNext}
              onBack={() => setStep(0)}
            />
          )}

          {step === 2 && (
            <StepTrust
              onSubmit={handleSubmit}
              onBack={() => setStep(1)}
              isSubmitting={isSubmitting}
            />
          )}

          {submitError && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {submitError}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-text-muted mt-8 font-mono tracking-wide">
          Tus datos se almacenan de forma segura y solo se usan para investigacion interna.
        </p>
      </div>
    </div>
  );
}
