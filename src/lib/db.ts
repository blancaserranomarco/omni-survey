import { neon } from '@neondatabase/serverless';

function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  return neon(url);
}

export async function initDB() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      participant_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      tax_familiarity INT NOT NULL,
      ai_daily_use BOOLEAN NOT NULL,
      used_ai_for_taxes BOOLEAN NOT NULL,
      consulted_expert BOOLEAN NOT NULL,
      intention_priority JSONB NOT NULL,
      persona_id TEXT NOT NULL,
      persona_name TEXT NOT NULL,
      persona_rationale TEXT NOT NULL,
      answers JSONB NOT NULL,
      consent BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function insertSubmission(data: {
  participant_id: string;
  name: string;
  email: string;
  tax_familiarity: number;
  ai_daily_use: boolean;
  used_ai_for_taxes: boolean;
  consulted_expert: boolean;
  intention_priority: unknown;
  persona_id: string;
  persona_name: string;
  persona_rationale: string;
  answers: unknown;
  consent: boolean;
}) {
  const sql = getSQL();
  await sql`
    INSERT INTO submissions (
      participant_id, name, email, tax_familiarity,
      ai_daily_use, used_ai_for_taxes, consulted_expert,
      intention_priority, persona_id, persona_name, persona_rationale,
      answers, consent
    ) VALUES (
      ${data.participant_id}, ${data.name}, ${data.email}, ${data.tax_familiarity},
      ${data.ai_daily_use}, ${data.used_ai_for_taxes}, ${data.consulted_expert},
      ${JSON.stringify(data.intention_priority)}, ${data.persona_id}, ${data.persona_name}, ${data.persona_rationale},
      ${JSON.stringify(data.answers)}, ${data.consent}
    )
  `;
}

export async function getSubmissions(personaFilter?: string) {
  const sql = getSQL();
  if (personaFilter) {
    return sql`
      SELECT * FROM submissions
      WHERE persona_name = ${personaFilter}
      ORDER BY created_at DESC
    `;
  }
  return sql`SELECT * FROM submissions ORDER BY created_at DESC`;
}
