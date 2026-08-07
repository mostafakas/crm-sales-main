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
import { getProposals } from "@/lib/firebase/proposals";

const STORAGE_KEY = "almaster:crm:proposal-draft";
const PROPOSALS_CACHE_KEY = "almaster:crm:proposals";

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
    const raw = window.localStorage.getItem(PROPOSALS_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredProposal[];
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

  /* Load cached proposals for instant paint */
  const cachedProposals = loadPersistedProposals();
  if (cachedProposals.length > 0) {
    store.dispatch(setProposals(cachedProposals));
  }

  /* Fetch live proposals from Firebase */
  getProposals()
    .then((data) => {
      store.dispatch(setProposals(data));
      try {
        window.localStorage.setItem(PROPOSALS_CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        // Ignore quota exceeded errors
      }
    })
    .catch((err) => {
      console.error("Failed to fetch proposals", err);
      // We don't wipe out the cache on error, just log it.
    });

  /* Persist draft on every change, debounced via micro-task. */
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
      } catch {
        /* ignore quota */
      }
    });
  });
}
