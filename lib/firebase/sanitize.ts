/**
 * Firestore rejects any field whose value is `undefined` (it throws
 * "Unsupported field value: undefined" and the write never happens). Plain
 * object literals in this codebase build up records with optional fields
 * like `field: someValue || undefined`, which is a completely normal JS/TS
 * pattern but a guaranteed Firestore write failure the moment that field is
 * actually empty.
 *
 * Call this on any object right before `setDoc`/`addDoc`/`updateDoc` so a
 * missing optional field just becomes an absent key (Firestore-safe)
 * instead of an explicit `undefined` value (Firestore-fatal). Works
 * recursively so nested objects (e.g. `client: { avatar: undefined }`) are
 * covered too.
 */
export function sanitizeForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }

  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val === undefined) continue;
      result[key] = sanitizeForFirestore(val);
    }
    return result as T;
  }

  return value;
}
