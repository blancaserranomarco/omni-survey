'use client';

interface Props {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export default function RadioGroup({ options, value, onChange, error }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-2.5 rounded-lg text-[13px] text-left transition-all duration-200 border ${
              value === opt
                ? 'border-accent/50 bg-accent-soft text-accent-text font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                : 'border-border bg-surface text-text-secondary hover:border-accent/30 hover:bg-accent-soft/50 hover:text-text-primary'
            }`}
          >
            {value === opt && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle" />
            )}
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
