import localforage from "localforage";

type CacheEntry<T> = {
  value: T;
  savedAt: number;     // ms
  expiresAt: number;   // ms
};

localforage.config({
  name: "repo-explorer",
  storeName: "cache",
  description: "Cached GitHub API responses",
});

export async function cacheGet<T>(key: string): Promise<T | null> {
  const entry = await localforage.getItem<CacheEntry<T>>(key);
  if (!entry) return null;

  const now = Date.now();
  if (entry.expiresAt <= now) {
    // expired: remove and miss
    await localforage.removeItem(key);
    return null;
  }

  return entry.value;
}

export async function cacheSet<T>(key: string, value: T, ttlMs: number): Promise<void> {
  const now = Date.now();
  const entry: CacheEntry<T> = {
    value,
    savedAt: now,
    expiresAt: now + ttlMs,
  };
  await localforage.setItem(key, entry);
}

export async function cacheRemove(key: string): Promise<void> {
  await localforage.removeItem(key);
}

export async function cacheClear(): Promise<void> {
  await localforage.clear();
}
