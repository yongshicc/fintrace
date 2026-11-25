const euroCurrencyFormatter = new Intl.NumberFormat('de-AT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    throw new RangeError('Currency value must be finite.');
  }

  return euroCurrencyFormatter.format(value);
}
