"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { RichTextArea } from "../rich-text-area";
import { ImageUploadField } from "../image-upload-field";
import { BilingualField } from "../bilingual-field";

export function WhySimilarPanel() {
  const { draft, updateModule } = useProposalDraft();
  const why = draft.why;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    similar: true,
  });
  const t = (k: string) => () =>
    setOpen((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Similar projects we have delivered"
        open={open.similar}
        onToggle={t("similar")}
        >
        <div className="flex flex-col gap-3">
          {why.similarProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-background border border-border rounded-[10px] p-3 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Project Name
                </span>
                <BilingualField
                  fieldPath={`why.similarProjects.${proj.id}.name`}
                  value={proj.name}
                  onChange={(v) => {
                    const next = why.similarProjects.map((x) =>
                      x.id === proj.id ? { ...x, name: v } : x,
                    );
                    updateModule("why", { similarProjects: next });
                  }}
                  placeholder="Project name"
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                />
              </div>
              <RichTextArea
                fieldPath={`why.similarProjects.${proj.id}.details`}
                value={proj.details}
                onChange={(v) => {
                  const next = why.similarProjects.map((x) =>
                    x.id === proj.id ? { ...x, details: v } : x,
                  );
                  updateModule("why", { similarProjects: next });
                }}
              />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Project Link
                </span>
                <input
                  type="url"
                  value={proj.link}
                  onChange={(e) => {
                    const next = why.similarProjects.map((x) =>
                      x.id === proj.id ? { ...x, link: e.target.value } : x,
                    );
                    updateModule("why", { similarProjects: next });
                  }}
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Project Gallery
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const url = proj.gallery[slotIdx] ?? "";
                    return (
                      <div key={slotIdx} className="relative">
                        <ImageUploadField
                          value={url}
                          onChange={(v) => {
                            const nextGallery = [...proj.gallery];
                            nextGallery[slotIdx] = v;
                            const cleaned = nextGallery.filter(
                              (x, i) => i <= slotIdx || x,
                            );
                            const next = why.similarProjects.map((x) =>
                              x.id === proj.id
                                ? { ...x, gallery: cleaned }
                                : x,
                            );
                            updateModule("why", { similarProjects: next });
                          }}
                          aspect="16/10"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add Another Project
          </button>
        </div>
      </ModuleSubItem>
    </div>
  );
}
