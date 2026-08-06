"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SYSTEMS, type SystemId } from "@/lib/systems";
import { useActiveSystem } from "@/hooks/shared/use-active-system";

interface SystemSelectorProps {
  userName: string;
}

export function SystemSelector({ userName }: SystemSelectorProps) {
  const { activeId, switchTo } = useActiveSystem();
  const [isPending, startTransition] = React.useTransition();
  const [pendingId, setPendingId] = React.useState<SystemId | null>(null);
  const highlightedId = pendingId ?? activeId ?? "crm";

  const handleSelect = (id: SystemId) => {
    if (isPending) return;
    setPendingId(id);
    /* Keep the transition pending (spinner showing) until the destination
     * dashboard route is fully ready, then it unmounts this screen. */
    startTransition(() => switchTo(id));
  };

  return (
    <div className="w-full max-w-[560px] bg-background rounded-[24px] p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col items-center gap-2">
        <div className="size-[72px] rounded-[16px] overflow-hidden">
          <Image
            src="/bluelogo.svg"
            alt="Almaster"
            width={72}
            height={72}
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center mt-3">
          Welcome <span className="text-[#0000FF]">{userName}!</span>
        </h1>
      </div>

      <div className="mt-8">
        <p className="text-md font-bold text-foreground mb-4">
          Select the system you want to enter:
        </p>

        <div className="flex flex-col gap-3">
          {SYSTEMS.map((system) => {
            const isActive = highlightedId === system.id;
            const isLoading = isPending && pendingId === system.id;
            const isDimmed = isPending && pendingId !== system.id;
            const Icon = system.icon;

            return (
              <button
                key={system.id}
                type="button"
                onClick={() => handleSelect(system.id)}
                disabled={isPending}
                aria-busy={isLoading}
                className={cn(
                  "group flex items-center gap-4 w-full p-3 rounded-[14px] transition-all duration-200 outline-none text-left",
                  isActive
                    ? "bg-[#0000FF] text-white shadow-lg shadow-[#0000FF]/25"
                    : "bg-muted text-foreground hover:bg-secondary",
                  isDimmed && "opacity-50",
                  isPending && "cursor-wait",
                )}>
                <div
                  className={cn(
                    "size-12 rounded-[10px] flex items-center justify-center shrink-0 transition-colors",
                    isActive
                      ? "bg-white/15 ring-1 ring-white/25 text-white"
                      : "bg-secondary text-muted-foreground group-hover:text-primary",
                  )}>
                  <Icon className="size-5" strokeWidth={2} />
                </div>

                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <span
                    className={cn(
                      "font-bold text-md leading-tight",
                      isActive ? "text-white" : "text-foreground",
                    )}>
                    {system.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-tight truncate",
                      isActive ? "text-white/85" : "text-muted-foreground",
                    )}>
                    {isLoading ? "Entering…" : system.description}
                  </span>
                </div>

                {isLoading ? (
                  <Loader2
                    className={cn(
                      "size-[18px] shrink-0 animate-spin",
                      isActive ? "text-white" : "text-primary",
                    )}
                  />
                ) : (
                  <ArrowRight
                    className={cn(
                      "size-[18px] shrink-0 transition-transform group-hover:translate-x-0.5",
                      isActive ? "text-white" : "text-primary",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
