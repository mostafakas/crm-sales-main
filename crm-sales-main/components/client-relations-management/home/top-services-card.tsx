"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProposalRecord, ProposalService } from "@/lib/types/proposal";

interface TopServicesCardProps {
  proposals: ProposalRecord[];
}

/**
 * Top Services card — Figma 2222:8053.
 *
 *   Outer: bg-[#f8fafc] gap-[24px] p-[24px] rounded-[12px]
 *   Header: gap-[8px] · "Top services" 18px bold #343434 + chip
 *     chip: bg-[rgba(0,71,255,0.1)] px-[8px] py-[6px] rounded-[32px]
 *           text 14px Janna Bold leading-14 #0047ff
 *   Body : flex-col justify-between (fills height)
 *   Row  : gap-[8px], two-line layout
 *     Line1: dot (10×10 colored) + label (14px colored) + count chip
 *            (bg-rgba color/0.1 px-[6px] py-[3px] rounded-[32px], 10px text leading-14 colored)
 *            … percentage (14px colored)
 *     Line2: bg-[#edf2f7] h-[10px] rounded-[12px] track,
 *            filled bar bg-color h-[10px] rounded-[4px] with %-width
 *
 *   Color mapping (NOT the design-system tokens — flag-true brand colors):
 *     content-writing       #f55050
 *     design                #00b927
 *     programming           #0047ff
 *     artificial-intelligence #9359ff
 *     marketing             #f38328
 *     finance               #08a1bc
 */
const SERVICE_COLOR: Record<
  ProposalService,
  { text: string; bg: string; tint: string; label: string }
> = {
  "content-writing": {
    text: "text-[#f55050]",
    bg: "bg-[#f55050]",
    tint: "bg-[rgba(245,80,80,0.1)]",
    label: "Content Writing",
  },
  design: {
    text: "text-[#00b927]",
    bg: "bg-[#00b927]",
    tint: "bg-[rgba(0,185,39,0.1)]",
    label: "Design",
  },
  programming: {
    text: "text-[#0047ff]",
    bg: "bg-[#0047ff]",
    tint: "bg-[rgba(0,71,255,0.1)]",
    label: "Programming",
  },
  "artificial-intelligence": {
    text: "text-[#9359ff]",
    bg: "bg-[#9359ff]",
    tint: "bg-[rgba(147,89,255,0.1)]",
    label: "Artificial Intelligence",
  },
  marketing: {
    text: "text-[#f38328]",
    bg: "bg-[#f38328]",
    tint: "bg-[rgba(243,131,40,0.1)]",
    label: "Marketing",
  },
  finance: {
    text: "text-[#08a1bc]",
    bg: "bg-[#08a1bc]",
    tint: "bg-[rgba(8,161,188,0.1)]",
    label: "Finance",
  },
};

interface ServiceRow {
  service: ProposalService;
  count: number;
  share: number;
}

export function TopServicesCard({ proposals }: TopServicesCardProps) {
  const rows = React.useMemo<ServiceRow[]>(() => {
    const counts: Record<string, number> = {};
    for (const p of proposals) {
      counts[p.service] = (counts[p.service] ?? 0) + 1;
    }
    const total = proposals.length || 1;
    return Object.entries(counts)
      .map(([service, count]) => ({
        service: service as ProposalService,
        count,
        share: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [proposals]);

  return (
    <div className="bg-[#f8fafc] flex flex-col gap-[24px] items-start p-[24px] rounded-[12px] w-full h-full">
      {/* Header */}
      <div className="flex items-center gap-[8px] w-full">
        <h3 className="font-bold text-[18px] leading-[20px] text-[#343434] whitespace-nowrap">
          Top services
        </h3>
        <span className="bg-[rgba(0,71,255,0.1)] flex items-center justify-center px-[8px] py-[6px] rounded-[32px]">
          <span className="font-bold text-[14px] leading-[14px] text-[#0047ff] whitespace-nowrap">
            {proposals.length} Proposals
          </span>
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-start justify-between w-full">
        {rows.map((row) => {
          const c = SERVICE_COLOR[row.service];
          return (
            <div
              key={row.service}
              className="flex flex-col gap-[8px] items-start justify-center w-full">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-[8px]">
                  <span className={cn("size-[10px] rounded-full", c.bg)} />
                  <div className="flex items-center gap-[6px]">
                    <span
                      className={cn(
                        "font-bold text-[14px] leading-[20px] whitespace-nowrap",
                        c.text,
                      )}>
                      {c.label}
                    </span>
                    <span
                      className={cn(
                        "flex items-center justify-center px-[6px] py-[3px] rounded-[32px]",
                        c.tint,
                      )}>
                      <span
                        className={cn(
                          "font-bold text-[10px] leading-[14px] whitespace-nowrap",
                          c.text,
                        )}>
                        {row.count}
                      </span>
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "font-bold text-[14px] leading-[20px] whitespace-nowrap",
                    c.text,
                  )}>
                  {row.share}%
                </span>
              </div>
              <div className="bg-[#edf2f7] h-[10px] w-full rounded-[12px] overflow-hidden">
                <div
                  className={cn("h-[10px] rounded-[4px]", c.bg)}
                  style={{ width: `${row.share}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
