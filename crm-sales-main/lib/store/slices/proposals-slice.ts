import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { createEmptyProposalDraft } from "@/lib/data/proposal-draft-seed";
import type { StoredProposal } from "@/lib/types/proposal";

/**
 * Proposals state holds two distinct things:
 *
 *  - `draft`   — the single proposal currently being authored in the wizard.
 *  - `records` — every saved proposal (wizard-generated or imported). This is
 *                the source of truth for the home/list/detail views and is
 *                persisted to localStorage alongside the draft.
 *
 * `hydrated` flips to true once the persisted records have been loaded on the
 * client, letting views distinguish "no proposals yet" from "not loaded yet".
 */
interface ProposalsState {
  draft: ProposalDraft;
  records: StoredProposal[];
  hydrated: boolean;
}

const initialState: ProposalsState = {
  draft: createEmptyProposalDraft(),
  records: [],
  hydrated: false,
};

type ModuleSlot =
  | "about"
  | "serviceDetails"
  | "why"
  | "scope"
  | "quotation"
  | "support"
  | "whatWeNeed";

const MODULE_KEY_MAP: Record<ModuleKey, ModuleSlot> = {
  about: "about",
  service: "serviceDetails",
  why: "why",
  scope: "scope",
  quotation: "quotation",
  support: "support",
  whatWeNeed: "whatWeNeed",
};

type ModulePatch =
  | { key: "about"; patch: Partial<AboutModuleDraft> }
  | { key: "service"; patch: Partial<ServiceDetailsModuleDraft> }
  | { key: "why"; patch: Partial<WhyModuleDraft> }
  | { key: "scope"; patch: Partial<ScopeModuleDraft> }
  | { key: "quotation"; patch: Partial<QuotationModuleDraft> }
  | { key: "support"; patch: Partial<SupportModuleDraft> }
  | { key: "whatWeNeed"; patch: Partial<WhatWeNeedModuleDraft> };

const proposalsSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {
    setDraft: (state, action: PayloadAction<ProposalDraft>) => {
      state.draft = action.payload;
    },

    updateDraft: (state, action: PayloadAction<Partial<ProposalDraft>>) => {
      state.draft = {
        ...state.draft,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
    },

    updateModule: (state, action: PayloadAction<ModulePatch>) => {
      const slot = MODULE_KEY_MAP[action.payload.key];
      const current = state.draft[slot] as unknown as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state.draft as any)[slot] = { ...current, ...action.payload.patch };
      state.draft.updatedAt = new Date().toISOString();
    },

    toggleModule: (state, action: PayloadAction<ModuleKey>) => {
      const slot = MODULE_KEY_MAP[action.payload];
      const current = state.draft[slot] as unknown as { enabled: boolean };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state.draft as any)[slot] = {
        ...current,
        enabled: !current.enabled,
      };
      state.draft.updatedAt = new Date().toISOString();
    },

    resetDraft: (state) => {
      state.draft = createEmptyProposalDraft();
    },

    markStepComplete: (
      state,
      action: PayloadAction<"configure" | "builder">,
    ) => {
      if (!state.draft.completedSteps.includes(action.payload)) {
        state.draft.completedSteps = [
          ...state.draft.completedSteps,
          action.payload,
        ];
      }
      state.draft.updatedAt = new Date().toISOString();
    },

    setArOverride: (
      state,
      action: PayloadAction<{ path: string; value: string }>,
    ) => {
      const overrides = state.draft.arOverrides ?? {};
      if (action.payload.value) {
        state.draft.arOverrides = {
          ...overrides,
          [action.payload.path]: action.payload.value,
        };
      } else {
        const next = { ...overrides };
        delete next[action.payload.path];
        state.draft.arOverrides = next;
      }
      state.draft.updatedAt = new Date().toISOString();
    },

    /* ─── Saved proposals (records) ─────────────────────────────────── */

    /** Replace the whole collection — used to hydrate from localStorage. */
    setProposals: (state, action: PayloadAction<StoredProposal[]>) => {
      state.records = action.payload;
      state.hydrated = true;
    },

    /**
     * Insert a new proposal or replace an existing one (matched by id). New
     * proposals go to the top so the most recent appears first in the table.
     */
    upsertProposal: (state, action: PayloadAction<StoredProposal>) => {
      const idx = state.records.findIndex((p) => p.id === action.payload.id);
      if (idx === -1) {
        state.records.unshift(action.payload);
      } else {
        state.records[idx] = action.payload;
      }
    },

    removeProposal: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  setDraft,
  updateDraft,
  updateModule,
  toggleModule,
  resetDraft,
  markStepComplete,
  setArOverride,
  setProposals,
  upsertProposal,
  removeProposal,
} = proposalsSlice.actions;
export default proposalsSlice.reducer;

/* ─── Selectors ────────────────────────────────────────────────────── */

import type { RootState } from "../store";

export const selectProposalDraft = (state: RootState) => state.proposals.draft;

export const selectProposals = (state: RootState) => state.proposals.records;

export const selectProposalsHydrated = (state: RootState) =>
  state.proposals.hydrated;

export const selectProposalById = (id: string) => (state: RootState) =>
  state.proposals.records.find((p) => p.id === id) ?? null;

/** Find the saved proposal generated from a given draft id, if any. */
export const selectProposalByDraftId =
  (draftId: string) => (state: RootState) =>
    state.proposals.records.find((p) => p.draft?.id === draftId) ?? null;

/* ─── Step gating ──────────────────────────────────────────────────── */

export type WizardStepId = "configure" | "builder" | "review";

/**
 * A step is "complete" when every required field for that step is set
 * in the draft. The wizard sidebar uses this to lock future steps until
 * earlier ones are filled in.
 */
export function isStepComplete(
  step: WizardStepId,
  draft: ProposalDraft,
): boolean {
  switch (step) {
    case "configure":
      /* Step 1 is complete as soon as every required configure field
       * is filled — no extra confirmation needed. */
      return Boolean(
        draft.country &&
          draft.language &&
          draft.service &&
          draft.dimensions &&
          draft.client &&
          draft.headline.trim(),
      );
    case "builder":
      /* Step 2 requires Step 1 to be done AND the user to have clicked
       * "Review & export" at least once. We can't simply check "any
       * module enabled" because the seed enables every module by
       * default — that would unlock Step 3 the moment the user lands.
       *
       * The `?? []` guard backfills the field for drafts persisted in
       * localStorage before `completedSteps` was added to the type. */
      return (
        isStepComplete("configure", draft) &&
        (draft.completedSteps ?? []).includes("builder")
      );
    case "review":
      return true;
  }
}

/** Memo-friendly selector for step completion. */
export const selectStepStatus = (state: RootState) => {
  const d = state.proposals.draft;
  return {
    configure: isStepComplete("configure", d),
    builder: isStepComplete("builder", d),
    review: isStepComplete("review", d),
  };
};

/**
 * Returns the highest step the user is allowed to navigate to. They can
 * always visit step 1; step 2 requires step 1 complete; step 3 requires
 * step 2 complete.
 */
export function reachableStep(draft: ProposalDraft): WizardStepId {
  if (!isStepComplete("configure", draft)) return "configure";
  if (!isStepComplete("builder", draft)) return "builder";
  return "review";
}
