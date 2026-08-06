"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { BilingualField } from "../bilingual-field";

export function SupportModulePanel() {
  const { draft, updateModule } = useProposalDraft();
  const support = draft.support;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    benefits: true,
    promise: true,
    team: true,
  });
  const t = (k: string) => () =>
    setOpen((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="After Sale Benefits"
        open={open.benefits}
        onToggle={t("benefits")}
        >
        <div className="grid grid-cols-2 gap-2">
          {support.afterSaleBenefits.map((b) => (
            <div
              key={b.id}
              className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-1.5">
              <BilingualField
                fieldPath={`support.afterSaleBenefits.${b.id}.title`}
                value={b.title}
                onChange={(v) => {
                  const next = support.afterSaleBenefits.map((x) =>
                    x.id === b.id ? { ...x, title: v } : x,
                  );
                  updateModule("support", { afterSaleBenefits: next });
                }}
                placeholder="Title"
                className="bg-transparent outline-none text-xs font-bold text-primary w-full"
              />
              <BilingualField
                multiline
                rows={2}
                fieldPath={`support.afterSaleBenefits.${b.id}.description`}
                value={b.description}
                onChange={(v) => {
                  const next = support.afterSaleBenefits.map((x) =>
                    x.id === b.id ? { ...x, description: v } : x,
                  );
                  updateModule("support", { afterSaleBenefits: next });
                }}
                placeholder="Description"
                className="bg-muted px-2 py-1.5 rounded-[6px] outline-none text-[11px] font-bold resize-none w-full"
              />
            </div>
          ))}
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Our Support Promise"
        open={open.promise}
        onToggle={t("promise")}
        >
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "uptime" as const, label: "Uptime" },
            { key: "response" as const, label: "Response time" },
            { key: "warranty" as const, label: "Warranty" },
            { key: "satisfaction" as const, label: "Satisfaction" },
          ].map((k) => (
            <div
              key={k.key}
              className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground">
                {k.label}
              </span>
              <BilingualField
                fieldPath={`support.supportPromise.${k.key}`}
                value={support.supportPromise[k.key]}
                onChange={(v) =>
                  updateModule("support", {
                    supportPromise: {
                      ...support.supportPromise,
                      [k.key]: v,
                    },
                  })
                }
                placeholder={k.label}
                className="bg-transparent outline-none text-xs font-bold text-foreground w-full"
              />
            </div>
          ))}
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Our Support Team"
        open={open.team}
        onToggle={t("team")}
        >
        <div className="flex flex-col gap-2">
          {support.supportTeam.map((m) => (
            <div
              key={m.id}
              className="bg-background border border-border rounded-[8px] p-3 flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={m.avatar} />
                <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid grid-cols-2 gap-2 flex-1 items-start">
                <BilingualField
                  fieldPath={`support.supportTeam.${m.id}.name`}
                  value={m.name}
                  onChange={(v) => {
                    const next = support.supportTeam.map((x) =>
                      x.id === m.id ? { ...x, name: v } : x,
                    );
                    updateModule("support", { supportTeam: next });
                  }}
                  placeholder="Name"
                  className="bg-muted h-8 px-3 rounded-[6px] outline-none text-xs font-bold w-full"
                />
                <BilingualField
                  fieldPath={`support.supportTeam.${m.id}.role`}
                  value={m.role}
                  onChange={(v) => {
                    const next = support.supportTeam.map((x) =>
                      x.id === m.id ? { ...x, role: v } : x,
                    );
                    updateModule("support", { supportTeam: next });
                  }}
                  placeholder="Role"
                  className="bg-muted h-8 px-3 rounded-[6px] outline-none text-xs font-bold w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </ModuleSubItem>
    </div>
  );
}
