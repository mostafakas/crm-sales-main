"use client";

import * as React from "react";
import { Database, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProposalsStatVariant =
  | "neutral"
  | "saudi"
  | "egypt"
  | "global"
  | "drafted";

interface ProposalsStatCardProps {
  variant: ProposalsStatVariant;
  label: string;
  value: number | string;
  hint?: string;
  /** Optional flag emoji (Saudi/Egypt/Global). Rendered inside a small
   * white pill. Falls back to the variant icon. */
  flag?: string;
  /** Icon for neutral + drafted variants. */
  icon?: React.ElementType;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * KPI card — Figma frames 2222:7538/7544/7561/7594/7602.
 *
 * Exact specs:
 *   - h-[116px] p-[16px] gap-[12px] rounded-[8px]
 *   - Label  : Janna Bold 14px / leading-20
 *   - Number : Janna Bold 24px / leading-20
 *   - Hint   : Janna Bold 14px / leading-20  (same as label!)
 *
 * Colored variants (Saudi/Egypt/Global) place a 14×12 flag inside a
 * white #f8fafc pill (w-20 h-18 rounded-[4px]). Neutral + Drafted show
 * a 16px lucide icon inline.
 */
export function ProposalsStatCard({
  variant,
  label,
  value,
  hint,
  flag,
  icon: Icon,
  selected,
  onClick,
}: ProposalsStatCardProps) {
  const bg =
    variant === "neutral"
      ? "bg-[#edf2f7]"
      : variant === "saudi"
        ? "bg-[#006c35]"
        : variant === "egypt"
          ? "bg-[#ec1c24]"
          : variant === "global"
            ? "bg-[#0047ff]"
            : "bg-[#707070]";

  const textColor =
    variant === "neutral" ? "text-[#343434]" : "text-white";

  const DefaultIcon = variant === "drafted" ? Box : Database;
  const RenderIcon = Icon ?? DefaultIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full h-[116px] p-[16px] flex flex-col gap-[12px] items-start rounded-[8px] outline-none text-left transition-shadow",
        bg,
        onClick && "cursor-pointer hover:brightness-95",
        selected && "ring-2 ring-foreground/30 ring-offset-2 ring-offset-background",
      )}>
      {/* Row 1: label + trailing icon/flag */}
      <div className="flex items-center justify-between w-full">
        <span
          className={cn(
            "font-bold text-[14px] leading-[20px] whitespace-nowrap",
            textColor,
          )}>
          {label}
        </span>

        {flag ? (
          <span className="bg-[#f8fafc] w-[20px] h-[18px] flex items-center justify-center rounded-[4px] text-[12px] leading-none">
            {flag}
          </span>
        ) : (
          <RenderIcon
            className={cn("size-[16px]", textColor)}
            strokeWidth={2}
          />
        )}
      </div>

      {/* Row 2: big number */}
      <span
        className={cn(
          "font-bold text-[24px] leading-[20px] w-full tabular-nums",
          textColor,
        )}>
        {value}
      </span>

      {/* Row 3: hint */}
      {hint ? (
        <span
          className={cn(
            "font-bold text-[14px] leading-[20px] w-full",
            textColor,
          )}>
          {hint}
        </span>
      ) : null}
    </button>
  );
}
