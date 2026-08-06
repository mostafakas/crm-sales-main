"use client";

import * as React from "react";
import { User, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalCoverPreviewProps {
  headline?: string;
  subtitle?: string;
  client?: string;
  date?: string;
  validTill?: string;
  className?: string;
}

/**
 * Approximation of the AL Master proposal cover. Matches the wording &
 * layout of the actual proposal template (page 1):
 *
 *   ─ ALmaster mark (top-left)        Arabic decorative text (top-right)
 *   ─ Website Project Proposal        (big white heading)
 *   ─ "Development of a new full website…" (subtitle)
 *   ─ [Prepared For] [Date] [Valid Till] chips
 *   ─ Address / CR No / Email / Website footer strip
 */
export function ProposalCoverPreview({
  headline = "Website Project Proposal",
  subtitle = "Development Of A New Full Website For Client's Real Estate Company",
  client = "Client Name",
  date = "October 30, 2025",
  validTill = "November 14, 2025 · 14 Days",
  className,
}: ProposalCoverPreviewProps) {
  return (
    <div
      className={cn(
        "relative w-full aspect-[16/10] overflow-hidden rounded-[10px] bg-[#0B1486] text-white",
        className,
      )}>
      {/* Background gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% -10%, rgba(99,102,241,0.55), transparent 55%), radial-gradient(120% 80% at -10% 110%, rgba(0,71,255,0.55), transparent 55%), linear-gradient(135deg, #0B1486 0%, #1B2BC0 50%, #0030FF 100%)",
        }}
      />

      {/* Subtle diagonal weave */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, transparent 0 18px, #FFFFFF 18px 19px)",
        }}
      />

      <div className="absolute inset-0 px-[6%] py-[7%] flex flex-col">
        {/* Top row: ALmaster mark + Arabic */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-[2px] bg-white/85" />
            <span className="text-[8px] font-bold tracking-[0.18em] text-white/85">
              ALMASTER
            </span>
          </div>
          <span
            dir="rtl"
            className="text-[8px] font-bold tracking-[0.18em] text-white/75">
            الشكل الزين • زيلة ماسلر
          </span>
        </div>

        {/* Middle: headline + subtitle + chips */}
        <div className="mt-auto flex flex-col gap-[6px]">
          <h3 className="text-[clamp(13px,1.6vw,22px)] font-bold leading-tight">
            {headline}
          </h3>
          <p className="text-[clamp(7px,0.7vw,10px)] font-bold leading-snug text-white/80 max-w-[80%]">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <CoverChip icon={User} label={`Prepared For: ${client}`} />
            <CoverChip icon={Calendar} label={`Date: ${date}`} />
            <CoverChip icon={Clock} label={`Valid Till: ${validTill}`} />
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[6px] font-bold text-white/60 tracking-wide">
          <span className="truncate">
            Adress: Riyadh, Thumamah Road, Al Yasmin District · Phone:
            +966582700000
          </span>
          <span className="truncate ml-2">almaster.tech</span>
        </div>
      </div>
    </div>
  );
}

function CoverChip({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[7px] font-bold leading-none text-white/95 bg-white/10 backdrop-blur-sm rounded-[3px] px-1.5 py-1">
      <Icon className="size-2" strokeWidth={2.4} />
      {label}
    </span>
  );
}
