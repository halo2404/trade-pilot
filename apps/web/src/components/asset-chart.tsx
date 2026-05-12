"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ema as calcEma, sma as calcSma } from "@/lib/indicators";
import type { OHLCVBar } from "@/lib/chart-types";

interface Props {
  bars: OHLCVBar[];
  currency: string;
  showSMA: boolean;
  showEMA: boolean;
  smaPeriod?: number;
  emaPeriod?: number;
}

function formatTs(ts: string, nBars: number): string {
  const d = new Date(ts);
  if (nBars <= 78) {
    // intraday: show HH:MM
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }
  if (nBars <= 35) {
    // hourly: show DD.MM HH:MM
    return `${d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} ${d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function priceFormatter(value: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 4,
    notation: "compact",
  }).format(value);
}

function volFormatter(value: number) {
  return new Intl.NumberFormat("de-DE", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, currency, nBars }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="rounded-lg border bg-background shadow-md p-3 text-xs space-y-1 min-w-[160px]">
      <p className="font-medium text-muted-foreground">{formatTs(d.t, nBars)}</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <span className="text-muted-foreground">Schluss</span>
        <span className="font-semibold tabular-nums text-right">{priceFormatter(d.c, currency)}</span>
        <span className="text-muted-foreground">Eröffnung</span>
        <span className="tabular-nums text-right">{priceFormatter(d.o, currency)}</span>
        <span className="text-muted-foreground">Hoch</span>
        <span className="tabular-nums text-right text-green-600 dark:text-green-400">{priceFormatter(d.h, currency)}</span>
        <span className="text-muted-foreground">Tief</span>
        <span className="tabular-nums text-right text-red-600 dark:text-red-400">{priceFormatter(d.l, currency)}</span>
        {d.sma != null && (
          <>
            <span className="text-muted-foreground">SMA</span>
            <span className="tabular-nums text-right text-amber-500">{priceFormatter(d.sma, currency)}</span>
          </>
        )}
        {d.ema != null && (
          <>
            <span className="text-muted-foreground">EMA</span>
            <span className="tabular-nums text-right text-purple-500">{priceFormatter(d.ema, currency)}</span>
          </>
        )}
        <span className="text-muted-foreground">Volumen</span>
        <span className="tabular-nums text-right">{volFormatter(d.v)}</span>
      </div>
    </div>
  );
}

export function AssetChart({ bars, currency, showSMA, showEMA, smaPeriod = 20, emaPeriod = 20 }: Props) {
  const data = useMemo(() => {
    const closes = bars.map((b) => b.c);
    const smaVals = calcSma(closes, smaPeriod);
    const emaVals = calcEma(closes, emaPeriod);

    return bars.map((b, i) => ({
      ...b,
      sma: smaVals[i],
      ema: emaVals[i],
    }));
  }, [bars, smaPeriod, emaPeriod]);

  const nBars = bars.length;
  const prices = bars.map((b) => b.c);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const pad = (maxPrice - minPrice) * 0.08;
  const priceMin = minPrice - pad;
  const priceMax = maxPrice + pad;

  const isUp = bars.length >= 2 && bars[bars.length - 1].c >= bars[0].c;
  const strokeColor = isUp ? "#22c55e" : "#ef4444";
  const gradientId = `grad-${isUp ? "up" : "dn"}`;

  return (
    <div className="space-y-1">
      {/* Price + SMA/EMA */}
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.18} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="t"
            tickFormatter={(v) => formatTs(v, nBars)}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={Math.floor(nBars / 6)}
            className="text-muted-foreground"
          />
          <YAxis
            domain={[priceMin, priceMax]}
            tickFormatter={(v) => priceFormatter(v, currency)}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={72}
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip currency={currency} nBars={nBars} />} />

          {/* Price area */}
          <Line
            type="monotone"
            dataKey="c"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3 }}
            fill={`url(#${gradientId})`}
            name="Kurs"
          />

          {/* SMA overlay */}
          {showSMA && (
            <Line
              type="monotone"
              dataKey="sma"
              stroke="#f59e0b"
              strokeWidth={1.2}
              dot={false}
              strokeDasharray="4 2"
              connectNulls
              name={`SMA ${smaPeriod}`}
            />
          )}

          {/* EMA overlay */}
          {showEMA && (
            <Line
              type="monotone"
              dataKey="ema"
              stroke="#a855f7"
              strokeWidth={1.2}
              dot={false}
              connectNulls
              name={`EMA ${emaPeriod}`}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Volume */}
      <ResponsiveContainer width="100%" height={60}>
        <BarChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <YAxis
            tickFormatter={volFormatter}
            tick={{ fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            width={72}
            tickCount={2}
            className="text-muted-foreground"
          />
          <Tooltip
            formatter={(v) => [volFormatter(Number(v)), "Volumen"]}
            labelFormatter={() => ""}
            contentStyle={{ fontSize: 11 }}
          />
          <Bar
            dataKey="v"
            fill={strokeColor}
            opacity={0.45}
            radius={[1, 1, 0, 0]}
            maxBarSize={8}
            name="Volumen"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
