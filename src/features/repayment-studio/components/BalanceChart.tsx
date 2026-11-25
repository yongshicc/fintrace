import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AmortizationEntry } from '../../../engine';
import { formatEuro, formatInteger } from '../formatters';

interface BalanceChartProps {
  originalSchedule: AmortizationEntry[];
  alternativeSchedule: AmortizationEntry[] | null;
}

interface ChartPoint {
  month: number;
  original: number;
  alternative: number | null;
}

function buildChartData(
  originalSchedule: AmortizationEntry[],
  alternativeSchedule: AmortizationEntry[] | null,
): ChartPoint[] {
  const alternativeByMonth = new Map(
    alternativeSchedule?.map((entry) => [entry.month, entry.closingBalance]) ??
      [],
  );
  const first: ChartPoint = {
    month: 0,
    original: originalSchedule[0]?.openingBalance ?? 0,
    alternative: alternativeSchedule
      ? (alternativeSchedule[0]?.openingBalance ?? 0)
      : null,
  };

  return [
    first,
    ...originalSchedule.map((entry) => ({
      month: entry.month,
      original: entry.closingBalance,
      alternative: alternativeSchedule
        ? (alternativeByMonth.get(entry.month) ?? null)
        : null,
    })),
  ];
}

export function BalanceChart({
  originalSchedule,
  alternativeSchedule,
}: BalanceChartProps) {
  const data = buildChartData(originalSchedule, alternativeSchedule);

  return (
    <section className="data-section" aria-labelledby="chart-heading">
      <div className="section-heading-row">
        <div>
          <h2 className="section-heading" id="chart-heading">
            Restschuld über die Laufzeit
          </h2>
          <p className="section-subtitle">
            Monatliche Entwicklung bei gleichbleibender Rate
          </p>
        </div>
        <div className="chart-legend" aria-label="Diagrammlegende">
          <span>
            <i className="legend-line legend-original" /> Ohne Sondertilgung
          </span>
          {alternativeSchedule ? (
            <span>
              <i className="legend-line legend-alternative" /> Mit Sondertilgung
            </span>
          ) : null}
        </div>
      </div>
      <div className="h-[290px] w-full sm:h-[340px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 800, height: 340 }}
        >
          <AreaChart
            data={data}
            margin={{ top: 12, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              stroke="#273548"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#8290a3"
              tick={{ fill: '#a8b3c3', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#8290a3"
              tick={{ fill: '#a8b3c3', fontSize: 12 }}
              tickFormatter={(value: number) =>
                `${formatInteger(value / 1_000)} Tsd.`
              }
              tickLine={false}
              axisLine={false}
              width={62}
            />
            <Tooltip
              formatter={(value) => formatEuro(Number(value))}
              labelFormatter={(label) => `Monat ${String(label)}`}
              contentStyle={{
                background: '#111c2c',
                border: '1px solid #3c4b60',
                borderRadius: '10px',
                color: '#f8fafc',
              }}
            />
            <Area
              type="monotone"
              dataKey="original"
              name="Ohne Sondertilgung"
              stroke="#9fb0c8"
              strokeWidth={2}
              strokeDasharray="6 6"
              fill="#64748b"
              fillOpacity={0.06}
              isAnimationActive={false}
            />
            {alternativeSchedule ? (
              <Line
                type="monotone"
                dataKey="alternative"
                name="Mit Sondertilgung"
                stroke="#62e6ad"
                strokeWidth={3}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
