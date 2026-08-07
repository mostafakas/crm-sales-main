import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string | number | undefined, formatStr: string = "PPP") {
  if (!date) return ""
  const d = new Date(date)
  if (!isValid(d)) return ""
  return format(d, formatStr)
}

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number, currency: string = "USD", locale: string = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Creates a slug from a string
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Safely access nested object properties
 */
export function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((acc: any, part: string) => acc && acc[part], obj)
}

/**
 * Removes undefined values from an object recursively,
 * returning a new clean object suitable for Firestore.
 */
export function cleanUndefined<T>(obj: T): T {
  if (obj === undefined) return null as any;
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as any;
  }
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val !== undefined) {
        result[key] = cleanUndefined(val);
      }
    }
  }
  return result as T;
}
