"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  removeProposal,
  resetDraft,
  setDraft,
  upsertProposal,
} from "@/lib/store/slices/proposals-slice";
import { exportProposalAsDocx } from "@/lib/proposal-export";
import type { StoredProposal } from "@/lib/types/proposal";

/**
 * Shared view/edit/archive/export wiring for the proposal lists (home +
 * all-proposals page). Centralises the modal open state and the dispatches
 * so both surfaces behave identically.
 */
export function useProposalActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [viewing, setViewing] = React.useState<StoredProposal | null>(null);

  const handleView = React.useCallback((p: StoredProposal) => {
    setViewing(p);
  }, []);

  /** Load a saved proposal back into the wizard for editing. */
  const handleEdit = React.useCallback(
    (p: StoredProposal) => {
      if (p.draft) {
        dispatch(setDraft(p.draft));
        router.push("/client-relations-management/proposals/new/configure");
      } else {
        /* Imported proposals carry no editable draft. */
        router.push("/client-relations-management/proposals/new");
      }
      setViewing(null);
    },
    [dispatch, router],
  );

  const handleArchive = React.useCallback(
    (p: StoredProposal) => {
      dispatch(removeProposal(p.id));
      setViewing(null);
    },
    [dispatch],
  );

  /** Re-export a saved proposal as DOCX from its stored draft. */
  const handleExport = React.useCallback(async (p: StoredProposal) => {
    if (!p.draft) {
      window.alert(
        "This proposal was imported and has no editable content to export.",
      );
      return;
    }
    const baseName = (p.headline || "Proposal").replace(/[^\w-]+/g, "_");
    try {
      await exportProposalAsDocx(p.draft, `${baseName}.docx`);
    } catch (err) {
      console.error("Export failed:", err);
      window.alert("Failed to export this proposal.");
    }
  }, []);

  /** Persist a newly imported proposal. */
  const handleImport = React.useCallback(
    (p: StoredProposal) => {
      dispatch(upsertProposal(p));
    },
    [dispatch],
  );

  /** Start a brand-new proposal from a clean draft. */
  const handleNew = React.useCallback(() => {
    dispatch(resetDraft());
    router.push("/client-relations-management/proposals/new/configure");
  }, [dispatch, router]);

  return {
    viewing,
    setViewing,
    handleView,
    handleEdit,
    handleArchive,
    handleExport,
    handleImport,
    handleNew,
  };
}
