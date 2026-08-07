"use client";

import * as React from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { setProposals } from "@/lib/store/slices/proposals-slice";
import type { StoredProposal } from "@/lib/types/proposal";

export function ProposalsInitializer({ proposals }: { proposals: StoredProposal[] }) {
  const dispatch = useAppDispatch();
  const initialized = React.useRef(false);

  if (!initialized.current) {
    dispatch(setProposals(proposals));
    initialized.current = true;
  }

  return null;
}
