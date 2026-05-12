import { describe, expect, it } from "vitest";
import { ema, rsi, sma } from "@/lib/indicators";

// ── SMA ───────────────────────────────────────────────────────────────

describe("sma()", () => {
  it("returns null for indices before period-1", () => {
    const result = sma([10, 20, 30, 40, 50], 3);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
  });

  it("calculates correct SMA at period boundary", () => {
    const result = sma([10, 20, 30], 3);
    expect(result[2]).toBeCloseTo(20);
  });

  it("SMA(1) returns the value itself", () => {
    const values = [5, 10, 15];
    const result = sma(values, 1);
    result.forEach((v, i) => expect(v).toBeCloseTo(values[i]));
  });

  it("slides the window correctly", () => {
    const result = sma([2, 4, 6, 8, 10], 3);
    expect(result[2]).toBeCloseTo(4);  // (2+4+6)/3
    expect(result[3]).toBeCloseTo(6);  // (4+6+8)/3
    expect(result[4]).toBeCloseTo(8);  // (6+8+10)/3
  });

  it("returns array of same length as input", () => {
    const values = [1, 2, 3, 4, 5];
    expect(sma(values, 3)).toHaveLength(values.length);
  });
});

// ── EMA ───────────────────────────────────────────────────────────────

describe("ema()", () => {
  it("returns null before period-1", () => {
    const result = ema([1, 2, 3, 4, 5], 3);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
  });

  it("seeds first EMA value as SMA", () => {
    const result = ema([10, 20, 30, 40, 50], 3);
    expect(result[2]).toBeCloseTo(20); // SMA of [10,20,30]
  });

  it("gives more weight to recent values (EMA > SMA in uptrend)", () => {
    const ascending = [10, 20, 30, 40, 50, 60, 70];
    const smaResult = sma(ascending, 3);
    const emaResult = ema(ascending, 3);
    // After seed point, EMA should be >= SMA in an uptrend
    const lastSma = smaResult[smaResult.length - 1] as number;
    const lastEma = emaResult[emaResult.length - 1] as number;
    expect(lastEma).toBeGreaterThanOrEqual(lastSma);
  });

  it("returns array of same length as input", () => {
    const values = [1, 2, 3, 4, 5, 6];
    expect(ema(values, 3)).toHaveLength(values.length);
  });
});

// ── RSI ───────────────────────────────────────────────────────────────

describe("rsi()", () => {
  it("returns all nulls when not enough data", () => {
    const result = rsi([10, 20, 30], 14);
    expect(result.every((v) => v === null)).toBe(true);
  });

  it("RSI is 100 when all gains (no losses)", () => {
    const ascending = Array.from({ length: 20 }, (_, i) => i * 10);
    const result = rsi(ascending, 14);
    const last = result[result.length - 1] as number;
    expect(last).toBeCloseTo(100);
  });

  it("RSI is 0 when all losses (no gains)", () => {
    const descending = Array.from({ length: 20 }, (_, i) => 200 - i * 10);
    const result = rsi(descending, 14);
    const last = result[result.length - 1] as number;
    expect(last).toBeCloseTo(0);
  });

  it("RSI is around 50 for alternating gains/losses", () => {
    const zigzag = Array.from({ length: 30 }, (_, i) => (i % 2 === 0 ? 100 : 110));
    const result = rsi(zigzag, 14);
    const last = result[result.length - 1] as number;
    expect(last).toBeGreaterThan(30);
    expect(last).toBeLessThan(70);
  });

  it("RSI values are always in [0, 100]", () => {
    const noisy = [50, 55, 48, 60, 45, 70, 40, 65, 42, 68, 50, 55, 60, 52, 58, 63, 49, 71, 44, 66];
    const result = rsi(noisy, 5);
    result.forEach((v) => {
      if (v !== null) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    });
  });

  it("returns array of same length as input", () => {
    const values = Array.from({ length: 20 }, (_, i) => i);
    expect(rsi(values, 14)).toHaveLength(values.length);
  });
});
