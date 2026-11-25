import type { LoanCalculation } from '../../../engine';
import { formatEuro } from '../formatters';

interface ResultSummaryProps {
  calculation: LoanCalculation;
}

export function ResultSummary({ calculation }: ResultSummaryProps) {
  const metrics = [
    ['Monatsrate', calculation.monthlyInstallment],
    ['Gesamtrückzahlung', calculation.totalRepayment],
    ['Gesamtzinsen', calculation.totalInterest],
  ] as const;

  return (
    <section
      aria-labelledby="summary-heading"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 className="sr-only" id="summary-heading">
        Ergebnisübersicht
      </h2>
      <div className="metric-grid">
        {metrics.map(([label, value]) => (
          <div className="metric" key={label}>
            <p className="metric-label">{label}</p>
            <p className="metric-value">{formatEuro(value)}</p>
          </div>
        ))}
      </div>
      <p className="provenance-line">
        <span aria-hidden="true">●</span>
        Herkunft der Werte: deterministischer FinTrace-Rechenkern,
        Annuitätenmethode und effektiver Jahreszins.
      </p>
    </section>
  );
}
