import { lazy, Suspense, useMemo, useState, type FormEvent } from 'react';
import {
  calculateLoan,
  generateAmortizationSchedule,
  simulateExtraRepayment,
} from '../../engine';
import { LoanForm } from './components/LoanForm';
import {
  EngineeringSection,
  PrincipleSection,
  ReferenceCases,
} from './components/LandingSections';
import { RepaymentTable } from './components/RepaymentTable';
import { ResultSummary } from './components/ResultSummary';
import { ScenarioComparison } from './components/ScenarioComparison';
import { StudioHeader } from './components/StudioHeader';
import { VerifiedAssistant } from './components/VerifiedAssistant';
import { formatEuro, formatPercent } from './formatters';
import type { StudioFormValues } from './types';

const INITIAL_VALUES: StudioFormValues = {
  principal: 30_000,
  annualRatePercent: 7,
  durationMonths: 60,
  extraRepaymentEnabled: true,
  extraRepaymentAmount: 5_000,
  extraRepaymentMonth: 13,
};

const BalanceChart = lazy(() =>
  import('./components/BalanceChart').then((module) => ({
    default: module.BalanceChart,
  })),
);

const InterestRangeExplorer = lazy(() =>
  import('./components/InterestRangeExplorer').then((module) => ({
    default: module.InterestRangeExplorer,
  })),
);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `Bitte Eingaben prüfen: ${error.message}`;
  }
  return 'Die Simulation konnte nicht berechnet werden.';
}

export function RepaymentStudio() {
  const [draft, setDraft] = useState<StudioFormValues>(INITIAL_VALUES);
  const [submitted, setSubmitted] = useState<StudioFormValues>(INITIAL_VALUES);
  const [error, setError] = useState<string | null>(null);

  const simulation = useMemo(() => {
    const loanInput = {
      principal: submitted.principal,
      annualEffectiveRate: submitted.annualRatePercent / 100,
      durationMonths: submitted.durationMonths,
    };
    const calculation = calculateLoan(loanInput);
    const originalSchedule = generateAmortizationSchedule(loanInput);
    const extraResult = submitted.extraRepaymentEnabled
      ? simulateExtraRepayment({
          ...loanInput,
          extraRepaymentAmount: submitted.extraRepaymentAmount,
          extraRepaymentMonth: submitted.extraRepaymentMonth,
        })
      : null;

    return { calculation, originalSchedule, extraResult };
  }, [submitted]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const loanInput = {
        principal: draft.principal,
        annualEffectiveRate: draft.annualRatePercent / 100,
        durationMonths: draft.durationMonths,
      };
      calculateLoan(loanInput);
      if (draft.extraRepaymentEnabled) {
        simulateExtraRepayment({
          ...loanInput,
          extraRepaymentAmount: draft.extraRepaymentAmount,
          extraRepaymentMonth: draft.extraRepaymentMonth,
        });
      }
      setSubmitted(draft);
      setError(null);
    } catch (nextError) {
      setError(getErrorMessage(nextError));
    }
  }

  function handleSelectInterestRate(annualRatePercent: number) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      annualRatePercent,
    }));
    setSubmitted((currentValues) => ({
      ...currentValues,
      annualRatePercent,
    }));
    setError(null);
  }

  const displayedSchedule =
    simulation.extraResult?.alternativeSchedule ?? simulation.originalSchedule;

  return (
    <div className="site-frame" id="top">
      <div className="hero-band">
        <StudioHeader />
        <main>
          <section className="hero page-shell" aria-labelledby="hero-heading">
            <div className="hero-copy">
              <h1 id="hero-heading">
                Kredite verstehen. Nicht nur vergleichen.
              </h1>
              <p>
                FinTrace zeigt bei jeder Kreditzahl, woher sie kommt: Annahmen,
                Rechenweg und die Wirkung einer Sondertilgung.
              </p>
              <ul className="trust-list">
                <li>Alle Beträge entstehen im deterministischen Rechenkern.</li>
                <li>
                  Erklärungen verwenden ausschließlich verifizierte Ergebnisse.
                </li>
                <li>
                  Kein Konto, keine persönlichen Daten, keine Live-KI nötig.
                </li>
              </ul>
              <a className="hero-link" href="#studio">
                Zum vollständigen Repayment Studio{' '}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-calculator">
              <aside aria-label="Simulationsparameter">
                <LoanForm
                  draft={draft}
                  error={error}
                  onChange={setDraft}
                  onSubmit={handleSubmit}
                />
              </aside>
              <ResultSummary calculation={simulation.calculation} />
            </div>
          </section>
        </main>
      </div>

      <PrincipleSection />

      <main className="studio-main" id="studio">
        <div className="page-shell">
          <div className="studio-intro">
            <div>
              <h2>Kreditkosten nachvollziehbar simulieren</h2>
              <p>
                Annuitätendarlehen transparent berechnen, Rückzahlung verstehen
                und Szenarien vergleichen.
              </p>
            </div>
            <p className="studio-promise">KI erklärt. Der Rechner rechnet.</p>
          </div>

          <div className="data-canvas">
            <VerifiedAssistant
              calculation={simulation.calculation}
              extraResult={simulation.extraResult}
            />
            <div className="studio-grid">
              <Suspense
                fallback={
                  <div className="data-section h-[430px] animate-pulse bg-slate-100" />
                }
              >
                <InterestRangeExplorer
                  principal={submitted.principal}
                  durationMonths={submitted.durationMonths}
                  currentAnnualRatePercent={submitted.annualRatePercent}
                  onSelectRate={handleSelectInterestRate}
                />
              </Suspense>
              <Suspense
                fallback={
                  <div className="data-section h-[390px] animate-pulse bg-slate-100" />
                }
              >
                <BalanceChart
                  originalSchedule={simulation.originalSchedule}
                  alternativeSchedule={
                    simulation.extraResult?.alternativeSchedule ?? null
                  }
                />
              </Suspense>
            </div>
            <div className="studio-grid studio-grid-bottom">
              <ScenarioComparison
                calculation={simulation.calculation}
                extraResult={simulation.extraResult}
              />
              <RepaymentTable
                schedule={displayedSchedule}
                highlightedMonth={
                  submitted.extraRepaymentEnabled
                    ? submitted.extraRepaymentMonth
                    : null
                }
              />
            </div>
          </div>

          <section
            className="assumption-strip"
            aria-label="Berechnungsannahmen"
          >
            <p>
              <strong>Aktive Annahmen:</strong>{' '}
              {formatEuro(submitted.principal)},{' '}
              {formatPercent(submitted.annualRatePercent)}, Monatsrate konstant,
              gebührenfreies Festzinsmodell, Rundung nur für die Anzeige.
            </p>
          </section>
        </div>
      </main>

      <ReferenceCases />
      <EngineeringSection />
      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <strong>FinTrace</strong>
          <p>
            Unabhängiges Portfolio-Projekt zur Simulation von Kreditkosten.
            Keine Kreditberatung und kein Kreditangebot. Es besteht keine
            Verbindung zu CHECK24 oder einem anderen Anbieter.
          </p>
          <a href="#top">Nach oben ↑</a>
        </div>
      </footer>
    </div>
  );
}
