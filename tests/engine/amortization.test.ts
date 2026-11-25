import { describe, expect, it } from 'vitest';
import { calculateLoan, generateAmortizationSchedule } from '../../src/engine';

const input = {
  principal: 30_000,
  annualEffectiveRate: 0.07,
  durationMonths: 60,
};

describe('generateAmortizationSchedule', () => {
  it('adjusts the final installment and closes at zero', () => {
    const schedule = generateAmortizationSchedule(input);
    const finalEntry = schedule.at(-1);

    expect(schedule).toHaveLength(60);
    expect(finalEntry?.closingBalance).toBe(0);
    expect(finalEntry?.regularPayment).toBeLessThanOrEqual(
      calculateLoan(input).monthlyInstallment,
    );
  });

  it('conserves principal and interest', () => {
    const result = calculateLoan(input);
    const schedule = generateAmortizationSchedule(input);
    const principal = schedule.reduce(
      (sum, entry) => sum + entry.principalPortion + entry.extraRepayment,
      0,
    );
    const interest = schedule.reduce(
      (sum, entry) => sum + entry.interestPortion,
      0,
    );
    const cashPayments = schedule.reduce(
      (sum, entry) => sum + entry.regularPayment + entry.extraRepayment,
      0,
    );

    expect(principal).toBeCloseTo(input.principal, 8);
    expect(interest).toBeCloseTo(result.totalInterest, 8);
    expect(cashPayments).toBeCloseTo(input.principal + interest, 8);
    expect(cashPayments).toBeCloseTo(result.totalRepayment, 8);
  });

  it('never produces negative or non-finite balances', () => {
    const schedule = generateAmortizationSchedule(input);

    for (const entry of schedule) {
      expect(entry.openingBalance).toBeGreaterThanOrEqual(0);
      expect(entry.closingBalance).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(entry.openingBalance)).toBe(true);
      expect(Number.isFinite(entry.closingBalance)).toBe(true);
    }
  });
});
