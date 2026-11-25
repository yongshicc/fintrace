import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { compareInterestRates } from '../../../engine';
import { formatEuro, formatInteger, formatPercent } from '../formatters';

interface InterestRangeExplorerProps {
  principal: number;
  durationMonths: number;
  currentAnnualRatePercent: number;
  onSelectRate: (annualRatePercent: number) => void;
}

interface RangeValues {
  minimumPercent: number;
  maximumPercent: number;
  stepPercent: number;
}

const INITIAL_RANGE: RangeValues = {
  minimumPercent: 5,
  maximumPercent: 9,
  stepPercent: 0.5,
};

export function InterestRangeExplorer({
  principal,
  durationMonths,
  currentAnnualRatePercent,
  onSelectRate,
}: InterestRangeExplorerProps) {
  const [range, setRange] = useState<RangeValues>(INITIAL_RANGE);

  const result = useMemo(() => {
    try {
      const scenarios = compareInterestRates({
        principal,
        annualEffectiveRate: currentAnnualRatePercent / 100,
        durationMonths,
        minimumAnnualEffectiveRate: range.minimumPercent / 100,
        maximumAnnualEffectiveRate: range.maximumPercent / 100,
        rateStep: range.stepPercent / 100,
      });
      return { scenarios, error: null };
    } catch (error) {
      return {
        scenarios: [],
        error:
          error instanceof Error
            ? error.message
            : 'Die Zinsspanne konnte nicht berechnet werden.',
      };
    }
  }, [currentAnnualRatePercent, durationMonths, principal, range]);

  const scenarioChoices = useMemo(() => {
    if (result.scenarios.length === 0) {
      return [];
    }
    const current = result.scenarios.reduce((closest, scenario) =>
      Math.abs(scenario.annualEffectiveRate - currentAnnualRatePercent / 100) <
      Math.abs(closest.annualEffectiveRate - currentAnnualRatePercent / 100)
        ? scenario
        : closest,
    );
    return Array.from(
      new Map(
        [result.scenarios[0], current, result.scenarios.at(-1)]
          .filter((scenario) => scenario !== undefined)
          .map((scenario) => [scenario.annualEffectiveRate, scenario]),
      ).values(),
    );
  }, [currentAnnualRatePercent, result.scenarios]);

  const chartData = result.scenarios.map((scenario) => ({
    ratePercent: scenario.annualEffectiveRate * 100,
    monthlyInstallment: scenario.monthlyInstallment,
    totalInterest: scenario.totalInterest,
  }));

  return (
    <section className="data-section" aria-labelledby="range-heading">
      <div className="section-heading-row">
        <div>
          <h2 className="section-heading" id="range-heading">
            Interest Range Explorer
          </h2>
          <p className="section-subtitle">
            Wie verändert der effektive Jahreszins die Monatsrate?
          </p>
        </div>
        <p className="range-current">
          Aktuell: {formatPercent(currentAnnualRatePercent)}
        </p>
      </div>

      <div className="range-controls" aria-label="Zinsspanne konfigurieren">
        <RangeField
          id="range-minimum"
          label="Von"
          value={range.minimumPercent}
          onChange={(minimumPercent) => setRange({ ...range, minimumPercent })}
        />
        <RangeField
          id="range-maximum"
          label="Bis"
          value={range.maximumPercent}
          onChange={(maximumPercent) => setRange({ ...range, maximumPercent })}
        />
        <RangeField
          id="range-step"
          label="Schritt"
          value={range.stepPercent}
          onChange={(stepPercent) => setRange({ ...range, stepPercent })}
        />
      </div>

      {result.error ? (
        <p className="range-error" role="alert">
          Bitte Zinsspanne prüfen: {result.error}
        </p>
      ) : (
        <>
          <div className="range-chart" aria-label="Monatsrate nach Zinssatz">
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 800, height: 260 }}
            >
              <LineChart
                data={chartData}
                margin={{ top: 14, right: 12, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  stroke="#273548"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="ratePercent"
                  tickFormatter={(value: number) => `${value.toFixed(1)} %`}
                  tick={{ fill: '#a8b3c3', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tickFormatter={(value: number) => formatInteger(value)}
                  tick={{ fill: '#a8b3c3', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatEuro(Number(value)),
                    name === 'monthlyInstallment'
                      ? 'Monatsrate'
                      : 'Gesamtzinsen',
                  ]}
                  labelFormatter={(label) =>
                    `Effektiver Jahreszins ${Number(label).toFixed(2)} %`
                  }
                  contentStyle={{
                    background: '#111c2c',
                    border: '1px solid #3c4b60',
                    borderRadius: '10px',
                    color: '#f8fafc',
                  }}
                />
                <ReferenceLine
                  x={currentAnnualRatePercent}
                  stroke="#8b9ab0"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="monthlyInstallment"
                  name="monthlyInstallment"
                  stroke="#62e6ad"
                  strokeWidth={3}
                  dot={{ fill: '#0c1727', stroke: '#62e6ad', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#62e6ad' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rate-scenario-list">
            {scenarioChoices.map((scenario) => {
              const percent = scenario.annualEffectiveRate * 100;
              const isCurrent =
                Math.abs(percent - currentAnnualRatePercent) < 1e-9;
              return (
                <button
                  className={`rate-scenario ${isCurrent ? 'is-current' : ''}`}
                  type="button"
                  onClick={() => onSelectRate(percent)}
                  aria-label={`${formatPercent(percent)} übernehmen`}
                  key={scenario.annualEffectiveRate}
                >
                  <span>{formatPercent(percent)}</span>
                  <strong>{formatEuro(scenario.monthlyInstallment)}</strong>
                  <small>
                    Gesamtzinsen {formatEuro(scenario.totalInterest)}
                  </small>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function RangeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id}>
      <span>{label}</span>
      <span className="range-field-shell">
        <input
          id={id}
          type="number"
          min="0"
          max="1000"
          step="0.1"
          value={value}
          onChange={(event) => {
            const nextValue = event.currentTarget.valueAsNumber;
            if (Number.isFinite(nextValue)) {
              onChange(nextValue);
            }
          }}
        />
        <span aria-hidden="true">%</span>
      </span>
    </label>
  );
}
