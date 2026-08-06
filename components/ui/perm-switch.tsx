"use client";

import { cn } from "@/lib/utils";

// ON  → blue track  + white thumb (right)
// OFF → white track + blue thumb  (left)
// Thumb is vertically centered via top-1/2 / -translate-y-1/2 so it stays
// centered regardless of whether the track has a border or not.

interface PermSwitchProps {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
}

export function PermSwitch({ checked, onCheckedChange, className }: PermSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 h-[18px] w-[32px] rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer",
        checked ? "bg-primary" : "bg-background border border-border",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 block size-[14px] rounded-full transition-transform duration-200",
          checked
            ? "bg-white translate-x-[16px]"
            : "bg-primary translate-x-[2px]",
        )}
      />

    </button>
  );
}
