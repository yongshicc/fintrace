import { calculateLoan } from './calculateLoan';
import type { InterestRangeInput, InterestRateScenario } from './types';
import { validateLoanInput } from './validation';

const MAX_SCENARIOS = 101;
const RATE_EQUALITY_TOLERANCE = 1e-12;

function assertValidRange(input: InterestRangeInput): void {
  const values = [
    input.minimumAnnualEffectiveRate,
    input.maximumAnnualEffectiveRate,
    input.rateStep,
  ];

  if (values.some((value) => !Number.isFinite(value))) {
    throw new RangeError('Interest range values must be finite.');
  }
  if (input.minimumAnnualEffectiveRate < 0) {
    throw new RangeError('minimumAnnualEffectiveRate must not be negative.');
  }
  if (input.maximumAnnualEffectiveRate < input.minimumAnnualEffectiveRate) {
    throw new RangeError(
      'maximumAnnualEffectiveRate must not be lower than the minimum.',
    );
  }
  if (input.rateStep <= 0) {
    throw new RangeError('rateStep must be greater than zero.');
  }

  const estimatedCount =
    Math.ceil(
      (input.maximumAnnualEffectiveRate - input.minimumAnnualEffectiveRate) /
        input.rateStep,
    ) + 2;
  if (estimatedCount > MAX_SCENARIOS) {
    throw new RangeError(
      `Interest ranges are limited to ${MAX_SCENARIOS} scenarios.`,
    );
  }
}

function addUniqueRate(rates: number[], rate: number): void {
  if (
    !rates.some(
      (existingRate) =>
        Math.abs(existingRate - rate) <= RATE_EQUALITY_TOLERANCE,
    )
  ) {
    rates.push(rate);
  }
}

export function compareInterestRates(
  input: InterestRangeInput,
): InterestRateScenario[] {
  validateLoanInput(input);
  assertValidRange(input);

  const rates: number[] = [];
  const span =
    input.maximumAnnualEffectiveRate - input.minimumAnnualEffectiveRate;
  const stepCount = Math.floor(span / input.rateStep);

  for (let index = 0; index <= stepCount; index += 1) {
    addUniqueRate(
      rates,
      input.minimumAnnualEffectiveRate + index * input.rateStep,
    );
  }

  addUniqueRate(rates, input.maximumAnnualEffectiveRate);
  if (
    input.annualEffectiveRate >= input.minimumAnnualEffectiveRate &&
    input.annualEffectiveRate <= input.maximumAnnualEffectiveRate
  ) {
    addUniqueRate(rates, input.annualEffectiveRate);
  }

  return [...rates]
    .sort((a, b) => a - b)
    .map((annualEffectiveRate) => {
      const result = calculateLoan({
        principal: input.principal,
        annualEffectiveRate,
        durationMonths: input.durationMonths,
      });

      return {
        annualEffectiveRate,
        monthlyInstallment: result.monthlyInstallment,
        totalInterest: result.totalInterest,
        totalRepayment: result.totalRepayment,
      };
    });
}
