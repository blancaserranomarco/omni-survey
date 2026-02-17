'use client';

import { useState } from 'react';

interface Props {
  options: string[];
  max: number;
  value: string[];
  onChange: (val: string[]) => void;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  error?: string;
}

export default function MultiSelectMax({
  options,
  max,
  value,
  onChange,
  allowOther = false,
  otherValue = '',
  onOtherChange,
  error,
}: Props) {
  const [showOther, setShowOther] = useState(false);

  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else if (value.length < max) {
      onChange([...value, option]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value.includes(opt);
          const disabled = !selected && value.length >= max;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              disabled={disabled}
              className={`px-3 py-2.5 rounded-lg text-[13px] text-left transition-all duration-200 border ${
                selected
                  ? 'border-accent/50 bg-accent-soft text-accent-text font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : disabled
                    ? 'border-border/50 bg-card/50 text-text-muted/40 cursor-not-allowed'
                    : 'border-border bg-surface text-text-secondary hover:border-accent/30 hover:bg-accent-soft/50 hover:text-text-primary'
              }`}
            >
              {selected && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle" />
              )}
              {opt}
            </button>
          );
        })}
      </div>

      {allowOther && (
        <div className="mt-3">
          {!showOther ? (
            <button
              type="button"
              onClick={() => setShowOther(true)}
              className="text-[13px] text-accent/70 hover:text-accent transition-colors"
            >
              + Otro
            </button>
          ) : (
            <input
              type="text"
              maxLength={140}
              placeholder="Otro (max 140 caracteres)"
              value={otherValue}
              onChange={(e) => onOtherChange?.(e.target.value)}
            />
          )}
        </div>
      )}

      <div className="mt-2 flex justify-between items-center">
        {error ? (
          <p className="text-red-400 text-xs">{error}</p>
        ) : (
          <span />
        )}
        <p className="text-[11px] font-mono text-text-muted">
          {value.length}/{max}
        </p>
      </div>
    </div>
  );
}
