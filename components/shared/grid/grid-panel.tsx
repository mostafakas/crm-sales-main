"use client";

import { cn } from "@/lib/utils";

interface GridPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GridPanel({ children, className }: GridPanelProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

interface GridPanelHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function GridPanelHeader({ children, className }: GridPanelHeaderProps) {
  return (
    <div className={cn("shrink-0", className)}>
      {children}
    </div>
  );
}

interface GridItemsProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function GridItems({ children, columns = 3, className }: GridItemsProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-4", colClass, className)}>
      {children}
    </div>
  );
}
