import { describe, it, expect } from "vitest";
import { formatCompactNumber } from "./formatters";

describe("formatCompactNumber", () => {
  it("formats small numbers", () => {
    expect(formatCompactNumber(42)).toBe("42");
  });

  it("formats thousands", () => {
    expect(formatCompactNumber(1200)).toBe("1.2K");
  });

  it("formats millions", () => {
    expect(formatCompactNumber(2_500_000)).toBe("2.5M");
  });
});
