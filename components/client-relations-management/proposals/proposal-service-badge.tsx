"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_SERVICE_META,
  type ProposalService,
} from "@/lib/types/proposal";

interface ProposalServiceBadgeProps {
  service: ProposalService;
  className?: string;
}

/**
 * Service badge — Figma 2222:7761 / 2222:7763 / etc.
 *
 *   px-[8px] py-[4px] rounded-[4px]
 *   Janna Bold 12px / leading-14, white
 *
 *   Colors (solid):
 *     Content Writing       → #f55050 (destructive)
 *     Programming           → #0047ff (primary)
 *     Design                → #00b927 (success)
 *     Artificial Intelligence → #9359ff (purple)
 *     Marketing             → #f38328 (warning)
 *     Finance               → #08a1bc (info)
 */
export function ProposalServiceBadge({
  service,
  className,
}: ProposalServiceBadgeProps) {
  const meta = PROPOSAL_SERVICE_META[service];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-[8px] py-[4px] rounded-[4px] font-bold text-[12px] leading-[14px] text-white whitespace-nowrap",
        meta.solidBg,
        className,
      )}>
      {meta.label}
    </span>
  );
}
