import { describe, expect, it } from 'vitest';
import { handleRestRequest } from '../../src/adapters';
import { calculateLoan, simulateExtraRepayment } from '../../src/engine';

const loanInput = {
  principal: 30_000,
  annualEffectiveRate: 0.07,
  durationMonths: 60,
};

describe('handleRestRequest', () => {
  it('returns the unchanged engine calculation', () => {
    const response = handleRestRequest({
      method: 'POST',
      path: '/v1/loans/calculate',
      body: loanInput,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      source: 'fintrace-engine',
      result: calculateLoan(loanInput),
    });
  });

  it('returns the unchanged extra-repayment simulation', () => {
    const input = {
      ...loanInput,
      extraRepaymentAmount: 5_000,
      extraRepaymentMonth: 13,
    };
    const response = handleRestRequest({
      method: 'POST',
      path: '/v1/loans/extra-repayment',
      body: input,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      source: 'fintrace-engine',
      result: simulateExtraRepayment(input),
    });
  });

  it('rejects invalid financial input without calculating a fallback', () => {
    const response = handleRestRequest({
      method: 'POST',
      path: '/v1/loans/calculate',
      body: { ...loanInput, principal: '30000' },
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: { code: 'INVALID_INPUT' },
    });

    const unknownField = handleRestRequest({
      method: 'POST',
      path: '/v1/loans/calculate',
      body: { ...loanInput, guessedRate: 0.05 },
    });
    expect(unknownField.status).toBe(400);
  });

  it('returns reviewed knowledge with citations', () => {
    const response = handleRestRequest({
      method: 'POST',
      path: '/v1/knowledge/search',
      body: { query: 'Sondertilgung', limit: 1 },
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      source: 'fintrace-reviewed-knowledge',
      matches: [
        {
          id: 'extra-repayment-model',
          sourcePath: 'docs/calculation-method.de.md',
        },
      ],
    });
  });

  it('distinguishes method and route errors', () => {
    expect(
      handleRestRequest({ method: 'GET', path: '/v1/loans/calculate' }).status,
    ).toBe(405);
    expect(handleRestRequest({ method: 'GET', path: '/missing' }).status).toBe(
      404,
    );
  });
});
