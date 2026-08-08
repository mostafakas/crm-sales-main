"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { ImageUploadField } from "../image-upload-field";
import { BilingualField } from "../bilingual-field";

export function AboutBrandsPanel() {
  const { draft, updateModule } = useProposalDraft();
  const about = draft.about;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    brands: true,
    partners: true,
  });

  const t = (k: string) => () =>
    setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Brands Trust Us"
        open={open.brands}
        onToggle={t("brands")}
        >
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground font-bold">
            Leave this empty to use the default AlMaster brand logos. Add logos here to override them for this specific proposal.
          </p>
          {about.brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-3">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const next = about.brands.filter((x) => x.id !== brand.id);
                    updateModule("about", { brands: next });
                  }}
                  className="text-xs font-bold text-destructive hover:underline">
                  Remove
                </button>
              </div>
              <div className="flex items-start gap-4">
                <ImageUploadField
                  variant="avatar"
                  value={brand.logo || ""}
                  onChange={(url) => {
                    const next = about.brands.map((x) =>
                      x.id === brand.id ? { ...x, logo: url } : x,
                    );
                    updateModule("about", { brands: next });
                  }}
                />
                <div className="flex flex-col gap-2 flex-1">
                  <BilingualField
                    fieldPath={`about.brands.${brand.id}.name`}
                    value={brand.name}
                    onChange={(v) => {
                      const next = about.brands.map((x) =>
                        x.id === brand.id ? { ...x, name: v } : x,
                      );
                      updateModule("about", { brands: next });
                    }}
                    placeholder="Brand Name"
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
                brands: [
                  ...about.brands,
                  {
                    id: `b-${Date.now()}`,
                    name: "",
                    logo: "",
                  },
                ],
              });
            }}
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add Brand
          </button>
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Our Partners"
        open={open.partners}
        onToggle={t("partners")}
        >
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground font-bold">
            Leave this empty to use the default AlMaster partner logos. Add logos here to override them.
          </p>
          {about.partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-background border border-border rounded-[8px] p-3 flex flex-col gap-3">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const next = about.partners.filter((x) => x.id !== partner.id);
                    updateModule("about", { partners: next });
                  }}
                  className="text-xs font-bold text-destructive hover:underline">
                  Remove
                </button>
              </div>
              <div className="flex items-start gap-4">
                <ImageUploadField
                  variant="avatar"
                  value={partner.logo || ""}
                  onChange={(url) => {
                    const next = about.partners.map((x) =>
                      x.id === partner.id ? { ...x, logo: url } : x,
                    );
                    updateModule("about", { partners: next });
                  }}
                />
                <div className="flex flex-col gap-2 flex-1">
                  <BilingualField
                    fieldPath={`about.partners.${partner.id}.name`}
                    value={partner.name}
                    onChange={(v) => {
                      const next = about.partners.map((x) =>
                        x.id === partner.id ? { ...x, name: v } : x,
                      );
                      updateModule("about", { partners: next });
                    }}
                    placeholder="Partner Name"
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
                partners: [
                  ...about.partners,
                  {
                    id: `p-${Date.now()}`,
                    name: "",
                    logo: "",
                  },
                ],
              });
            }}
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add Partner
          </button>
        </div>
      </ModuleSubItem>
    </div>
  );
}
