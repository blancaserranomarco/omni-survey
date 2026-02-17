'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trustSchema, type TrustData } from '@/lib/schema';
import {
  Q13_OPTIONS,
  Q14_OPTIONS,
  Q15_OPTIONS,
  Q16_OPTIONS,
  Q17_OPTIONS,
  Q18_OPTIONS,
} from '@/lib/questions';
import MultiSelectMax from './MultiSelectMax';
import RadioGroup from './RadioGroup';

interface Props {
  defaultValues?: Partial<TrustData>;
  onSubmit: (data: TrustData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function StepTrust({ defaultValues, onSubmit, onBack, isSubmitting }: Props) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
  } = useForm<TrustData>({
    resolver: zodResolver(trustSchema),
    defaultValues: {
      q13_responsibility: '',
      q14_trustSignals: [],
      q15_format: '',
      q16_controls: [],
      q17_uncertainty: '',
      q18_errorHandling: '',
      q19_openText: '',
      ...defaultValues,
    },
  });

  const q19 = watch('q19_openText') || '';

  return (
    <div className="space-y-8">
      {/* Q13 */}
      <div className="animate-fade-in-up">
        <label className="block text-sm font-semibold text-text-primary mb-2">
          En fiscalidad, ¿que nivel de responsabilidad esperas de OMNI? <span className="text-accent">*</span>
        </label>
        <Controller
          control={control}
          name="q13_responsibility"
          render={({ field }) => (
            <RadioGroup
              options={Q13_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.q13_responsibility?.message}
            />
          )}
        />
      </div>

      {/* Q14 */}
      <div className="animate-fade-in-up stagger-1">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          ¿Que senales te harian confiar mas? <span className="text-accent">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">Selecciona hasta 3 opciones</p>
        <Controller
          control={control}
          name="q14_trustSignals"
          render={({ field }) => (
            <MultiSelectMax
              options={Q14_OPTIONS}
              max={3}
              value={field.value}
              onChange={field.onChange}
              error={errors.q14_trustSignals?.message}
            />
          )}
        />
      </div>

      {/* Q15 */}
      <div className="animate-fade-in-up stagger-2">
        <label className="block text-sm font-semibold text-text-primary mb-2">
          ¿Que formato prefieres que use OMNI cuando te responde? <span className="text-accent">*</span>
        </label>
        <Controller
          control={control}
          name="q15_format"
          render={({ field }) => (
            <RadioGroup
              options={Q15_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.q15_format?.message}
            />
          )}
        />
      </div>

      {/* Q16 */}
      <div className="animate-fade-in-up stagger-3">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          ¿Que controles necesitas para sentirte seguro/a? <span className="text-accent">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">Selecciona hasta 2 opciones</p>
        <Controller
          control={control}
          name="q16_controls"
          render={({ field }) => (
            <MultiSelectMax
              options={Q16_OPTIONS}
              max={2}
              value={field.value}
              onChange={field.onChange}
              error={errors.q16_controls?.message}
            />
          )}
        />
      </div>

      {/* Q17 */}
      <div className="animate-fade-in-up stagger-4">
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Si OMNI no esta seguro, ¿que esperas que haga? <span className="text-accent">*</span>
        </label>
        <Controller
          control={control}
          name="q17_uncertainty"
          render={({ field }) => (
            <RadioGroup
              options={Q17_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.q17_uncertainty?.message}
            />
          )}
        />
      </div>

      {/* Q18 */}
      <div className="animate-fade-in-up stagger-5">
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Si OMNI falla (error/timeout), ¿que esperas? <span className="text-accent">*</span>
        </label>
        <Controller
          control={control}
          name="q18_errorHandling"
          render={({ field }) => (
            <RadioGroup
              options={Q18_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.q18_errorHandling?.message}
            />
          )}
        />
      </div>

      {/* Q19 */}
      <div className="animate-fade-in-up stagger-6">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Algo importante que OMNI deberia hacer o evitar
        </label>
        <p className="text-xs text-text-muted mb-2">
          Tono, claridad, empatia, seguridad... Lo que quieras. Opcional.
        </p>
        <textarea
          {...register('q19_openText')}
          maxLength={300}
          rows={3}
          placeholder="Escribe aqui si quieres..."
          className="resize-none"
        />
        <p className="text-[11px] font-mono text-text-muted text-right mt-1">{q19.length}/300</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-3 border border-border text-text-secondary rounded-xl font-semibold text-sm hover:bg-surface hover:border-border-light transition-all disabled:opacity-40"
        >
          Atras
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`flex-[2] py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            isSubmitting
              ? 'bg-card text-text-muted border border-border cursor-not-allowed'
              : 'bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_24px_rgba(200,89,62,0.25)]'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-text-muted/30 border-t-text-muted rounded-full animate-spin" />
              Enviando...
            </span>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
    </div>
  );
}
