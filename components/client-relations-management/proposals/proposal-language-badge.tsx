"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProposalLanguage } from "@/lib/types/proposal";

interface ProposalLanguageBadgeProps {
  language: ProposalLanguage;
  className?: string;
}

/**
 * Language indicator — Figma 2222:7943-7951.
 *
 *   gap-[8px] · 6×6 dot · Janna Bold 14px / leading-22.4
 *
 *   English → #f55050 (destructive red)
 *   Arabic  → #00b927 (success green)
 *   Both    → #0047ff (primary blue)
 */
const LANG_STYLE: Record<ProposalLanguage, { text: string; dot: string; label: string }> = {
  english: {
    text: "text-[#f55050]",
    dot: "bg-[#f55050]",
    label: "English",
  },
  arabic: {
    text: "text-[#00b927]",
    dot: "bg-[#00b927]",
    label: "Arabic",
  },
  both: {
    text: "text-[#0047ff]",
    dot: "bg-[#0047ff]",
    label: "Both",
  },
};

export function ProposalLanguageBadge({
  language,
  className,
}: ProposalLanguageBadgeProps) {
  const s = LANG_STYLE[language];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-[8px] whitespace-nowrap",
        className,
      )}>
      <span className={cn("size-[6px] rounded-full", s.dot)} />
      <span className={cn("font-bold text-[14px] leading-[22.4px]", s.text)}>
        {s.label}
      </span>
    </span>
  );
}
