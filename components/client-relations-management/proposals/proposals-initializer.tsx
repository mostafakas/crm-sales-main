"use client";

import * as React from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { setProposals } from "@/lib/store/slices/proposals-slice";
import type { StoredProposal } from "@/lib/types/proposal";

export function ProposalsInitializer({ proposals }: { proposals: StoredProposal[] }) {
  const dispatch = useAppDispatch();
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    dispatch(setProposals(proposals));
  }, [dispatch, proposals]);

  return null;
}
