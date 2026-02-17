import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { FullSubmission } from './schema';

const INTENTION_LABELS: Record<string, string> = {
  optimize: 'Optimizar ("Quiero optimizar")',
  validate: 'Validar ("¿Lo estoy haciendo bien?")',
  urgency: 'Urgencia ("Ayúdame ya")',
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

interface DrawContext {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  boldFont: PDFFont;
  y: number;
  pageNum: number;
}

function newPage(ctx: DrawContext): DrawContext {
  const page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  ctx.pageNum++;
  return { ...ctx, page, y: PAGE_HEIGHT - MARGIN };
}

function ensureSpace(ctx: DrawContext, needed: number): DrawContext {
  if (ctx.y - needed < MARGIN + 30) {
    return newPage(ctx);
  }
  return ctx;
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawText(
  ctx: DrawContext,
  text: string,
  opts: { fontSize?: number; bold?: boolean; color?: [number, number, number]; indent?: number } = {}
): DrawContext {
  const fontSize = opts.fontSize || 10;
  const font = opts.bold ? ctx.boldFont : ctx.font;
  const indent = opts.indent || 0;
  const color = opts.color || [0.1, 0.1, 0.1];

  const lines = wrapText(text, font, fontSize, CONTENT_WIDTH - indent);
  for (const line of lines) {
    ctx = ensureSpace(ctx, fontSize + 4);
    ctx.page.drawText(line, {
      x: MARGIN + indent,
      y: ctx.y,
      size: fontSize,
      font,
      color: rgb(color[0], color[1], color[2]),
    });
    ctx.y -= fontSize + 4;
  }
  return ctx;
}

function drawSectionHeader(ctx: DrawContext, title: string): DrawContext {
  ctx = ensureSpace(ctx, 30);
  ctx.y -= 12;
  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.y - 2,
    width: CONTENT_WIDTH,
    height: 18,
    color: rgb(0.95, 0.95, 0.97),
  });
  ctx.page.drawText(title.toUpperCase(), {
    x: MARGIN + 8,
    y: ctx.y + 2,
    size: 9,
    font: ctx.boldFont,
    color: rgb(0.4, 0.4, 0.5),
  });
  ctx.y -= 24;
  return ctx;
}

function drawField(ctx: DrawContext, label: string, value: string | string[]): DrawContext {
  ctx = ensureSpace(ctx, 20);
  ctx = drawText(ctx, label, { bold: true, fontSize: 9, color: [0.4, 0.4, 0.45] });
  if (Array.isArray(value)) {
    for (const v of value) {
      ctx = drawText(ctx, `  - ${v}`, { fontSize: 10, indent: 8 });
    }
  } else {
    ctx = drawText(ctx, value, { fontSize: 10, indent: 8 });
  }
  ctx.y -= 4;
  return ctx;
}

function addPageNumbers(doc: PDFDocument, font: PDFFont) {
  const pages = doc.getPages();
  for (let i = 0; i < pages.length; i++) {
    pages[i].drawText(`${i + 1} / ${pages.length}`, {
      x: PAGE_WIDTH / 2 - 15,
      y: 20,
      size: 8,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });
  }
}

export async function generatePdf(data: FullSubmission): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const firstPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let ctx: DrawContext = {
    doc,
    page: firstPage,
    font,
    boldFont,
    y: PAGE_HEIGHT - MARGIN,
    pageNum: 1,
  };

  // --- COVER ---
  ctx = drawText(ctx, 'OMNI Pre-Survey', { fontSize: 22, bold: true, color: [0.35, 0.22, 0.65] });
  ctx.y -= 4;
  ctx = drawText(ctx, `${data.participantId} — ${data.personaName}`, {
    fontSize: 14,
    bold: true,
    color: [0.2, 0.2, 0.2],
  });
  ctx.y -= 8;

  // Divider
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_WIDTH - MARGIN, y: ctx.y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.88),
  });
  ctx.y -= 16;

  ctx = drawField(ctx, 'Participant ID', data.participantId);
  ctx = drawField(ctx, 'Nombre', data.name);
  ctx = drawField(ctx, 'Email', data.email);
  ctx = drawField(ctx, 'Persona asignada', `${data.personaName} (${data.personaId})`);
  ctx = drawField(ctx, 'Motivo', data.personaRationale);
  ctx = drawField(ctx, 'Fecha', new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }));

  // --- PROFILING ---
  ctx = drawSectionHeader(ctx, 'Paso 1 — Perfil del participante');
  ctx = drawField(ctx, 'Familiaridad con impuestos', `${data.taxFamiliarity}/5`);
  ctx = drawField(ctx, '¿Usa agentes de IA a diario?', data.aiDailyUse ? 'Sí' : 'No');
  ctx = drawField(ctx, '¿Ha usado IA para temas fiscales?', data.usedAiForTaxes ? 'Sí' : 'No');
  ctx = drawField(ctx, '¿Ha consultado a un gestor/experto?', data.consultedExpert ? 'Sí' : 'No');
  ctx = drawField(
    ctx,
    'Intención (orden de prioridad)',
    data.intentionPriority.map((i, idx) => `${idx + 1}. ${INTENTION_LABELS[i] || i}`)
  );

  // --- EXPECTATIONS ---
  ctx = drawSectionHeader(ctx, 'Paso 2 — Expectativas');
  ctx = drawField(ctx, 'Q9: ¿Qué crees que es OMNI y qué te promete?', data.q9_omniPromise);
  if (data.q9_other) ctx = drawField(ctx, 'Q9 — Otro', data.q9_other);

  ctx = drawField(ctx, 'Q10: ¿Qué esperas que OMNI pueda hacer por ti?', data.q10_expectations);
  if (data.q10_other) ctx = drawField(ctx, 'Q10 — Otro', data.q10_other);

  ctx = drawField(ctx, 'Q11: ¿Qué crees que te pedirá OMNI?', data.q11_dataExpected);
  if (data.q11_other) ctx = drawField(ctx, 'Q11 — Otro', data.q11_other);

  ctx = drawField(ctx, 'Q12: ¿Qué te preocupa más?', data.q12_concerns);
  if (data.q12_other) ctx = drawField(ctx, 'Q12 — Otro', data.q12_other);

  // --- TRUST ---
  ctx = drawSectionHeader(ctx, 'Paso 3 — Confianza y controles');
  ctx = drawField(ctx, 'Q13: Nivel de responsabilidad esperado', data.q13_responsibility);
  ctx = drawField(ctx, 'Q14: Señales de confianza', data.q14_trustSignals);
  ctx = drawField(ctx, 'Q15: Formato de respuesta preferido', data.q15_format);
  ctx = drawField(ctx, 'Q16: Controles necesarios', data.q16_controls);
  ctx = drawField(ctx, 'Q17: Si OMNI no está seguro...', data.q17_uncertainty);
  ctx = drawField(ctx, 'Q18: Si OMNI falla...', data.q18_errorHandling);
  if (data.q19_openText) {
    ctx = drawField(ctx, 'Q19: Comentario abierto', data.q19_openText);
  }

  addPageNumbers(doc, font);
  return doc.save();
}
