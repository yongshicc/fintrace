import type { LoanInput } from './types';

export const MAX_DURATION_MONTHS = 1_200;

function assertFinite(value: number, field: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${field} must be finite.`);
  }
}

export function validateLoanInput(input: LoanInput): void {
  assertFinite(input.principal, 'principal');
  assertFinite(input.annualEffectiveRate, 'annualEffectiveRate');
  assertFinite(input.durationMonths, 'durationMonths');

  if (input.principal <= 0) {
    throw new RangeError('principal must be greater than zero.');
  }
  if (input.annualEffectiveRate < 0) {
    throw new RangeError('annualEffectiveRate must not be negative.');
  }
  if (
    !Number.isInteger(input.durationMonths) ||
    input.durationMonths < 1 ||
    input.durationMonths > MAX_DURATION_MONTHS
  ) {
    throw new RangeError(
      `durationMonths must be an integer from 1 to ${MAX_DURATION_MONTHS}.`,
    );
  }
}

export function validateNonNegativeAmount(value: number, field: string): void {
  assertFinite(value, field);
  if (value < 0) {
    throw new RangeError(`${field} must not be negative.`);
  }
}
