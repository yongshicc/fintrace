import { generateAmortizationSchedule } from './amortization';
import type {
  AmortizationEntry,
  ExtraRepaymentInput,
  ExtraRepaymentResult,
  LoanInput,
} from './types';
import { validateLoanInput, validateNonNegativeAmount } from './validation';

function sumInterest(schedule: AmortizationEntry[]): number {
  return schedule.reduce((total, entry) => total + entry.interestPortion, 0);
}

export function simulateExtraRepayment(
  input: ExtraRepaymentInput,
): ExtraRepaymentResult {
  const loanInput: LoanInput = {
    principal: input.principal,
    annualEffectiveRate: input.annualEffectiveRate,
    durationMonths: input.durationMonths,
  };
  validateLoanInput(loanInput);
  validateNonNegativeAmount(input.extraRepaymentAmount, 'extraRepaymentAmount');

  if (
    !Number.isInteger(input.extraRepaymentMonth) ||
    input.extraRepaymentMonth < 1 ||
    input.extraRepaymentMonth > input.durationMonths
  ) {
    throw new RangeError(
      'extraRepaymentMonth must be an integer within the original loan duration.',
    );
  }

  const originalSchedule = generateAmortizationSchedule(loanInput);
  const alternativeSchedule = generateAmortizationSchedule(loanInput, {
    extraRepaymentAmount: input.extraRepaymentAmount,
    extraRepaymentMonth: input.extraRepaymentMonth,
  });
  const originalInterest = sumInterest(originalSchedule);
  const alternativeInterest = sumInterest(alternativeSchedule);
  const interestSavings = originalInterest - alternativeInterest;
  const originalDuration = originalSchedule.length;
  const alternativeDuration = alternativeSchedule.length;

  return {
    originalSchedule,
    alternativeSchedule,
    originalInterest,
    alternativeInterest,
    interestSavings,
    originalDuration,
    alternativeDuration,
    monthsSaved: originalDuration - alternativeDuration,
  };
}
