import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("font-bold antialiased transition-colors", {
  variants: {
    variant: {
      // 22px Main Header (Used for dashboard main context)
      display: "text-2xl leading-[20px] tracking-tight-custom",

      // 18px Primary Header (Used for Profile names, heavy sub-headers)
      h1: "text-xl leading-[24px]",

      // 18px Compact Section Header (Used for Your Tasks, Activity Logs)
      h2: "text-xl leading-[20px]",

      // 14px Standard Label/Body (Project's core text size)
      body: "text-md leading-[20px]",

      // 14px Muted color variant
      bodyMuted: "text-md leading-[20px] text-muted-foreground",

      // 12px Metadata Label (Used for interface elements, dates)
      small: "text-sm leading-[20px]",

      // 12px Badge Label (Reduced line-height for status badges)
      label: "text-sm leading-[14px]",

      // 11px Smallest interface labels
      xs: "text-xs leading-[20px]",

      // 10px Grid labels
      tiny: "text-tiny leading-[14px]",

    },
    tabular: {
      true: "tabular-nums",
    },
  },
  defaultVariants: {
    variant: "body",
    tabular: false,
  },
});

export interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

/**
 * Reusable Typography component that maintains strict pixel fidelity with existing design.
 * @param as - The HTML element to render (default: "p")
 * @param variant - The typographic style variant (display, h1, h2, body, bodyMuted, small, label, xs, tiny)
 * @param tabular - Enable tabular-nums for numeric precision
 */
export function Typography({
  className,
  variant,
  tabular,
  as: Component = "p",
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(typographyVariants({ variant, tabular, className }))}
      {...props}
    />
  );
}
