import type { ExtraRepaymentResult, LoanCalculation } from '../../engine';

export type RecordedExplanationTopic =
  | 'monthly-installment'
  | 'interest-costs'
  | 'extra-repayment';

export interface ExplanationFact {
  label: string;
  value: number;
  format: 'currency' | 'percent' | 'months';
  source: string;
}

export interface RecordedExplanation {
  title: string;
  body: string;
  facts: ExplanationFact[];
  limitation: string;
}

export function getRecordedExplanation(
  topic: RecordedExplanationTopic,
  calculation: LoanCalculation,
  extraResult: ExtraRepaymentResult | null,
): RecordedExplanation {
  switch (topic) {
    case 'monthly-installment':
      return {
        title: 'So ordnet FinTrace deine Monatsrate ein',
        body: 'Die Rate gehört zu einem Modell mit gleichbleibender Monatsrate. Kreditbetrag, effektiver Jahreszins und Laufzeit sind die bestätigten Eingaben; die Rate stammt direkt aus dem Rechenkern.',
        facts: [
          {
            label: 'Kreditbetrag',
            value: calculation.principal,
            format: 'currency',
            source: 'LoanCalculation.principal',
          },
          {
            label: 'Effektiver Jahreszins',
            value: calculation.annualEffectiveRate,
            format: 'percent',
            source: 'LoanCalculation.annualEffectiveRate',
          },
          {
            label: 'Monatsrate',
            value: calculation.monthlyInstallment,
            format: 'currency',
            source: 'LoanCalculation.monthlyInstallment',
          },
        ],
        limitation:
          'Die Erklärung beschreibt das aktive Festzinsmodell ohne Gebühren und ersetzt keine Vertragsprüfung.',
      };

    case 'interest-costs':
      return {
        title: 'Darum liegen Rückzahlung und Kreditbetrag auseinander',
        body: 'Die Gesamtzinsen sind die vom Rechenkern ausgewiesenen Kosten des modellierten Kredits. Die Gesamtrückzahlung enthält Kreditbetrag und Zinsen über die vollständige Laufzeit.',
        facts: [
          {
            label: 'Gesamtzinsen',
            value: calculation.totalInterest,
            format: 'currency',
            source: 'LoanCalculation.totalInterest',
          },
          {
            label: 'Gesamtrückzahlung',
            value: calculation.totalRepayment,
            format: 'currency',
            source: 'LoanCalculation.totalRepayment',
          },
          {
            label: 'Laufzeit',
            value: calculation.durationMonths,
            format: 'months',
            source: 'LoanCalculation.durationMonths',
          },
        ],
        limitation:
          'Nicht modellierte Gebühren, Versicherungen oder vertragliche Rundungsregeln können reale Kosten verändern.',
      };

    case 'extra-repayment':
      if (!extraResult) {
        return {
          title: 'Für diesen Vergleich fehlt ein aktives Szenario',
          body: 'Aktiviere eine Sondertilgung und aktualisiere die Simulation. Erst dann kann der Rechenkern ein Basis- und ein Alternativszenario gegenüberstellen.',
          facts: [],
          limitation:
            'Ohne berechnetes Alternativszenario nennt FinTrace bewusst keine mögliche Ersparnis.',
        };
      }

      return {
        title: 'So wirkt die gewählte Sondertilgung im Modell',
        body: 'Das Alternativszenario behält die reguläre Rate bei und verwendet die Sondertilgung zur Verkürzung der Laufzeit. Ersparnis und Dauer stammen vollständig aus der Engine-Simulation.',
        facts: [
          {
            label: 'Zinsersparnis',
            value: extraResult.interestSavings,
            format: 'currency',
            source: 'ExtraRepaymentResult.interestSavings',
          },
          {
            label: 'Neue Gesamtzinsen',
            value: extraResult.alternativeInterest,
            format: 'currency',
            source: 'ExtraRepaymentResult.alternativeInterest',
          },
          {
            label: 'Verkürzung',
            value: extraResult.monthsSaved,
            format: 'months',
            source: 'ExtraRepaymentResult.monthsSaved',
          },
        ],
        limitation:
          'Das Modell unterstellt eine gebührenfreie Sondertilgung und unveränderte reguläre Monatsrate.',
      };
  }
}
