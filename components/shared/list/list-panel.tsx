"use client";

import { cn } from "@/lib/utils";

interface ListPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function ListPanel({ children, className }: ListPanelProps) {
  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

interface ListPanelHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ListPanelHeader({ children, className }: ListPanelHeaderProps) {
  return (
    <div className={cn("shrink-0", className)}>
      {children}
    </div>
  );
}

interface ListPanelBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ListPanelBody({ children, className }: ListPanelBodyProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}
