"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProposalViewModal } from "@/components/client-relations-management/modals/proposal-view-modal";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectProposalById,
  selectProposalsHydrated,
} from "@/lib/store/slices/proposals-slice";
import { useProposalActions } from "./use-proposal-actions";

interface ProposalDetailPageProps {
  proposalId: string;
}

/**
 * Deep-link page for a single proposal. Reads the proposal from the store
 * (hydrated from localStorage) and mounts the {@link ProposalViewModal}
 * forced open; closing it routes back to the proposals list.
 */
export function ProposalDetailPage({ proposalId }: ProposalDetailPageProps) {
  const router = useRouter();
  const hydrated = useAppSelector(selectProposalsHydrated);
  const proposal = useAppSelector(selectProposalById(proposalId));
  const { handleEdit, handleArchive, handleExport } = useProposalActions();

  const handleClose = React.useCallback(
    (open: boolean) => {
      if (!open) router.push("/client-relations-management/proposals");
    },
    [router],
  );

  /* Wait for localStorage hydration before deciding "not found" to avoid a
   * flash of the empty state on first paint. */
  if (!hydrated) {
    return <div className="flex-1 bg-background" />;
  }

  if (!proposal) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 bg-background">
        <h1 className="text-[22px] font-bold text-foreground">
          Proposal not found
        </h1>
        <p className="text-sm font-bold text-muted-foreground">
          We couldn&apos;t locate a proposal with id <code>{proposalId}</code>.
        </p>
        <button
          type="button"
          onClick={() => router.push("/client-relations-management/proposals")}
          className="mt-2 h-10 px-5 rounded-[12px] bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
          Back to Proposals
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      {/* Dim placeholder backdrop so the modal sits on a visible page. */}
      <div className="w-full h-full" />
      <ProposalViewModal
        open
        onOpenChange={handleClose}
        proposal={proposal}
        onEdit={handleEdit}
        onArchive={(p) => {
          handleArchive(p);
          router.push("/client-relations-management/proposals");
        }}
        onExport={handleExport}
      />
    </div>
  );
}
