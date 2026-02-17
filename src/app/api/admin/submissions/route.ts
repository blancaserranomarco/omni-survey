import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const authHeader = req.headers.get('x-admin-password');
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
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

  return NextResponse.json({ submissions: data });
}
