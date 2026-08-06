"use client";

import * as React from "react";
import { Plus, Filter } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { useAppSelector } from "@/lib/store/hooks";
import { selectProposals } from "@/lib/store/slices/proposals-slice";
import { useProposalActions } from "./use-proposal-actions";
import { PROPOSAL_SERVICE_META } from "@/lib/types/proposal";
import { LatestProposalsTable } from "@/components/client-relations-management/home/latest-proposals-table";
import {
  ProposalsSearchBar,
  type ProposalsMarketTab,
} from "@/components/client-relations-management/home/proposals-search-bar";
import { ProposalsGrid } from "./proposals-grid";
import {
  ProposalsViewToggle,
  type ProposalsViewMode,
} from "./proposals-view-toggle";
import { ProposalsPagination } from "./proposals-pagination";
import { ImportProposalModal } from "@/components/client-relations-management/modals/import-proposal-modal";
import { FilterProposalsModal } from "@/components/client-relations-management/modals/filter-proposals-modal";
import { ProposalViewModal } from "@/components/client-relations-management/modals/proposal-view-modal";
import type { ProposalFilterValues } from "@/lib/validations/proposal";

interface ProposalsListPageProps {
  initialView?: ProposalsViewMode;
}

const PAGE_SIZE_LIST = 8;
const PAGE_SIZE_GRID = 6;

export function ProposalsListPage({
  initialView = "list",
}: ProposalsListPageProps) {
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
  const [viewMode, setViewMode] =
    React.useState<ProposalsViewMode>(initialView);
  const [marketTab, setMarketTab] = React.useState<ProposalsMarketTab>("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState<ProposalFilterValues>({});
  const [importOpen, setImportOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const visible = React.useMemo(() => {
    return proposals.filter((p) => {
      if (marketTab !== "all" && p.market !== marketTab) return false;
      if (filters.markets?.length && !filters.markets.includes(p.market))
        return false;
      if (filters.services?.length && !filters.services.includes(p.service))
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
          PROPOSAL_SERVICE_META[p.service].label.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [proposals, marketTab, search, filters]);

  React.useEffect(() => {
    setPage(1);
  }, [marketTab, search, filters, viewMode]);

  const pageSize = viewMode === "grid" ? PAGE_SIZE_GRID : PAGE_SIZE_LIST;
  const paged = visible.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full px-6 py-6 bg-background overflow-x-hidden flex flex-col gap-5">
      {/* Toolbar: title + Filters + New Proposal */}
      <div className="flex flex-wrap items-center justify-between gap-3 h-10">
        <Typography
          as="h1"
          className="text-[22px] leading-5 text-foreground">
          All Proposals
        </Typography>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="h-10 px-3 rounded-[8px] bg-muted flex items-center gap-1.5 transition-colors hover:bg-secondary outline-none">
            <Filter className="size-3 text-muted-foreground" strokeWidth={2.2} />
            <span className="text-xs leading-none font-bold text-muted-foreground">
              Filters
            </span>
          </button>

          <button
            type="button"
            onClick={handleNew}
            className="h-10 px-5 rounded-[12px] bg-primary flex items-center gap-2 transition-colors hover:bg-primary/90 outline-none">
            <Plus
              className="size-3.5 text-primary-foreground"
              strokeWidth={2.5}
            />
            <span className="text-xs leading-none font-bold text-primary-foreground">
              New Proposal
            </span>
          </button>
        </div>
      </div>

      {/* Search + market tabs + view toggle */}
      <ProposalsSearchBar
        search={search}
        onSearchChange={setSearch}
        market={marketTab}
        onMarketChange={setMarketTab}
        trailing={
          <ProposalsViewToggle value={viewMode} onChange={setViewMode} />
        }
      />

      {/* Body */}
      {viewMode === "list" ? (
        <LatestProposalsTable
          proposals={paged}
          onView={handleView}
          onExport={handleExport}
        />
      ) : (
        <ProposalsGrid
          proposals={paged}
          onView={handleView}
          onExport={handleExport}
        />
      )}

      {/* Pagination */}
      <ProposalsPagination
        page={page}
        pageSize={pageSize}
        total={visible.length}
        onPageChange={setPage}
      />

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
