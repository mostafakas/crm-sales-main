"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProposalMarket } from "@/lib/types/proposal";

interface ProposalCountryBadgeProps {
  market: ProposalMarket;
  className?: string;
}

/**
 * Country pill — Figma 2222:7812 / 7825 / 7854.
 *
 *   bg-[rgba(0,108,53,0.1)] / [rgba(255,43,43,0.1)] / [rgba(0,71,255,0.1)]
 *   gap-[8px] px-[8px] py-[4px] rounded-[6px]
 *   12×12 flag · Janna Bold 12px / leading-14
 *
 *   Saudi  text → #006c35
 *   Egypt  text → #ff2b2b
 *   Global text → #0047ff
 */
const MARKET_STYLE: Record<
  ProposalMarket,
  { bg: string; text: string; flag: string; label: string }
> = {
  saudi: {
    bg: "bg-[rgba(0,108,53,0.1)]",
    text: "text-[#006c35]",
    flag: "🇸🇦",
    label: "Saudi Arabia",
  },
  egypt: {
    bg: "bg-[rgba(255,43,43,0.1)]",
    text: "text-[#ff2b2b]",
    flag: "🇪🇬",
    label: "Egypt",
  },
  global: {
    bg: "bg-[rgba(0,71,255,0.1)]",
    text: "text-[#0047ff]",
    flag: "🌐",
    label: "Global",
  },
};

export function ProposalCountryBadge({
  market,
  className,
}: ProposalCountryBadgeProps) {
  const s = MARKET_STYLE[market];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-[8px] px-[8px] py-[4px] rounded-[6px] whitespace-nowrap",
        s.bg,
        className,
      )}>
      <span className="size-[12px] flex items-center justify-center text-[12px] leading-none">
        {s.flag}
      </span>
      <span className={cn("font-bold text-[12px] leading-[14px]", s.text)}>
        {s.label}
      </span>
    </span>
  );
}
