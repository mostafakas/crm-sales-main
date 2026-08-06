"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import {
  isStepComplete,
  selectProposalDraft,
  type WizardStepId,
} from "@/lib/store/slices/proposals-slice";

const PATH_PREREQUISITES: { match: string; needs: WizardStepId }[] = [
  {
    match: "/client-relations-management/proposals/new/builder",
    needs: "configure",
  },
  {
    match: "/client-relations-management/proposals/new/review",
    needs: "builder",
  },
];

const REDIRECT_TO: Record<WizardStepId, string> = {
  configure: "/client-relations-management/proposals/new/configure",
  builder: "/client-relations-management/proposals/new/builder",
  review: "/client-relations-management/proposals/new/review",
};

/**
 * Redirects the user back to the first incomplete step if they try to
 * navigate directly to a step whose prerequisites aren't met.
 */
export function WizardRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const draft = useAppSelector(selectProposalDraft);

  React.useEffect(() => {
    if (!pathname) return;
    const rule = PATH_PREREQUISITES.find((r) => pathname.startsWith(r.match));
    if (rule && !isStepComplete(rule.needs, draft)) {
      router.replace(REDIRECT_TO[rule.needs]);
    }
  }, [pathname, draft, router]);

  return <>{children}</>;
}
