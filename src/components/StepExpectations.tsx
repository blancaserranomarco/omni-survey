'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expectationsSchema, type ExpectationsData } from '@/lib/schema';
import { Q9_OPTIONS, Q10_OPTIONS, Q11_OPTIONS, Q12_OPTIONS } from '@/lib/questions';
import MultiSelectMax from './MultiSelectMax';

interface Props {
  defaultValues?: Partial<ExpectationsData>;
  onNext: (data: ExpectationsData) => void;
  onBack: () => void;
}

export default function StepExpectations({ defaultValues, onNext, onBack }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExpectationsData>({
    resolver: zodResolver(expectationsSchema),
    defaultValues: {
      q9_omniPromise: [],
      q9_other: '',
      q10_expectations: [],
      q10_other: '',
      q11_dataExpected: [],
      q11_other: '',
      q12_concerns: [],
      q12_other: '',
      ...defaultValues,
    },
  });

  return (
    <div className="space-y-8">
      {/* OMNI Intro */}
      <div className="rounded-xl border border-gold/20 bg-gold-soft p-5 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-[3px] w-6 bg-gold rounded-full" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold">
            Antes de continuar
          </p>
        </div>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          <strong className="text-text-primary">OMNI</strong> es un asistente conversacional de TaxDown integrado en ChatGPT.
          Te ayuda con impuestos de forma practica (no solo la declaracion): entender tu situacion,
          detectar riesgos y oportunidades, pedirte lo minimo para orientarte y guiarte hacia el
          siguiente paso seguro (simular, checklist, preparar documentacion o hablar con un
          especialista cuando haga falta).
        </p>
      </div>

      {/* Q9 */}
      <div className="animate-fade-in-up stagger-1">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          ¿Que crees que es OMNI y que te promete? <span className="text-accent">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">Selecciona hasta 3 opciones</p>
        <Controller
          control={control}
          name="q9_omniPromise"
          render={({ field }) => (
            <Controller
              control={control}
              name="q9_other"
              render={({ field: otherField }) => (
                <MultiSelectMax
                  options={Q9_OPTIONS}
                  max={3}
                  value={field.value}
                  onChange={field.onChange}
                  allowOther
                  otherValue={otherField.value}
                  onOtherChange={otherField.onChange}
                  error={errors.q9_omniPromise?.message}
                />
              )}
            />
          )}
        />
      </div>

      {/* Q10 */}
      <div className="animate-fade-in-up stagger-2">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          ¿Que 3 cosas esperas que OMNI pueda hacer por ti? <span className="text-accent">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">Selecciona hasta 3 opciones</p>
        <Controller
          control={control}
          name="q10_expectations"
          render={({ field }) => (
            <Controller
              control={control}
              name="q10_other"
              render={({ field: otherField }) => (
                <MultiSelectMax
                  options={Q10_OPTIONS}
                  max={3}
                  value={field.value}
                  onChange={field.onChange}
                  allowOther
                  otherValue={otherField.value}
                  onOtherChange={otherField.onChange}
                  error={errors.q10_expectations?.message}
                />
              )}
            />
          )}
        />
      </div>

      {/* Q11 */}
      <div className="animate-fade-in-up stagger-3">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          ¿Que crees que te pedira OMNI para poder ayudarte? <span className="text-accent">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">Selecciona hasta 3 opciones</p>
        <Controller
          control={control}
          name="q11_dataExpected"
          render={({ field }) => (
            <Controller
              control={control}
              name="q11_other"
              render={({ field: otherField }) => (
                <MultiSelectMax
                  options={Q11_OPTIONS}
                  max={3}
                  value={field.value}
                  onChange={field.onChange}
                  allowOther
                  otherValue={otherField.value}
                  onOtherChange={otherField.onChange}
                  error={errors.q11_dataExpected?.message}
                />
              )}
            />
          )}
        />
      </div>

      {/* Q12 */}
      <div className="animate-fade-in-up stagger-4">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          ¿Que te preocupa mas al usar un asistente fiscal con IA? <span className="text-accent">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">Selecciona hasta 2 opciones</p>
        <Controller
          control={control}
          name="q12_concerns"
          render={({ field }) => (
            <Controller
              control={control}
              name="q12_other"
              render={({ field: otherField }) => (
                <MultiSelectMax
                  options={Q12_OPTIONS}
                  max={2}
                  value={field.value}
                  onChange={field.onChange}
                  allowOther
                  otherValue={otherField.value}
                  onOtherChange={otherField.onChange}
                  error={errors.q12_concerns?.message}
                />
              )}
            />
          )}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-border text-text-secondary rounded-xl font-semibold text-sm hover:bg-surface hover:border-border-light transition-all"
        >
          Atras
        </button>
        <button
          type="button"
          onClick={handleSubmit(onNext)}
          className="flex-[2] py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,89,62,0.25)]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
