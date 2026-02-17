'use client';

const STEPS = ['Perfil', 'Expectativas', 'Confianza'];

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEPS.map((label, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={label} className="flex items-center gap-1">
            {i > 0 && (
              <div className="relative w-10 sm:w-16 h-px mx-1">
                <div className="absolute inset-0 bg-border" />
                <div
                  className="absolute inset-y-0 left-0 bg-accent transition-all duration-500 ease-out"
                  style={{ width: isDone ? '100%' : '0%' }}
                />
              </div>
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-mono transition-all duration-300 ${
                  isActive
                    ? 'bg-accent text-white shadow-[0_0_16px_rgba(200,89,62,0.3)]'
                    : isDone
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'bg-surface text-text-muted border border-border'
                }`}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${
                  isActive ? 'text-text-primary' : isDone ? 'text-accent/70' : 'text-text-muted'
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
