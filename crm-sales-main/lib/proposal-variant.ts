import type { ProposalDraft } from "@/lib/types/proposal-draft";
import type { ProposalLangVariant } from "@/lib/proposal-layout";

/**
 * Resolve a draft for a single rendered language variant.
 *
 * English copy lives on the field itself; Arabic copy lives in
 * `draft.arOverrides[fieldPath]` (written by the bilingual editors). When
 * generating the Arabic proposal we swap each localizable text field for its
 * Arabic override (falling back to the English base when empty), so a single
 * document pipeline produces a fully localized proposal per variant.
 *
 * Non-textual data (images, pricing, icons, structure) is shared verbatim.
 *
 * Field-path convention — MUST match the `fieldPath` props in the panels:
 *   - scalar:      "scope.projectScope"
 *   - array item:  "about.coreValues.<id>.headline"
 *   - string list: "quotation.packages.<id>.includes.<index>"
 */
export function resolveDraftForVariant(
  draft: ProposalDraft,
  variant: ProposalLangVariant,
): ProposalDraft {
  if (variant !== "arabic") return draft;

  const ar = draft.arOverrides ?? {};
  const pick = (path: string, base: string) => ar[path]?.trim() || base;

  return {
    ...draft,
    headline: pick("headline", draft.headline),
    shortDescription: pick("shortDescription", draft.shortDescription),

    about: {
      ...draft.about,
      whoWeAre: pick("about.whoWeAre", draft.about.whoWeAre),
      ourMission: pick("about.ourMission", draft.about.ourMission),
      ourVision: pick("about.ourVision", draft.about.ourVision),
      coreValues: draft.about.coreValues.map((cv) => ({
        ...cv,
        headline: pick(`about.coreValues.${cv.id}.headline`, cv.headline),
        description: pick(`about.coreValues.${cv.id}.description`, cv.description),
      })),
      keyFacts: draft.about.keyFacts.map((kf) => ({
        ...kf,
        value: pick(`about.keyFacts.${kf.id}.value`, kf.value),
        label: pick(`about.keyFacts.${kf.id}.label`, kf.label),
      })),
      certifications: draft.about.certifications.map((c) => ({
        ...c,
        title: pick(`about.certifications.${c.id}.title`, c.title),
        issuer: pick(`about.certifications.${c.id}.issuer`, c.issuer),
        date: pick(`about.certifications.${c.id}.date`, c.date),
      })),
      experts: draft.about.experts.map((ex) => ({
        ...ex,
        name: pick(`about.experts.${ex.id}.name`, ex.name),
        role: pick(`about.experts.${ex.id}.role`, ex.role),
        expertise: ex.expertise.map((e, i) =>
          pick(`about.experts.${ex.id}.expertise.${i}`, e),
        ),
      })),
    },

    serviceDetails: {
      ...draft.serviceDetails,
      serviceName: pick("service.serviceName", draft.serviceDetails.serviceName),
      overview: pick("service.overview", draft.serviceDetails.overview),
      keyDeliverables: pick(
        "service.keyDeliverables",
        draft.serviceDetails.keyDeliverables,
      ),
      moreDetails: pick("service.moreDetails", draft.serviceDetails.moreDetails),
      technologies: draft.serviceDetails.technologies.map((g) => ({
        ...g,
        name: pick(`service.technologies.${g.id}.name`, g.name),
      })),
    },

    why: {
      ...draft.why,
      whyChooseAlMaster: pick("why.whyChooseAlMaster", draft.why.whyChooseAlMaster),
      whatOthersDont: pick("why.whatOthersDont", draft.why.whatOthersDont),
      whyPerfectFit: draft.why.whyPerfectFit.map((it) => ({
        ...it,
        title: pick(`why.whyPerfectFit.${it.id}.title`, it.title),
        description: pick(`why.whyPerfectFit.${it.id}.description`, it.description),
      })),
      distinctAdvantages: draft.why.distinctAdvantages.map((it) => ({
        ...it,
        title: pick(`why.distinctAdvantages.${it.id}.title`, it.title),
        description: pick(
          `why.distinctAdvantages.${it.id}.description`,
          it.description,
        ),
      })),
      similarProjects: draft.why.similarProjects.map((p) => ({
        ...p,
        name: pick(`why.similarProjects.${p.id}.name`, p.name),
        details: pick(`why.similarProjects.${p.id}.details`, p.details),
        feedbackAuthor: pick(
          `why.similarProjects.${p.id}.feedbackAuthor`,
          p.feedbackAuthor ?? "",
        ),
        feedbackBody: pick(
          `why.similarProjects.${p.id}.feedbackBody`,
          p.feedbackBody ?? "",
        ),
      })),
    },

    scope: {
      ...draft.scope,
      projectScope: pick("scope.projectScope", draft.scope.projectScope),
      includedInScope: pick("scope.includedInScope", draft.scope.includedInScope),
      excludedFromScope: pick(
        "scope.excludedFromScope",
        draft.scope.excludedFromScope,
      ),
      estimatedTotalDuration: pick(
        "scope.estimatedTotalDuration",
        draft.scope.estimatedTotalDuration,
      ),
      phases: draft.scope.phases.map((ph) => ({
        ...ph,
        label: pick(`scope.phases.${ph.id}.label`, ph.label),
        description: pick(`scope.phases.${ph.id}.description`, ph.description),
        duration: pick(`scope.phases.${ph.id}.duration`, ph.duration),
      })),
    },

    quotation: {
      ...draft.quotation,
      notes: pick("quotation.notes", draft.quotation.notes),
      lineItems: draft.quotation.lineItems.map((li) => ({
        ...li,
        service: pick(`quotation.lineItems.${li.id}.service`, li.service),
        description: pick(
          `quotation.lineItems.${li.id}.description`,
          li.description,
        ),
      })),
      paymentTerms: draft.quotation.paymentTerms.map((pt) => ({
        ...pt,
        label: pick(`quotation.paymentTerms.${pt.id}.label`, pt.label),
      })),
      packages: draft.quotation.packages.map((pk) => ({
        ...pk,
        name: pick(`quotation.packages.${pk.id}.name`, pk.name),
        description: pick(`quotation.packages.${pk.id}.description`, pk.description),
        cadence: pick(`quotation.packages.${pk.id}.cadence`, pk.cadence),
        timeline: pick(`quotation.packages.${pk.id}.timeline`, pk.timeline),
        includes: pk.includes.map((inc, i) =>
          pick(`quotation.packages.${pk.id}.includes.${i}`, inc),
        ),
      })),
    },

    support: {
      ...draft.support,
      afterSaleBenefits: draft.support.afterSaleBenefits.map((b) => ({
        ...b,
        title: pick(`support.afterSaleBenefits.${b.id}.title`, b.title),
        description: pick(
          `support.afterSaleBenefits.${b.id}.description`,
          b.description,
        ),
      })),
      supportPromise: {
        uptime: pick("support.supportPromise.uptime", draft.support.supportPromise.uptime),
        response: pick("support.supportPromise.response", draft.support.supportPromise.response),
        warranty: pick("support.supportPromise.warranty", draft.support.supportPromise.warranty),
        satisfaction: pick(
          "support.supportPromise.satisfaction",
          draft.support.supportPromise.satisfaction,
        ),
      },
      supportTeam: draft.support.supportTeam.map((m) => ({
        ...m,
        name: pick(`support.supportTeam.${m.id}.name`, m.name),
        role: pick(`support.supportTeam.${m.id}.role`, m.role),
      })),
    },

    whatWeNeed: {
      ...draft.whatWeNeed,
      projectAssets: pick("whatWeNeed.projectAssets", draft.whatWeNeed.projectAssets),
      accessDetails: pick("whatWeNeed.accessDetails", draft.whatWeNeed.accessDetails),
      technicalReferences: pick(
        "whatWeNeed.technicalReferences",
        draft.whatWeNeed.technicalReferences,
      ),
    },
  };
}
