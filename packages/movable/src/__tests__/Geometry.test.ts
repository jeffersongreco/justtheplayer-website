import { describe, expect, it, vi } from "vitest";
import { Geometry } from "../lib/Geometry";

const noop = () => undefined;

describe("Geometry.clamp", () => {
  it("returns value when within range", () => {
    expect(Geometry.clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min when value is below", () => {
    expect(Geometry.clamp(-3, 0, 10)).toBe(0);
  });

  it("clamps to max when value is above", () => {
    expect(Geometry.clamp(15, 0, 10)).toBe(10);
  });

  it("returns min when value equals min", () => {
    expect(Geometry.clamp(0, 0, 10)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(Geometry.clamp(10, 0, 10)).toBe(10);
  });

  it("handles inverted min/max (min > max)", () => {
    expect(Geometry.clamp(5, 10, 0)).toBe(10);
  });

  it("handles equal min and max", () => {
    expect(Geometry.clamp(5, 3, 3)).toBe(3);
  });

  it("handles negative ranges", () => {
    expect(Geometry.clamp(-5, -10, -1)).toBe(-5);
  });
});

describe("Geometry.intersects", () => {
  const rect = (x: number, y: number, width: number, height: number) => ({
    x,
    y,
    width,
    height,
  });

  it("detects overlap", () => {
    expect(Geometry.intersects(rect(0, 0, 10, 10), rect(5, 5, 10, 10))).toBe(
      true
    );
  });

  it("detects containment", () => {
    expect(Geometry.intersects(rect(0, 0, 20, 20), rect(5, 5, 5, 5))).toBe(
      true
    );
  });

  it("returns false for no overlap", () => {
    expect(Geometry.intersects(rect(0, 0, 10, 10), rect(20, 20, 10, 10))).toBe(
      false
    );
  });

  it("returns false for adjacent rects (touching edges)", () => {
    expect(Geometry.intersects(rect(0, 0, 10, 10), rect(10, 0, 10, 10))).toBe(
      false
    );
  });

  it("returns false for vertically adjacent rects", () => {
    expect(Geometry.intersects(rect(0, 0, 10, 10), rect(0, 10, 10, 10))).toBe(
      false
    );
  });

  it("detects partial horizontal overlap", () => {
    expect(Geometry.intersects(rect(0, 0, 10, 10), rect(9, 0, 10, 10))).toBe(
      true
    );
  });

  it("detects partial vertical overlap", () => {
    expect(Geometry.intersects(rect(0, 0, 10, 10), rect(0, 9, 10, 10))).toBe(
      true
    );
  });
});

describe("Geometry.resolve", () => {
  const containerSize = 500;

  it("resolves percentage values", () => {
    expect(Geometry.resolve("50%", containerSize)).toBe(250);
  });

  it("resolves 0%", () => {
    expect(Geometry.resolve("0%", containerSize)).toBe(0);
  });

  it("resolves 100%", () => {
    expect(Geometry.resolve("100%", containerSize)).toBe(500);
  });

  it("resolves px values", () => {
    expect(Geometry.resolve("120px", containerSize)).toBe(120);
  });

  it("resolves 0px", () => {
    expect(Geometry.resolve("0px", containerSize)).toBe(0);
  });

  it("resolves bare numbers", () => {
    expect(Geometry.resolve(42, containerSize)).toBe(42);
  });

  it("resolves 0 as a number", () => {
    expect(Geometry.resolve(0, containerSize)).toBe(0);
  });

  it("resolves negative numbers", () => {
    expect(Geometry.resolve(-10, containerSize)).toBe(-10);
  });

  it("falls back to 0 and warns for NaN", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(noop);
    expect(Geometry.resolve(Number.NaN, containerSize)).toBe(0);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("falls back to 0 and warns for Infinity", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(noop);
    expect(Geometry.resolve(Number.POSITIVE_INFINITY, containerSize)).toBe(0);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("falls back to 0 and warns for -Infinity", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(noop);
    expect(Geometry.resolve(Number.NEGATIVE_INFINITY, containerSize)).toBe(0);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("falls back to 0 and warns for unparseable strings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(noop);
    expect(Geometry.resolve("abc" as never, containerSize)).toBe(0);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("falls back to 0 and warns for strings with no unit", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(noop);
    expect(Geometry.resolve("42" as never, containerSize)).toBe(0);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});
