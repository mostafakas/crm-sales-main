"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { RichTextArea } from "../rich-text-area";
import { ImageUploadField } from "../image-upload-field";
import { BilingualField } from "../bilingual-field";

export function WhyModulePanel() {
  const { draft, updateModule } = useProposalDraft();
  const why = draft.why;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    why: true,
    perfect: true,
    others: true,
    advantages: true,
  });
  const t = (k: string) => () =>
    setOpen((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Why Choose AlMaster for Your Project?"
        open={open.why}
        onToggle={t("why")}
        >
        <RichTextArea
          fieldPath="why.whyChooseAlMaster"
          value={why.whyChooseAlMaster}
          onChange={(v) => updateModule("why", { whyChooseAlMaster: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Why we're a perfect fit"
        open={open.perfect}
        onToggle={t("perfect")}
        >
        <div className="flex flex-col gap-2">
          {why.whyPerfectFit.map((f, i) => (
            <div key={f.id} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground">
                Feature{i + 1}
              </span>
              <BilingualField
                fieldPath={`why.whyPerfectFit.${f.id}.title`}
                value={f.title}
                onChange={(v) => {
                  const next = why.whyPerfectFit.map((x) =>
                    x.id === f.id ? { ...x, title: v } : x,
                  );
                  updateModule("why", { whyPerfectFit: next });
                }}
                placeholder="Title"
                className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
              />
              <RichTextArea
                fieldPath={`why.whyPerfectFit.${f.id}.description`}
                value={f.description}
                onChange={(v) => {
                  const next = why.whyPerfectFit.map((x) =>
                    x.id === f.id ? { ...x, description: v } : x,
                  );
                  updateModule("why", { whyPerfectFit: next });
                }}
              />
            </div>
          ))}
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="What AlMaster Offers, That Others Don't"
        open={open.others}
        onToggle={t("others")}
        >
        <RichTextArea
          fieldPath="why.whatOthersDont"
          value={why.whatOthersDont}
          onChange={(v) => updateModule("why", { whatOthersDont: v })}
        />
      </ModuleSubItem>

      <ModuleSubItem
        title="Our Distinct Advantages"
        open={open.advantages}
        onToggle={t("advantages")}
        >
        <div className="flex flex-col gap-2">
          {why.distinctAdvantages.map((a, i) => (
            <div key={a.id} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground">
                Feature{i + 1}
              </span>
              <BilingualField
                fieldPath={`why.distinctAdvantages.${a.id}.title`}
                value={a.title}
                onChange={(v) => {
                  const next = why.distinctAdvantages.map((x) =>
                    x.id === a.id ? { ...x, title: v } : x,
                  );
                  updateModule("why", { distinctAdvantages: next });
                }}
                placeholder="Title"
                className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
              />
              <RichTextArea
                fieldPath={`why.distinctAdvantages.${a.id}.description`}
                value={a.description}
                onChange={(v) => {
                  const next = why.distinctAdvantages.map((x) =>
                    x.id === a.id ? { ...x, description: v } : x,
                  );
                  updateModule("why", { distinctAdvantages: next });
                }}
              />
            </div>
          ))}
        </div>
      </ModuleSubItem>

    </div>
  );
}
