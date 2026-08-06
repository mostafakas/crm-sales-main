"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_STATUS_META,
  getProposalStatus,
  type ProposalRecord,
} from "@/lib/types/proposal";

interface ProposalStatusPillProps {
  proposal: ProposalRecord;
  className?: string;
}

export function ProposalStatusPill({
  proposal,
  className,
}: ProposalStatusPillProps) {
  const status = getProposalStatus(proposal);
  const meta = PROPOSAL_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 h-[22px] rounded-md text-xs font-bold",
        meta.tintBg,
        meta.tintFg,
        className,
      )}>
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
