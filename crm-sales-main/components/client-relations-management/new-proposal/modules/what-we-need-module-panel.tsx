"use client";

import * as React from "react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { RichTextArea } from "../rich-text-area";

export function WhatWeNeedModulePanel() {
  const { draft, updateModule } = useProposalDraft();
  const wwn = draft.whatWeNeed;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    assets: true,
    access: true,
    references: true,
  });
  const t = (k: string) => () =>
    setOpen((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Project Assets"
        open={open.assets}
        onToggle={t("assets")}
        >
        <RichTextArea
          fieldPath="whatWeNeed.projectAssets"
          value={wwn.projectAssets}
          onChange={(v) => updateModule("whatWeNeed", { projectAssets: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Access Details"
        titleClassName="text-success"
        open={open.access}
        onToggle={t("access")}
        >
        <RichTextArea
          fieldPath="whatWeNeed.accessDetails"
          value={wwn.accessDetails}
          onChange={(v) => updateModule("whatWeNeed", { accessDetails: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Technical References"
        titleClassName="text-warning"
        open={open.references}
        onToggle={t("references")}
        >
        <RichTextArea
          fieldPath="whatWeNeed.technicalReferences"
          value={wwn.technicalReferences}
          onChange={(v) =>
            updateModule("whatWeNeed", { technicalReferences: v })
          }
        />
      </ModuleSubItem>
    </div>
  );
}
