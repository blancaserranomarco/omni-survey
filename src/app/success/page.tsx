export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-sage/[0.06] blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <div className="card-surface p-10 animate-scale-in">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-fade-in-up stagger-1"
            style={{ backgroundColor: 'rgba(110, 138, 94, 0.15)' }}
          >
            <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-3 animate-fade-in-up stagger-2">
            Gracias, tu respuesta
            <br />
            <span className="font-serif italic text-sage">ha sido enviada.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed animate-fade-in-up stagger-3">
            Tu feedback nos ayuda a disenar un asistente fiscal que realmente sea util.
            No necesitas hacer nada mas.
          </p>
        </div>

        <p className="text-[11px] font-mono text-text-muted mt-8 tracking-wide animate-fade-in stagger-4">
          OMNI (TaxDown) — Workshop Pre-Survey
        </p>
      </div>
    </div>
  );
}
