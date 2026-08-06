"use client";

import * as React from "react";
import { Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
export type ProposalsPeriod = "month" | "week" | "day";

interface ProposalsToolbarProps {
  title?: string;
  period: ProposalsPeriod;
  onPeriodChange: (period: ProposalsPeriod) => void;
  onNewProposal?: () => void;
}

/**
 * Title + Month/Week/Day toggle + New Proposal — Figma 2222:7506.
 *
 * Exact specs:
 *   - h1: Janna Bold 22px / leading-20 / #343434
 *   - Toggle outer: bg-[#edf2f7] gap-[6px] px-[4px] rounded-[8px]
 *   - Toggle inner pill: h-[32px] px-[12px] py-[8px] rounded-[8px] gap-[8px]
 *       active   = bg-[#707070] text-white
 *       inactive = bg-[#edf2f7] text-[#707070]
 *   - Pill text: Janna Bold 12px / leading-14
 *   - Pill icon: 12×12
 *   - "New Proposal" btn: bg-[#0047ff] h-[40px] px-[20px] py-[16px]
 *     rounded-[12px] gap-[8px], 10×16 plus icon, 12px white text
 *     leading-22.4
 *   - Right cluster gap: 12px
 */
const PERIODS: { value: ProposalsPeriod; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

export function ProposalsToolbar({
  title = "AlMaster Proposals",
  period,
  onPeriodChange,
  onNewProposal,
}: ProposalsToolbarProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="font-bold text-[22px] leading-[20px] text-[#343434] whitespace-nowrap">
        {title}
      </h1>

      <div className="flex items-center gap-[12px]">
        {/* Period toggle */}
        <div className="bg-[#edf2f7] flex items-center gap-[6px] px-[4px] rounded-[8px] h-[40px]">
          {PERIODS.map((p) => {
            const active = period === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onPeriodChange(p.value)}
                className={cn(
                  "h-[32px] px-[12px] py-[8px] flex items-center justify-center gap-[8px] rounded-[8px] outline-none transition-colors",
                  active
                    ? "bg-[#707070] text-white"
                    : "bg-[#edf2f7] text-[#707070] hover:bg-[#dfe5ec]",
                )}>
                <Calendar className="size-[12px]" strokeWidth={2} />
                <span className="font-bold text-[12px] leading-[14px]">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* New proposal */}
        <button
          type="button"
          onClick={onNewProposal}
          className="bg-[#0047ff] h-[40px] px-[20px] py-[16px] flex items-center justify-center gap-[8px] rounded-[12px] outline-none transition-colors hover:bg-[#0047ff]/90">
          <Plus
            className="h-[16px] w-[10px] text-white"
            strokeWidth={2.5}
          />
          <span className="font-bold text-[12px] leading-[22.4px] text-white whitespace-nowrap">
            New Proposal
          </span>
        </button>
      </div>
    </div>
  );
}
