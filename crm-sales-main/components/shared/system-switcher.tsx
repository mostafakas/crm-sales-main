"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SYSTEMS, type SystemId } from "@/lib/systems";
import { useActiveSystem } from "@/hooks/shared/use-active-system";
import { useIsMounted } from "@/hooks/shared/use-is-mounted";

export function SystemSwitcher() {
  const { active, switchTo } = useActiveSystem();
  const mounted = useIsMounted();

  if (!mounted || !active) {
    return (
      <div className="bg-muted p-1.5 rounded-xl flex items-center shrink-0">
        <div className="bg-secondary h-10 w-[240px] rounded-lg" />
      </div>
    );
  }

  const ActiveIcon = active.icon;

  return (
    <div className="bg-muted p-1.5 rounded-xl flex items-center shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-secondary h-10 flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg hover:bg-secondary/80 transition-all outline-none">
          <div className="size-7 rounded-md bg-background flex items-center justify-center shrink-0">
            <ActiveIcon className="size-[14px] text-muted-foreground" strokeWidth={2} />
          </div>
          <span className="font-bold text-sm leading-none text-foreground whitespace-nowrap">
            {active.name}
          </span>
          <ChevronDown className="size-[14px] text-muted-foreground opacity-60" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-[var(--anchor-width)] min-w-[280px] rounded-2xl shadow-2xl border border-border p-2 bg-background">
          {SYSTEMS.map((system) => {
            const isActive = system.id === active.id;
            const Icon = system.icon;
            return (
              <DropdownMenuItem
                key={system.id}
                onClick={() => switchTo(system.id as SystemId)}
                className={cn(
                  "cursor-pointer rounded-xl px-2 py-2 transition-colors flex items-center gap-2.5 outline-none",
                  isActive
                    ? "bg-[#0000FF]/8 text-[#0000FF] focus:bg-[#0000FF]/12"
                    : "text-foreground hover:bg-muted focus:bg-muted",
                )}>
                <div
                  className={cn(
                    "size-7 rounded-md flex items-center justify-center shrink-0",
                    isActive ? "bg-[#0000FF]/15" : "bg-secondary",
                  )}>
                  <Icon
                    className={cn(
                      "size-[14px]",
                      isActive ? "text-[#0000FF]" : "text-muted-foreground",
                    )}
                    strokeWidth={2}
                  />
                </div>
                <span
                  className={cn(
                    "font-bold text-sm truncate",
                    isActive ? "text-[#0000FF]" : "text-foreground",
                  )}>
                  {system.name}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
