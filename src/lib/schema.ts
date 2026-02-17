import { z } from 'zod';

export const intentionOptions = ['optimize', 'validate', 'urgency'] as const;

export const profilingSchema = z.object({
  name: z.string().min(2, 'Introduce tu nombre'),
  email: z.string().email('Introduce un email válido'),
  taxFamiliarity: z.number().min(1).max(5),
  aiDailyUse: z.boolean(),
  usedAiForTaxes: z.boolean(),
  consultedExpert: z.boolean(),
  intentionPriority: z
    .array(z.enum(intentionOptions))
    .min(1, 'Selecciona al menos una intención')
    .max(3),
});

export const expectationsSchema = z.object({
  q9_omniPromise: z
    .array(z.string())
    .min(1, 'Selecciona al menos una opción')
    .max(3, 'Máximo 3 opciones'),
  q9_other: z.string().max(140).optional(),
  q10_expectations: z
    .array(z.string())
    .min(1, 'Selecciona al menos una opción')
    .max(3, 'Máximo 3 opciones'),
  q10_other: z.string().max(140).optional(),
  q11_dataExpected: z
    .array(z.string())
    .min(1, 'Selecciona al menos una opción')
    .max(3, 'Máximo 3 opciones'),
  q11_other: z.string().max(140).optional(),
  q12_concerns: z
    .array(z.string())
    .min(1, 'Selecciona al menos una opción')
    .max(2, 'Máximo 2 opciones'),
  q12_other: z.string().max(140).optional(),
});

export const trustSchema = z.object({
  q13_responsibility: z.string().min(1, 'Selecciona una opción'),
  q14_trustSignals: z
    .array(z.string())
    .min(1, 'Selecciona al menos una opción')
    .max(3, 'Máximo 3 opciones'),
  q15_format: z.string().min(1, 'Selecciona una opción'),
  q16_controls: z
    .array(z.string())
    .min(1, 'Selecciona al menos una opción')
    .max(2, 'Máximo 2 opciones'),
  q17_uncertainty: z.string().min(1, 'Selecciona una opción'),
  q18_errorHandling: z.string().min(1, 'Selecciona una opción'),
  q19_openText: z.string().max(300).optional(),
});

export const fullSubmissionSchema = z.object({
  participantId: z.string(),
  consent: z.literal(true),
  ...profilingSchema.shape,
  personaId: z.string(),
  personaName: z.string(),
  personaRationale: z.string(),
  ...expectationsSchema.shape,
  ...trustSchema.shape,
});

export type ProfilingData = z.infer<typeof profilingSchema>;
export type ExpectationsData = z.infer<typeof expectationsSchema>;
export type TrustData = z.infer<typeof trustSchema>;
export type FullSubmission = z.infer<typeof fullSubmissionSchema>;
