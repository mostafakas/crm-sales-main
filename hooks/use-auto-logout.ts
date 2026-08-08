"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 5 minutes in milliseconds
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

export function useAutoLogout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleLogout = () => {
      // Clear the auth cookie
      document.cookie = "almaster-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // Redirect to login
      router.push("/login");
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
    };

    // Events to track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [router]);
}
