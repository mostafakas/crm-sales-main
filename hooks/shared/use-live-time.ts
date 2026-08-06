"use client";

import { useState, useEffect } from "react";

/**
 * Hook to provide current time, updated every second.
 * Handles hydration issues by only returning time after mounting.
 */
export function useLiveTime() {
  const [time, setTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    time,
    isMounted,
    formattedTime: time
      ? time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "--:--:-- --",
  };
}
