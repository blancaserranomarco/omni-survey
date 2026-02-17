import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const authHeader = req.headers.get('x-admin-password');
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'json';
  const persona = url.searchParams.get('persona');

  let query = getSupabase()
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (persona) {
    query = query.eq('persona_name', persona);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (format === 'csv') {
    if (!data || data.length === 0) {
      return new Response('No data', { status: 200, headers: { 'Content-Type': 'text/csv' } });
    }

    const flatRows = data.map((row) => ({
      participant_id: row.participant_id,
      name: row.name,
      email: row.email,
      tax_familiarity: row.tax_familiarity,
      ai_daily_use: row.ai_daily_use,
      used_ai_for_taxes: row.used_ai_for_taxes,
      consulted_expert: row.consulted_expert,
      intention_priority: JSON.stringify(row.intention_priority),
      persona_id: row.persona_id,
      persona_name: row.persona_name,
      persona_rationale: row.persona_rationale,
      ...flattenAnswers(row.answers),
      created_at: row.created_at,
    }));

    const headers = Object.keys(flatRows[0]);
    const csvLines = [
      headers.join(','),
      ...flatRows.map((row) =>
        headers.map((h) => {
          const val = String((row as Record<string, unknown>)[h] ?? '');
          return `"${val.replace(/"/g, '""')}"`;
        }).join(',')
      ),
    ];

    return new Response(csvLines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="omni-survey-export.csv"`,
      },
    });
  }

  // JSON
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="omni-survey-export.json"`,
    },
  });
}

function flattenAnswers(answers: Record<string, unknown>) {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(answers || {})) {
    if (Array.isArray(value)) {
      flat[key] = value.join('; ');
    } else {
      flat[key] = String(value ?? '');
    }
  }
  return flat;
}
