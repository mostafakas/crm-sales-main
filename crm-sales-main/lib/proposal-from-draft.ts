/**
 * Convert a {@link ProposalDraft} (the wizard's editable model) into a
 * {@link StoredProposal} (the persisted, table-facing record + draft).
 *
 * This is the single bridge between "authoring" and "saved proposals", so
 * the page count, code generation, and field mapping all live here rather
 * than being duplicated across the review step and the slice.
 */

import { addDays, format } from "date-fns";
import type { ProposalDraft } from "@/lib/types/proposal-draft";
import type {
  ProposalClient,
  ProposalFormat,
  ProposalMarket,
  StoredProposal,
} from "@/lib/types/proposal";
import {
  primaryVariant,
  type ProposalLangVariant,
} from "@/lib/proposal-layout";

/**
 * Number of pages a draft renders to. Mirrors `computeProposalPages` in
 * proposal-document.tsx exactly — keep the two in sync. We re-implement the
 * count here (rather than importing the component) so this helper stays free
 * of React/DOM dependencies and can run anywhere, including the store.
 */
export function countProposalPages(draft: ProposalDraft): number {
  let n = 2; // cover + table of contents
  if (draft.about.enabled) n += 4; // about, values, experts, brands
  if (draft.serviceDetails.enabled) n += 1;
  if (draft.why.enabled) n += draft.why.similarProjects.length ? 2 : 1;
  if (draft.scope.enabled) n += 1;
  if (draft.quotation.enabled) n += 1;
  if (draft.support.enabled) n += 1;
  if (draft.whatWeNeed.enabled) n += 1;
  n += 1; // thank-you page
  return n;
}

/** Wizard dimensions → export/file format used for the record icon. */
function formatFromDraft(draft: ProposalDraft): ProposalFormat {
  return draft.dimensions === "powerpoint" ? "pptx" : "docx";
}

function marketFromDraft(draft: ProposalDraft): ProposalMarket {
  return draft.country ?? "global";
}

function clientFromDraft(draft: ProposalDraft): ProposalClient {
  const c = draft.client;
  if (!c) return { id: "client-unknown", name: "Untitled Client" };
  return { id: c.id, name: c.name, avatar: c.avatar };
}

/**
 * Pull the next free `PRP-####` code given the codes already in use, so two
 * proposals never collide. Starts at PRP-2040 to match the existing scheme.
 */
export function generateProposalCode(existingCodes: string[]): string {
  const used = new Set(existingCodes.map((c) => c.toUpperCase()));
  let n = 2040;
  while (used.has(`PRP-${n}`)) n += 1;
  return `PRP-${n}`;
}

export interface BuildProposalOptions {
  /** Whether the proposal counts as "sent" (active) vs. a saved draft. */
  sent: boolean;
  /** Codes already taken — used to mint a unique code for new proposals. */
  existingCodes: string[];
  /** Reuse an existing record's identity when re-saving/editing. */
  existing?: Pick<StoredProposal, "id" | "code" | "createdAt">;
  /**
   * Language variant for this stored copy. Defaults to the draft's primary
   * variant. A "both" draft is saved twice — once per variant.
   */
  variant?: ProposalLangVariant;
}

/**
 * Build (or rebuild) a {@link StoredProposal} from the current draft.
 *
 * When `existing` is supplied the proposal keeps its id/code/createdAt so an
 * edit updates the same row instead of spawning a duplicate; otherwise a
 * fresh id and code are minted.
 */
export function createStoredProposalFromDraft(
  draft: ProposalDraft,
  { sent, existingCodes, existing, variant }: BuildProposalOptions,
): StoredProposal {
  const lang = variant ?? primaryVariant(draft.language);
  const now = new Date();
  const createdAt = existing?.createdAt ?? format(now, "yyyy-MM-dd");
  const expiresAt = format(
    addDays(new Date(createdAt), draft.validityDays || 14),
    "yyyy-MM-dd",
  );

  return {
    id: existing?.id ?? `prp-${Date.now()}-${lang}`,
    code: existing?.code ?? generateProposalCode(existingCodes),
    headline: draft.headline.trim() || "Untitled Proposal",
    subtitle: draft.shortDescription.trim() || undefined,
    service: draft.service ?? "programming",
    client: clientFromDraft(draft),
    market: marketFromDraft(draft),
    language: lang,
    format: formatFromDraft(draft),
    pages: countProposalPages(draft),
    createdAt,
    expiresAt,
    sentAt: sent ? new Date().toISOString() : null,
    variant: lang,
    // Snapshot the draft so the viewer/editor can reconstruct full content.
    draft: JSON.parse(JSON.stringify(draft)) as ProposalDraft,
  };
}
