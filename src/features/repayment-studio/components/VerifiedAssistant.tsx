import { useState } from 'react';
import type { ExtraRepaymentResult, LoanCalculation } from '../../../engine';
import { formatEuro, formatPercent } from '../formatters';
import {
  getRecordedExplanation,
  type ExplanationFact,
  type RecordedExplanationTopic,
} from '../recordedExplanations';

interface VerifiedAssistantProps {
  calculation: LoanCalculation;
  extraResult: ExtraRepaymentResult | null;
}

const TOPICS: ReadonlyArray<{
  id: RecordedExplanationTopic;
  label: string;
}> = [
  { id: 'monthly-installment', label: 'Wie entsteht meine Monatsrate?' },
  { id: 'interest-costs', label: 'Was bedeuten die Gesamtzinsen?' },
  { id: 'extra-repayment', label: 'Was bringt die Sondertilgung?' },
];

export function VerifiedAssistant({
  calculation,
  extraResult,
}: VerifiedAssistantProps) {
  const [topic, setTopic] = useState<RecordedExplanationTopic>(
    'monthly-installment',
  );
  const explanation = getRecordedExplanation(topic, calculation, extraResult);

  return (
    <section className="assistant-section" aria-labelledby="assistant-heading">
      <div className="assistant-heading-row">
        <div>
          <p className="assistant-kicker">Verifizierter Erklärmodus</p>
          <h2 className="section-heading" id="assistant-heading">
            FinTrace Assistent
          </h2>
        </div>
        <span className="assistant-mode">Aufgezeichnet · keine Live-KI</span>
      </div>

      <p className="assistant-intro">
        Wähle eine vorab geprüfte Frage. Jede angezeigte Zahl wird unverändert
        aus dem deterministischen Rechenkern übernommen.
      </p>

      <div className="assistant-topics" aria-label="Erklärung auswählen">
        {TOPICS.map((item) => (
          <button
            className="assistant-topic"
            type="button"
            aria-pressed={topic === item.id}
            onClick={() => setTopic(item.id)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="assistant-answer" aria-live="polite" aria-atomic="true">
        <p className="assistant-label">Aufgezeichnete Antwort</p>
        <h3>{explanation.title}</h3>
        <p>{explanation.body}</p>

        {explanation.facts.length > 0 ? (
          <dl className="assistant-facts">
            {explanation.facts.map((fact) => (
              <div key={fact.source}>
                <dt>{fact.label}</dt>
                <dd>
                  <strong>{formatFact(fact)}</strong>
                  <span>Quelle: {fact.source}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <p className="assistant-limitation">
          <strong>Modellgrenze:</strong> {explanation.limitation}
        </p>
      </div>
    </section>
  );
}

function formatFact(fact: ExplanationFact): string {
  switch (fact.format) {
    case 'currency':
      return formatEuro(fact.value);
    case 'percent':
      return formatPercent(fact.value * 100);
    case 'months':
      return `${fact.value.toLocaleString('de-AT')} Monate`;
  }
}
