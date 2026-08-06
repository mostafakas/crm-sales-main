"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  savedAt?: string;
}

/**
 * Step header — Figma 2222:12923.
 *
 *   gap-[12px] items-start
 *   Icon: bg-[#0047ff] size-[40px] rounded-[10px] p-[5px], 15px inner icon (white)
 *   Text col gap-[8px]:
 *     Title: Janna Bold 22px / leading-20 / #0047ff
 *     Hint : Janna Bold 14px / leading-16.5 / #707070
 *
 *   Right-side "All changes saved" badge:
 *     bg-[rgba(0,71,255,0.1)] h-[40px] px-[12px] rounded-[8px] gap-[8px]
 *     14×14 check icon + 14px text leading-22.4 #0047ff
 */
export function WizardStepHeader({
  icon: Icon,
  title,
  subtitle,
  savedAt = "All changes saved",
}: WizardStepHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-[16px] w-full">
      <div className="flex gap-[12px] items-start">
        <div className="size-[40px] bg-[#0047ff] rounded-[10px] flex items-center justify-center shrink-0">
          <Icon className="size-[15px] text-white" strokeWidth={2.4} />
        </div>
        <div className="flex flex-col gap-[8px] items-start">
          <h1 className="font-bold text-[22px] leading-[20px] text-[#0047ff] whitespace-nowrap">
            {title}
          </h1>
          <p className="font-bold text-[14px] leading-[16.5px] text-[#707070]">
            {subtitle}
          </p>
        </div>
      </div>

      <SavedBadge label={savedAt} />
    </div>
  );
}

function SavedBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[8px] px-[12px] h-[40px] rounded-[8px] bg-[rgba(0,71,255,0.1)]",
      )}>
      <Check className="size-[14px] text-[#0047ff]" strokeWidth={2.4} />
      <span className="font-bold text-[14px] leading-[22.4px] text-[#0047ff] whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}
