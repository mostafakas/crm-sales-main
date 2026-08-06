"use client";

import * as React from "react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { RichTextArea } from "../rich-text-area";
import { ImageUploadField } from "../image-upload-field";
import { BilingualField } from "../bilingual-field";

export function ServiceModulePanel() {
  const { draft, updateModule } = useProposalDraft();
  const service = draft.serviceDetails;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    service: true,
    image: true,
    overview: true,
    deliverables: true,
    tech: true,
    more: true,
  });
  const t = (k: string) => () =>
    setOpen((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Service"
        open={open.service}
        onToggle={t("service")}
        >
        <div className="grid grid-cols-[1fr_140px] gap-2 items-start">
          <BilingualField
            fieldPath="service.serviceName"
            value={service.serviceName}
            onChange={(v) => updateModule("service", { serviceName: v })}
            className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold text-foreground w-full"
            placeholder="Service name"
          />
          <input
            type="text"
            value={service.serviceIcon}
            onChange={(e) =>
              updateModule("service", { serviceIcon: e.target.value })
            }
            className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold text-foreground w-full"
            placeholder="Icon"
          />
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Image"
        open={open.image}
        onToggle={t("image")}
        >
        <ImageUploadField
          value={service.imageUrl}
          onChange={(url) =>
            updateModule("service", { imageUrl: url, showImage: true })
          }
          aspect="16/9"
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Overview"
        open={open.overview}
        onToggle={t("overview")}
        >
        <RichTextArea
          fieldPath="service.overview"
          value={service.overview}
          onChange={(v) => updateModule("service", { overview: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Key Deliverables"
        open={open.deliverables}
        onToggle={t("deliverables")}
        >
        <RichTextArea
          fieldPath="service.keyDeliverables"
          value={service.keyDeliverables}
          onChange={(v) => updateModule("service", { keyDeliverables: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Technologies We Use"
        open={open.tech}
        onToggle={t("tech")}
        >
        <div className="flex flex-col gap-2">
          {service.technologies.map((group) => (
            <div
              key={group.id}
              className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {group.name}
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 h-[18px] inline-flex items-center rounded-[4px]">
                  {group.technologies.length}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-2 items-start">
                <BilingualField
                  fieldPath={`service.technologies.${group.id}.name`}
                  value={group.name}
                  onChange={(v) => {
                    const next = service.technologies.map((x) =>
                      x.id === group.id ? { ...x, name: v } : x,
                    );
                    updateModule("service", { technologies: next });
                  }}
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                  placeholder="Group name"
                />
                <input
                  type="text"
                  value={group.icon ?? ""}
                  onChange={(e) => {
                    const next = service.technologies.map((x) =>
                      x.id === group.id
                        ? { ...x, icon: e.target.value }
                        : x,
                    );
                    updateModule("service", { technologies: next });
                  }}
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                  placeholder="Icon"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 h-[22px] rounded-[6px] text-[10px] font-bold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="More Details about Service"
        open={open.more}
        onToggle={t("more")}
        >
        <RichTextArea
          fieldPath="service.moreDetails"
          value={service.moreDetails}
          onChange={(v) => updateModule("service", { moreDetails: v })}
        />
      </ModuleSubItem>
    </div>
  );
}
