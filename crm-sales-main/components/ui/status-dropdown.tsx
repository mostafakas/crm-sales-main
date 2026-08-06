"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type EmployeeStatus =
  | "Online"
  | "Meeting"
  | "Break"
  | "IDLE"
  | "Offline";

export const statusConfig: Record<
  EmployeeStatus,
  { color: string; darkColor: string; lightBg: string }
> = {
  Online:  { color: "var(--success)", darkColor: "var(--success)", lightBg: "bg-success/10" },
  Meeting: { color: "var(--warning)", darkColor: "var(--warning)", lightBg: "bg-warning/10" },
  Break:   { color: "var(--pink)", darkColor: "var(--pink)", lightBg: "bg-pink-10" },
  IDLE:    { color: "var(--indigo)", darkColor: "var(--indigo)", lightBg: "bg-indigo-10" },
  Offline: { color: "var(--muted-foreground)", darkColor: "var(--text-disabled)", lightBg: "bg-muted/10" },
};


interface StatusDropdownProps {
  status: EmployeeStatus;
  onStatusChange?: (status: EmployeeStatus) => void;
  theme?: "light" | "dark";
}

export function StatusDropdown({
  status,
  onStatusChange,
  theme = "light",
}: StatusDropdownProps) {
  const config = statusConfig[status];
  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] h-[24px] cursor-pointer hover:opacity-80 transition-all outline-none",
          isDark ? "backdrop-blur-md" : config.lightBg,
        )}
        style={
          isDark
            ? { backgroundColor: `${config.darkColor}1A` }
            : undefined
        }>
        <span
          className="text-sm font-bold leading-[14px]"
          style={{ color: isDark ? config.darkColor : config.color }}>
          {status}
        </span>

        <ChevronDown
          className="size-[10px]"
          style={{ color: isDark ? config.darkColor : config.color }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          "w-[140px] rounded-[10px] p-1 shadow-xl border",
          isDark
            ? "bg-[#1a1a2e] border-white/10 "
            : "bg-background border-border",
        )}>

        {(Object.keys(statusConfig) as EmployeeStatus[]).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onStatusChange?.(s)}
            className={cn(
              "flex items-center justify-between px-3 py-2 cursor-pointer rounded-[6px] transition-colors",
              isDark
                ? "hover:bg-white/10 focus:bg-white/10 "
                : "hover:bg-secondary focus:bg-secondary",
            )}>

            <div className="flex items-center gap-2">
              <div
                className="size-2 rounded-full backdrop-blur-md"
                style={{ backgroundColor: statusConfig[s].color }}
              />
              <span
                className={cn(
                  "text-sm font-bold",
                  status === s
                    ? isDark
                      ? "text-white"
                      : "text-primary"
                    : isDark
                      ? "text-white/60"
                      : "text-muted-foreground",
                )}>
                {s}
              </span>

            </div>
            {status === s && (
              <Check
                className={cn(
                  "size-3",
                  isDark ? "text-white " : "text-primary",
                )}
              />
            )}

          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
