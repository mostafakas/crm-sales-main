"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
}

/**
 * A layout component for grouping FormField components.
 * Defaults to a responsive grid layout.
 */
export function FormFieldGroup({
  children,
  className,
  cols = 2,
  ...props
}: FormFieldGroupProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn("grid gap-4", gridCols[cols], className)}
      {...props}
    >
      {children}
    </div>
  );
}
