"use client";

import * as React from "react";
import { Database, Box } from "lucide-react";
import {
  ProposalsStatCard,
  type ProposalsStatVariant,
} from "./proposals-stat-card";
import {
  getProposalStatus,
  type ProposalMarket,
  type ProposalRecord,
} from "@/lib/types/proposal";

export type ProposalsMarketFilter = ProposalMarket | "all" | "drafted";

interface ProposalsStatsGridProps {
  proposals: ProposalRecord[];
  selected?: ProposalsMarketFilter;
  onSelect?: (filter: ProposalsMarketFilter) => void;
}

interface StatConfig {
  key: ProposalsMarketFilter;
  variant: ProposalsStatVariant;
  label: string;
  /** Flag emoji for colored variants. */
  flag?: string;
  /** Icon for neutral / drafted. */
  icon?: React.ElementType;
}

const STATS: StatConfig[] = [
  { key: "all", variant: "neutral", label: "Total Proposals", icon: Database },
  { key: "saudi", variant: "saudi", label: "Saudi Market", flag: "🇸🇦" },
  { key: "egypt", variant: "egypt", label: "Egyptian Market", flag: "🇪🇬" },
  { key: "global", variant: "global", label: "Global Market", flag: "🌐" },
  { key: "drafted", variant: "drafted", label: "Drafted Proposals", icon: Box },
];

export function ProposalsStatsGrid({
  proposals,
  selected = "all",
  onSelect,
}: ProposalsStatsGridProps) {
  const counts = React.useMemo(() => {
    const c = { all: proposals.length, saudi: 0, egypt: 0, global: 0, drafted: 0 };
    for (const p of proposals) {
      if (p.market === "saudi") c.saudi += 1;
      else if (p.market === "egypt") c.egypt += 1;
      else if (p.market === "global") c.global += 1;
      if (getProposalStatus(p) === "drafted") c.drafted += 1;
    }
    return c;
  }, [proposals]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[8px] shrink-0">
      {STATS.map((stat) => {
        const value = counts[stat.key as keyof typeof counts];
        const hint =
          stat.key === "all" || stat.key === "drafted"
            ? "This Month"
            : "+12 This Month";
        return (
          <ProposalsStatCard
            key={stat.key}
            variant={stat.variant}
            label={stat.label}
            value={value}
            hint={hint}
            flag={stat.flag}
            icon={stat.icon}
            selected={selected === stat.key}
            onClick={() => onSelect?.(stat.key)}
          />
        );
      })}
    </div>
  );
}
