'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profilingSchema, type ProfilingData } from '@/lib/schema';
import { mapToPersona, type PersonaResult as PersonaResultType } from '@/lib/personas';
import PersonaResult from './PersonaResult';
import IntentionRanker from './IntentionRanker';
import { useState } from 'react';

const TAX_LEVELS = [
  { value: 1, label: 'Muy baja' },
  { value: 2, label: 'Baja' },
  { value: 3, label: 'Media' },
  { value: 4, label: 'Alta' },
  { value: 5, label: 'Muy alta' },
];

interface Props {
  participantId: string;
  defaultValues?: Partial<ProfilingData>;
  onNext: (data: ProfilingData, persona: PersonaResultType) => void;
}

export default function StepProfiling({ participantId, defaultValues, onNext }: Props) {
  const [personaResult, setPersonaResult] = useState<PersonaResultType | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfilingData>({
    resolver: zodResolver(profilingSchema),
    defaultValues: {
      name: '',
      email: '',
      taxFamiliarity: 3,
      aiDailyUse: false,
      usedAiForTaxes: false,
      consultedExpert: false,
      intentionPriority: [],
      ...defaultValues,
    },
  });

  const handleContinue = handleSubmit((data) => {
    const persona = mapToPersona({
      taxFamiliarity: data.taxFamiliarity,
      aiDailyUse: data.aiDailyUse,
      usedAiForTaxes: data.usedAiForTaxes,
      consultedExpert: data.consultedExpert,
      intentionPriority: data.intentionPriority,
    });
    setPersonaResult(persona);
  });

  const handleConfirm = handleSubmit((data) => {
    if (personaResult) {
      onNext(data, personaResult);
    }
  });

  return (
    <div className="space-y-7">
      {/* Participant ID Badge */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <span className="px-3 py-1.5 bg-surface border border-border rounded-lg text-[11px] font-mono font-medium text-accent tracking-wide">
          {participantId}
        </span>
        <span className="text-[11px] text-text-muted">Tu identificador</span>
      </div>

      {/* Name */}
      <div className="animate-fade-in-up stagger-1">
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Nombre y apellidos <span className="text-accent">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Tu nombre completo"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="animate-fade-in-up stagger-2">
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Email <span className="text-accent">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="tu@email.com"
        />
        {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
      </div>

      {/* Tax Familiarity */}
      <div className="animate-fade-in-up stagger-3">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Nivel de familiaridad con impuestos <span className="text-accent">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">
          1 = nunca he hecho nada de impuestos, 5 = lo domino bien
        </p>
        <Controller
          control={control}
          name="taxFamiliarity"
          render={({ field }) => (
            <div className="flex gap-2">
              {TAX_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => field.onChange(level.value)}
                  className={`flex-1 py-3 rounded-xl text-center transition-all duration-200 border ${
                    field.value === level.value
                      ? 'border-accent/50 bg-accent-soft text-accent-text shadow-[0_0_12px_rgba(200,89,62,0.15)]'
                      : 'border-border bg-surface text-text-secondary hover:border-accent/30'
                  }`}
                >
                  <span className="block text-lg font-bold font-mono">{level.value}</span>
                  <span className="text-[11px]">{level.label}</span>
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* Yes/No toggles */}
      <div className="space-y-5 animate-fade-in-up stagger-4">
        <YesNoField
          label="¿Usas agentes de IA en tu dia a dia?"
          helperText="ChatGPT, Copilot, Claude, etc."
          control={control}
          name="aiDailyUse"
        />
        <YesNoField
          label="¿Has usado IA para temas fiscales alguna vez?"
          helperText="Consultar dudas fiscales, revisar documentos..."
          control={control}
          name="usedAiForTaxes"
        />
        <YesNoField
          label="¿Has consultado a un gestor/experto fiscal alguna vez?"
          control={control}
          name="consultedExpert"
        />
      </div>

      {/* Intention Priority */}
      <div className="animate-fade-in-up stagger-5">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Cuando uso un agente conversacional, normalmente vengo con la intencion de... <span className="text-accent">*</span>
        </label>
        <Controller
          control={control}
          name="intentionPriority"
          render={({ field }) => (
            <IntentionRanker
              value={field.value}
              onChange={field.onChange}
              error={errors.intentionPriority?.message}
            />
          )}
        />
      </div>

      {/* Persona Result */}
      {personaResult && <PersonaResult result={personaResult} />}

      {/* Buttons */}
      <div className="pt-2">
        {!personaResult ? (
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,89,62,0.25)]"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,89,62,0.25)]"
          >
            Siguiente paso
          </button>
        )}
      </div>
    </div>
  );
}

function YesNoField({
  label,
  helperText,
  control,
  name,
}: {
  label: string;
  helperText?: string;
  control: ReturnType<typeof useForm<ProfilingData>>['control'];
  name: 'aiDailyUse' | 'usedAiForTaxes' | 'consultedExpert';
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">{label}</label>
          {helperText && <p className="text-xs text-text-muted mb-2">{helperText}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => field.onChange(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                field.value === true
                  ? 'border-accent/50 bg-accent-soft text-accent-text'
                  : 'border-border bg-surface text-text-secondary hover:border-accent/30'
              }`}
            >
              Si
            </button>
            <button
              type="button"
              onClick={() => field.onChange(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                field.value === false
                  ? 'border-accent/50 bg-accent-soft text-accent-text'
                  : 'border-border bg-surface text-text-secondary hover:border-accent/30'
              }`}
            >
              No
            </button>
          </div>
        </div>
      )}
    />
  );
}
