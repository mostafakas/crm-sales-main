"use client";

import * as React from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import type { ProposalDraft } from "@/lib/types/proposal-draft";
import { useProposalSheets } from "@/components/client-relations-management/proposal-document/proposal-paginator";
import { ScaledPage } from "@/components/client-relations-management/proposal-document/scaled-page";
import type { ProposalLangVariant } from "@/lib/proposal-layout";

interface ProposalDocumentFullscreenProps {
  draft: ProposalDraft;
  onClose: () => void;
  variant?: ProposalLangVariant;
}

/**
 * Fullscreen overlay that renders every page of the proposal at once.
 * Press Esc or click the close button to exit.
 */
export function ProposalDocumentFullscreen({
  draft,
  onClose,
  variant,
}: ProposalDocumentFullscreenProps) {
  const { sheets, measurer } = useProposalSheets(draft, variant);
  const [zoom, setZoom] = React.useState(0.6);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex flex-col">
      {/* Toolbar */}
      <div className="h-14 shrink-0 px-4 flex items-center justify-between bg-foreground text-white">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold leading-none">
            Proposal preview · {sheets.length} pages
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.2, +(z - 0.1).toFixed(2)))}
            aria-label="Zoom out"
            className="size-8 rounded-[8px] bg-white/10 hover:bg-white/20 flex items-center justify-center outline-none">
            <ZoomOut className="size-3.5" strokeWidth={2.4} />
          </button>
          <span className="text-xs font-bold tabular-nums bg-white/10 px-2.5 h-8 rounded-[8px] flex items-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.1).toFixed(2)))}
            aria-label="Zoom in"
            className="size-8 rounded-[8px] bg-white/10 hover:bg-white/20 flex items-center justify-center outline-none">
            <ZoomIn className="size-3.5" strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close fullscreen"
            className="size-8 rounded-[8px] bg-white/10 hover:bg-white/20 flex items-center justify-center outline-none ml-2">
            <X className="size-3.5" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Scrollable canvas — every page rendered top to bottom */}
      <div className="flex-1 overflow-auto py-6">
        <div className="flex flex-col items-center gap-6">
          {sheets.map((p) => (
            <ScaledPage
              key={p.id}
              zoom={zoom}
              className="shrink-0 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.25)]">
              {p.node}
            </ScaledPage>
          ))}
        </div>
        {measurer}
      </div>
    </div>
  );
}
