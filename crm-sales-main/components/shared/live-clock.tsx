"use client";

import * as React from "react";
import { useLiveTime } from "@/hooks/shared/use-live-time";

interface LiveClockProps {
  className?: string;
}

export function LiveClock({ className }: LiveClockProps) {
  const { formattedTime, isMounted } = useLiveTime();

  if (!isMounted) {
    return (
      <span className={className}>
        --:--:-- --
      </span>
    );
  }

  return (
    <span className={className}>
      {formattedTime}
    </span>
  );
}
