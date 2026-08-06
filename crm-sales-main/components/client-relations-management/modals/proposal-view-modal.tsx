"use client";

import * as React from "react";
import {
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Archive,
  Pencil,
  Download,
} from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_FORMAT_META,
  PROPOSAL_LANGUAGE_META,
  type StoredProposal,
} from "@/lib/types/proposal";
import { ProposalCoverPreview } from "@/components/client-relations-management/proposals/proposal-cover-preview";
import { ProposalServiceBadge } from "@/components/client-relations-management/proposals/proposal-service-badge";
import { ProposalCountryBadge } from "@/components/client-relations-management/proposals/proposal-country-badge";
import { useProposalSheets } from "@/components/client-relations-management/proposal-document/proposal-paginator";
import { ScaledPage } from "@/components/client-relations-management/proposal-document/scaled-page";
import { ProposalDocumentFullscreen } from "@/components/client-relations-management/new-proposal/steps/proposal-fullscreen";
import { pageAspectFor } from "@/lib/proposal-layout";

export interface ProposalViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: StoredProposal | null;
  onEdit?: (proposal: StoredProposal) => void;
  onExport?: (proposal: StoredProposal) => void;
  onArchive?: (proposal: StoredProposal) => void;
}

/**
 * Proposal viewer — right-anchored sheet (Figma 2222:9717).
 *
 *   Sheet sits flush against the right edge with rounded-l corners,
 *   taking the full viewport height. No centered backdrop — the page
 *   stays visible underneath at slight opacity so the sheet feels like
 *   a slide-over drawer.
 *
 *   Body layout:
 *     - left column ~272px: metadata rows
 *     - right column flex-1: header row + cover preview + zoom toolbar
 *       + thumbnail strip
 *     - bottom-left footer: archive + edit + export
 */
export function ProposalViewModal({
  open,
  onOpenChange,
  proposal,
  onEdit,
  onExport,
  onArchive,
}: ProposalViewModalProps) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setPageIndex(0);
      setFullscreen(false);
    }
  }, [open, proposal?.id]);

  /* Render the real pages when we have the originating draft; otherwise fall
   * back to the stored page count (e.g. imported proposals). */
  const { sheets, measurer } = useProposalSheets(proposal?.draft, proposal?.variant);
  const hasPages = sheets.length > 0;

  if (!proposal) return null;

  const formatMeta = PROPOSAL_FORMAT_META[proposal.format];
  const langMeta = PROPOSAL_LANGUAGE_META[proposal.language];
  const totalPages = hasPages ? sheets.length : proposal.pages;
  const safeIndex = Math.min(pageIndex, totalPages - 1);
  const coverDate = formatHumanDate(proposal.createdAt);
  const coverValidTill = formatHumanDate(proposal.expiresAt);
  const previewAspect = pageAspectFor(proposal.draft?.dimensions);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Dark, blurred backdrop — dims the page to a dark tone and
         * blurs the underlying surface so focus stays on the sheet. */}
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm",
            "duration-300 ease-out data-open:animate-in data-open:fade-in-0",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:duration-200",
          )}
        />

        <DialogPrimitive.Popup
          className={cn(
            "fixed right-2.5 top-2.5 bottom-2.5 z-50 w-[min(960px,95vw)]",
            "bg-background rounded-[16px] shadow-[-12px_0_40px_rgba(15,23,42,0.12)]",
            "flex flex-col overflow-hidden outline-none",
            "duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "data-open:animate-in data-open:slide-in-from-right-12",
            "data-closed:animate-out data-closed:slide-out-to-right-12 data-closed:duration-200",
          )}>
          {/* Header bar */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-border shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "size-10 rounded-[8px] flex items-center justify-center shrink-0",
                  formatMeta.iconBg,
                )}>
                <FileText
                  className={cn("size-4", formatMeta.iconFg)}
                  strokeWidth={2.2}
                />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="text-[12px] font-bold leading-none text-[#707070] flex items-center gap-1.5">
                  <span>{proposal.code}</span>
                  <span aria-hidden>•</span>
                  <span>{proposal.pages} pages</span>
                  <span aria-hidden>•</span>
                  <span>{formatMeta.label}</span>
                </div>
                <span className="text-[16px] font-bold leading-[20px] text-[#343434] truncate">
                  {proposal.headline}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="bg-muted size-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors outline-none shrink-0">
              <X className="size-4 text-foreground" strokeWidth={2.4} />
            </button>
          </div>

          {/* Body — two columns */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[272px_1fr] min-h-0 overflow-hidden">
            {/* Metadata column */}
            <div className="px-5 py-5 flex flex-col gap-4 overflow-y-auto">
              <MetaRow label="ID:" value={proposal.code} />
              <MetaRow
                label="Service:"
                value={<ProposalServiceBadge service={proposal.service} />}
              />
              <MetaRow
                label="Client:"
                value={
                  <div className="flex items-center gap-1.5">
                    <Avatar className="size-5">
                      <AvatarImage src={proposal.client.avatar} />
                      <AvatarFallback>
                        {proposal.client.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[14px] font-bold leading-none text-[#343434]">
                      {proposal.client.name}
                    </span>
                  </div>
                }
              />
              <MetaRow
                label="Country:"
                value={<ProposalCountryBadge market={proposal.market} />}
              />
              <MetaRow
                label="Created:"
                value={formatDate(proposal.createdAt)}
              />
              <MetaRow
                label="Expires:"
                value={
                  <span
                    className={cn(
                      new Date(proposal.expiresAt) < new Date() &&
                        "text-destructive",
                    )}>
                    {formatDate(proposal.expiresAt)}
                  </span>
                }
              />
              <MetaRow
                label="Language:"
                value={
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[14px] font-bold leading-none",
                      langMeta.fg,
                    )}>
                    <span
                      className={cn("size-[6px] rounded-full", langMeta.dot)}
                    />
                    {langMeta.label}
                  </span>
                }
              />
              <MetaRow
                label="Number of pages"
                value={`${proposal.pages} pages`}
              />
              <MetaRow label="Dimensions" value={formatMeta.label} />
            </div>

            {/* Preview column */}
            <div className="px-5 py-5 flex flex-col gap-3 overflow-y-auto border-l border-border">
              <div className="w-full shrink-0 rounded-[12px] overflow-hidden bg-muted shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                {hasPages ? (
                  <ScaledPage fit="width" className="w-full">
                    {sheets[safeIndex]?.node}
                  </ScaledPage>
                ) : (
                  <ProposalCoverPreview
                    headline={proposal.headline}
                    subtitle={proposal.subtitle}
                    client={proposal.client.name}
                    date={coverDate}
                    validTill={coverValidTill}
                    className="w-full"
                  />
                )}
              </div>

              {/* Page navigator */}
              <div className="shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NavBtn
                    ariaLabel="Previous page"
                    disabled={pageIndex <= 0}
                    onClick={() =>
                      setPageIndex((i) => Math.max(0, i - 1))
                    }>
                    <ChevronLeft className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                  <span className="text-[14px] font-bold leading-none text-[#343434] tabular-nums select-none">
                    Page {safeIndex + 1} / {totalPages}
                  </span>
                  <NavBtn
                    ariaLabel="Next page"
                    disabled={pageIndex >= totalPages - 1}
                    onClick={() =>
                      setPageIndex((i) => Math.min(totalPages - 1, i + 1))
                    }>
                    <ChevronRight className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                </div>

                <div className="flex items-center gap-1.5">
                  <NavBtn ariaLabel="Zoom out">
                    <ZoomOut className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                  <span className="text-[14px] font-bold leading-none text-[#343434] bg-muted px-2.5 h-8 rounded-[8px] flex items-center tabular-nums select-none">
                    100%
                  </span>
                  <NavBtn ariaLabel="Zoom in">
                    <ZoomIn className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                  <NavBtn
                    ariaLabel="Fullscreen"
                    disabled={!proposal.draft}
                    onClick={() => setFullscreen(true)}>
                    <Maximize2 className="size-3.5" strokeWidth={2.4} />
                  </NavBtn>
                </div>
              </div>

              {/* Thumbnails — single horizontal scrollable row */}
              <div className="shrink-0 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const isActive = i === safeIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPageIndex(i)}
                      className={cn(
                        "shrink-0 w-[150px] rounded-[8px] overflow-hidden transition-all outline-none p-1.5",
                        isActive
                          ? "bg-[#0047ff]"
                          : "bg-[#f8fafc] hover:bg-secondary",
                      )}>
                      <div
                        className="rounded-[4px] overflow-hidden bg-white"
                        style={{ aspectRatio: previewAspect }}>
                        {hasPages ? (
                          <ScaledPage fit="box" className="w-full h-full">
                            {sheets[i]?.node}
                          </ScaledPage>
                        ) : (
                          <div className="w-full h-full bg-[#0A0F4F] flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">
                              {i + 1}
                            </span>
                          </div>
                        )}
                      </div>
                      <span
                        className={cn(
                          "block text-center text-[10px] font-bold leading-none mt-1.5",
                          isActive ? "text-white" : "text-[#707070]",
                        )}>
                        {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer — sits below body, anchored to bottom-left of meta column */}
          <div className="px-5 py-4 flex items-center gap-2 border-t border-border shrink-0">
            <button
              type="button"
              onClick={() => onArchive?.(proposal)}
              aria-label="Archive"
              className="size-10 bg-muted rounded-[10px] flex items-center justify-center hover:bg-secondary transition-colors outline-none">
              <Archive className="size-3.5 text-foreground" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(proposal)}
              className="h-10 px-4 bg-muted rounded-[10px] flex items-center gap-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors outline-none">
              <Pencil className="size-3.5" strokeWidth={2.2} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onExport?.(proposal)}
              className="flex-1 h-10 bg-[#0047ff] text-white rounded-[10px] flex items-center justify-center gap-2 text-xs font-bold hover:bg-[#0047ff]/90 transition-colors outline-none shadow-sm shadow-primary/20">
              <Download className="size-3.5" strokeWidth={2.4} />
              Export
            </button>
          </div>

          {fullscreen && proposal.draft ? (
            <ProposalDocumentFullscreen
              draft={proposal.draft}
              variant={proposal.variant}
              onClose={() => setFullscreen(false)}
            />
          ) : null}
          {/* Hidden measurer keeps pagination in sync. */}
          {measurer}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

interface MetaRowProps {
  label: string;
  value: React.ReactNode;
}

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 min-h-[24px]">
      <span className="text-[14px] font-bold leading-none text-[#707070]">
        {label}
      </span>
      <div className="text-[14px] font-bold leading-none text-[#343434] text-right">
        {value}
      </div>
    </div>
  );
}

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
      className="size-8 rounded-[8px] bg-muted text-foreground flex items-center justify-center hover:bg-secondary transition-colors outline-none disabled:opacity-40 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function formatHumanDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, "MMMM dd, yyyy");
}
