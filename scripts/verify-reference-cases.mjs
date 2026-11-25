const cases = [
  { months: 36, displayedPayment: 923.37, displayedTotal: 33_241.19 },
  { months: 60, displayedPayment: 591.0, displayedTotal: 35_459.83 },
  { months: 84, displayedPayment: 449.63, displayedTotal: 37_769.22 },
];

const principal = 30_000;
const annualRate = 0.07;

// Deliberately uses direct exponentiation instead of the engine's log1p/expm1 path.
const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

for (const reference of cases) {
  const payment =
    (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -reference.months);
  const total = payment * reference.months;
  const roundedPayment = Number(payment.toFixed(2));
  const roundedTotal = Number(total.toFixed(2));
  const matches =
    roundedPayment === reference.displayedPayment &&
    roundedTotal === reference.displayedTotal;

  console.log(
    JSON.stringify({
      months: reference.months,
      payment,
      total,
      roundedPayment,
      roundedTotal,
      referencePayment: reference.displayedPayment,
      referenceTotal: reference.displayedTotal,
      matches,
    }),
  );

  if (!matches) {
    process.exitCode = 1;
  }
}
