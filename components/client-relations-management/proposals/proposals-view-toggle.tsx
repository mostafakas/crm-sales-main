"use client";

import * as React from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProposalsViewMode = "list" | "grid";

export interface ProposalsViewToggleProps {
  value: ProposalsViewMode;
  onChange: (value: ProposalsViewMode) => void;
  className?: string;
}

/**
 * List / Grid toggle — Figma 2222:7619.
 *
 *   - Container : bg-[#edf2f7] h-[40px] gap-[6px] px-[4px] rounded-[8px]
 *   - Inner pill: h-[32px] px-[12px] py-[8px] rounded-[8px]
 *       active   = bg-[#0047ff] (white icon)
 *       inactive = bg-[#edf2f7] (muted icon)
 *   - Icons: 12×12
 */
export function ProposalsViewToggle({
  value,
  onChange,
  className,
}: ProposalsViewToggleProps) {
  const segments: { key: ProposalsViewMode; icon: React.ElementType }[] = [
    { key: "list", icon: List },
    { key: "grid", icon: LayoutGrid },
  ];

  return (
    <div
      className={cn(
        "bg-[#edf2f7] h-[40px] flex items-center justify-center gap-[6px] px-[4px] rounded-[8px]",
        className,
      )}>
      {segments.map(({ key, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            aria-label={`${key} view`}
            className={cn(
              "h-[32px] px-[12px] py-[8px] flex items-center justify-center rounded-[8px] outline-none transition-colors",
              active
                ? "bg-[#0047ff] text-white"
                : "bg-[#edf2f7] text-[#707070] hover:bg-[#dfe5ec]",
            )}>
            <Icon className="size-[12px]" strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
}
