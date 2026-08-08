/**
 * Proposal domain types — drives the CRM "Proposals Generator" module.
 *
 * Mirrors the Figma "Proposals Generator - Home" frame (2222:7469).
 *
 * Reuses task department metadata for service badges so design stays
 * consistent between Tasks and Proposals.
 */

// Type-only import — erased at compile time, so the proposal ↔ proposal-draft
// cycle never exists at runtime.
import type { ProposalDraft as ProposalDraftRef } from "@/lib/types/proposal-draft";

/* ─── Core enums ────────────────────────────────────────────────────── */

export type ProposalMarket = "saudi" | "egypt" | "global";

export type ProposalLanguage = "english" | "arabic" | "both";

export type ProposalFormat = "docx" | "pptx" | "pdf";

/** Status is derived from `expiresAt` + presence of `sentAt`. */
export type ProposalStatus = "drafted" | "active" | "expired";

/** Service categories. */
export type ProposalService =
  | "programming"
  | "design"
  | "content-writing"
  | "artificial-intelligence"
  | "marketing"
  | "finance";

export const PROPOSAL_SERVICE_META: Record<
  ProposalService,
  {
    label: string;
    solidBg: string;
    solidFg: string;
    tintBg: string;
    tintFg: string;
  }
> = {
  programming: {
    label: "Programming",
    solidBg: "bg-[#0047ff]",
    solidFg: "text-white",
    tintBg: "bg-[#0047ff]/10",
    tintFg: "text-[#0047ff]",
  },
  design: {
    label: "Design",
    solidBg: "bg-[#00b927]",
    solidFg: "text-white",
    tintBg: "bg-[#00b927]/10",
    tintFg: "text-[#00b927]",
  },
  "content-writing": {
    label: "Content Writing",
    solidBg: "bg-[#f55050]",
    solidFg: "text-white",
    tintBg: "bg-[#f55050]/10",
    tintFg: "text-[#f55050]",
  },
  "artificial-intelligence": {
    label: "Artificial Intelligence",
    solidBg: "bg-[#9359ff]",
    solidFg: "text-white",
    tintBg: "bg-[#9359ff]/10",
    tintFg: "text-[#9359ff]",
  },
  marketing: {
    label: "Marketing",
    solidBg: "bg-[#f38328]",
    solidFg: "text-white",
    tintBg: "bg-[#f38328]/10",
    tintFg: "text-[#f38328]",
  },
  finance: {
    label: "Finance",
    solidBg: "bg-[#08a1bc]",
    solidFg: "text-white",
    tintBg: "bg-[#08a1bc]/10",
    tintFg: "text-[#08a1bc]",
  },
};

/* ─── Records ───────────────────────────────────────────────────────── */

export interface ProposalClient {
  id: string;
  name: string;
  avatar?: string;
}

export interface ProposalRecord {
  id: string;
  /** Human-readable code, e.g. "PRP-2040". */
  code: string;
  /** File-style headline shown in the table. */
  headline: string;
  services: ProposalService[];
  client: ProposalClient;
  market: ProposalMarket;
  language: ProposalLanguage;
  format: ProposalFormat;
  pages: number;
  /** ISO date (yyyy-mm-dd). */
  createdAt: string;
  /** ISO date (yyyy-mm-dd). */
  expiresAt: string;
  /** ISO date or null. Drives the `active` vs `drafted` distinction. */
  sentAt?: string | null;
}

/**
 * A persisted proposal — the table-facing {@link ProposalRecord} summary
 * plus the full editable {@link ProposalDraft} it was generated from.
 *
 * Storing the draft lets the viewer render the real cover/pages and lets
 * the wizard reopen the proposal for editing. Imported proposals have no
 * draft (they originate from an uploaded file), so `draft` is optional and
 * every consumer must tolerate its absence.
 */
export interface StoredProposal extends ProposalRecord {
  /** One-line subtitle shown on the cover preview. */
  subtitle?: string;
  /** Full editable draft, present for wizard-generated proposals. */
  draft?: ProposalDraftRef;
  /**
   * Which language this stored copy renders. A "both" draft produces two
   * stored proposals — one `"english"` (LTR) and one `"arabic"` (RTL).
   */
  variant?: "english" | "arabic";
}

/* ─── Market metadata ───────────────────────────────────────────────── */

export const PROPOSAL_MARKET_META: Record<
  ProposalMarket,
  {
    label: string;
    flag: string;
    /** Solid bg utility used on stat cards. */
    solidBg: string;
    /** Text against solid bg. */
    solidFg: string;
    /** Tinted bg utility used on badges / pills. */
    tintBg: string;
    /** Text against tinted bg. */
    tintFg: string;
    /** Solid dot utility. */
    dot: string;
  }
> = {
  saudi: {
    label: "Saudi Arabia",
    flag: "🇸🇦",
    solidBg: "bg-success",
    solidFg: "text-success-foreground",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    dot: "bg-success",
  },
  egypt: {
    label: "Egypt",
    flag: "🇪🇬",
    solidBg: "bg-destructive",
    solidFg: "text-destructive-foreground",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    dot: "bg-destructive",
  },
  global: {
    label: "Global",
    flag: "🌐",
    solidBg: "bg-primary",
    solidFg: "text-primary-foreground",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    dot: "bg-primary",
  },
};

/* ─── Language metadata ─────────────────────────────────────────────── */

export const PROPOSAL_LANGUAGE_META: Record<
  ProposalLanguage,
  { label: string; dot: string; fg: string }
> = {
  english: {
    label: "English",
    dot: "bg-success",
    fg: "text-success",
  },
  arabic: {
    label: "Arabic",
    dot: "bg-success",
    fg: "text-success",
  },
  both: {
    label: "Both",
    dot: "bg-primary",
    fg: "text-primary",
  },
};

/* ─── Format metadata ───────────────────────────────────────────────── */

export const PROPOSAL_FORMAT_META: Record<
  ProposalFormat,
  { label: string; iconBg: string; iconFg: string }
> = {
  docx: {
    label: "A4",
    iconBg: "bg-primary/10",
    iconFg: "text-primary",
  },
  pptx: {
    label: "Powerpoint",
    iconBg: "bg-warning/10",
    iconFg: "text-warning",
  },
  pdf: {
    label: "PDF",
    iconBg: "bg-destructive/10",
    iconFg: "text-destructive",
  },
};

/* ─── Helpers ───────────────────────────────────────────────────────── */

export function getProposalStatus(
  record: ProposalRecord,
  now: Date = new Date(),
): ProposalStatus {
  if (!record.sentAt) return "drafted";
  const expires = new Date(record.expiresAt);
  if (Number.isNaN(expires.getTime())) return "active";
  return expires.getTime() < now.getTime() ? "expired" : "active";
}

export const PROPOSAL_STATUS_META: Record<
  ProposalStatus,
  { label: string; tintBg: string; tintFg: string; dot: string }
> = {
  drafted: {
    label: "Drafted",
    tintBg: "bg-muted",
    tintFg: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  active: {
    label: "Active",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    dot: "bg-primary",
  },
  expired: {
    label: "Expired",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    dot: "bg-destructive",
  },
};
