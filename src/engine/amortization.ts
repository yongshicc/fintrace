import { calculateLoan } from './calculateLoan';
import type { AmortizationEntry, LoanInput } from './types';

export const ABSOLUTE_BALANCE_TOLERANCE = 1e-8;
export const RELATIVE_BALANCE_TOLERANCE = 1e-12;

interface ScheduleOptions {
  extraRepaymentAmount?: number;
  extraRepaymentMonth?: number;
}

function toleranceFor(principal: number): number {
  return Math.max(
    ABSOLUTE_BALANCE_TOLERANCE,
    principal * RELATIVE_BALANCE_TOLERANCE,
  );
}

export function generateAmortizationSchedule(
  input: LoanInput,
  options: ScheduleOptions = {},
): AmortizationEntry[] {
  const calculation = calculateLoan(input);
  const tolerance = toleranceFor(input.principal);
  const schedule: AmortizationEntry[] = [];
  let balance = input.principal;

  for (let month = 1; month <= input.durationMonths; month += 1) {
    const openingBalance = balance;
    const interestPortion = openingBalance * calculation.monthlyRate;
    const amountDue = openingBalance + interestPortion;
    const regularPayment = Math.min(calculation.monthlyInstallment, amountDue);
    const principalPortion = Math.min(
      openingBalance,
      regularPayment - interestPortion,
    );
    const afterRegularPayment = Math.max(0, openingBalance - principalPortion);
    const requestedExtra =
      month === options.extraRepaymentMonth
        ? (options.extraRepaymentAmount ?? 0)
        : 0;
    const extraRepayment = Math.min(requestedExtra, afterRegularPayment);
    const rawClosingBalance = afterRegularPayment - extraRepayment;
    const closingBalance =
      rawClosingBalance <= tolerance ? 0 : rawClosingBalance;

    schedule.push({
      month,
      openingBalance,
      regularPayment,
      interestPortion,
      principalPortion,
      extraRepayment,
      closingBalance,
    });

    balance = closingBalance;
    if (balance === 0) {
      break;
    }
  }

  const lastEntry = schedule.at(-1);
  if (!lastEntry || lastEntry.closingBalance !== 0) {
    throw new Error('The amortization schedule did not repay the loan.');
  }

  return schedule;
}
