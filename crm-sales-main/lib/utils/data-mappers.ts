import { toMap } from "./array-utils";

// ─── Normalizer ───────────────────────────────────────────────────────────────
// Converts an array of entities into a lookup map keyed by id.

export interface NormalizedState<T> {
  byId: Map<string, T>;
  ids: string[];
}

export function normalize<T extends { id: string }>(
  items: T[]
): NormalizedState<T> {
  return {
    byId: toMap(items, (item) => item.id),
    ids: items.map((item) => item.id),
  };
}

export function denormalize<T>(state: NormalizedState<T>): T[] {
  return state.ids.flatMap((id) => {
    const item = state.byId.get(id);
    return item ? [item] : [];
  });
}

// ─── Key Transformer ──────────────────────────────────────────────────────────

/** Converts all keys of an object from camelCase to snake_case for API payloads. */
export function toApiPayload(obj: Record<string, unknown>): Record<string, unknown> {
  return transformKeys(obj, camelToSnake);
}

/** Converts all keys of an API response object from snake_case to camelCase. */
export function fromApiResponse(obj: Record<string, unknown>): Record<string, unknown> {
  return transformKeys(obj, snakeToCamel);
}

function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function transformKeys(
  obj: unknown,
  transform: (key: string) => string
): Record<string, unknown> {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, transform)) as unknown as Record<string, unknown>;
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        transform(k),
        transformKeys(v, transform),
      ])
    );
  }
  return obj as Record<string, unknown>;
}

// ─── Pick / Omit Helpers ──────────────────────────────────────────────────────

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return Object.fromEntries(
    keys.filter((k) => k in obj).map((k) => [k, obj[k]])
  ) as Pick<T, K>;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const keySet = new Set(keys as string[]);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keySet.has(k))
  ) as Omit<T, K>;
}
