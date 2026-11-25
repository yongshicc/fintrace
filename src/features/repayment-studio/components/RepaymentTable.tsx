import type { AmortizationEntry } from '../../../engine';
import { formatEuro } from '../formatters';

interface RepaymentTableProps {
  schedule: AmortizationEntry[];
  highlightedMonth: number | null;
}

function selectPreviewRows(
  schedule: AmortizationEntry[],
  highlightedMonth: number | null,
): AmortizationEntry[] {
  const indexes = new Set([0, 1, 2, schedule.length - 1]);

  if (highlightedMonth !== null) {
    indexes.add(highlightedMonth - 2);
    indexes.add(highlightedMonth - 1);
    indexes.add(highlightedMonth);
  }

  return [...indexes]
    .filter((index) => index >= 0 && index < schedule.length)
    .sort((a, b) => a - b)
    .map((index) => schedule[index])
    .filter((entry): entry is AmortizationEntry => entry !== undefined);
}

export function RepaymentTable({
  schedule,
  highlightedMonth,
}: RepaymentTableProps) {
  const rows = selectPreviewRows(schedule, highlightedMonth);

  return (
    <section className="data-section" aria-labelledby="schedule-heading">
      <div className="section-heading-row">
        <div>
          <h2 className="section-heading" id="schedule-heading">
            Tilgungsplan
          </h2>
          <p className="section-subtitle">
            Auszug aus {schedule.length} Monatszeilen
          </p>
        </div>
        <p className="table-hint">Tabelle seitlich verschiebbar</p>
      </div>
      <div
        className="table-scroll desktop-schedule"
        tabIndex={0}
        aria-label="Tilgungsplan, seitlich scrollbar"
      >
        <table>
          <thead>
            <tr>
              <th>Monat</th>
              <th>Anfangssaldo</th>
              <th>Rate</th>
              <th>Zins</th>
              <th>Tilgung</th>
              <th>Sondertilgung</th>
              <th>Restschuld</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, index) => {
              const previous = rows[index - 1];
              const hasGap = previous && entry.month - previous.month > 1;
              return (
                <tr
                  className={
                    entry.month === highlightedMonth
                      ? 'is-highlighted'
                      : undefined
                  }
                  key={entry.month}
                >
                  <td>
                    {hasGap ? <span className="row-gap">…</span> : null}
                    {entry.month}
                  </td>
                  <td>{formatEuro(entry.openingBalance)}</td>
                  <td>{formatEuro(entry.regularPayment)}</td>
                  <td>{formatEuro(entry.interestPortion)}</td>
                  <td>{formatEuro(entry.principalPortion)}</td>
                  <td>{formatEuro(entry.extraRepayment)}</td>
                  <td>{formatEuro(entry.closingBalance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className="mobile-schedule"
        aria-label="Tilgungsplan für Mobilgeräte"
      >
        {rows.map((entry, index) => {
          const previous = rows[index - 1];
          const hasGap = previous && entry.month - previous.month > 1;
          const isHighlighted = entry.month === highlightedMonth;
          return (
            <details
              className={isHighlighted ? 'is-highlighted' : undefined}
              open={isHighlighted ? true : undefined}
              key={entry.month}
            >
              <summary>
                <span>
                  {hasGap ? '… ' : ''}Monat {entry.month}
                </span>
                <strong>{formatEuro(entry.closingBalance)} Restschuld</strong>
              </summary>
              <dl>
                <MobileValue
                  label="Anfangssaldo"
                  value={entry.openingBalance}
                />
                <MobileValue label="Rate" value={entry.regularPayment} />
                <MobileValue label="Zins" value={entry.interestPortion} />
                <MobileValue label="Tilgung" value={entry.principalPortion} />
                <MobileValue
                  label="Sondertilgung"
                  value={entry.extraRepayment}
                />
              </dl>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function MobileValue({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{formatEuro(value)}</dd>
    </div>
  );
}
