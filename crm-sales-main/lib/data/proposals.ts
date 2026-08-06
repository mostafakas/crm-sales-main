/**
 * Proposal-related shared shapes.
 *
 * The seeded mock proposals that used to live here have been removed — all
 * proposals now flow through Redux (`state.proposals.records`) and persist to
 * localStorage. See `lib/store/slices/proposals-slice.ts`.
 */

/** A single entry in the "Recent Activities" feed. */
export interface ProposalActivity {
  id: string;
  actorName: string;
  action: string;
  proposalCode: string;
  proposalHeadline: string;
  proposalId: string;
  /** Relative-time string for display. */
  relativeTime: string;
}
