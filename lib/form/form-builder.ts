import { z } from "zod";
import { FieldValues, DefaultValues } from "react-hook-form";

// ─── Default Value Builder ────────────────────────────────────────────────────

type SchemaDefaults<T extends z.ZodRawShape> = DefaultValues<z.infer<z.ZodObject<T>>>;

/**
 * Extracts safe default values from a Zod object schema.
 * Falls back to empty string / false / undefined per field type.
 */
export function getSchemaDefaults<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): SchemaDefaults<T> {
  const shape = schema.shape;
  const defaults: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(shape)) {
    defaults[key] = getFieldDefault(field as z.ZodTypeAny);
  }

  return defaults as SchemaDefaults<T>;
}

function getFieldDefault(field: z.ZodTypeAny): unknown {
  if (field instanceof z.ZodOptional) return undefined;
  if (field instanceof z.ZodNullable) return null;

  // Handles ZodDefault: safeParse(undefined) returns the configured default value
  const result = field.safeParse(undefined);
  if (result.success) return result.data;

  if (field instanceof z.ZodString) return "";
  if (field instanceof z.ZodNumber) return 0;
  if (field instanceof z.ZodBoolean) return false;
  if (field instanceof z.ZodArray) return [];
  if (field instanceof z.ZodObject) return getSchemaDefaults(field);

  return undefined;
}

// ─── Value Transformer ────────────────────────────────────────────────────────

/**
 * Strips undefined keys from form values before sending to the API.
 * Keeps null values so explicit clearing is preserved.
 */
export function stripUndefined<T extends FieldValues>(values: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

/**
 * Trims all string values in a form payload.
 */
export function trimStringValues<T extends FieldValues>(values: T): T {
  return Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
  ) as T;
}

// ─── Dirty Field Detector ─────────────────────────────────────────────────────

/**
 * Returns only the fields that differ between two form value snapshots.
 */
export function getDirtyValues<T extends FieldValues>(
  current: T,
  original: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(current).filter(([k, v]) => v !== original[k])
  ) as Partial<T>;
}

// ─── Error Mapping ────────────────────────────────────────────────────────────

/**
 * Maps a record of errors (e.g. from API) to react-hook-form errors.
 */
export function setFormErrors<T extends FieldValues>(
  form: { setError: (name: any, error: any) => void },
  errors: Record<string, string | string[]>
): void {
  Object.entries(errors).forEach(([field, message]) => {
    form.setError(field as any, {
      type: "manual",
      message: Array.isArray(message) ? message[0] : message,
    });
  });
}

// ─── Retry Logic ──────────────────────────────────────────────────────────────

/**
 * Simple exponential backoff retry helper.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// ─── Metadata Extraction ──────────────────────────────────────────────────────

/**
 * Checks if a field in a Zod schema is required.
 */
export function isFieldRequired(field: z.ZodTypeAny): boolean {
  if (field instanceof z.ZodOptional || field instanceof z.ZodNullable) return false;
  if (field instanceof z.ZodDefault) return false;
  
  return true;
}

/**
 * Extracts metadata for all fields in a schema.
 */
export function getSchemaMetadata<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) {
  const shape = schema.shape;
  const metadata: Record<string, { required: boolean }> = {};

  for (const [key, field] of Object.entries(shape)) {
    metadata[key] = {
      required: isFieldRequired(field as z.ZodTypeAny),
    };
  }

  return metadata;
}
