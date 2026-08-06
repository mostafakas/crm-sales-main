"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProposalDraft } from "@/lib/types/proposal-draft";
import { PAGE_WIDTH, type ProposalLangVariant } from "@/lib/proposal-layout";
import { useProposalSheets } from "./proposal-paginator";

export interface ProposalDocumentProps {
  draft: ProposalDraft;
  className?: string;
  /** Which language variant to render. Defaults to the draft's primary. */
  variant?: ProposalLangVariant;
}

/**
 * The rendered proposal — a stack of fixed-size sheets. Used as the source
 * for PDF export (each `.proposal-page` is captured to an image). The live
 * preview / review / fullscreen viewers render the same sheets via
 * {@link useProposalSheets} so every surface stays in sync.
 */
export const ProposalDocument = React.forwardRef<HTMLDivElement, ProposalDocumentProps>(
  function ProposalDocument({ draft, className, variant }, ref) {
    const { sheets, measurer } = useProposalSheets(draft, variant);

    return (
      <div ref={ref} className={cn("flex flex-col gap-6", className)}>
        {sheets.map((s, i) => (
          <div
            key={s.id}
            data-proposal-page={i + 1}
            className="proposal-page relative bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] mx-auto"
            style={{ width: PAGE_WIDTH }}>
            {s.node}
          </div>
        ))}
        {measurer}
      </div>
    );
  },
);
