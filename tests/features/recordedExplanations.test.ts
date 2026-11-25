import { describe, expect, it } from 'vitest';
import { calculateLoan, simulateExtraRepayment } from '../../src/engine';
import { getRecordedExplanation } from '../../src/features/repayment-studio/recordedExplanations';

const input = {
  principal: 30_000,
  annualEffectiveRate: 0.07,
  durationMonths: 60,
};

describe('getRecordedExplanation', () => {
  it('uses unchanged calculation fields as traceable facts', () => {
    const calculation = calculateLoan(input);
    const explanation = getRecordedExplanation(
      'monthly-installment',
      calculation,
      null,
    );

    expect(explanation.facts).toEqual([
      expect.objectContaining({
        value: calculation.principal,
        source: 'LoanCalculation.principal',
      }),
      expect.objectContaining({
        value: calculation.annualEffectiveRate,
        source: 'LoanCalculation.annualEffectiveRate',
      }),
      expect.objectContaining({
        value: calculation.monthlyInstallment,
        source: 'LoanCalculation.monthlyInstallment',
      }),
    ]);
  });

  it('does not invent savings without an alternative scenario', () => {
    const explanation = getRecordedExplanation(
      'extra-repayment',
      calculateLoan(input),
      null,
    );

    expect(explanation.facts).toHaveLength(0);
    expect(explanation.body).toContain('Aktiviere eine Sondertilgung');
  });

  it('uses the engine result for extra-repayment facts', () => {
    const calculation = calculateLoan(input);
    const extraResult = simulateExtraRepayment({
      ...input,
      extraRepaymentAmount: 5_000,
      extraRepaymentMonth: 13,
    });
    const explanation = getRecordedExplanation(
      'extra-repayment',
      calculation,
      extraResult,
    );

    expect(explanation.facts.map((fact) => fact.value)).toEqual([
      extraResult.interestSavings,
      extraResult.alternativeInterest,
      extraResult.monthsSaved,
    ]);
  });
});
