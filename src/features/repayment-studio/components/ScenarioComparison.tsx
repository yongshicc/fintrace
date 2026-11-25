import type { ExtraRepaymentResult, LoanCalculation } from '../../../engine';
import { formatEuro } from '../formatters';

interface ScenarioComparisonProps {
  calculation: LoanCalculation;
  extraResult: ExtraRepaymentResult | null;
}

export function ScenarioComparison({
  calculation,
  extraResult,
}: ScenarioComparisonProps) {
  if (!extraResult) {
    return (
      <section className="data-section" aria-labelledby="comparison-heading">
        <h2 className="section-heading" id="comparison-heading">
          Szenariovergleich
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Aktiviere eine Sondertilgung, um Zinsersparnis und verkürzte Laufzeit
          direkt zu vergleichen.
        </p>
      </section>
    );
  }

  return (
    <section className="data-section" aria-labelledby="comparison-heading">
      <h2 className="section-heading" id="comparison-heading">
        Szenariovergleich
      </h2>
      <div className="comparison-table" role="table">
        <div className="comparison-row comparison-head" role="row">
          <span role="columnheader">Kennzahl</span>
          <span role="columnheader">Basis</span>
          <span role="columnheader">Mit Sondertilgung</span>
        </div>
        <ComparisonRow
          label="Laufzeit"
          original={`${extraResult.originalDuration} Monate`}
          alternative={`${extraResult.alternativeDuration} Monate`}
        />
        <ComparisonRow
          label="Gesamtzinsen"
          original={formatEuro(calculation.totalInterest)}
          alternative={formatEuro(extraResult.alternativeInterest)}
        />
        <ComparisonRow
          label="Ersparnis"
          original="—"
          alternative={formatEuro(extraResult.interestSavings)}
        />
      </div>
    </section>
  );
}

function ComparisonRow({
  label,
  original,
  alternative,
}: {
  label: string;
  original: string;
  alternative: string;
}) {
  return (
    <div className="comparison-row" role="row">
      <span className="text-slate-300" role="cell">
        {label}
      </span>
      <span role="cell">{original}</span>
      <strong className="text-emerald-300" role="cell">
        {alternative}
      </strong>
    </div>
  );
}
