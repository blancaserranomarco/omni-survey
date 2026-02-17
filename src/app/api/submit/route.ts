import { NextResponse } from 'next/server';
import { fullSubmissionSchema } from '@/lib/schema';
import { initDB, insertSubmission } from '@/lib/db';
import { generatePdf } from '@/lib/pdf';
import { sendSubmissionEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = fullSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Ensure table exists
    await initDB();

    // Insert into DB
    try {
      await insertSubmission({
        participant_id: data.participantId,
        name: data.name,
        email: data.email,
        tax_familiarity: data.taxFamiliarity,
        ai_daily_use: data.aiDailyUse,
        used_ai_for_taxes: data.usedAiForTaxes,
        consulted_expert: data.consultedExpert,
        intention_priority: data.intentionPriority,
        persona_id: data.personaId,
        persona_name: data.personaName,
        persona_rationale: data.personaRationale,
        answers: {
          q9_omniPromise: data.q9_omniPromise,
          q9_other: data.q9_other,
          q10_expectations: data.q10_expectations,
          q10_other: data.q10_other,
          q11_dataExpected: data.q11_dataExpected,
          q11_other: data.q11_other,
          q12_concerns: data.q12_concerns,
          q12_other: data.q12_other,
          q13_responsibility: data.q13_responsibility,
          q14_trustSignals: data.q14_trustSignals,
          q15_format: data.q15_format,
          q16_controls: data.q16_controls,
          q17_uncertainty: data.q17_uncertainty,
          q18_errorHandling: data.q18_errorHandling,
          q19_openText: data.q19_openText,
        },
        consent: data.consent,
      });
    } catch (dbErr) {
      console.error('DB insert error:', dbErr);
      return NextResponse.json(
        { error: 'Error al guardar la respuesta' },
        { status: 500 }
      );
    }

    // Generate PDF
    let pdfBuffer: Buffer;
    try {
      const pdfBytes = await generatePdf(data);
      pdfBuffer = Buffer.from(pdfBytes);
    } catch (pdfErr) {
      console.error('PDF generation error:', pdfErr);
      pdfBuffer = Buffer.from('PDF generation failed');
    }

    // Send email
    try {
      await sendSubmissionEmail({
        participantId: data.participantId,
        personaName: data.personaName,
        name: data.name,
        email: data.email,
        pdfBuffer,
        jsonData: JSON.stringify(data, null, 2),
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }

    return NextResponse.json({ success: true, participantId: data.participantId });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
