"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProposalRecord } from "@/lib/types/proposal";
import { ProposalCard } from "./proposal-card";

interface ProposalsGridProps {
  proposals: ProposalRecord[];
  onView?: (proposal: ProposalRecord) => void;
  onExport?: (proposal: ProposalRecord) => void;
  onDuplicate?: (proposal: ProposalRecord) => void;
  className?: string;
}

export function ProposalsGrid({
  proposals,
  onView,
  onExport,
  onDuplicate,
  className,
}: ProposalsGridProps) {
  if (proposals.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-xl p-12 text-center text-sm font-bold text-muted-foreground">
        No proposals match the current filters.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
        className,
      )}>
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          onView={onView}
          onExport={onExport}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
