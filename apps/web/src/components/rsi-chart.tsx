"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { rsi as calcRsi } from "@/lib/indicators";
import type { OHLCVBar } from "@/lib/chart-types";

interface Props {
  bars: OHLCVBar[];
  period?: number;
}

export function RSIChart({ bars, period = 14 }: Props) {
  const data = useMemo(() => {
    const closes = bars.map((b) => b.c);
    const rsiVals = calcRsi(closes, period);
    return bars.map((b, i) => ({ t: b.t, rsi: rsiVals[i] != null ? +rsiVals[i]!.toFixed(2) : null }));
  }, [bars, period]);

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1 ml-1">
        RSI ({period})
      </p>
      <ResponsiveContainer width="100%" height={90}>
        <LineChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            domain={[0, 100]}
            ticks={[30, 50, 70]}
            tick={{ fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            width={30}
            className="text-muted-foreground"
          />
          <Tooltip
            formatter={(v) => [`${Number(v).toFixed(1)}`, `RSI (${period})`]}
            labelFormatter={() => ""}
            contentStyle={{ fontSize: 11 }}
          />
          {/* Overbought / oversold zones */}
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 2" strokeWidth={1} opacity={0.7} />
          <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 2" strokeWidth={1} opacity={0.7} />
          <ReferenceLine y={50} stroke="currentColor" strokeDasharray="2 3" strokeWidth={0.5} opacity={0.3} />

          <Line
            type="monotone"
            dataKey="rsi"
            stroke="#3b82f6"
            strokeWidth={1.5}
            dot={false}
            connectNulls
            name={`RSI (${period})`}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-1 ml-1">
        <span className="text-[10px] text-red-500">— Überkauft (70)</span>
        <span className="text-[10px] text-green-500">— Überverkauft (30)</span>
      </div>
    </div>
  );
}
