"use client";

import { useState, useEffect } from "react";

/**
 * Hook to check if a component is mounted.
 * Useful for avoiding hydration mismatches.
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
