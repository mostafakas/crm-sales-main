"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichTextArea } from "./rich-text-area";
import { useProposalDraft } from "./proposal-draft-context";

interface BilingualRichTextProps {
  /** Stable identifier for this field. Used as the key into draft.arOverrides. */
  fieldPath: string;
  /** English value (drives the EN editor). */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  arPlaceholder?: string;
  className?: string;
  minHeight?: number;
}

/**
 * Bilingual wrapper around {@link RichTextArea}.
 *
 * When the proposal language is `"both"`, renders two editors side by
 * side: EN on the left (LTR), AR on the right (RTL) with Janna font.
 * Both sides write into the draft — EN via the supplied `onChange`,
 * AR via the `setArOverride` action keyed by `fieldPath`.
 *
 * In monolingual mode it falls through to a single RichTextArea so the
 * rest of the panels stay unchanged.
 */
export function BilingualRichText({
  fieldPath,
  value,
  onChange,
  placeholder,
  arPlaceholder = "اكتب هنا…",
  className,
  minHeight = 96,
}: BilingualRichTextProps) {
  const { draft, setArOverride } = useProposalDraft();
  const bilingual = draft.language === "both";
  const arValue = draft.arOverrides?.[fieldPath] ?? "";

  if (!bilingual) {
    return (
      <RichTextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        minHeight={minHeight}
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
        <Languages className="size-3" strokeWidth={2.4} />
        Bilingual content — fill both sides
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* English (LTR) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0047FF]">
            English
          </span>
          <div dir="ltr">
            <RichTextArea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              minHeight={minHeight}
            />
          </div>
        </div>

        {/* Arabic (RTL) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9359FF]">
            العربية
          </span>
          <div dir="rtl" className="font-arabic">
            <RichTextArea
              value={arValue}
              onChange={(v) => setArOverride(fieldPath, v)}
              placeholder={arPlaceholder}
              minHeight={minHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
