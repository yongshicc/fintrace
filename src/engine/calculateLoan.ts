import type {
  CalculationAssumptions,
  LoanCalculation,
  LoanInput,
} from './types';
import { validateLoanInput } from './validation';

const ASSUMPTIONS: CalculationAssumptions = Object.freeze({
  rateConvention: 'annual-effective',
  repaymentModel: 'fixed-rate-annuity',
  fees: 0,
  paymentFrequency: 'monthly',
  rounding: 'presentation-only',
});

export function calculateMonthlyRate(annualEffectiveRate: number): number {
  return Math.expm1(Math.log1p(annualEffectiveRate) / 12);
}

export function calculateLoan(input: LoanInput): LoanCalculation {
  validateLoanInput(input);

  const monthlyRate = calculateMonthlyRate(input.annualEffectiveRate);
  const monthlyInstallment =
    monthlyRate === 0
      ? input.principal / input.durationMonths
      : (input.principal * monthlyRate) /
        -Math.expm1(-input.durationMonths * Math.log1p(monthlyRate));
  const totalRepayment = monthlyInstallment * input.durationMonths;
  const totalInterest = totalRepayment - input.principal;

  if (
    !Number.isFinite(monthlyInstallment) ||
    !Number.isFinite(totalRepayment) ||
    !Number.isFinite(totalInterest)
  ) {
    throw new RangeError('The loan parameters produce a non-finite result.');
  }

  return {
    ...input,
    monthlyRate,
    monthlyInstallment,
    totalInterest,
    totalRepayment,
    assumptions: ASSUMPTIONS,
  };
}
