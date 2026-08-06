"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, Settings, LayoutGrid, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectStepStatus,
  type WizardStepId,
} from "@/lib/store/slices/proposals-slice";

interface WizardStep {
  id: WizardStepId;
  label: string;
  hint: string;
  href: string;
  icon: React.ElementType;
  /** Step that must be complete before this one is reachable. */
  prerequisite?: WizardStepId;
}

const STEPS: WizardStep[] = [
  {
    id: "configure",
    label: "Step 1: Configuration",
    hint: "Country, language, client, service",
    href: "/client-relations-management/proposals/new/configure",
    icon: Settings,
  },
  {
    id: "builder",
    label: "Step 2: Proposal builder",
    hint: "Modules, content, pricing",
    href: "/client-relations-management/proposals/new/builder",
    icon: LayoutGrid,
    prerequisite: "configure",
  },
  {
    id: "review",
    label: "Step 03: Review & export",
    hint: "Validation and delivery",
    href: "/client-relations-management/proposals/new/review",
    icon: Upload,
    prerequisite: "builder",
  },
];

export function WizardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const status = useAppSelector(selectStepStatus);

  return (
    <aside className="sticky top-[64px] h-[calc(100vh-64px)] shrink-0 w-[280px] bg-[#f8fafc] border-r border-[#edf2f7] flex flex-col overflow-y-auto">
      <div className="flex flex-col gap-5 px-4 py-8">
        {/* Header: close + title + divider */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                router.push("/client-relations-management/proposals")
              }
              aria-label="Close wizard"
              className="size-9 rounded-full bg-[#edf2f7] hover:bg-[#e2e8f0] flex items-center justify-center shrink-0 transition-colors outline-none">
              <X className="size-[18px] text-[#343434]" strokeWidth={2.2} />
            </button>
            <p className="flex-1 min-w-0 font-bold text-[22px] leading-5 text-[#343434]">
              New proposal
            </p>
          </div>
          <div className="h-px w-full bg-[#edf2f7]" />
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2">
          {STEPS.map((step) => {
            const isActive = pathname?.startsWith(step.href);
            const isLocked = step.prerequisite
              ? !status[step.prerequisite]
              : false;
            const Icon = step.icon;

            const inner = (
              <div
                className={cn(
                  "flex gap-3 items-start p-3 rounded-[8px] w-full transition-colors",
                  isActive
                    ? "bg-primary/10"
                    : isLocked
                      ? "bg-[#edf2f7] opacity-50 cursor-not-allowed"
                      : "bg-[#edf2f7] hover:bg-[#e2e8f0] cursor-pointer",
                )}>
                <div
                  className={cn(
                    "size-8 rounded-[8px] flex items-center justify-center shrink-0",
                    isActive
                      ? "bg-primary text-white"
                      : "bg-[#f8fafc] text-[#707070]",
                  )}>
                  <Icon className="size-3" strokeWidth={2.4} />
                </div>
                <div className="flex flex-col gap-1 min-w-0 justify-center">
                  <span
                    className={cn(
                      "text-[14px] leading-4 font-bold whitespace-nowrap",
                      isActive ? "text-primary" : "text-[#343434]",
                    )}>
                    {step.label}
                  </span>
                  <span className="text-[12px] leading-[16.5px] font-bold text-[#707070] whitespace-nowrap">
                    {step.hint}
                  </span>
                </div>
              </div>
            );

            if (isLocked) {
              return (
                <div key={step.href} role="button" aria-disabled>
                  {inner}
                </div>
              );
            }
            return (
              <Link key={step.href} href={step.href} className="outline-none">
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
