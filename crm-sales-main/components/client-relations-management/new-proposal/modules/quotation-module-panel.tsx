"use client";

import * as React from "react";
import { Plus, Receipt, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProposalDraft } from "../proposal-draft-context";
import { ModuleSubItem } from "../module-shell";
import { RichTextArea } from "../rich-text-area";
import { BilingualField } from "../bilingual-field";
import { Switch } from "@/components/ui/switch";
import type { QuotationMode } from "@/lib/types/proposal-draft";

export function QuotationModulePanel() {
  const { draft, updateModule } = useProposalDraft();
  const q = draft.quotation;
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    list: true,
    payment: true,
    notes: true,
  });
  const t = (k: string) => () =>
    setOpen((p) => ({ ...p, [k]: !p[k] }));

  const subtotal = q.lineItems.reduce((sum, li) => sum + li.price, 0);
  const discountAmount = q.applyDiscount
    ? Math.round((subtotal * q.discountPercent) / 100)
    : 0;
  const afterDiscount = subtotal - discountAmount;

  return (
    <div className="flex flex-col gap-3">
      <ModuleSubItem
        title="Quotation (Invoice)"
        open={open.list}
        onToggle={t("list")}
        >
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <ModeButton
            active={q.mode === "quotation"}
            onClick={() => updateModule("quotation", { mode: "quotation" as QuotationMode })}
            icon={Receipt}
            label="Quotation"
          />
          <ModeButton
            active={q.mode === "packages"}
            onClick={() => updateModule("quotation", { mode: "packages" as QuotationMode })}
            icon={Package}
            label="packages"
          />
        </div>

        {q.mode === "quotation" ? (
          <div className="flex flex-col gap-2 mt-2">
            {q.lineItems.map((li, i) => (
              <div key={li.id} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Service {i + 1}
                </span>
                <div className="grid grid-cols-[1fr_120px] gap-2 items-start">
                  <BilingualField
                    fieldPath={`quotation.lineItems.${li.id}.service`}
                    value={li.service}
                    onChange={(v) => {
                      const next = q.lineItems.map((x) =>
                        x.id === li.id ? { ...x, service: v } : x,
                      );
                      updateModule("quotation", { lineItems: next });
                    }}
                    placeholder="Service"
                    className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                  />
                  <div className="bg-background border border-border h-9 px-3 rounded-[8px] flex items-center justify-between">
                    <span className="text-xs font-bold">₪</span>
                    <input
                      type="number"
                      value={li.price}
                      onChange={(e) => {
                        const next = q.lineItems.map((x) =>
                          x.id === li.id
                            ? { ...x, price: Number(e.target.value) }
                            : x,
                        );
                        updateModule("quotation", { lineItems: next });
                      }}
                      className="bg-transparent outline-none text-xs font-bold text-foreground text-right w-full"
                    />
                  </div>
                </div>
                <BilingualField
                  fieldPath={`quotation.lineItems.${li.id}.description`}
                  value={li.description}
                  onChange={(v) => {
                    const next = q.lineItems.map((x) =>
                      x.id === li.id ? { ...x, description: v } : x,
                    );
                    updateModule("quotation", { lineItems: next });
                  }}
                  placeholder="Description"
                  className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                />
              </div>
            ))}

            {/* Subtotal + discount */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
              <span className="text-sm font-bold text-foreground">
                SUBTOTAL QUOTE
              </span>
              <span className="text-sm font-bold text-primary">
                ₪ {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Apply{" "}
                <span className="text-destructive">Discount</span>
              </span>
              <Switch
                checked={q.applyDiscount}
                onCheckedChange={(v) =>
                  updateModule("quotation", { applyDiscount: v })
                }
                size="sm"
              />
              {q.applyDiscount ? (
                <>
                  <div className="bg-background border border-border h-9 px-3 rounded-[8px] flex items-center gap-1">
                    <input
                      type="number"
                      value={q.discountPercent}
                      onChange={(e) =>
                        updateModule("quotation", {
                          discountPercent: Number(e.target.value),
                        })
                      }
                      className="bg-transparent outline-none text-xs font-bold w-12"
                    />
                    <span className="text-xs font-bold">%</span>
                  </div>
                  <div className="bg-background border border-border h-9 px-3 rounded-[8px] flex items-center gap-1">
                    <span className="text-xs font-bold">₪</span>
                    <span className="text-xs font-bold">
                      {discountAmount.toLocaleString()}
                    </span>
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-foreground">
                SUBTOTAL QUOTE After{" "}
                <span className="text-destructive">Discount</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground line-through">
                  {subtotal.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-destructive">
                  ₪ {afterDiscount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <PackagesEditor />
        )}
      </ModuleSubItem>

      <ModuleSubItem
        title="Payment Terms"
        open={open.payment}
        onToggle={t("payment")}
        >
        <div className="flex flex-col gap-2">
          {q.paymentTerms.map((pt, i) => (
            <div key={pt.id} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground">
                {i === 0 ? "1st Payment" : i === 1 ? "2nd Payment" : `${i + 1}th Payment`}
              </span>
              <div className="grid grid-cols-[1fr_120px_80px] gap-2 items-start">
                <BilingualField
                  fieldPath={`quotation.paymentTerms.${pt.id}.label`}
                  value={pt.label}
                  onChange={(v) => {
                    const next = q.paymentTerms.map((x) =>
                      x.id === pt.id ? { ...x, label: v } : x,
                    );
                    updateModule("quotation", { paymentTerms: next });
                  }}
                  placeholder="Label"
                  className="bg-background border border-border h-9 px-3 rounded-[8px] outline-none text-xs font-bold w-full"
                />
                <div className="bg-background border border-border h-9 px-3 rounded-[8px] flex items-center gap-1">
                  <span className="text-xs font-bold">₪</span>
                  <input
                    type="number"
                    value={pt.amount}
                    onChange={(e) => {
                      const next = q.paymentTerms.map((x) =>
                        x.id === pt.id
                          ? { ...x, amount: Number(e.target.value) }
                          : x,
                      );
                      updateModule("quotation", { paymentTerms: next });
                    }}
                    className="bg-transparent outline-none text-xs font-bold w-full text-right"
                  />
                </div>
                <div className="bg-background border border-border h-9 px-3 rounded-[8px] flex items-center gap-1">
                  <input
                    type="number"
                    value={pt.percentage}
                    onChange={(e) => {
                      const next = q.paymentTerms.map((x) =>
                        x.id === pt.id
                          ? { ...x, percentage: Number(e.target.value) }
                          : x,
                      );
                      updateModule("quotation", { paymentTerms: next });
                    }}
                    className="bg-transparent outline-none text-xs font-bold w-full text-right"
                  />
                  <span className="text-xs font-bold">%</span>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updateModule("quotation", {
                paymentTerms: [
                  ...q.paymentTerms,
                  {
                    id: `pt-${Date.now()}`,
                    label: "",
                    amount: 0,
                    percentage: 0,
                  },
                ],
              })
            }
            className="self-start text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Plus className="size-3" strokeWidth={2.4} />
            Add phase
          </button>
        </div>
      </ModuleSubItem>

      <ModuleSubItem
        title="Notes"
        open={open.notes}
        onToggle={t("notes")}
        >
        <RichTextArea
          fieldPath="quotation.notes"
          value={q.notes}
          onChange={(v) => updateModule("quotation", { notes: v })}
        />
      </ModuleSubItem>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-[8px] flex items-center gap-1.5 text-xs font-bold transition-colors outline-none",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
      )}>
      <Icon className="size-3" strokeWidth={2.4} />
      {label}
    </button>
  );
}

function PackagesEditor() {
  const { draft, updateModule } = useProposalDraft();
  const q = draft.quotation;
  return (
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
  );
}
