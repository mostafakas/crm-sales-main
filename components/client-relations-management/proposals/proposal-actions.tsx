"use client";

import * as React from "react";
import { Upload, Eye, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalActionsProps {
  onDownload?: () => void;
  onView?: () => void;
  onCopy?: () => void;
  className?: string;
}

/**
 * Row actions — Figma 2222:7964.
 *
 *   gap-[6px]
 *   Each button: h-[28px] w-[32px] px-[12px] py-[16px] rounded-[8px]
 *     primary  : bg-[#0047ff] (white icon)
 *     muted    : bg-[rgba(0,71,255,0.1)] (primary icon)
 *     drafted  : bg-[rgba(112,112,112,0.1)] (#707070 icon)
 *   Icon: 12×12
 */
export function ProposalActions({
  onDownload,
  onView,
  onCopy,
  className,
}: ProposalActionsProps) {
  return (
    <div className={cn("flex items-center gap-[6px]", className)}>
      <ActionButton label="Download" variant="primary" onClick={onDownload}>
        <Upload className="size-[12px]" strokeWidth={2.2} />
      </ActionButton>
      <ActionButton label="View" variant="muted" onClick={onView}>
        <Eye className="size-[12px]" strokeWidth={2.2} />
      </ActionButton>
      <ActionButton label="Copy" variant="ghost" onClick={onCopy}>
        <Copy className="size-[12px]" strokeWidth={2.2} />
      </ActionButton>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  variant: "primary" | "muted" | "ghost";
  onClick?: () => void;
  children: React.ReactNode;
}

function ActionButton({
  label,
  variant,
  onClick,
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "h-[28px] w-[32px] flex items-center justify-center rounded-[8px] outline-none transition-all",
        variant === "primary" &&
          "bg-[#0047ff] text-white hover:bg-[#0047ff]/90",
        variant === "muted" &&
          "bg-[rgba(0,71,255,0.1)] text-[#0047ff] hover:bg-[rgba(0,71,255,0.18)]",
        variant === "ghost" &&
          "bg-[rgba(112,112,112,0.1)] text-[#707070] hover:bg-[rgba(112,112,112,0.18)]",
      )}>
      {children}
    </button>
  );
}
