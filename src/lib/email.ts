import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendSubmissionEmail(params: {
  participantId: string;
  personaName: string;
  name: string;
  email: string;
  pdfBuffer: Buffer;
  jsonData: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not set — skipping submission email.');
    return;
  }

  const { participantId, personaName, name, email, pdfBuffer, jsonData } = params;
  const organizerEmail = process.env.ORGANIZER_EMAIL!;

  await getResend().emails.send({
    from: 'OMNI Survey <onboarding@resend.dev>',
    to: organizerEmail,
    subject: `Nueva respuesta OMNI Survey — ${participantId} — ${personaName}`,
    html: `
      <h2>Nueva respuesta de encuesta OMNI</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Participant ID:</td><td>${participantId}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Nombre:</td><td>${name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email:</td><td>${email}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Persona:</td><td>${personaName}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Fecha:</td><td>${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666;">PDF y JSON adjuntos.</p>
    `,
    attachments: [
      {
        filename: `${participantId}.pdf`,
        content: pdfBuffer,
      },
      {
        filename: `${participantId}.json`,
        content: Buffer.from(jsonData),
      },
    ],
  });
}
