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

    </div>
  );
}
