import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RepaymentStudio } from '../../src/features/repayment-studio/RepaymentStudio';

describe('RepaymentStudio', () => {
  it('renders deterministic reference results', () => {
    render(<RepaymentStudio />);

    expect(screen.getAllByText(/591,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/35\.459,83/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/5\.459,83/).length).toBeGreaterThan(0);
  });

  it('updates all result values after form submission', () => {
    render(<RepaymentStudio />);

    fireEvent.change(screen.getByLabelText('Kreditbetrag'), {
      target: { value: '12000' },
    });
    fireEvent.change(screen.getByLabelText('Effektiver Jahreszins'), {
      target: { value: '0' },
    });
    fireEvent.change(screen.getByLabelText('Laufzeit'), {
      target: { value: '24' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    const form = screen.getByLabelText('Kreditbetrag').closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    expect(screen.getAllByText(/500,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/12\.000,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0,00/).length).toBeGreaterThan(0);
  });

  it('applies a selected interest scenario to the main simulation', async () => {
    render(<RepaymentStudio />);

    const highRateButton = await screen.findByRole('button', {
      name: /9,00 % übernehmen/,
    });
    fireEvent.click(highRateButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Effektiver Jahreszins')).toHaveValue(9);
    });
    expect(screen.getAllByText(/9,00 %/).length).toBeGreaterThan(0);
  });

  it('switches recorded explanations while preserving engine provenance', () => {
    render(<RepaymentStudio />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Was bringt die Sondertilgung?',
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'So wirkt die gewählte Sondertilgung im Modell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Quelle: ExtraRepaymentResult.interestSavings'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Aufgezeichnet · keine Live-KI/),
    ).toBeInTheDocument();
  });
});
