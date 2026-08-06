"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormFieldWrapper({ label, error, children, className }: FormFieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full items-start relative", className)}>
      <Label className="text-[#343434] text-[14px] font-bold leading-[22.4px] font-janna">
        {label}
      </Label>
      {children}
      {error && (
        <span className="absolute -bottom-[18px] right-0 text-destructive text-[10px] font-bold font-janna">
          {error}
        </span>
      )}
    </div>
  );
}
