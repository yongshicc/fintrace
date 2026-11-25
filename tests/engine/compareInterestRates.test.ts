import { describe, expect, it } from 'vitest';
import { compareInterestRates } from '../../src/engine';

const base = {
  principal: 30_000,
  annualEffectiveRate: 0.07,
  durationMonths: 60,
};

describe('compareInterestRates', () => {
  it('returns sorted scenarios and includes the current rate', () => {
    const scenarios = compareInterestRates({
      ...base,
      minimumAnnualEffectiveRate: 0.04,
      maximumAnnualEffectiveRate: 0.1,
      rateStep: 0.005,
    });

    expect(scenarios[0]?.annualEffectiveRate).toBeCloseTo(0.04, 12);
    expect(scenarios.at(-1)?.annualEffectiveRate).toBeCloseTo(0.1, 12);
    expect(
      scenarios.some((scenario) => scenario.annualEffectiveRate === 0.07),
    ).toBe(true);
    expect(scenarios).toEqual(
      [...scenarios].sort(
        (left, right) => left.annualEffectiveRate - right.annualEffectiveRate,
      ),
    );
  });

  it('produces monotonically increasing payments and interest', () => {
    const scenarios = compareInterestRates({
      ...base,
      minimumAnnualEffectiveRate: 0,
      maximumAnnualEffectiveRate: 0.12,
      rateStep: 0.01,
    });

    for (let index = 1; index < scenarios.length; index += 1) {
      expect(scenarios[index]?.monthlyInstallment).toBeGreaterThan(
        scenarios[index - 1]?.monthlyInstallment ?? 0,
      );
      expect(scenarios[index]?.totalInterest).toBeGreaterThan(
        scenarios[index - 1]?.totalInterest ?? -1,
      );
    }
  });

  it.each([
    {
      minimumAnnualEffectiveRate: -0.01,
      maximumAnnualEffectiveRate: 0.1,
      rateStep: 0.01,
    },
    {
      minimumAnnualEffectiveRate: 0.1,
      maximumAnnualEffectiveRate: 0.05,
      rateStep: 0.01,
    },
    {
      minimumAnnualEffectiveRate: 0.01,
      maximumAnnualEffectiveRate: 0.1,
      rateStep: 0,
    },
  ])('rejects invalid range values', (range) => {
    expect(() => compareInterestRates({ ...base, ...range })).toThrow(
      RangeError,
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects non-finite range values: %s',
    (minimumAnnualEffectiveRate) => {
      expect(() =>
        compareInterestRates({
          ...base,
          minimumAnnualEffectiveRate,
          maximumAnnualEffectiveRate: 0.1,
          rateStep: 0.01,
        }),
      ).toThrow(RangeError);
    },
  );

  it('limits the number of generated scenarios', () => {
    expect(() =>
      compareInterestRates({
        ...base,
        minimumAnnualEffectiveRate: 0,
        maximumAnnualEffectiveRate: 1,
        rateStep: 0.001,
      }),
    ).toThrow(/101 scenarios/);
  });
});
