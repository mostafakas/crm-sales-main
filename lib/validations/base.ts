import { z } from "zod";

// ─── Primitive Builders ───────────────────────────────────────────────────────

export const emailField = z.string().email("Invalid email address");

export const phoneField = z
  .string()
  .min(8, "Phone number is too short")
  .max(20, "Phone number is too long");

export const requiredString = (label: string) =>
  z.string().min(1, `${label} is required`);

export const optionalString = z.string().optional();

export const requiredDate = (label: string) =>
  z.date({ error: `${label} is required` });

export const optionalDate = z.date().optional();

// ─── Cross-Field Utilities ────────────────────────────────────────────────────

/** Confirms that two string fields match (e.g. password confirmation). */
export function matchingFields<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  fieldA: keyof T & string,
  fieldB: keyof T & string,
  message: string
) {
  return schema.refine((data: any) => data[fieldA] === data[fieldB], {
    message,
    path: [fieldB],
  });
}

/** Confirms that a "to" date is not before a "from" date. */
export function dateRangeValid<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  fromField: keyof T & string,
  toField: keyof T & string,
  message = "End date must be after start date"
) {
  return schema.refine(
    (data: any) => {
      const from = data[fromField] as Date | undefined;
      const to = data[toField] as Date | undefined;
      if (!from || !to) return true;
      return to >= from;
    },
    { message, path: [toField] }
  );
}

// ─── Async Validation Helpers ─────────────────────────────────────────────────

/** Wraps an async uniqueness check as a Zod refinement message factory. */
export function asyncUnique<T>(
  checkFn: (value: T) => Promise<boolean>,
  message: string
) {
  return async (value: T) => {
    const isUnique = await checkFn(value);
    return isUnique ? true : message;
  };
}
