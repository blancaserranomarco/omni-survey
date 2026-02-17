import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  if (password === adminPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
}
