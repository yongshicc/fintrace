import { describe, expect, it } from 'vitest';
import { formatCurrency } from '../../src/utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats values as EUR using the de-AT locale', () => {
    expect(formatCurrency(30_000)).toBe('€\u00a030.000,00');
  });

  it('rejects non-finite values', () => {
    expect(() => formatCurrency(Number.NaN)).toThrow(RangeError);
  });
});
