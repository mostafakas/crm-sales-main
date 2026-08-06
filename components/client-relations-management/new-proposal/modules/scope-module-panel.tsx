"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { RichTextArea } from "../rich-text-area";
import { BilingualField } from "../bilingual-field";

export function ScopeModulePanel() {
  const { draft, updateModule } = useProposalDraft();
  const scope = draft.scope;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    overview: true,
    included: true,
    excluded: true,
    phases: true,
  });
  const t = (k: string) => () =>
    setOpen((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Project Scope"
        open={open.overview}
        onToggle={t("overview")}
        >
        <RichTextArea
          fieldPath="scope.projectScope"
          value={scope.projectScope}
          onChange={(v) => updateModule("scope", { projectScope: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Included in Scope"
        titleClassName="text-success"
        open={open.included}
        onToggle={t("included")}
        >
        <RichTextArea
          fieldPath="scope.includedInScope"
          value={scope.includedInScope}
          onChange={(v) => updateModule("scope", { includedInScope: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Excluded from Scope"
        titleClassName="text-destructive"
        open={open.excluded}
        onToggle={t("excluded")}
        >
        <RichTextArea
          fieldPath="scope.excludedFromScope"
          value={scope.excludedFromScope}
          onChange={(v) => updateModule("scope", { excludedFromScope: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Project Phases & Timeline"
        open={open.phases}
        onToggle={t("phases")}
        >
        <div className="flex flex-col gap-3">
          {scope.phases.map((phase, i) => (
            <div key={phase.id} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground">
                Phase {i + 1}
              </span>
              <div className="grid grid-cols-[1fr_120px] gap-2 items-start">
                <BilingualField
                  fieldPath={`scope.phases.${phase.id}.label`}
                  value={phase.label}
                  onChange={(v) => {
                    const next = scope.phases.map((x) =>
                      x.id === phase.id ? { ...x, label: v } : x,
                    );
                    updateModule("scope", { phases: next });
                  }}
                  className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                  placeholder="Phase name"
                />
                <BilingualField
                  fieldPath={`scope.phases.${phase.id}.duration`}
                  value={phase.duration}
                  onChange={(v) => {
                    const next = scope.phases.map((x) =>
                      x.id === phase.id ? { ...x, duration: v } : x,
                    );
                    updateModule("scope", { phases: next });
                  }}
                  className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                  placeholder="Duration"
                />
              </div>
              <BilingualField
                fieldPath={`scope.phases.${phase.id}.description`}
                value={phase.description}
                onChange={(v) => {
                  const next = scope.phases.map((x) =>
                    x.id === phase.id ? { ...x, description: v } : x,
                  );
                  updateModule("scope", { phases: next });
                }}
                className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                placeholder="Description"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateModule("scope", {
                phases: [
                  ...scope.phases,
                  {
                    id: `ph-${Date.now()}`,
                    label: "",
                    description: "",
                    duration: "",
                  },
                ],
              });
            }}
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add Phase
          </button>
        </div>

        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-border">
          <span className="text-xs font-bold text-foreground">
            Estimated Total Duration:
          </span>
          <BilingualField
            fieldPath="scope.estimatedTotalDuration"
            value={scope.estimatedTotalDuration}
            onChange={(v) =>
              updateModule("scope", { estimatedTotalDuration: v })
            }
            placeholder="e.g. 3–4 Weeks"
            className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-sm font-bold text-primary w-full"
          />
        </div>
      </ModuleSubItem>
    </div>
  );
}
