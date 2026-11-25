import type { FormEvent } from 'react';
import type { StudioFormValues } from '../types';

interface LoanFormProps {
  draft: StudioFormValues;
  error: string | null;
  onChange: (next: StudioFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  hint?: string;
  onChange: (value: number) => void;
}

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  hint,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="field-shell">
        <input
          className="field-input"
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => {
            const nextValue = event.currentTarget.valueAsNumber;
            if (Number.isFinite(nextValue)) {
              onChange(nextValue);
            }
          }}
        />
        <span className="field-suffix" aria-hidden="true">
          {suffix}
        </span>
      </div>
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function LoanForm({ draft, error, onChange, onSubmit }: LoanFormProps) {
  return (
    <form className="input-rail" onSubmit={onSubmit}>
      <div className="space-y-5">
        <NumberField
          id="principal"
          label="Kreditbetrag"
          value={draft.principal}
          min={100}
          max={10_000_000}
          step={100}
          suffix="€"
          hint="Betrag ohne Gebühren"
          onChange={(principal) => onChange({ ...draft, principal })}
        />
        <NumberField
          id="annual-rate"
          label="Effektiver Jahreszins"
          value={draft.annualRatePercent}
          min={0}
          max={1_000}
          step={0.01}
          suffix="%"
          hint="Effektiver Zinssatz pro Jahr"
          onChange={(annualRatePercent) =>
            onChange({ ...draft, annualRatePercent })
          }
        />
        <NumberField
          id="duration"
          label="Laufzeit"
          value={draft.durationMonths}
          min={1}
          max={1_200}
          suffix="Monate"
          hint="Zwischen 1 und 1.200 Monaten"
          onChange={(durationMonths) =>
            onChange({
              ...draft,
              durationMonths,
              extraRepaymentMonth: Math.min(
                draft.extraRepaymentMonth,
                durationMonths,
              ),
            })
          }
        />
      </div>

      <div className="my-6 h-px bg-slate-700" />

      <label className="flex cursor-pointer items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-100">
          Sondertilgung (optional)
        </span>
        <input
          className="peer sr-only"
          type="checkbox"
          checked={draft.extraRepaymentEnabled}
          onChange={(event) =>
            onChange({
              ...draft,
              extraRepaymentEnabled: event.currentTarget.checked,
            })
          }
        />
        <span className="relative h-7 w-12 rounded-full bg-slate-600 transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-emerald-400 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-300" />
      </label>

      <fieldset
        className="mt-5 space-y-5 disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!draft.extraRepaymentEnabled}
      >
        <NumberField
          id="extra-amount"
          label="Sondertilgung"
          value={draft.extraRepaymentAmount}
          min={0}
          max={10_000_000}
          step={100}
          suffix="€"
          onChange={(extraRepaymentAmount) =>
            onChange({ ...draft, extraRepaymentAmount })
          }
        />
        <NumberField
          id="extra-month"
          label="Monat der Sondertilgung"
          value={draft.extraRepaymentMonth}
          min={1}
          max={draft.durationMonths}
          suffix="Monat"
          onChange={(extraRepaymentMonth) =>
            onChange({ ...draft, extraRepaymentMonth })
          }
        />
      </fieldset>

      {error ? (
        <p className="mt-5 text-sm leading-5 text-rose-300" role="alert">
          {error}
        </p>
      ) : null}

      <button className="primary-button mt-7" type="submit">
        Simulation aktualisieren
      </button>
    </form>
  );
}
