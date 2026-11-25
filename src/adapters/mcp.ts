import { handleRestRequest } from './rest';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpToolResult {
  content: Array<{ type: 'text'; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

const LOAN_PROPERTIES = {
  principal: { type: 'number', exclusiveMinimum: 0 },
  annualEffectiveRate: { type: 'number', minimum: 0 },
  durationMonths: { type: 'integer', minimum: 1, maximum: 1200 },
};

export const FINTRACE_MCP_TOOLS: readonly McpToolDefinition[] = [
  {
    name: 'calculate_loan',
    description:
      'Calculate a fixed-rate annuity loan with the FinTrace engine.',
    inputSchema: {
      type: 'object',
      properties: LOAN_PROPERTIES,
      required: ['principal', 'annualEffectiveRate', 'durationMonths'],
      additionalProperties: false,
    },
  },
  {
    name: 'simulate_extra_repayment',
    description: 'Compare the base schedule with one fee-free extra repayment.',
    inputSchema: {
      type: 'object',
      properties: {
        ...LOAN_PROPERTIES,
        extraRepaymentAmount: { type: 'number', minimum: 0 },
        extraRepaymentMonth: { type: 'integer', minimum: 1 },
      },
      required: [
        'principal',
        'annualEffectiveRate',
        'durationMonths',
        'extraRepaymentAmount',
        'extraRepaymentMonth',
      ],
      additionalProperties: false,
    },
  },
  {
    name: 'search_fintrace_knowledge',
    description: 'Search reviewed FinTrace model and disclaimer documents.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', minLength: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 10 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
];

const ROUTE_BY_TOOL: Readonly<Record<string, string>> = Object.freeze({
  calculate_loan: '/v1/loans/calculate',
  simulate_extra_repayment: '/v1/loans/extra-repayment',
  search_fintrace_knowledge: '/v1/knowledge/search',
});

export function callFinTraceTool(
  name: string,
  argumentsValue: unknown,
): McpToolResult {
  const path = ROUTE_BY_TOOL[name];
  if (!path) {
    return errorResult(`Unknown FinTrace tool: ${name}`);
  }

  const response = handleRestRequest({
    method: 'POST',
    path,
    body: argumentsValue,
  });
  if (response.status !== 200) {
    return errorResult(getRestError(response.body));
  }

  const result = response.body as Record<string, unknown>;
  return {
    content: [{ type: 'text', text: JSON.stringify(result) }],
    structuredContent: result,
  };
}

function getRestError(value: unknown): string {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'Invalid input.';
  }
  const error = (value as Record<string, unknown>).error;
  if (typeof error !== 'object' || error === null || Array.isArray(error)) {
    return 'Invalid input.';
  }
  const message = (error as Record<string, unknown>).message;
  return typeof message === 'string' ? message : 'Invalid input.';
}

function errorResult(message: string): McpToolResult {
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
  };
}
