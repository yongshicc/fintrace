import { describe, expect, it } from 'vitest';
import { callFinTraceTool, FINTRACE_MCP_TOOLS } from '../../src/adapters';
import { calculateLoan } from '../../src/engine';

const loanInput = {
  principal: 30_000,
  annualEffectiveRate: 0.07,
  durationMonths: 60,
};

describe('FinTrace MCP adapter', () => {
  it('publishes three bounded tools', () => {
    expect(FINTRACE_MCP_TOOLS.map((tool) => tool.name)).toEqual([
      'calculate_loan',
      'simulate_extra_repayment',
      'search_fintrace_knowledge',
    ]);
  });

  it('returns engine output as structured content', () => {
    const result = callFinTraceTool('calculate_loan', loanInput);

    expect(result.isError).toBeUndefined();
    expect(result.structuredContent).toEqual({
      source: 'fintrace-engine',
      result: calculateLoan(loanInput),
    });
    expect(JSON.parse(result.content[0]?.text ?? '{}')).toEqual(
      result.structuredContent,
    );
  });

  it('returns explicit tool errors for invalid calls', () => {
    expect(callFinTraceTool('unknown', {}).isError).toBe(true);
    const invalid = callFinTraceTool('calculate_loan', {
      ...loanInput,
      durationMonths: 0,
    });
    expect(invalid.isError).toBe(true);
    expect(invalid.content[0]?.text).toContain('durationMonths');
  });
});
