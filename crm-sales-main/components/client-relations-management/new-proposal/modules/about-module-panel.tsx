"use client";

import * as React from "react";
import { Search, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { RichTextArea } from "../rich-text-area";
import { ImageUploadField } from "../image-upload-field";
import { BilingualField } from "../bilingual-field";

export function AboutModulePanel() {
  const { draft, updateModule } = useProposalDraft();
  const about = draft.about;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    image: true,
    whoWeAre: true,
    mission: true,
    vision: true,
    core: true,
    facts: true,
    certs: true,
    experts: true,
  });

  const t = (k: string) => () =>
    setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Image"
        open={open.image}
        onToggle={t("image")}
        
        onSave={() => setOpen((p) => ({ ...p, image: false }))}
        onDiscard={() => setOpen((p) => ({ ...p, image: false }))}>
        <ImageUploadField
          value={about.imageUrl}
          onChange={(url) => updateModule("about", { imageUrl: url })}
          aspect="16/9"
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Who We Are?"
        open={open.whoWeAre}
        onToggle={t("whoWeAre")}
        >
        <RichTextArea
          fieldPath="about.whoWeAre"
          value={about.whoWeAre}
          onChange={(v) => updateModule("about", { whoWeAre: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Our Mission"
        open={open.mission}
        onToggle={t("mission")}
        >
        <RichTextArea
          fieldPath="about.ourMission"
          value={about.ourMission}
          onChange={(v) => updateModule("about", { ourMission: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Our Vision"
        open={open.vision}
        onToggle={t("vision")}
        >
        <RichTextArea
          fieldPath="about.ourVision"
          value={about.ourVision}
          onChange={(v) => updateModule("about", { ourVision: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Core Values"
        open={open.core}
        onToggle={t("core")}
        >
        <div className="flex flex-col gap-2">
          {about.coreValues.map((cv, i) => (
            <div
              key={cv.id}
              className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground inline-flex items-center gap-2">
                  <span className="size-5 rounded-[4px] bg-primary/10 text-primary inline-flex items-center justify-center text-[8px]">
                    {i + 1}
                  </span>
                  {cv.headline}
                </span>
                <button
                  type="button"
                  className="text-xs font-bold text-destructive hover:underline">
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-2 items-start">
                <BilingualField
                  fieldPath={`about.coreValues.${cv.id}.headline`}
                  value={cv.headline}
                  onChange={(v) => {
                    const next = about.coreValues.map((x) =>
                      x.id === cv.id ? { ...x, headline: v } : x,
                    );
                    updateModule("about", { coreValues: next });
                  }}
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold text-foreground w-full"
                  placeholder="Headline"
                />
                <input
                  type="text"
                  value={cv.icon}
                  readOnly
                  className="bg-muted h-9 px-3 rounded-[8px] outline-none text-xs font-bold text-foreground w-full"
                  placeholder="Icon"
                />
              </div>
              <BilingualField
                multiline
                rows={2}
                fieldPath={`about.coreValues.${cv.id}.description`}
                value={cv.description}
                onChange={(v) => {
                  const next = about.coreValues.map((x) =>
                    x.id === cv.id ? { ...x, description: v } : x,
                  );
                  updateModule("about", { coreValues: next });
                }}
                placeholder="Description"
                className="bg-muted px-3 py-2 rounded-[8px] outline-none text-xs font-bold text-foreground w-full resize-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateModule("about", {
                coreValues: [
                  ...about.coreValues,
                  {
                    id: `cv-${Date.now()}`,
                    icon: "innovation",
                    headline: "",
                    description: "",
                  },
                ],
              });
            }}
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add item
          </button>
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Key Facts"
        open={open.facts}
        onToggle={t("facts")}
        >
        <div className="grid grid-cols-2 gap-2">
          {about.keyFacts.map((fact) => (
            <div
              key={fact.id}
              className="bg-background border border-border rounded-[8px] px-3 py-2 flex flex-col gap-2">
              <BilingualField
                fieldPath={`about.keyFacts.${fact.id}.value`}
                value={fact.value}
                onChange={(v) => {
                  const next = about.keyFacts.map((x) =>
                    x.id === fact.id ? { ...x, value: v } : x,
                  );
                  updateModule("about", { keyFacts: next });
                }}
                placeholder="Value"
                className="bg-transparent outline-none text-sm font-bold text-primary w-full"
              />
              <BilingualField
                fieldPath={`about.keyFacts.${fact.id}.label`}
                value={fact.label}
                onChange={(v) => {
                  const next = about.keyFacts.map((x) =>
                    x.id === fact.id ? { ...x, label: v } : x,
                  );
                  updateModule("about", { keyFacts: next });
                }}
                placeholder="Label"
                className="bg-transparent outline-none text-xs font-bold text-foreground w-full"
              />
            </div>
          ))}
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Certifications"
        open={open.certs}
        onToggle={t("certs")}
        
        titleClassName="">
        <div className="flex flex-col gap-2">
          {about.certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-background border border-border rounded-[8px] px-3 py-2 flex items-center gap-3">
              <div className="size-9 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                ISO
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-xs font-bold text-foreground truncate">
                  {cert.title}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  By: {cert.issuer} · Date: {cert.date}
                </span>
              </div>
              <input
                type="checkbox"
                checked={cert.visible}
                onChange={(e) => {
                  const next = about.certifications.map((x) =>
                    x.id === cert.id
                      ? { ...x, visible: e.target.checked }
                      : x,
                  );
                  updateModule("about", { certifications: next });
                }}
                className="size-4"
              />
            </div>
          ))}
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Our Experts"
        open={open.experts}
        onToggle={t("experts")}
        >
        <div className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-2">
          <div className="bg-muted h-9 px-3 rounded-[6px] flex items-center gap-2">
            <Search className="size-3 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name or role..."
              className="bg-transparent outline-none text-xs font-bold w-full"
            />
          </div>
          {about.experts.map((expert) => (
            <label
              key={expert.id}
              className="flex items-center gap-3 px-2 py-2 rounded-[6px] hover:bg-muted cursor-pointer">
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
              <Avatar className="size-7">
                <AvatarImage src={expert.avatar} />
                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-xs font-bold text-foreground truncate">
                  {expert.name}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground truncate">
                  {expert.role}
                </span>
              </div>
            </label>
          ))}
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            {about.experts
              .filter((e) => e.selected)
              .map((e) => (
                <span
                  key={e.id}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 h-[22px] rounded-[6px] text-[10px] font-bold">
                  <Avatar className="size-3.5">
                    <AvatarImage src={e.avatar} />
                    <AvatarFallback>{e.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {e.name}
                </span>
              ))}
          </div>
        </div>
      </ModuleSubItem>
    </div>
  );
}
