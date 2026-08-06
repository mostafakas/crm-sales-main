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
export function getNestedValue(obj: Record<string, unknown>, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj)
}
