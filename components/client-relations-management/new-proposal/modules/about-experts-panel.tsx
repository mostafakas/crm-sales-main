"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { ImageUploadField } from "../image-upload-field";
import { BilingualField } from "../bilingual-field";

export function AboutExpertsPanel() {
  const { draft, updateModule } = useProposalDraft();
  const about = draft.about;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    experts: true,
  });

  const t = (k: string) => () =>
    setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Our Experts"
        open={open.experts}
        onToggle={t("experts")}
        >
        <div className="flex flex-col gap-3">
          {about.experts.map((expert) => (
            <div
              key={expert.id}
              className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expert.selected}
                    onChange={(e) => {
                      const next = about.experts.map((x) =>
                        x.id === expert.id
                          ? { ...x, selected: e.target.checked }
                          : x,
                      );
                      updateModule("about", { experts: next });
                    }}
                    className="size-3.5"
                  />
                  <span className="text-xs font-bold text-foreground">
                    Include in Proposal
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next = about.experts.filter((x) => x.id !== expert.id);
                    updateModule("about", { experts: next });
                  }}
                  className="text-xs font-bold text-destructive hover:underline">
                  Remove
                </button>
              </div>
              <div className="flex items-start gap-4">
                <ImageUploadField
                  variant="avatar"
                  value={expert.avatar || ""}
                  onChange={(url) => {
                    const next = about.experts.map((x) =>
                      x.id === expert.id ? { ...x, avatar: url } : x,
                    );
                    updateModule("about", { experts: next });
                  }}
                />
                <div className="flex flex-col gap-2 flex-1">
                  <BilingualField
                    fieldPath={`about.experts.${expert.id}.name`}
                    value={expert.name}
                    onChange={(v) => {
                      const next = about.experts.map((x) =>
                        x.id === expert.id ? { ...x, name: v } : x,
                      );
                      updateModule("about", { experts: next });
                    }}
                    placeholder="Expert Name"
                    className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold text-foreground w-full"
                  />
                  <BilingualField
                    fieldPath={`about.experts.${expert.id}.role`}
                    value={expert.role}
                    onChange={(v) => {
                      const next = about.experts.map((x) =>
                        x.id === expert.id ? { ...x, role: v } : x,
                      );
                      updateModule("about", { experts: next });
                    }}
                    placeholder="Expert Title / Role"
                    className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold text-foreground w-full"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateModule("about", {
                experts: [
                  ...about.experts,
                  {
                    id: `ex-${Date.now()}`,
                    name: "",
                    role: "",
                    expertise: [],
                    selected: true,
                  },
                ],
              });
            }}
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add Expert
          </button>
        </div>
      </ModuleSubItem>
    </div>
  );
}
