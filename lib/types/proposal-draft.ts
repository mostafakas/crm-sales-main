/**
 * The full editable draft model used by the New Proposal wizard.
 *
 * Every field here corresponds to a region in the proposal template
 * (proposal template.pdf): cover, About AlMaster, Why AlMaster, Scope &
 * Timeline, Quotation, Post-Launch Support, What We Need.
 */

import type {
  ProposalFormat,
  ProposalLanguage,
  ProposalMarket,
  ProposalService,
} from "./proposal";

export type ProposalDimensions = "powerpoint" | "a4";
export type QuotationMode = "quotation" | "packages";

export interface ProposalDraftClient {
  id: string;
  name: string;
  email: string;
  country?: string;
  phone?: string;
  avatar?: string;
}

export interface CoreValue {
  id: string;
  icon: "innovation" | "excellence" | "relationships" | "trust" | "quality";
  headline: string;
  description: string;
}

export interface KeyFact {
  id: string;
  value: string;
  label: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  visible: boolean;
}

export interface ExpertProfile {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  expertise: string[];
  selected: boolean;
}

export interface BrandLogo {
  id: string;
  name: string;
  logo?: string;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logo?: string;
}

export interface AboutModuleDraft {
  enabled: boolean;
  valuesEnabled: boolean;
  expertsEnabled: boolean;
  brandsEnabled: boolean;
  imageUrl: string;
  whoWeAre: string;
  ourMission: string;
  ourVision: string;
  coreValues: CoreValue[];
  keyFacts: KeyFact[];
  certifications: Certification[];
  experts: ExpertProfile[];
  brands: BrandLogo[];
  partners: PartnerLogo[];
}

export interface TechnologyGroup {
  id: string;
  name: string;
  icon?: string;
  technologies: string[];
}

export interface ServiceDetailsModuleDraft {
  enabled: boolean;
  serviceName: string;
  serviceIcon: string;
  imageUrl: string;
  showImage: boolean;
  overview: string;
  keyDeliverables: string;
  technologies: TechnologyGroup[];
  moreDetails: string;
}

export interface SimilarProject {
  id: string;
  name: string;
  details: string;
  link: string;
  gallery: string[];
  feedbackAuthor?: string;
  feedbackBody?: string;
  feedbackRating?: number;
  signatureLink?: string;
}

export interface WhyModuleDraft {
  enabled: boolean;
  similarEnabled: boolean;
  whyChooseAlMaster: string;
  whyPerfectFit: { id: string; title: string; description: string }[];
  whatOthersDont: string;
  distinctAdvantages: { id: string; title: string; description: string }[];
  similarProjects: SimilarProject[];
}

export interface PhaseTimeline {
  id: string;
  label: string;
  description: string;
  duration: string;
}

export interface ScopeModuleDraft {
  enabled: boolean;
  projectScope: string;
  includedInScope: string;
  excludedFromScope: string;
  phases: PhaseTimeline[];
  estimatedTotalDuration: string;
}

export interface QuotationLineItem {
  id: string;
  service: string;
  description: string;
  price: number;
}

export interface QuotationPackage {
  id: string;
  name: string;
  price: number;
  cadence: string;
  description: string;
  includes: string[];
  timeline: string;
}

export interface PaymentTerm {
  id: string;
  label: string;
  amount: number;
  percentage: number;
}

export interface QuotationModuleDraft {
  enabled: boolean;
  packagesEnabled: boolean;
  mode: QuotationMode;
  lineItems: QuotationLineItem[];
  packages: QuotationPackage[];
  subtotal: number;
  applyDiscount: boolean;
  discountPercent: number;
  paymentTerms: PaymentTerm[];
  notes: string;
}

export interface SupportBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface SupportTeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface SupportModuleDraft {
  enabled: boolean;
  afterSaleBenefits: SupportBenefit[];
  supportPromise: { uptime: string; response: string; warranty: string; satisfaction: string };
  supportTeam: SupportTeamMember[];
}

export interface WhatWeNeedModuleDraft {
  enabled: boolean;
  projectAssets: string;
  accessDetails: string;
  technicalReferences: string;
}

export type ModuleKey =
  | "about"
  | "about_values"
  | "about_experts"
  | "about_brands"
  | "service"
  | "why"
  | "why_similar"
  | "scope"
  | "quotation"
  | "packages"
  | "support"
  | "whatWeNeed";

export interface ProposalDraft {
  id: string;
  /* ─── Step 01: Configure ──────────────────────────────────────── */
  country?: ProposalMarket;
  language?: ProposalLanguage;
  services?: ProposalService[];
  validityDays: number;
  expiresAt?: string; // ISO date
  dimensions?: ProposalDimensions;
  client?: ProposalDraftClient;
  headline: string;
  slogan?: string;
  shortDescription: string;
  /* ─── Step 02: Modules ────────────────────────────────────────── */
  about: AboutModuleDraft;
  serviceDetails: ServiceDetailsModuleDraft;
  why: WhyModuleDraft;
  scope: ScopeModuleDraft;
  quotation: QuotationModuleDraft;
  support: SupportModuleDraft;
  whatWeNeed: WhatWeNeedModuleDraft;
  /* ─── Wizard progress ─────────────────────────────────────────── */
  /**
   * Steps the user has explicitly finished by clicking the forward
   * button. The route guard and sidebar use this to gate downstream
   * steps so Step 3 only opens after the user has confirmed Step 2.
   *
   * Reset to an empty list whenever the draft resets.
   */
  completedSteps: ("configure" | "builder")[];
  /* ─── Bilingual overrides ─────────────────────────────────────── */
  /**
   * Flat map of `fieldPath → Arabic value`. Only populated when the
   * user picked language === "both" in Step 1. Pages read EN from the
   * regular field and fall back to `arOverrides[path]` when the
   * preview language is Arabic. Used by the BilingualRichText editor.
   */
  arOverrides: Record<string, string>;
  /* ─── Meta ────────────────────────────────────────────────────── */
  updatedAt: string;
}

/* ─── Module metadata (for collapsed list rendering) ───────────────── */

export interface ModuleMeta {
  key: ModuleKey;
  title: string;
  hint: string;
  icon: string;
  itemCount: number;
}

export const MODULE_ORDER: ModuleKey[] = [
  "about",
  "about_values",
  "about_experts",
  "about_brands",
  "service",
  "why",
  "why_similar",
  "scope",
  "quotation",
  "packages",
  "support",
  "whatWeNeed",
];

export const MODULE_META: Record<ModuleKey, Omit<ModuleMeta, "itemCount">> = {
  about: {
    key: "about",
    title: "About AlMaster",
    hint: "Who We Are, Mission & Vision",
    icon: "building",
  },
  about_values: {
    key: "about_values",
    title: "Core Values",
    hint: "Core Values, Facts & Certifications",
    icon: "star",
  },
  about_experts: {
    key: "about_experts",
    title: "Our Experts",
    hint: "Team members & Leadership",
    icon: "users",
  },
  about_brands: {
    key: "about_brands",
    title: "Brands & Partners",
    hint: "Trusted clients and partners",
    icon: "briefcase",
  },
  service: {
    key: "service",
    title: "Service details",
    hint: "Auto-filled from selected service",
    icon: "layers",
  },
  why: {
    key: "why",
    title: "Why AlMaster",
    hint: "Differentiators & Advantages",
    icon: "award",
  },
  why_similar: {
    key: "why_similar",
    title: "Similar Projects",
    hint: "Case studies & past work",
    icon: "image",
  },
  scope: {
    key: "scope",
    title: "Scope & timeline",
    hint: "Phases, deliverables, exclusions",
    icon: "calendar",
  },
  quotation: {
    key: "quotation",
    title: "Quotation (Invoice)",
    hint: "Line-item quotation",
    icon: "credit-card",
  },
  packages: {
    key: "packages",
    title: "Our Packages",
    hint: "Pricing packages and tiers",
    icon: "package",
  },
  support: {
    key: "support",
    title: "Post-launch Support & benefits",
    hint: "Warranty, support, growth",
    icon: "shield",
  },
  whatWeNeed: {
    key: "whatWeNeed",
    title: "What we need to start",
    hint: "Assets, access, references",
    icon: "clipboard",
  },
};
