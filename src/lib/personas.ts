// 19 User Personas de TaxDown — adapted from TARJETA_PARTICIPANTE_WORKSHOP.html

export interface Persona {
  id: string;
  name: string;
  shortDesc: string;
  color: string;
}

export const PERSONAS: Persona[] = [
  { id: 'laura', name: 'Laura', shortDesc: 'Joven, 1ª renta', color: '#22c55e' },
  { id: 'oscar', name: 'Oscar', shortDesc: 'Senior, cuenta ajena', color: '#22c55e' },
  { id: 'lucia', name: 'Lucía', shortDesc: 'Jubilada', color: '#8b5cf6' },
  { id: 'ali', name: 'Alí', shortDesc: 'Extranjero residente', color: '#f59e0b' },
  { id: 'thomas', name: 'Thomas', shortDesc: 'Impatriado (Beckham)', color: '#f59e0b' },
  { id: 'alvaro', name: 'Álvaro', shortDesc: 'Expatriado (7P)', color: '#f59e0b' },
  { id: 'inigo', name: 'Íñigo', shortDesc: 'Primer hijo', color: '#3b82f6' },
  { id: 'irene', name: 'Irene', shortDesc: 'Fam. numerosa', color: '#3b82f6' },
  { id: 'jaime', name: 'Jaime', shortDesc: 'Conjunta', color: '#3b82f6' },
  { id: 'monica', name: 'Mónica', shortDesc: 'Monoparental', color: '#3b82f6' },
  { id: 'manu', name: 'Manu', shortDesc: 'Compra vivienda', color: '#10b981' },
  { id: 'elena', name: 'Elena', shortDesc: 'Multipropietario', color: '#10b981' },
  { id: 'marivi', name: 'Mariví', shortDesc: 'Venta vivienda', color: '#10b981' },
  { id: 'edu', name: 'Edu', shortDesc: 'Activo digital (cripto)', color: '#ec4899' },
  { id: 'aitor', name: 'Aitor', shortDesc: 'Curioso digital', color: '#ec4899' },
  { id: 'begona', name: 'Begoña', shortDesc: 'Moderado tradicional', color: '#ec4899' },
  { id: 'jl', name: 'JL', shortDesc: 'Freelancer digital', color: '#6366f1' },
  { id: 'ana', name: 'Ana', shortDesc: 'Pequeño empresario', color: '#6366f1' },
  { id: 'otro', name: 'Otro', shortDesc: 'No encaja claramente', color: '#9ca3af' },
];

export type IntentionType = 'optimize' | 'validate' | 'urgency';

export interface ProfilingInput {
  taxFamiliarity: number;        // 1-5
  aiDailyUse: boolean;
  usedAiForTaxes: boolean;
  consultedExpert: boolean;
  intentionPriority: IntentionType[];  // ordered array, 1-3 items
}

export interface PersonaResult {
  personaId: string;
  personaName: string;
  rationale: string;
}

/**
 * Adapted mapping algorithm from TARJETA_PARTICIPANTE_WORKSHOP.html.
 * Original used detailed fiscal data (age, employment, property, crypto, etc.).
 * This version maps simplified profiling inputs to the same 19 personas
 * using a weighted scoring approach.
 */
export function mapToPersona(input: ProfilingInput): PersonaResult {
  const { taxFamiliarity, aiDailyUse, usedAiForTaxes, consultedExpert, intentionPriority } = input;

  const primaryIntention = intentionPriority[0] || 'validate';
  const isDigital = aiDailyUse;
  const isAiTaxUser = usedAiForTaxes;
  const isLowTax = taxFamiliarity <= 2;
  const isMedTax = taxFamiliarity === 3;
  const isHighTax = taxFamiliarity >= 4;
  const isVeryHighTax = taxFamiliarity === 5;

  type Suggestion = { id: string; name: string; score: number; reason: string };
  const suggestions: Suggestion[] = [];

  // --- Laura: Joven, 1ª renta ---
  // Low tax knowledge, no expert, no AI for taxes, urgency or validate
  if (isLowTax && !consultedExpert && !isAiTaxUser && !isDigital) {
    suggestions.push({
      id: 'laura', name: 'Laura', score: 90,
      reason: 'Poca experiencia fiscal y no usa herramientas digitales — perfil de primera declaración',
    });
  }
  if (taxFamiliarity === 1 && !consultedExpert) {
    suggestions.push({
      id: 'laura', name: 'Laura', score: 80,
      reason: 'Familiaridad fiscal muy baja, sin asesor — probablemente primeras rentas',
    });
  }

  // --- Oscar: Senior, cuenta ajena, experiencia ---
  if (isHighTax && !isDigital && !consultedExpert && primaryIntention === 'validate') {
    suggestions.push({
      id: 'oscar', name: 'Oscar', score: 85,
      reason: 'Alta familiaridad fiscal, autosuficiente, busca validar — perfil senior experimentado',
    });
  }
  if (isHighTax && !isDigital && primaryIntention === 'validate') {
    suggestions.push({
      id: 'oscar', name: 'Oscar', score: 70,
      reason: 'Conocimiento fiscal alto, perfil no-digital que busca validación',
    });
  }

  // --- Lucía: Jubilada ---
  if (isMedTax && consultedExpert && !isDigital && primaryIntention === 'validate') {
    suggestions.push({
      id: 'lucia', name: 'Lucía', score: 75,
      reason: 'Familiaridad media, depende de expertos, no digital — perfil tradicional con experiencia',
    });
  }

  // --- Alí: Extranjero residente ---
  if (taxFamiliarity === 1 && isDigital && primaryIntention === 'urgency') {
    suggestions.push({
      id: 'ali', name: 'Alí', score: 75,
      reason: 'Muy poca familiaridad fiscal pero digital, con urgencia — posible caso de extranjero residente',
    });
  }

  // --- Thomas: Impatriado (Beckham) ---
  if (isLowTax && isDigital && consultedExpert && primaryIntention === 'optimize') {
    suggestions.push({
      id: 'thomas', name: 'Thomas', score: 70,
      reason: 'Baja familiaridad + digital + experto + optimizar — posible caso especial (impatriado)',
    });
  }

  // --- Álvaro: Expatriado ---
  if (isLowTax && isDigital && consultedExpert && primaryIntention === 'urgency') {
    suggestions.push({
      id: 'alvaro', name: 'Álvaro', score: 70,
      reason: 'Baja familiaridad + digital + experto + urgencia — posible caso expatriado',
    });
  }

  // --- Íñigo: Primer hijo ---
  if (isMedTax && !consultedExpert && !isDigital && primaryIntention === 'validate') {
    suggestions.push({
      id: 'inigo', name: 'Íñigo', score: 75,
      reason: 'Familiaridad media, autogestión, busca validar — perfil de transición vital (nuevo hijo, nueva compra)',
    });
  }

  // --- Irene: Familia numerosa ---
  if (isMedTax && consultedExpert && primaryIntention === 'optimize') {
    suggestions.push({
      id: 'irene', name: 'Irene', score: 72,
      reason: 'Caso medio-complejo, usa experto, busca optimizar — perfil familiar con complejidad',
    });
  }

  // --- Jaime: Conjunta ---
  if (isMedTax && !isDigital && consultedExpert && primaryIntention === 'validate') {
    suggestions.push({
      id: 'jaime', name: 'Jaime', score: 73,
      reason: 'Familiaridad media, confía en expertos, busca validar — perfil de declaración conjunta',
    });
  }

  // --- Mónica: Monoparental ---
  if (isLowTax && !isDigital && primaryIntention === 'urgency') {
    suggestions.push({
      id: 'monica', name: 'Mónica', score: 80,
      reason: 'Baja familiaridad, no digital, urgencia — perfil vulnerable que necesita orientación rápida',
    });
  }
  if (isLowTax && primaryIntention === 'urgency' && !consultedExpert) {
    suggestions.push({
      id: 'monica', name: 'Mónica', score: 75,
      reason: 'Poca familiaridad fiscal con urgencia y sin asesor — necesita guía directa',
    });
  }

  // --- Manu: Compra vivienda ---
  if (isLowTax && isDigital && !consultedExpert && primaryIntention === 'validate') {
    suggestions.push({
      id: 'manu', name: 'Manu', score: 78,
      reason: 'Digital pero novato fiscal, busca seguridad y validación — perfil de primera gestión importante',
    });
  }

  // --- Elena: Multipropietario ---
  if (isVeryHighTax && consultedExpert && primaryIntention === 'optimize') {
    suggestions.push({
      id: 'elena', name: 'Elena', score: 85,
      reason: 'Máxima familiaridad + experto + optimizar — perfil complejo con múltiples activos',
    });
  }

  // --- Mariví: Venta vivienda ---
  if (isHighTax && consultedExpert && primaryIntention === 'validate') {
    suggestions.push({
      id: 'marivi', name: 'Mariví', score: 72,
      reason: 'Alta familiaridad con experto y necesidad de validar — perfil de operación puntual importante',
    });
  }

  // --- Edu: Activo digital (cripto) ---
  if (isMedTax && isDigital && isAiTaxUser && primaryIntention === 'optimize') {
    suggestions.push({
      id: 'edu', name: 'Edu', score: 88,
      reason: 'Digital activo, ya usa IA fiscal, busca optimizar — perfil inversor digital',
    });
  }
  if (isHighTax && isDigital && isAiTaxUser && primaryIntention === 'optimize') {
    suggestions.push({
      id: 'edu', name: 'Edu', score: 85,
      reason: 'Perfil altamente digital con experiencia fiscal y IA — inversor activo',
    });
  }

  // --- Aitor: Curioso digital ---
  if (isMedTax && isDigital && isAiTaxUser && primaryIntention === 'validate') {
    suggestions.push({
      id: 'aitor', name: 'Aitor', score: 82,
      reason: 'Digital, ya probó IA fiscal, busca validar — curioso digital explorando opciones',
    });
  }
  if (isLowTax && isDigital && isAiTaxUser) {
    suggestions.push({
      id: 'aitor', name: 'Aitor', score: 70,
      reason: 'Poco conocimiento fiscal pero ya probó IA — curioso digital',
    });
  }

  // --- Begoña: Moderado tradicional ---
  if (isHighTax && !isDigital && consultedExpert && primaryIntention === 'optimize') {
    suggestions.push({
      id: 'begona', name: 'Begoña', score: 80,
      reason: 'Alto conocimiento, usa experto, no digital — perfil tradicional que busca optimizar',
    });
  }
  if (isHighTax && !isDigital && consultedExpert) {
    suggestions.push({
      id: 'begona', name: 'Begoña', score: 68,
      reason: 'Experto tradicional con buen conocimiento fiscal',
    });
  }

  // --- JL: Freelancer digital ---
  if (isMedTax && isDigital && !consultedExpert && primaryIntention === 'urgency') {
    suggestions.push({
      id: 'jl', name: 'JL', score: 82,
      reason: 'Digital, autónomo en lo fiscal, necesita ayuda rápida — perfil freelancer',
    });
  }
  if (isLowTax && isDigital && !consultedExpert && primaryIntention === 'urgency') {
    suggestions.push({
      id: 'jl', name: 'JL', score: 76,
      reason: 'Digital pero poco experto en impuestos, con urgencia — necesita resolución rápida',
    });
  }

  // --- Ana: Pequeño empresario ---
  if (isHighTax && isDigital && primaryIntention === 'optimize' && consultedExpert) {
    suggestions.push({
      id: 'ana', name: 'Ana', score: 82,
      reason: 'Alto conocimiento + digital + experto + optimizar — perfil empresarial',
    });
  }
  if (isVeryHighTax && isDigital && primaryIntention === 'optimize') {
    suggestions.push({
      id: 'ana', name: 'Ana', score: 78,
      reason: 'Máxima familiaridad fiscal y digital, busca optimizar — perfil empresarial avanzado',
    });
  }

  // --- Fallback ---
  if (suggestions.length === 0) {
    // General fallbacks based on primary dimension
    if (isDigital && primaryIntention === 'optimize') {
      suggestions.push({
        id: 'edu', name: 'Edu', score: 50,
        reason: 'Perfil digital orientado a optimización',
      });
    } else if (isDigital && primaryIntention === 'urgency') {
      suggestions.push({
        id: 'jl', name: 'JL', score: 50,
        reason: 'Perfil digital con necesidad de respuesta rápida',
      });
    } else if (isDigital) {
      suggestions.push({
        id: 'aitor', name: 'Aitor', score: 50,
        reason: 'Perfil digital — curioso y explorador',
      });
    } else if (consultedExpert) {
      suggestions.push({
        id: 'begona', name: 'Begoña', score: 50,
        reason: 'Confía en asesores — perfil tradicional',
      });
    } else {
      suggestions.push({
        id: 'oscar', name: 'Oscar', score: 40,
        reason: 'Perfil estándar — caso base',
      });
    }
  }

  // De-duplicate by persona id, keep highest score
  const bestByPersona = new Map<string, Suggestion>();
  for (const s of suggestions) {
    const existing = bestByPersona.get(s.id);
    if (!existing || s.score > existing.score) {
      bestByPersona.set(s.id, s);
    }
  }

  const sorted = Array.from(bestByPersona.values()).sort((a, b) => b.score - a.score);
  const top = sorted[0];

  return {
    personaId: top.id,
    personaName: top.name,
    rationale: top.reason,
  };
}
