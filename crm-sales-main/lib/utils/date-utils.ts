import { format, isValid, differenceInDays, addDays, startOfDay, endOfDay, isBefore, isAfter, parseISO } from "date-fns";

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatDate(
  date: Date | string | number | undefined,
  formatStr = "PPP"
): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  if (!isValid(d)) return "";
  return format(d, formatStr);
}

export function formatShortDate(date: Date | string | undefined): string {
  return formatDate(date, "dd MMM yyyy");
}

export function formatDateTime(date: Date | string | undefined): string {
  return formatDate(date, "dd MMM yyyy, hh:mm a");
}

// ─── Relative ─────────────────────────────────────────────────────────────────

export function relativeDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  const days = differenceInDays(new Date(), d);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ─── Range Utilities ──────────────────────────────────────────────────────────

export interface DateRange {
  from: Date;
  to: Date;
}

export function buildDateRange(from: Date, to: Date): DateRange {
  return { from: startOfDay(from), to: endOfDay(to) };
}

export function daysInRange(range: DateRange): number {
  return differenceInDays(range.to, range.from) + 1;
}

export function shiftRange(range: DateRange, days: number): DateRange {
  return {
    from: addDays(range.from, days),
    to: addDays(range.to, days),
  };
}

// ─── Guards ───────────────────────────────────────────────────────────────────

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && isValid(date);
}

export function isDateBefore(date: Date, reference: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(reference));
}

export function isDateAfter(date: Date, reference: Date): boolean {
  return isAfter(startOfDay(date), startOfDay(reference));
}
