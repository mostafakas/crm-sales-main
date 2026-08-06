"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useProposalDraft } from "./proposal-draft-context";
import { useProposalSheets } from "@/components/client-relations-management/proposal-document/proposal-paginator";
import { ScaledPage } from "@/components/client-relations-management/proposal-document/scaled-page";
import {
  pageAspectFor,
  primaryVariant,
  type ProposalLangVariant,
} from "@/lib/proposal-layout";
import { LanguageToggle } from "./language-toggle";

interface LivePreviewPanelProps {
  /** 1-based page index. */
  pageIndex?: number;
  onPageChange?: (index: number) => void;
  className?: string;
}

/**
 * Live Preview — Figma 2222:13637.
 *
 *   Outer wrapper:
 *     flex flex-col gap-[12px] items-start w-full (transparent)
 *   Header:
 *     "Live Preview" Janna Bold 20px / leading-22.4 / #343434
 *   Card:
 *     bg-[#edf2f7] flex flex-col gap-[8px] items-center p-[20px]
 *     rounded-[16px] w-full
 *   Big cover:
 *     aspect-[567/319] (≈16:9) rounded-[12px] w-full — clamps the
 *     actual A4 page (1240×1754) scaled to fit
 *   Thumbnails row (horizontal scroll):
 *     flex gap-[6px] items-start py-[8px] overflow-x-auto w-full
 *   Each thumb cell:
 *     flex flex-col gap-[2px] items-center p-[6px] rounded-[4px]
 *     bg = #f8fafc (inactive) | #0047ff (active)
 *     Page #: Janna Bold 10px / leading-18.75 / right / w-[6px]
 *       text-[#707070] inactive | text-white active
 *     Cover inside: 130×73, object-cover
 */
export function LivePreviewPanel({
  pageIndex = 1,
  onPageChange,
  className,
}: LivePreviewPanelProps) {
  const { draft } = useProposalDraft();
  const bilingual = draft.language === "both";
  const [variant, setVariant] = React.useState<ProposalLangVariant>(
    primaryVariant(draft.language),
  );
  /* Keep the previewed variant valid if the language selection changes. */
  React.useEffect(() => {
    if (!bilingual) setVariant(primaryVariant(draft.language));
  }, [bilingual, draft.language]);

  const { sheets, measurer } = useProposalSheets(draft, variant);
  const aspect = pageAspectFor(draft.dimensions);

  const safeIdx = Math.min(Math.max(0, pageIndex - 1), Math.max(0, sheets.length - 1));
  const current = sheets[safeIdx];

  return (
    <div
      className={cn(
        "flex flex-col gap-[12px] items-start w-full",
        className,
      )}>
      {/* Header */}
      <div className="flex gap-[8px] items-center w-full">
        <p className="flex-1 font-bold text-[20px] leading-[22.4px] text-[#343434]">
          Live Preview
        </p>
        {bilingual ? (
          <LanguageToggle value={variant} onChange={setVariant} />
        ) : null}
      </div>

      {/* Card */}
      <div className="bg-[#edf2f7] flex flex-col gap-[8px] items-center overflow-clip p-[20px] rounded-[16px] w-full">
        {/* Big cover — matches the chosen page aspect (A4 / 16:9), whole
         * page letterboxed so nothing clips. */}
        <div
          className="w-full rounded-[12px] overflow-hidden bg-white shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
          style={{ aspectRatio: aspect }}>
          {current ? (
            <ScaledPage fit="box" className="w-full h-full">
              {current.node}
            </ScaledPage>
          ) : null}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-[6px] items-start overflow-x-auto py-[8px] w-full no-scrollbar">
          {sheets.map((p, i) => {
            const isActive = i === safeIdx;
            /* Use a div + role="button" rather than a real <button>
             * because the rendered proposal page inside may contain its
             * own interactive elements (and <button> can't nest). */
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => onPageChange?.(i + 1)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPageChange?.(i + 1);
                  }
                }}
                aria-label={`Page ${i + 1}`}
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col gap-[2px] items-center p-[6px] rounded-[4px] shrink-0 outline-none transition-colors cursor-pointer",
                  isActive ? "bg-[#0047ff]" : "bg-[#f8fafc] hover:bg-[#e8eef5]",
                )}>
                <div className="h-[73px] w-[130px] rounded-[2px] overflow-hidden bg-white">
                  <ScaledPage fit="box" className="w-full h-full">
                    {p.node}
                  </ScaledPage>
                </div>
                <span
                  className={cn(
                    "font-bold text-[10px] leading-[18.75px] tracking-[-0.14px] text-right w-[10px]",
                    isActive ? "text-white" : "text-[#707070]",
                  )}>
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Hidden measurer keeps pagination in sync. */}
      {measurer}
    </div>
  );
}

