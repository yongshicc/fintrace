import { describe, expect, it } from 'vitest';
import { searchKnowledge } from '../../src/adapters';

describe('searchKnowledge', () => {
  it('returns reviewed sources ranked by the query', () => {
    const matches = searchKnowledge('Wie wirkt eine Sondertilgung?');

    expect(matches[0]).toMatchObject({
      id: 'extra-repayment-model',
      sourcePath: 'docs/calculation-method.de.md',
    });
    expect(matches[0]?.score).toBeGreaterThan(0);
  });

  it('returns no documents for an empty or unrelated query', () => {
    expect(searchKnowledge('')).toEqual([]);
    expect(searchKnowledge('Quantenchromodynamik')).toEqual([]);
  });

  it('enforces a bounded result limit', () => {
    expect(searchKnowledge('Modell', 0)).toEqual([]);
    expect(searchKnowledge('Modell', 11)).toEqual([]);
    expect(searchKnowledge('Modell', 1)).toHaveLength(1);
  });
});
