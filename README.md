# OMNI Pre-Survey — Workshop

Encuesta web para el workshop de OMNI (TaxDown). Recoge expectativas de participantes externos sobre un asistente fiscal conversacional, asigna automaticamente un user persona y genera un PDF con las respuestas.

## Stack

- **Next.js 14+ App Router** + TypeScript + TailwindCSS
- **react-hook-form** + **zod** — validacion de formularios
- **pdf-lib** — generacion de PDF (server-side)
- **Supabase** — base de datos PostgreSQL
- **Resend** — envio de emails con adjuntos
- **@dnd-kit** — drag-and-drop para ranking de intenciones

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

Crea un proyecto en [supabase.com](https://supabase.com) y ejecuta este SQL en el SQL Editor:

```sql
CREATE TABLE submissions (
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
);

-- Index for admin filtering
CREATE INDEX idx_submissions_persona ON submissions(persona_name);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);
```

### 3. Configurar Resend

Crea una cuenta en [resend.com](https://resend.com) y obten tu API key.

> **Nota:** Con la cuenta gratuita de Resend, el remitente sera `onboarding@resend.dev` y solo puedes enviar al email verificado de tu cuenta. Para produccion, verifica un dominio propio.

### 4. Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripcion |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Settings > API) |
| `RESEND_API_KEY` | API key de Resend |
| `ORGANIZER_EMAIL` | Email donde llegan los PDFs |
| `ADMIN_PASSWORD` | Contrasena para /admin |

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

### Opcion A: CLI

```bash
npm i -g vercel
vercel
```

### Opcion B: GitHub

1. Sube el repo a GitHub
2. Importa en [vercel.com/new](https://vercel.com/new)
3. Anade las variables de entorno en Settings > Environment Variables
4. Deploy

### Variables de entorno en Vercel

Anade las mismas 5 variables de `.env.example` en el dashboard de Vercel (Settings > Environment Variables).

## Estructura

```
src/
  app/
    page.tsx                 # Landing (Step 0 — consent)
    survey/page.tsx          # Wizard (Steps 1-3)
    success/page.tsx         # Pantalla de exito
    admin/page.tsx           # Panel admin (protegido)
    api/
      submit/route.ts        # POST: guardar + PDF + email
      auth/route.ts          # POST: login admin
      admin/
        submissions/         # GET: listar respuestas
        export/              # GET: CSV/JSON export
  components/                # Componentes React del wizard
  lib/
    personas.ts              # 19 personas + algoritmo de mapeo
    schema.ts                # Schemas Zod
    pdf.ts                   # Generacion PDF con pdf-lib
    email.ts                 # Envio email con Resend
    supabase.ts              # Cliente Supabase
    questions.ts             # Opciones de preguntas
    participant-id.ts        # Generador TD-OMNI-XXXX
```

## Flujo

1. **Landing** > Consentimiento GDPR > "Empezar"
2. **Paso 1** > Datos + perfil > auto-asignacion de persona
3. **Paso 2** > Expectativas sobre OMNI (Q9-Q12)
4. **Paso 3** > Confianza y controles (Q13-Q19) > "Enviar"
5. **Submit** > DB + PDF + Email al organizador
6. **Success** > "Gracias, tu respuesta ha sido enviada."

## Admin

Accede a `/admin` con la contrasena definida en `ADMIN_PASSWORD`. Permite:
- Ver todas las respuestas
- Filtrar por persona
- Exportar CSV o JSON
