import { describe, expect, it } from 'vitest';
import { calculateLoan } from '../../src/engine';
import { publicReferenceCases } from '../fixtures/public-reference-cases';

describe('calculateLoan', () => {
  it.each(publicReferenceCases)(
    'matches the rounded $durationMonths-month public reference case',
    (reference) => {
      const result = calculateLoan(reference);

      expect(result.monthlyInstallment).toBeCloseTo(
        reference.displayedMonthlyPayment,
        2,
      );
      expect(result.totalRepayment).toBeCloseTo(
        reference.displayedTotalRepayment,
        2,
      );
    },
  );

  it('handles zero interest separately', () => {
    const result = calculateLoan({
      principal: 12_000,
      annualEffectiveRate: 0,
      durationMonths: 24,
    });

    expect(result.monthlyRate).toBe(0);
    expect(result.monthlyInstallment).toBe(500);
    expect(result.totalInterest).toBe(0);
    expect(result.totalRepayment).toBe(12_000);
  });

  it('remains stable for a very small positive rate', () => {
    const result = calculateLoan({
      principal: 10_000,
      annualEffectiveRate: 1e-12,
      durationMonths: 12,
    });

    expect(Number.isFinite(result.monthlyInstallment)).toBe(true);
    expect(result.monthlyInstallment).toBeCloseTo(10_000 / 12, 8);
    expect(result.totalInterest).toBeGreaterThanOrEqual(0);
  });

  it.each([
    { principal: 0, annualEffectiveRate: 0.05, durationMonths: 12 },
    { principal: -1, annualEffectiveRate: 0.05, durationMonths: 12 },
    { principal: Number.NaN, annualEffectiveRate: 0.05, durationMonths: 12 },
  ])('rejects invalid principal: $principal', (input) => {
    expect(() => calculateLoan(input)).toThrow(RangeError);
  });

  it.each([-0.01, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid annual rate: %s',
    (annualEffectiveRate) => {
      expect(() =>
        calculateLoan({
          principal: 10_000,
          annualEffectiveRate,
          durationMonths: 12,
        }),
      ).toThrow(RangeError);
    },
  );

  it.each([0, -1, 12.5, 1_201, Number.NaN])(
    'rejects invalid duration: %s',
    (durationMonths) => {
      expect(() =>
        calculateLoan({
          principal: 10_000,
          annualEffectiveRate: 0.05,
          durationMonths,
        }),
      ).toThrow(RangeError);
    },
  );
});
