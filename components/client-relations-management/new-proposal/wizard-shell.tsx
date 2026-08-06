"use client";

import * as React from "react";
import { WizardSidebar } from "./wizard-sidebar";
import { WizardRouteGuard } from "./wizard-route-guard";

/** Two-pane wizard shell: fixed step sidebar + the active step's content. */
export function WizardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 bg-muted min-h-0 min-w-0">
      <WizardSidebar />
      <main className="flex-1 min-w-0">
        <WizardRouteGuard>{children}</WizardRouteGuard>
      </main>
    </div>
  );
}
