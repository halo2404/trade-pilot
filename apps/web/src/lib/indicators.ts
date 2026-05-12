/**
 * Technical indicator calculations.
 * All functions return arrays of the same length as the input,
 * with null for positions where not enough data is available yet.
 */

export function sma(values: number[], period: number): (number | null)[] {
  return values.map((_, i) => {
    if (i < period - 1) return null;
    const slice = values.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

export function ema(values: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  const result: (number | null)[] = new Array(values.length).fill(null);

  // Seed: first EMA = SMA of first `period` values
  const seed = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result[period - 1] = seed;

  for (let i = period; i < values.length; i++) {
    result[i] = values[i] * k + (result[i - 1] as number) * (1 - k);
  }
  return result;
}

export function rsi(values: number[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period + 1) return result;

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < values.length; i++) {
    const delta = values[i] - values[i - 1];
    gains.push(Math.max(0, delta));
    losses.push(Math.max(0, -delta));
  }

  // First RSI uses simple averages
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const calcRsi = (ag: number, al: number) =>
    al === 0 ? 100 : 100 - 100 / (1 + ag / al);

  result[period] = calcRsi(avgGain, avgLoss);

  for (let i = period + 1; i < values.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
    result[i] = calcRsi(avgGain, avgLoss);
  }

  return result;
}
