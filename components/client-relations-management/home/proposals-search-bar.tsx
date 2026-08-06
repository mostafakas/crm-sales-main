"use client";

import * as React from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProposalMarket } from "@/lib/types/proposal";
import {
  ProposalsViewToggle,
  type ProposalsViewMode,
} from "@/components/client-relations-management/proposals/proposals-view-toggle";

export type ProposalsMarketTab = ProposalMarket | "all";

interface ProposalsSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  market: ProposalsMarketTab;
  onMarketChange: (market: ProposalsMarketTab) => void;
  trailing?: React.ReactNode;
  className?: string;
}

/**
 * Search input + market tabs — Figma 2222:7624.
 *
 * Exact specs:
 *   - Outer gap: 6px
 *   - Search field: bg-[#edf2f7] h-[40px] px-[12px] py-[16px] gap-[12px]
 *     rounded-[8px], 12px Janna-Regular placeholder #707070 leading-20,
 *     12×12 search icon
 *   - Tab cluster: h-[40px] gap-[6px]
 *   - "All Proposals" active: bg-[#343434] text-white px-[12px] py-[8px]
 *     rounded-[8px] · text 12px Janna Bold leading-14
 *   - Saudi tab : bg-[rgba(0,108,53,0.1)] text-[#006c35] gap-[8px]
 *   - Egypt tab : bg-[rgba(255,43,43,0.1)] text-[#ff2b2b]
 *   - Global tab: bg-[rgba(0,71,255,0.1)] text-[#0047ff]
 *   - Each tab flag is 12×12
 */
const MARKET_TABS: {
  value: ProposalsMarketTab;
  label: string;
  flag?: string;
  bgClass?: string;
  textClass?: string;
}[] = [
  { value: "all", label: "All Proposals" },
  {
    value: "saudi",
    label: "Saudi Arabia",
    flag: "🇸🇦",
    bgClass: "bg-[rgba(0,108,53,0.1)]",
    textClass: "text-[#006c35]",
  },
  {
    value: "egypt",
    label: "Egypt",
    flag: "🇪🇬",
    bgClass: "bg-[rgba(255,43,43,0.1)]",
    textClass: "text-[#ff2b2b]",
  },
  {
    value: "global",
    label: "Global",
    flag: "🌐",
    bgClass: "bg-[rgba(0,71,255,0.1)]",
    textClass: "text-[#0047ff]",
  },
];

export function ProposalsSearchBar({
  search,
  onSearchChange,
  market,
  onMarketChange,
  trailing,
  className,
}: ProposalsSearchBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-[6px] w-full",
        className,
      )}>
      {/* Search input */}
      <div className="bg-[#edf2f7] flex-1 min-w-px flex items-center gap-[12px] h-[40px] px-[12px] py-[16px] rounded-[8px]">
        <Search className="size-[12px] text-[#707070] shrink-0" strokeWidth={2} />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for a proposal by its Headline, client name, Service..."
          className="flex-1 min-w-px bg-transparent outline-none font-normal text-[12px] leading-[20px] text-[#343434] placeholder:text-[#707070]"
        />
      </div>

      {/* Market tabs */}
      <div className="flex items-center gap-[6px] h-[40px] shrink-0">
        {MARKET_TABS.map((tab) => {
          const isActive = market === tab.value;
          if (tab.value === "all") {
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onMarketChange(tab.value)}
                className={cn(
                  "h-full flex items-center justify-center px-[12px] py-[8px] rounded-[8px] outline-none transition-colors",
                  isActive
                    ? "bg-[#343434] text-white"
                    : "bg-[#edf2f7] text-[#707070] hover:bg-[#dfe5ec]",
                )}>
                <span className="font-bold text-[12px] leading-[14px] whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          }
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onMarketChange(tab.value)}
              className={cn(
                "h-full flex items-center justify-center gap-[8px] px-[12px] py-[8px] rounded-[8px] outline-none transition-all",
                tab.bgClass,
                tab.textClass,
                isActive && "ring-2 ring-current/30",
              )}>
              <span className="size-[12px] flex items-center justify-center text-[12px] leading-none">
                {tab.flag}
              </span>
              <span className="font-bold text-[12px] leading-[14px] whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {trailing}
    </div>
  );
}

/**
 * "Latest Proposals" header row — Figma 2222:7611.
 *
 *   - Section title: Janna Bold 18px / leading-20 / text-[#343434]
 *     with a 20×20 chevron-down icon next to it
 *   - Filters btn: h-[40px] px-[12px] py-[8px] bg-[#edf2f7] rounded-[8px]
 *     gap-[6px], 12×12 icon and 12px text leading-22.4 (#707070)
 *   - 8px gap, then view toggle (86×40)
 */
interface ProposalsListToolsProps {
  viewMode: ProposalsViewMode;
  onViewModeChange: (mode: ProposalsViewMode) => void;
  onOpenFilters?: () => void;
}

export function ProposalsListTools({
  viewMode,
  onViewModeChange,
  onOpenFilters,
}: ProposalsListToolsProps) {
  return (
    <div className="flex items-center justify-between gap-[12px] h-[40px]">
      <div className="flex items-center gap-[8px]">
        <h2 className="font-bold text-[18px] leading-[20px] text-[#343434]">
          Latest Proposals
        </h2>
        <ChevronDown
          className="size-[20px] text-[#707070]"
          strokeWidth={2.2}
        />
      </div>

      <div className="flex items-center gap-[8px]">
        <button
          type="button"
          onClick={onOpenFilters}
          className="h-[40px] px-[12px] py-[8px] bg-[#edf2f7] flex items-center gap-[6px] rounded-[8px] outline-none transition-colors hover:bg-[#dfe5ec]">
          <Filter className="size-[12px] text-[#707070]" strokeWidth={2} />
          <span className="font-bold text-[12px] leading-[22.4px] text-[#707070]">
            Filters
          </span>
        </button>
        <ProposalsViewToggle value={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
}
