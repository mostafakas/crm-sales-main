/**
 * Single source of truth for proposal page geometry and reading direction.
 *
 * Page dimensions and text direction were previously hardcoded (1240×1754,
 * always LTR) across the live preview, fullscreen viewer, review step, modal,
 * and export pipeline. They now derive from the draft's `dimensions` and
 * `language` so the configuration step's choices actually take effect.
 */

import type { ProposalDimensions } from "@/lib/types/proposal-draft";
import type { ProposalLanguage } from "@/lib/types/proposal";

/** Every page is authored at this fixed width; height varies by format. */
export const PAGE_WIDTH = 1240;

/** A4 portrait height at 1240px width (1240 × √2). */
const A4_HEIGHT = 1754;
/** 16:9 landscape height at 1240px width. */
const WIDE_HEIGHT = Math.round((PAGE_WIDTH * 9) / 16); // 698

export function pageHeightFor(dimensions?: ProposalDimensions): number {
  return dimensions === "powerpoint" ? WIDE_HEIGHT : A4_HEIGHT;
}

/** CSS `aspect-ratio` value, e.g. "1240 / 1754". */
export function pageAspectFor(dimensions?: ProposalDimensions): string {
  return `${PAGE_WIDTH} / ${pageHeightFor(dimensions)}`;
}

export function isLandscape(dimensions?: ProposalDimensions): boolean {
  return dimensions === "powerpoint";
}

/* ─── Language / direction ─────────────────────────────────────────── */

/** A single rendered language of a proposal. */
export type ProposalLangVariant = "english" | "arabic";

export function directionFor(variant: ProposalLangVariant): "rtl" | "ltr" {
  return variant === "arabic" ? "rtl" : "ltr";
}

/** The variant shown by default in single-document previews. */
export function primaryVariant(language?: ProposalLanguage): ProposalLangVariant {
  return language === "arabic" ? "arabic" : "english";
}

/**
 * The set of proposals produced for a given language choice:
 *  - english → 1 English (LTR) proposal
 *  - arabic  → 1 Arabic (RTL) proposal
 *  - both    → 2 proposals, English (LTR) and Arabic (RTL)
 */
export function variantsFor(language?: ProposalLanguage): ProposalLangVariant[] {
  if (language === "both") return ["english", "arabic"];
  if (language === "arabic") return ["arabic"];
  return ["english"];
}
