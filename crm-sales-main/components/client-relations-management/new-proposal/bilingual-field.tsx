"use client";

import * as React from "react";
import { useProposalDraft } from "./proposal-draft-context";
import { useEditMode } from "./module-shell";

interface BilingualFieldProps {
  /** Stable key; the Arabic value is stored at draft.arOverrides[fieldPath]. */
  fieldPath: string;
  /** English value (lives on the field itself). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Classes applied to each underlying input/textarea. */
  className?: string;
  /** Render a textarea instead of an input. */
  multiline?: boolean;
  rows?: number;
  readOnly?: boolean;
}

/**
 * Plain text field with built-in bilingual support.
 *
 * When the proposal language is "both" it stacks an English (LTR) input over
 * an Arabic (RTL) input — the English side writes the field itself, the Arabic
 * side writes `draft.arOverrides[fieldPath]`. Otherwise it renders a single
 * input. Stacking (rather than side-by-side) keeps it drop-in compatible with
 * the existing grid layouts in the module panels.
 */
export function BilingualField({
  fieldPath,
  value,
  onChange,
  placeholder,
  className,
  multiline = false,
  rows = 2,
  readOnly = false,
}: BilingualFieldProps) {
  const { draft, setArOverride } = useProposalDraft();
  const { editing, registerRevert } = useEditMode();
  const bilingual = draft.language === "both";
  const arValue = draft.arOverrides?.[fieldPath] ?? "";

  /* Snapshot on edit-start so "Discard Changes" reverts this field. */
  const enSnap = React.useRef(value);
  const arSnap = React.useRef(arValue);
  React.useEffect(() => {
    if (!editing) return;
    enSnap.current = value;
    arSnap.current = arValue;
    return registerRevert(() => {
      onChange(enSnap.current);
      if (bilingual) setArOverride(fieldPath, arSnap.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const field = (args: {
    dir: "ltr" | "rtl";
    val: string;
    on: (v: string) => void;
    ph?: string;
  }) =>
    multiline ? (
      <textarea
        dir={args.dir}
        value={args.val}
        onChange={(e) => args.on(e.target.value)}
        placeholder={args.ph}
        rows={rows}
        readOnly={readOnly}
        className={className}
      />
    ) : (
      <input
        type="text"
        dir={args.dir}
        value={args.val}
        onChange={(e) => args.on(e.target.value)}
        placeholder={args.ph}
        readOnly={readOnly}
        className={className}
      />
    );

  if (!bilingual) {
    return field({ dir: "ltr", val: value, on: onChange, ph: placeholder });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#0047ff] shrink-0 w-[18px]">
          EN
        </span>
        <div className="flex-1">
          {field({ dir: "ltr", val: value, on: onChange, ph: placeholder })}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#9359ff] shrink-0 w-[18px]">
          AR
        </span>
        <div className="flex-1">
          {field({
            dir: "rtl",
            val: arValue,
            on: (v) => setArOverride(fieldPath, v),
            ph: placeholder,
          })}
        </div>
      </div>
    </div>
  );
}
