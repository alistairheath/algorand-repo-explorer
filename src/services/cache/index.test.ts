import { describe, it, expect, beforeEach } from "vitest";
import localforage from "localforage";
import { cacheGet, cacheSet } from "./index";

beforeEach(async () => {
  await localforage.clear();
});

describe("cache", () => {
  it("returns cached value before expiry", async () => {
    await cacheSet("key", "value", 1000);
    const result = await cacheGet<string>("key");
    expect(result).toBe("value");
  });

  it("expires values correctly", async () => {
    await cacheSet("key", "value", -1);
    const result = await cacheGet("key");
    expect(result).toBeNull();
  });
});
