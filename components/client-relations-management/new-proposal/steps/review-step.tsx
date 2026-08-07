"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Save,
  Loader2,
  ChevronDown,
  FileText,
  FileType,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProposalDraft } from "../proposal-draft-context";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectProposals,
  upsertProposal,
} from "@/lib/store/slices/proposals-slice";
import { saveFirebaseProposal } from "@/lib/firebase/proposals";
import { createStoredProposalFromDraft } from "@/lib/proposal-from-draft";
import {
  variantsFor,
  primaryVariant,
  type ProposalLangVariant,
} from "@/lib/proposal-layout";
import { LanguageToggle } from "../language-toggle";
import { WizardStepHeader } from "../wizard-step-header";
import { ProposalDocument } from "@/components/client-relations-management/proposal-document/proposal-document";
import { useProposalSheets } from "@/components/client-relations-management/proposal-document/proposal-paginator";
import {
  exportProposalAsPdf,
  exportProposalAsDocx,
} from "@/lib/proposal-export";
import { ProposalDocumentFullscreen } from "./proposal-fullscreen";
import { toast } from "sonner";

export function ReviewStep() {
  const router = useRouter();
  const { draft, resetDraft } = useProposalDraft();
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectProposals);

  /* Persist the draft as saved proposal(s). A "both" draft produces two
   * records (English + Arabic). Reuses each variant's existing identity when
   * the draft was saved before, so re-saving/exporting updates the same rows
   * instead of creating duplicates. */
  const saveProposal = React.useCallback(
    async (sent: boolean) => {
      const usedCodes = records.map((p) => p.code);
      for (const variant of variantsFor(draft.language)) {
        const existing = records.find(
          (p) => p.draft?.id === draft.id && p.variant === variant,
        );
        const stored = createStoredProposalFromDraft(draft, {
          sent: sent || Boolean(existing?.sentAt),
          existingCodes: usedCodes,
          existing,
          variant,
        });
        if (!existing) usedCodes.push(stored.code);
        try {
          await saveFirebaseProposal(stored);
          dispatch(upsertProposal(stored));
        } catch (error) {
          console.error("Failed to save proposal to Firebase:", error);
          toast.error("Failed to save proposal.");
          throw error;
        }
      }
    },
    [dispatch, draft, records],
  );

  /* The on-screen, paginated preview lives in `previewRef`. The hidden
   * "full document" lives in `exportRef` and is used as the source for
   * PDF/DOCX export so we never re-flow the live preview during export. */
  const exportRef = React.useRef<HTMLDivElement>(null);

  const [page, setPage] = React.useState(1);
  const [zoom, setZoom] = React.useState(0.45);
  const [exporting, setExporting] = React.useState<"pdf" | "docx" | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);

  const bilingual = draft.language === "both";
  const [previewVariant, setPreviewVariant] =
    React.useState<ProposalLangVariant>(primaryVariant(draft.language));
  const { sheets, measurer } = useProposalSheets(draft, previewVariant);
  const totalPages = Math.max(1, sheets.length);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSaveDraft = async () => {
    try {
      await saveProposal(false);
      resetDraft();
      toast.success("Draft saved successfully.");
      router.push("/client-relations-management/proposals");
    } catch (err) {
      // toast is already shown inside saveProposal
    }
  };

  const handleExport = async (format: "pdf" | "docx") => {
    setExporting(format);
    setExportMenuOpen(false);
    try {
      const baseName = (draft.headline || "Proposal").replace(/[^\w-]+/g, "_");
      if (format === "pdf") {
        if (!exportRef.current) throw new Error("Document not ready.");
        await exportProposalAsPdf(
          exportRef.current,
          `${baseName}.pdf`,
          draft.dimensions,
        );
      } else {
        /* DOCX is built directly from the draft — no DOM capture. */
        await exportProposalAsDocx(draft, `${baseName}.docx`);
      }
      /* A successfully exported proposal counts as "sent" (active). */
      await saveProposal(true);
      resetDraft();
      toast.success(`Proposal exported as ${format.toUpperCase()}.`);
      router.push("/client-relations-management/proposals");
    } catch (err) {
      console.error("Export failed:", err);
      // Only show alert if it's an export error (save errors show their own toast)
      if (err instanceof Error && err.message === "Document not ready.") {
        alert(`Failed to export proposal as ${format.toUpperCase()}.`);
      }
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full w-full overflow-x-hidden">
      <WizardStepHeader
        icon={Upload}
        title="Step 03: Review & export"
        subtitle="Validation and delivery"
      />

      {/* Form card (1st shade of BG) */}
      <div className="bg-[#f8fafc] rounded-[20px] p-6 flex flex-col gap-6 w-full">
        {/* Review block: label + preview container */}
        <div className="flex flex-col gap-1.5 w-full">
          <p className="text-[14px] font-bold leading-[22.4px] text-[#343434]">
            Review
          </p>

          {/* Cover + toolbar share one container, split by a divider. */}
          <div className="bg-[#edf2f7] rounded-[16px] p-5 flex flex-col gap-5 items-center w-full overflow-hidden">
            <div className="w-full flex items-start justify-center rounded-[12px] overflow-hidden ">
              <SinglePagePreview
                node={sheets[Math.min(page, totalPages) - 1]?.node}
                zoom={zoom}
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="h-px w-full bg-[#e5e9f0]" />
              <div className="flex items-center justify-between gap-3 px-5 py-2 w-full">
                {/* Page navigator */}
                <div className="flex items-center gap-1">
                  <NavBtn
                    ariaLabel="Previous page"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}>
                    <ChevronLeft className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                  <span className="text-[12px] font-bold text-[#343434] tracking-[-0.14px] tabular-nums select-none whitespace-nowrap">
                    Page {page} / {totalPages}
                  </span>
                  <NavBtn
                    ariaLabel="Next page"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}>
                    <ChevronRight className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                </div>

                {/* View controls */}
                <div className="flex items-center gap-[7px]">
                  {bilingual ? (
                    <LanguageToggle
                      value={previewVariant}
                      onChange={setPreviewVariant}
                    />
                  ) : null}
                  <div className="flex items-center gap-2.5">
                    <NavBtn
                      ariaLabel="Zoom out"
                      onClick={() =>
                        setZoom((z) => Math.max(0.2, +(z - 0.05).toFixed(2)))
                      }>
                      <ZoomOut className="size-3.5" strokeWidth={2.4} />
                    </NavBtn>
                    <span className="text-[12px] font-bold text-[#343434] tracking-[-0.14px] tabular-nums select-none">
                      {Math.round(zoom * 100)}%
                    </span>
                    <NavBtn
                      ariaLabel="Zoom in"
                      onClick={() =>
                        setZoom((z) => Math.min(1, +(z + 0.05).toFixed(2)))
                      }>
                      <ZoomIn className="size-3.5" strokeWidth={2.4} />
                    </NavBtn>
                  </div>
                  <div className="w-px h-[17.5px] bg-[#e5e9f0]" />
                  <NavBtn
                    ariaLabel="Fullscreen"
                    onClick={() => setFullscreenOpen(true)}>
                    <Maximize2 className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 w-full">
          <button
            type="button"
            onClick={() =>
              router.push("/client-relations-management/proposals/new/builder")
            }
            className="h-10 px-5 rounded-[12px] bg-[#edf2f7] text-[#707070] text-[12px] font-bold flex items-center gap-2 hover:bg-[#e2e8f0] transition-colors outline-none">
            <ArrowLeft className="size-4" strokeWidth={2.4} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-10 px-5 rounded-[8px] bg-[#707070] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#5e5e5e] transition-colors outline-none">
              <Save className="size-3" strokeWidth={2.4} />
              Save as Draft
            </button>

            {/* Export split-button */}
            <ExportButton
              exporting={exporting}
              menuOpen={exportMenuOpen}
              onMenuOpenChange={setExportMenuOpen}
              onExport={handleExport}
            />
          </div>
        </div>
        {/* Hidden measurer keeps the page count / packing in sync. */}
        {measurer}
      </div>

      {/* Hidden full document used as the export source. Rendering it in
       * the live DOM avoids re-creating it during export, which would be
       * slow and would race with React state. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -99999,
          top: 0,
          pointerEvents: "none",
          opacity: 0,
        }}>
        <ProposalDocument
          ref={exportRef}
          draft={draft}
          variant={previewVariant}
        />
      </div>

      {fullscreenOpen ? (
        <ProposalDocumentFullscreen
          draft={draft}
          variant={previewVariant}
          onClose={() => setFullscreenOpen(false)}
        />
      ) : null}
    </div>
  );
}

/* ─── Page-at-a-time preview ───────────────────────────────────────── */

import { ScaledPage } from "@/components/client-relations-management/proposal-document/scaled-page";

function SinglePagePreview({
  node,
  zoom,
}: {
  node?: React.ReactNode;
  zoom: number;
}) {
  if (!node) {
    return (
      <div className="text-xs font-bold text-muted-foreground py-12">
        No pages to render.
      </div>
    );
  }

  /* Each sheet is a fixed-size page; `zoom` scales the whole sheet. */
  return (
    <ScaledPage
      zoom={zoom}
      className="shrink-0 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] rounded-xl">
      {node}
    </ScaledPage>
  );
}

/* ─── Toolbar primitive ────────────────────────────────────────────── */

function NavBtn({
  ariaLabel,
  children,
  disabled,
  onClick,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="size-7 rounded-[5px] text-[#343434] flex items-center justify-center hover:bg-black/[0.06] transition-colors outline-none disabled:opacity-40 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

/* ─── Export split-button ──────────────────────────────────────────── */

function ExportButton({
  exporting,
  menuOpen,
  onMenuOpenChange,
  onExport,
}: {
  exporting: "pdf" | "docx" | null;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onExport: (format: "pdf" | "docx") => void;
}) {
  /* Close on outside click */
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onMenuOpenChange(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen, onMenuOpenChange]);

  const isExporting = exporting !== null;

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onExport("pdf")}
          disabled={isExporting}
          className={cn(
            "h-10 pl-5 pr-4 rounded-l-[10px] bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 transition-all outline-none shadow-sm shadow-primary/20",
            isExporting ? "opacity-70 cursor-wait" : "hover:bg-primary/90",
          )}>
          {exporting === "pdf" ? (
            <Loader2 className="size-3.5 animate-spin" strokeWidth={2.4} />
          ) : (
            <Download className="size-3.5" strokeWidth={2.4} />
          )}
          {exporting === "pdf"
            ? "Generating PDF..."
            : exporting === "docx"
              ? "Generating DOCX..."
              : "Export as PDF"}
        </button>
        <button
          type="button"
          onClick={() => onMenuOpenChange(!menuOpen)}
          disabled={isExporting}
          aria-label="Choose export format"
          className={cn(
            "h-10 px-2.5 rounded-r-[10px] bg-primary text-primary-foreground border-l border-white/20 flex items-center justify-center transition-all outline-none shadow-sm shadow-primary/20",
            isExporting ? "opacity-70 cursor-wait" : "hover:bg-primary/90",
          )}>
          <ChevronDown className="size-3.5" strokeWidth={2.4} />
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute right-0 bottom-[130%] mt-2 w-[200px] bg-background border border-border rounded-[10px] shadow-xl p-1 z-30">
          <button
            type="button"
            onClick={() => onExport("pdf")}
            className="w-full text-left px-3 py-2 rounded-[8px] text-xs font-bold text-foreground hover:bg-muted flex items-center gap-2 outline-none">
            <FileText className="size-3.5 text-destructive" strokeWidth={2.4} />
            <div className="flex flex-col gap-0.5">
              <span>Export as PDF</span>
              <span className="text-[10px] font-bold text-muted-foreground">
                Best for print & sharing
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onExport("docx")}
            className="w-full text-left px-3 py-2 rounded-[8px] text-xs font-bold text-foreground hover:bg-muted flex items-center gap-2 outline-none">
            <FileType className="size-3.5 text-primary" strokeWidth={2.4} />
            <div className="flex flex-col gap-0.5">
              <span>Export as DOCX</span>
              <span className="text-[10px] font-bold text-muted-foreground">
                Editable in Microsoft Word
              </span>
            </div>
          </button>
        </div>
      ) : null}
    </div>
  );
}
