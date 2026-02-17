import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/db';

export async function GET(req: Request) {
  const authHeader = req.headers.get('x-admin-password');
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const persona = url.searchParams.get('persona') || undefined;

  try {
    const data = await getSubmissions(persona);
    return NextResponse.json({ submissions: data });
  } catch (err) {
    console.error('Admin submissions error:', err);
    return NextResponse.json({ error: 'Error fetching submissions' }, { status: 500 });
  }
}
