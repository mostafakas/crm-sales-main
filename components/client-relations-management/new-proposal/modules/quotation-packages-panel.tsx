"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { BilingualField } from "../bilingual-field";

export function QuotationPackagesPanel() {
  const { draft, updateModule } = useProposalDraft();
  const q = draft.quotation;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    packages: true,
  });

  const t = (k: string) => () =>
    setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Packages"
        open={open.packages}
        onToggle={t("packages")}
        >
        <div className="flex flex-col gap-2 mt-2">
          {q.packages.map((pk, i) => (
            <div
              key={pk.id}
              className="bg-background border border-border rounded-[10px] p-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-muted-foreground">
                Package {i + 1}
              </span>
              <div className="grid grid-cols-[1fr_140px] gap-2 items-start">
                <BilingualField
                  fieldPath={`quotation.packages.${pk.id}.name`}
                  value={pk.name}
                  onChange={(v) => {
                    const next = q.packages.map((x) =>
                      x.id === pk.id ? { ...x, name: v } : x,
                    );
                    updateModule("quotation", { packages: next });
                  }}
                  placeholder="Package name"
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                />
                <div className="bg-muted h-9 px-3 rounded-[8px] flex items-center gap-1">
                  <span className="text-xs font-bold">₪</span>
                  <input
                    type="number"
                    value={pk.price}
                    onChange={(e) => {
                      const next = q.packages.map((x) =>
                        x.id === pk.id
                          ? { ...x, price: Number(e.target.value) }
                          : x,
                      );
                      updateModule("quotation", { packages: next });
                    }}
                    className="bg-transparent outline-none text-xs font-bold w-full text-right"
                  />
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {pk.cadence}
                  </span>
                </div>
              </div>
              <BilingualField
                multiline
                rows={2}
                fieldPath={`quotation.packages.${pk.id}.description`}
                value={pk.description}
                onChange={(v) => {
                  const next = q.packages.map((x) =>
                    x.id === pk.id ? { ...x, description: v } : x,
                  );
                  updateModule("quotation", { packages: next });
                }}
                placeholder="Description"
                className="bg-muted px-3 py-2 rounded-[8px] outline-none text-xs font-bold w-full resize-none"
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Includes
                </span>
                {pk.includes.map((inc, idx) => (
                  <BilingualField
                    key={idx}
                    fieldPath={`quotation.packages.${pk.id}.includes.${idx}`}
                    value={inc}
                    onChange={(v) => {
                      const newIncludes = [...pk.includes];
                      newIncludes[idx] = v;
                      const next = q.packages.map((x) =>
                        x.id === pk.id ? { ...x, includes: newIncludes } : x,
                      );
                      updateModule("quotation", { packages: next });
                    }}
                    placeholder="Feature"
                    className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const next = q.packages.map((x) =>
                      x.id === pk.id
                        ? { ...x, includes: [...x.includes, ""] }
                        : x,
                    );
                    updateModule("quotation", { packages: next });
                  }}
                  className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  <Plus className="size-3" strokeWidth={2.4} />
                  Add Feature
                </button>
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                <span className="text-xs font-bold text-muted-foreground">
                  Timeline
                </span>
                <BilingualField
                  fieldPath={`quotation.packages.${pk.id}.timeline`}
                  value={pk.timeline}
                  onChange={(v) => {
                    const next = q.packages.map((x) =>
                      x.id === pk.id ? { ...x, timeline: v } : x,
                    );
                    updateModule("quotation", { packages: next });
                  }}
                  placeholder="e.g. 1-2 weeks"
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold text-foreground w-full"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updateModule("quotation", {
                packages: [
                  ...q.packages,
                  {
                    id: `pk-${Date.now()}`,
                    name: "",
                    price: 0,
                    cadence: "per month",
                    description: "",
                    includes: [],
                    timeline: "",
                  },
                ],
              })
            }
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add Package
          </button>
        </div>
      </ModuleSubItem>
    </div>
  );
}
