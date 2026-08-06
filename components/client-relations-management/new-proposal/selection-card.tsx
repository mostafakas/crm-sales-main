"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  /**
   * Brand tone used when selected. Drives the background tint, border,
   * check pill, and (where applicable) the title color of the card.
   */
  tone?: "primary" | "saudi" | "egypt" | "global";
}

/**
 * Selection card used across Step 01 — Figma 2222:11695.
 *
 * Active state: `bg-[rgba(0,71,255,0.1)] border border-[#0047ff]
 * p-[16px] rounded-[8px]` with a 20×20 circular check in the top-right.
 *
 * Inactive: `bg-white border border-[#e2e8f0]`.
 *
 * The `tone` prop overrides the title/check colors when selected so the
 * country cards render in their brand color.
 */
export function SelectionCard({
  selected,
  onClick,
  className,
  children,
  tone = "primary",
}: SelectionCardProps) {
  const activeStyles = {
    primary: {
      bg: "bg-[rgba(0,71,255,0.1)]",
      border: "border-[#0047ff]",
      check: "bg-[#0047ff] text-white",
    },
    saudi: {
      bg: "bg-[rgba(0,71,255,0.1)]",
      border: "border-[#0047ff]",
      check: "bg-[#0047ff] text-white",
    },
    egypt: {
      bg: "bg-[rgba(0,71,255,0.1)]",
      border: "border-[#0047ff]",
      check: "bg-[#0047ff] text-white",
    },
    global: {
      bg: "bg-[rgba(0,71,255,0.1)]",
      border: "border-[#0047ff]",
      check: "bg-[#0047ff] text-white",
    },
  } as const;

  const s = activeStyles[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full p-[16px] text-left transition-colors outline-none rounded-[8px] border",
        selected
          ? cn(s.bg, s.border)
          : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1]",
        className,
      )}>
      {selected ? (
        <span
          className={cn(
            "absolute top-[16px] right-[16px] size-[20px] rounded-full flex items-center justify-center",
            s.check,
          )}>
          <Check className="size-3" strokeWidth={3} />
        </span>
      ) : null}
      {children}
    </button>
  );
}

/**
 * Section heading row — title left, hint right.
 *   Title: Janna Bold 14px / leading-22.4 / #343434
 *   Hint : Janna Bold 12px / leading-16.5 / #64748b
 */
export function WizardFieldSection({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[6px] w-full">
      <div className="flex gap-[8px] items-center w-full">
        <p className="flex-1 font-bold text-[14px] leading-[22.4px] text-[#343434]">
          {label}
        </p>
        {hint ? (
          <div className="text-[12px] leading-[16.5px] text-[#64748b] font-bold whitespace-nowrap">
            {hint}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
