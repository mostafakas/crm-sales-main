"use client";

import * as React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { selectProposals } from "@/lib/store/slices/proposals-slice";
import { useProposalActions } from "@/components/client-relations-management/proposals/use-proposal-actions";
import {
  getProposalStatus,
  PROPOSAL_SERVICE_META,
} from "@/lib/types/proposal";
import {
  ProposalsStatsGrid,
  type ProposalsMarketFilter,
} from "./proposals-stats-grid";
import {
  ProposalsToolbar,
  type ProposalsPeriod,
} from "./proposals-toolbar";
import {
  ProposalsSearchBar,
  ProposalsListTools,
  type ProposalsMarketTab,
} from "./proposals-search-bar";
import type { ProposalsViewMode } from "@/components/client-relations-management/proposals/proposals-view-toggle";
import { LatestProposalsTable } from "./latest-proposals-table";
import { ProposalsGrid } from "@/components/client-relations-management/proposals/proposals-grid";
import { RecentActivitiesCard } from "./recent-activities-card";
import { TopServicesCard } from "./top-services-card";
import { ImportProposalModal } from "@/components/client-relations-management/modals/import-proposal-modal";
import { FilterProposalsModal } from "@/components/client-relations-management/modals/filter-proposals-modal";
import { ProposalViewModal } from "@/components/client-relations-management/modals/proposal-view-modal";
import type { ProposalFilterValues } from "@/lib/validations/proposal";

/**
 * Proposals Generator home — pixel-aligned with Figma 2222:7469.
 *
 * Section rhythm (top → bottom):
 *  - Toolbar (40px tall)
 *  - +20px gap → KPI grid (116px)
 *  - +48px gap → Latest Proposals header (40px)
 *  - +16px gap → Search bar (40px)
 *  - +16px gap → Table/Grid
 *  - +48px gap → Bottom cards (388px)
 */
export function ProposalsHome() {
  const proposals = useAppSelector(selectProposals);
  const {
    viewing,
    setViewing,
    handleView,
    handleEdit,
    handleArchive,
    handleExport,
    handleImport,
    handleNew,
  } = useProposalActions();
  const [period, setPeriod] = React.useState<ProposalsPeriod>("month");
  const [statFilter, setStatFilter] =
    React.useState<ProposalsMarketFilter>("all");
  const [marketTab, setMarketTab] = React.useState<ProposalsMarketTab>("all");
  const [search, setSearch] = React.useState("");
  const [viewMode, setViewMode] = React.useState<ProposalsViewMode>("list");
  const [filters, setFilters] = React.useState<ProposalFilterValues>({});
  const [importOpen, setImportOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const visibleProposals = React.useMemo(() => {
    return proposals.filter((p) => {
      if (statFilter === "drafted" && getProposalStatus(p) !== "drafted")
        return false;
      if (
        (statFilter === "saudi" ||
          statFilter === "egypt" ||
          statFilter === "global") &&
        p.market !== statFilter
      )
        return false;

      if (marketTab !== "all" && p.market !== marketTab) return false;

      if (filters.markets?.length && !filters.markets.includes(p.market))
        return false;
      if (filters.services?.length && (!p.services || !p.services.some(s => filters.services!.includes(s))))
        return false;
      if (filters.languages?.length && !filters.languages.includes(p.language))
        return false;
      if (filters.formats?.length && !filters.formats.includes(p.format))
        return false;

      if (search) {
        const q = search.toLowerCase();
        const matches =
          p.headline.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.client.name.toLowerCase().includes(q) ||
          (p.services || []).some(s => PROPOSAL_SERVICE_META[s]?.label.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [proposals, statFilter, marketTab, search, filters]);

  return (
    <div
      className="w-full bg-white flex flex-col p-[24px] overflow-x-hidden"
      style={{ gap: 48 }}>
      {/* Toolbar + KPI grid (20px gap inside; full block spans top section) */}
      <div className="flex flex-col" style={{ gap: 20 }}>
        <ProposalsToolbar
          period={period}
          onPeriodChange={setPeriod}
          onNewProposal={handleNew}
        />
        <ProposalsStatsGrid
          proposals={proposals}
          selected={statFilter}
          onSelect={setStatFilter}
        />
      </div>

      {/* Latest Proposals section: header → 16px → search → 32px → body */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        <ProposalsListTools
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <ProposalsSearchBar
          search={search}
          onSearchChange={setSearch}
          market={marketTab}
          onMarketChange={setMarketTab}
        />
        <div className="mt-2">
          {viewMode === "list" ? (
            <LatestProposalsTable
              proposals={visibleProposals.slice(0, 6)}
              onView={handleView}
              onExport={handleExport}
            />
          ) : (
            <ProposalsGrid
              proposals={visibleProposals.slice(0, 6)}
              onView={handleView}
              onExport={handleExport}
            />
          )}
        </div>
      </div>

      {/* Bottom cards — 16px gap between Recent / Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 16 }}>
        <RecentActivitiesCard />
        <TopServicesCard proposals={proposals} />
      </div>

      <ImportProposalModal
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={(record) => {
          handleImport(record);
          setImportOpen(false);
        }}
      />
      <FilterProposalsModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        defaultValues={filters}
        onApply={(v) => {
          setFilters(v);
          setFiltersOpen(false);
        }}
        onReset={() => setFilters({})}
      />
      <ProposalViewModal
        open={Boolean(viewing)}
        onOpenChange={(v) => {
          if (!v) setViewing(null);
        }}
        proposal={viewing}
        onEdit={handleEdit}
        onExport={handleExport}
        onArchive={handleArchive}
      />
    </div>
  );
}
