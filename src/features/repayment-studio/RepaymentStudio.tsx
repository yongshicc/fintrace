import { lazy, Suspense, useMemo, useState, type FormEvent } from 'react';
import {
  calculateLoan,
  generateAmortizationSchedule,
  simulateExtraRepayment,
} from '../../engine';
import { LoanForm } from './components/LoanForm';
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
    <div className="min-h-screen bg-[#08111f] text-slate-100">
      <StudioHeader />
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-5 lg:mb-8 lg:flex-row lg:items-end">
          <div>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Kreditkosten nachvollziehbar simulieren
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
              Annuitätendarlehen transparent berechnen, Rückzahlung verstehen
              und Szenarien vergleichen.
            </p>
          </div>
          <p className="border-l-2 border-emerald-300 pl-4 text-sm font-semibold text-slate-200 sm:text-base">
            KI erklärt. Der Rechner rechnet.
          </p>
        </div>

        <div className="studio-layout">
          <aside aria-label="Simulationsparameter">
            <LoanForm
              draft={draft}
              error={error}
              onChange={setDraft}
              onSubmit={handleSubmit}
            />
          </aside>

          <div className="data-canvas">
            <ResultSummary calculation={simulation.calculation} />
            <VerifiedAssistant
              calculation={simulation.calculation}
              extraResult={simulation.extraResult}
            />
            <Suspense
              fallback={
                <div className="data-section h-[430px] animate-pulse bg-slate-900/30" />
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
                <div className="data-section h-[390px] animate-pulse bg-slate-900/30" />
              }
            >
              <BalanceChart
                originalSchedule={simulation.originalSchedule}
                alternativeSchedule={
                  simulation.extraResult?.alternativeSchedule ?? null
                }
              />
            </Suspense>
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

        <section className="assumption-strip" aria-label="Berechnungsannahmen">
          <p>
            <strong>Aktive Annahmen:</strong> {formatEuro(submitted.principal)},{' '}
            {formatPercent(submitted.annualRatePercent)}, Monatsrate konstant,
            gebührenfreies Festzinsmodell, Rundung nur für die Anzeige.
          </p>
        </section>
      </main>
      <footer className="border-t border-slate-800 px-4 py-6 text-center text-xs leading-5 text-slate-500 sm:px-6">
        FinTrace ist ein unabhängiges Portfolio-Projekt zur Simulation von
        Kreditkosten. Keine Kreditberatung und kein Kreditangebot. Es besteht
        keine Verbindung zu CHECK24.
      </footer>
    </div>
  );
}
