"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SYSTEMS,
  type SystemId,
  getSystemById,
  getSystemByPath,
} from "@/lib/systems";

const STORAGE_KEY = "almaster:active-system";

function readStoredSystem(): SystemId | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value && SYSTEMS.some((s) => s.id === value)) {
    return value as SystemId;
  }
  return null;
}

export function useActiveSystem() {
  const router = useRouter();
  const pathname = usePathname();
  const systemFromPath = getSystemByPath(pathname);

  const [activeId, setActiveId] = useState<SystemId | null>(
    systemFromPath?.id ?? null,
  );

  useEffect(() => {
    if (systemFromPath) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveId(systemFromPath.id);
      window.localStorage.setItem(STORAGE_KEY, systemFromPath.id);
      return;
    }
    const stored = readStoredSystem();
    if (stored) setActiveId(stored);
  }, [systemFromPath, systemFromPath?.id]);

  const switchTo = useCallback(
    (id: SystemId) => {
      const target = getSystemById(id);
      window.localStorage.setItem(STORAGE_KEY, target.id);
      setActiveId(target.id);
      router.push(target.href);
    },
    [router],
  );

  const active = activeId ? getSystemById(activeId) : null;

  return { active, activeId, switchTo };
}
