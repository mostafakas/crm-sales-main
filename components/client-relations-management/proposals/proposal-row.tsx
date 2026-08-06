"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_FORMAT_META,
  type ProposalRecord,
} from "@/lib/types/proposal";

interface ProposalRowProps {
  proposal: ProposalRecord;
  className?: string;
}

/**
 * File-icon + meta + headline column — Figma 2222:7690.
 *
 *   Row gap-[8px]
 *   File icon button: bg-[rgba(0,71,255,0.1)] h-[32px] w-[28px]
 *     px-[10.667px] py-[14.222px] rounded-[7.111px], 12×12 icon
 *   Text column gap-[2px]
 *   Meta line: gap-[6px], h-[16.5px]
 *     - JannaLT-Regular (NOT Bold) 10px / leading-16 / #707070
 *     - 3×3 dot separator (rounded-full bg-current with opacity)
 *     - "24 pages" has tracking-[-0.14px]
 *   Headline: Janna Bold 14px / leading-16 / #343434
 */
export function ProposalRow({ proposal, className }: ProposalRowProps) {
  const formatMeta = PROPOSAL_FORMAT_META[proposal.format];
  return (
    <div className={cn("flex items-center gap-[8px]", className)}>
      <div className="bg-[rgba(0,71,255,0.1)] h-[32px] w-[28px] flex items-center justify-center rounded-[7px] shrink-0">
        <FileText className="size-[12px] text-[#0047ff]" strokeWidth={2.2} />
      </div>
      <div className="flex flex-col gap-[2px] items-start min-w-0">
        <div className="flex items-center gap-[6px] h-[16.5px]">
          <span className="font-normal text-[10px] leading-[16px] text-[#707070] whitespace-nowrap">
            {proposal.code}
          </span>
          <span className="size-[3px] rounded-full bg-[#707070]" />
          <span className="font-normal text-[10px] leading-[16px] tracking-[-0.14px] text-[#707070] whitespace-nowrap">
            {proposal.pages} pages
          </span>
          <span className="size-[3px] rounded-full bg-[#707070]" />
          <span className="font-normal text-[10px] leading-[16px] tracking-[-0.14px] text-[#707070] whitespace-nowrap">
            {formatMeta.label}
          </span>
        </div>
        <span className="font-bold text-[14px] leading-[16px] text-[#343434] whitespace-nowrap truncate">
          {proposal.headline}
        </span>
      </div>
    </div>
  );
}
