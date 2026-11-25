import { describe, expect, it } from 'vitest';
import { simulateExtraRepayment } from '../../src/engine';

const base = {
  principal: 30_000,
  annualEffectiveRate: 0.07,
  durationMonths: 60,
};

describe('simulateExtraRepayment', () => {
  it.each([0, -1, 1.5, 61, Number.NaN])(
    'rejects invalid repayment month: %s',
    (extraRepaymentMonth) => {
      expect(() =>
        simulateExtraRepayment({
          ...base,
          extraRepaymentAmount: 1_000,
          extraRepaymentMonth,
        }),
      ).toThrow(RangeError);
    },
  );

  it('leaves the schedule unchanged for a zero extra repayment', () => {
    const result = simulateExtraRepayment({
      ...base,
      extraRepaymentAmount: 0,
      extraRepaymentMonth: 12,
    });

    expect(result.alternativeSchedule).toEqual(result.originalSchedule);
    expect(result.interestSavings).toBe(0);
    expect(result.monthsSaved).toBe(0);
  });

  it('caps an extra repayment at the remaining principal', () => {
    const result = simulateExtraRepayment({
      ...base,
      extraRepaymentAmount: 1_000_000,
      extraRepaymentMonth: 12,
    });
    const repaymentEntry = result.alternativeSchedule.at(-1);

    expect(result.alternativeDuration).toBe(12);
    expect(repaymentEntry?.month).toBe(12);
    expect(repaymentEntry?.closingBalance).toBe(0);
    expect(repaymentEntry?.extraRepayment).toBeLessThan(1_000_000);
  });

  it('supports early full repayment after the first regular installment', () => {
    const result = simulateExtraRepayment({
      ...base,
      extraRepaymentAmount: base.principal,
      extraRepaymentMonth: 1,
    });

    expect(result.alternativeDuration).toBe(1);
    expect(result.alternativeSchedule[0]?.closingBalance).toBe(0);
    expect(result.monthsSaved).toBe(59);
  });

  it('shortens duration and cannot increase interest', () => {
    const result = simulateExtraRepayment({
      ...base,
      extraRepaymentAmount: 5_000,
      extraRepaymentMonth: 12,
    });

    expect(result.alternativeDuration).toBeLessThan(result.originalDuration);
    expect(result.alternativeInterest).toBeLessThanOrEqual(
      result.originalInterest,
    );
    expect(result.interestSavings).toBeGreaterThan(0);
  });
});
