import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui-slice";
import proposalsReducer, {
  setDraft,
  setProposals,
} from "./slices/proposals-slice";
import { baseApi } from "./services/baseApi";
import { createEmptyProposalDraft } from "@/lib/data/proposal-draft-seed";
import type { ProposalDraft } from "@/lib/types/proposal-draft";
import type { StoredProposal } from "@/lib/types/proposal";

const STORAGE_KEY = "almaster:crm:proposal-draft";
const PROPOSALS_STORAGE_KEY = "almaster:crm:proposals";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    proposals: proposalsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* ─── Client-only hydration helpers (called by ReduxProvider) ──────── */

let hydrated = false;

function loadPersistedDraft(): ProposalDraft | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProposalDraft;
    /* Migration: older drafts persisted before optional fields were
     * added need them backfilled. */
    const legacyPackages =
      parsed.quotation?.packages?.length === 1 &&
      parsed.quotation.packages[0]?.id === "pk-1";
    return {
      ...parsed,
      completedSteps: Array.isArray(parsed.completedSteps)
        ? parsed.completedSteps
        : [],
      arOverrides:
        parsed.arOverrides && typeof parsed.arOverrides === "object"
          ? parsed.arOverrides
          : {},
      /* Refresh the stale single-package default to the current 3-tier seed
       * (only when the draft still holds the untouched legacy default). */
      quotation: legacyPackages
        ? {
            ...parsed.quotation,
            packages: createEmptyProposalDraft().quotation.packages,
          }
        : parsed.quotation,
    };
  } catch {
    return null;
  }
}

function loadPersistedProposals(): StoredProposal[] {
  try {
    const raw = window.localStorage.getItem(PROPOSALS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredProposal[]) : [];
  } catch {
    return [];
  }
}

/**
 * Lazily hydrate the proposal draft and saved proposals from localStorage
 * and start the persistence subscriber. Called from `<ReduxProvider />`
 * inside a `useEffect`, never at module load — that avoids SSR/CSR hydration
 * mismatches because both the server and the client's first paint use the
 * initial (empty) state, and the persisted state only lands after mount.
 */
export function hydrateClientOnly() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;

  const persistedDraft = loadPersistedDraft();
  if (persistedDraft) store.dispatch(setDraft(persistedDraft));

  /* Always dispatch — even an empty list flips the `hydrated` flag so views
   * can tell "loaded, no proposals" from "not loaded yet". */
  store.dispatch(setProposals(loadPersistedProposals()));

  /* Persist draft + records on every change, debounced via micro-task. */
  let queued = false;
  store.subscribe(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      try {
        const state = store.getState();
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(state.proposals.draft),
        );
        window.localStorage.setItem(
          PROPOSALS_STORAGE_KEY,
          JSON.stringify(state.proposals.records),
        );
      } catch {
        /* ignore quota */
      }
    });
  });
}
