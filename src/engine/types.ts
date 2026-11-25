export interface LoanInput {
  principal: number;
  annualEffectiveRate: number;
  durationMonths: number;
}

export interface CalculationAssumptions {
  rateConvention: 'annual-effective';
  repaymentModel: 'fixed-rate-annuity';
  fees: 0;
  paymentFrequency: 'monthly';
  rounding: 'presentation-only';
}

export interface LoanCalculation extends LoanInput {
  monthlyRate: number;
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
  assumptions: CalculationAssumptions;
}

export interface AmortizationEntry {
  month: number;
  openingBalance: number;
  regularPayment: number;
  interestPortion: number;
  principalPortion: number;
  extraRepayment: number;
  closingBalance: number;
}

export interface ExtraRepaymentInput extends LoanInput {
  extraRepaymentAmount: number;
  extraRepaymentMonth: number;
}

export interface ExtraRepaymentResult {
  originalSchedule: AmortizationEntry[];
  alternativeSchedule: AmortizationEntry[];
  originalInterest: number;
  alternativeInterest: number;
  interestSavings: number;
  originalDuration: number;
  alternativeDuration: number;
  monthsSaved: number;
}

export interface InterestRangeInput extends LoanInput {
  minimumAnnualEffectiveRate: number;
  maximumAnnualEffectiveRate: number;
  rateStep: number;
}

export interface InterestRateScenario {
  annualEffectiveRate: number;
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
}
