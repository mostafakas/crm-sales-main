"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProposalLangVariant } from "@/lib/proposal-layout";

/**
 * EN / AR segmented switch used to preview either language of a bilingual
 * ("both") proposal in Step 2's live preview and Step 3's review.
 */
export function LanguageToggle({
  value,
  onChange,
  className,
}: {
  value: ProposalLangVariant;
  onChange: (v: ProposalLangVariant) => void;
  className?: string;
}) {
  const options: { id: ProposalLangVariant; label: string }[] = [
    { id: "english", label: "EN" },
    { id: "arabic", label: "AR" },
  ];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 bg-muted rounded-[8px] p-[3px]",
        className,
      )}>
      <Languages
        className="size-3 text-muted-foreground mx-1 shrink-0"
        strokeWidth={2.2}
      />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={cn(
            "h-6 px-2.5 rounded-[6px] text-[11px] font-bold leading-none transition-colors outline-none",
            value === o.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
