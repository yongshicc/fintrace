export interface PublicReferenceCase {
  principal: number;
  annualEffectiveRate: number;
  durationMonths: number;
  displayedMonthlyPayment: number;
  displayedTotalRepayment: number;
  sourceUrl: string;
  assumptions: string;
  verificationMethod: string;
}

const shared = {
  principal: 30_000,
  annualEffectiveRate: 0.07,
  sourceUrl: 'https://www.check24.at/kredit/kreditrechner',
  assumptions:
    'Fee-free fixed-rate annuity; annual effective rate converted to a monthly effective rate; amounts rounded to cents only for display.',
  verificationMethod:
    'Independent spreadsheet-compatible PMT implementation using direct exponentiation in scripts/verify-reference-cases.mjs.',
} as const;

export const publicReferenceCases: PublicReferenceCase[] = [
  {
    ...shared,
    durationMonths: 36,
    displayedMonthlyPayment: 923.37,
    displayedTotalRepayment: 33_241.19,
  },
  {
    ...shared,
    durationMonths: 60,
    displayedMonthlyPayment: 591.0,
    displayedTotalRepayment: 35_459.83,
  },
  {
    ...shared,
    durationMonths: 84,
    displayedMonthlyPayment: 449.63,
    displayedTotalRepayment: 37_769.22,
  },
];
