"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, ArrowLeft, ArrowRight } from "lucide-react";
import { useProposalDraft } from "../proposal-draft-context";
import {
  MODULE_ORDER,
  MODULE_META,
  type ModuleKey,
} from "@/lib/types/proposal-draft";
import { WizardStepHeader } from "../wizard-step-header";
import { ModuleShell } from "../module-shell";
import { LivePreviewPanel } from "../live-preview-panel";
import { AboutModulePanel } from "../modules/about-module-panel";
import { ServiceModulePanel } from "../modules/service-module-panel";
import { WhyModulePanel } from "../modules/why-module-panel";
import { ScopeModulePanel } from "../modules/scope-module-panel";
import { QuotationModulePanel } from "../modules/quotation-module-panel";
import { SupportModulePanel } from "../modules/support-module-panel";
import { WhatWeNeedModulePanel } from "../modules/what-we-need-module-panel";

const MODULE_PANELS: Record<ModuleKey, React.ComponentType> = {
  about: AboutModulePanel,
  service: ServiceModulePanel,
  why: WhyModulePanel,
  scope: ScopeModulePanel,
  quotation: QuotationModulePanel,
  support: SupportModulePanel,
  whatWeNeed: WhatWeNeedModulePanel,
};

export function BuilderStep() {
  const router = useRouter();
  const { draft, toggleModule, markStepComplete } = useProposalDraft();
  const [expanded, setExpanded] = React.useState<Set<ModuleKey>>(
    new Set(),
  );
  const [pageIndex, setPageIndex] = React.useState(1);

  const toggleExpand = (key: ModuleKey) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const itemCounts: Record<ModuleKey, number> = {
    about: 6,
    service: 4,
    why: 3,
    scope: 4,
    quotation: 3,
    support: 3,
    whatWeNeed: 3,
  };

  const moduleEnabled = (key: ModuleKey) => {
    const map = {
      about: draft.about.enabled,
      service: draft.serviceDetails.enabled,
      why: draft.why.enabled,
      scope: draft.scope.enabled,
      quotation: draft.quotation.enabled,
      support: draft.support.enabled,
      whatWeNeed: draft.whatWeNeed.enabled,
    };
    return map[key];
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-full p-[24px]">
      <div className="bg-white rounded-[20px] p-[32px] flex flex-col gap-[32px]">
        <WizardStepHeader
          icon={LayoutGrid}
          title="Step 2: Proposal builder"
          subtitle="Each module below renders one or more pages in the live preview."
        />

        {/* Two-column body */}
        <div className="grid grid-cols-[minmax(0,1fr)_460px] gap-[24px] items-start">
          {/* Modules */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] p-[20px] flex flex-col gap-[16px]">
            <div className="flex gap-[8px] items-center w-full">
              <p className="flex-1 font-bold text-[20px] leading-[22.4px] text-[#343434]">
                Modules
              </p>
              <p className="font-bold text-[12px] leading-[16.5px] text-[#64748b] whitespace-nowrap">
                Toggle to view or hide module, override CMS content per proposal.
              </p>
            </div>

            <div className="flex flex-col gap-[8px]">
              {MODULE_ORDER.map((key) => {
                const meta = MODULE_META[key];
                const Panel = MODULE_PANELS[key];
                return (
                  <ModuleShell
                    key={key}
                    moduleKey={key}
                    title={meta.title}
                    hint={meta.hint}
                    itemCount={itemCounts[key]}
                    enabled={moduleEnabled(key)}
                    onToggle={() => toggleModule(key)}
                    expanded={expanded.has(key)}
                    onExpandToggle={() => toggleExpand(key)}>
                    <Panel />
                  </ModuleShell>
                );
              })}
            </div>
          </div>

          {/* Live Preview — sticks below the CRM header while modules scroll */}
          <div className="sticky top-[80px] self-start">
            <LivePreviewPanel
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => router.push("/client-relations-management/proposals/new/configure")}
            className="bg-[#edf2f7] h-[40px] px-[20px] py-[16px] rounded-[12px] flex items-center justify-center gap-[8px] outline-none transition-colors hover:bg-[#dfe5ec]">
            <ArrowLeft className="size-[16px] text-[#707070]" strokeWidth={2.4} />
            <span className="font-bold text-[12px] leading-[22.4px] text-[#707070]">
              Back
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              markStepComplete("builder");
              router.push("/client-relations-management/proposals/new/review");
            }}
            className="bg-[#0047ff] h-[40px] px-[20px] py-[16px] rounded-[12px] flex items-center justify-center gap-[8px] outline-none transition-colors hover:bg-[#0047ff]/90">
            <span className="font-bold text-[12px] leading-[22.4px] text-white whitespace-nowrap">
              Review & export
            </span>
            <ArrowRight className="size-[16px] text-white" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
