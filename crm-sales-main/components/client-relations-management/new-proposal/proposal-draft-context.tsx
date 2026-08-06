"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectProposalDraft,
  updateDraft as updateDraftAction,
  updateModule as updateModuleAction,
  toggleModule as toggleModuleAction,
  resetDraft as resetDraftAction,
  markStepComplete as markStepCompleteAction,
  setArOverride as setArOverrideAction,
} from "@/lib/store/slices/proposals-slice";
import type {
  ModuleKey,
  ProposalDraft,
  AboutModuleDraft,
  ServiceDetailsModuleDraft,
  WhyModuleDraft,
  ScopeModuleDraft,
  QuotationModuleDraft,
  SupportModuleDraft,
  WhatWeNeedModuleDraft,
} from "@/lib/types/proposal-draft";

/**
 * Thin Redux-backed wrapper that preserves the original Context API.
 * Internally everything lives in `state.proposals.draft` and persists to
 * localStorage via the store subscriber. The `Provider` is now a no-op
 * kept only so existing layouts compile.
 */
export function ProposalDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

type ModulePatchMap = {
  about: Partial<AboutModuleDraft>;
  service: Partial<ServiceDetailsModuleDraft>;
  why: Partial<WhyModuleDraft>;
  scope: Partial<ScopeModuleDraft>;
  quotation: Partial<QuotationModuleDraft>;
  support: Partial<SupportModuleDraft>;
  whatWeNeed: Partial<WhatWeNeedModuleDraft>;
};

interface ProposalDraftHookValue {
  draft: ProposalDraft;
  updateDraft: (patch: Partial<ProposalDraft>) => void;
  updateModule: <K extends ModuleKey>(key: K, patch: ModulePatchMap[K]) => void;
  toggleModule: (key: ModuleKey) => void;
  resetDraft: () => void;
  markStepComplete: (step: "configure" | "builder") => void;
  /** Set or clear the Arabic override for a field path. */
  setArOverride: (path: string, value: string) => void;
}

export function useProposalDraft(): ProposalDraftHookValue {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectProposalDraft);

  const updateDraft = React.useCallback(
    (patch: Partial<ProposalDraft>) => {
      dispatch(updateDraftAction(patch));
    },
    [dispatch],
  );

  const updateModule = React.useCallback(
    <K extends ModuleKey>(key: K, patch: ModulePatchMap[K]) => {
      dispatch(
        updateModuleAction({ key, patch } as Parameters<
          typeof updateModuleAction
        >[0]),
      );
    },
    [dispatch],
  );

  const toggleModule = React.useCallback(
    (key: ModuleKey) => {
      dispatch(toggleModuleAction(key));
    },
    [dispatch],
  );

  const resetDraft = React.useCallback(() => {
    dispatch(resetDraftAction());
  }, [dispatch]);

  const markStepComplete = React.useCallback(
    (step: "configure" | "builder") => {
      dispatch(markStepCompleteAction(step));
    },
    [dispatch],
  );

  const setArOverride = React.useCallback(
    (path: string, value: string) => {
      dispatch(setArOverrideAction({ path, value }));
    },
    [dispatch],
  );

  return {
    draft,
    updateDraft,
    updateModule,
    toggleModule,
    resetDraft,
    markStepComplete,
    setArOverride,
  };
}
