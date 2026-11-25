import {
  calculateLoan,
  simulateExtraRepayment,
  type ExtraRepaymentInput,
  type LoanInput,
} from '../engine';
import { searchKnowledge } from './knowledge';

export interface RestRequest {
  method: string;
  path: string;
  body?: unknown;
}

export interface RestResponse {
  status: number;
  headers: Readonly<Record<string, string>>;
  body: unknown;
}

const JSON_HEADERS = Object.freeze({
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
});

export function handleRestRequest(request: RestRequest): RestResponse {
  if (request.method === 'GET' && request.path === '/v1/health') {
    return respond(200, { status: 'ok', engine: 'fintrace' });
  }

  const knownPostRoute = [
    '/v1/loans/calculate',
    '/v1/loans/extra-repayment',
    '/v1/knowledge/search',
  ].includes(request.path);

  if (knownPostRoute && request.method !== 'POST') {
    return respond(405, {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Use POST for this route.',
      },
    });
  }

  try {
    switch (request.path) {
      case '/v1/loans/calculate':
        return respond(200, {
          source: 'fintrace-engine',
          result: calculateLoan(readLoanInput(request.body)),
        });
      case '/v1/loans/extra-repayment':
        return respond(200, {
          source: 'fintrace-engine',
          result: simulateExtraRepayment(readExtraRepaymentInput(request.body)),
        });
      case '/v1/knowledge/search': {
        const body = readRecord(request.body);
        assertOnlyFields(body, ['query', 'limit']);
        const query = readString(body, 'query');
        const limit = body.limit === undefined ? 3 : readNumber(body, 'limit');
        if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
          throw new RangeError('limit must be an integer from 1 to 10.');
        }
        return respond(200, {
          source: 'fintrace-reviewed-knowledge',
          matches: searchKnowledge(query, limit),
        });
      }
      default:
        return respond(404, {
          error: { code: 'NOT_FOUND', message: 'Route not found.' },
        });
    }
  } catch (error) {
    return respond(400, {
      error: {
        code: 'INVALID_INPUT',
        message: error instanceof Error ? error.message : 'Invalid input.',
      },
    });
  }
}

function readLoanInput(value: unknown): LoanInput {
  const body = readRecord(value);
  assertOnlyFields(body, [
    'principal',
    'annualEffectiveRate',
    'durationMonths',
  ]);
  return {
    principal: readNumber(body, 'principal'),
    annualEffectiveRate: readNumber(body, 'annualEffectiveRate'),
    durationMonths: readNumber(body, 'durationMonths'),
  };
}

function readExtraRepaymentInput(value: unknown): ExtraRepaymentInput {
  const body = readRecord(value);
  assertOnlyFields(body, [
    'principal',
    'annualEffectiveRate',
    'durationMonths',
    'extraRepaymentAmount',
    'extraRepaymentMonth',
  ]);
  return {
    principal: readNumber(body, 'principal'),
    annualEffectiveRate: readNumber(body, 'annualEffectiveRate'),
    durationMonths: readNumber(body, 'durationMonths'),
    extraRepaymentAmount: readNumber(body, 'extraRepaymentAmount'),
    extraRepaymentMonth: readNumber(body, 'extraRepaymentMonth'),
  };
}

function readRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError('Request body must be a JSON object.');
  }
  return value as Record<string, unknown>;
}

function readNumber(body: Record<string, unknown>, field: string): number {
  const value = body[field];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${field} must be a finite number.`);
  }
  return value;
}

function readString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} must be a non-empty string.`);
  }
  return value;
}

function assertOnlyFields(
  body: Record<string, unknown>,
  allowedFields: readonly string[],
): void {
  const allowed = new Set(allowedFields);
  const unknownField = Object.keys(body).find((field) => !allowed.has(field));
  if (unknownField) {
    throw new TypeError(`Unknown field: ${unknownField}.`);
  }
}

function respond(status: number, body: unknown): RestResponse {
  return { status, headers: JSON_HEADERS, body };
}
