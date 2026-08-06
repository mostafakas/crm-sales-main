// ─── Case Converters ──────────────────────────────────────────────────────────

export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toLowerCase());
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .replace(/[-\s]+/g, "_")
    .toLowerCase()
    .replace(/^_/, "");
}

export function toKebabCase(str: string): string {
  return toSnakeCase(str).replace(/_/g, "-");
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

// ─── Truncation ───────────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number, suffix = "..."): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(fullName: string, max = 2): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ─── Guards ───────────────────────────────────────────────────────────────────

export function isBlank(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

export function isNotBlank(str: string | null | undefined): str is string {
  return !isBlank(str);
}
