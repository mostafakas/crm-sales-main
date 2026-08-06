// ─── Grouping ─────────────────────────────────────────────────────────────────

export function groupBy<T>(
  arr: T[],
  key: (item: T) => string
): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ─── Deduplication ────────────────────────────────────────────────────────────

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function uniqueBy<T>(arr: T[], key: (item: T) => unknown): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

export function sortBy<T>(
  arr: T[],
  key: (item: T) => string | number,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...arr].sort((a, b) => {
    const ka = key(a);
    const kb = key(b);
    const cmp = ka < kb ? -1 : ka > kb ? 1 : 0;
    return direction === "asc" ? cmp : -cmp;
  });
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function flatten<T>(arr: T[][]): T[] {
  return arr.flat();
}

export function compact<T>(arr: (T | null | undefined | false | "")[]): T[] {
  return arr.filter(Boolean) as T[];
}

export function toMap<T, K extends string | number>(
  arr: T[],
  key: (item: T) => K
): Map<K, T> {
  return new Map(arr.map((item) => [key(item), item]));
}
