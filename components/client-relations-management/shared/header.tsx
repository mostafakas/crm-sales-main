"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Clock, Home, FileText, Plus, Users, LogOut, Bell } from "lucide-react";
import { LiveClock } from "@/components/shared/live-clock";
import { SystemSwitcher } from "@/components/shared/system-switcher";
import { cn } from "@/lib/utils";
import { useAutoLogout } from "@/hooks/use-auto-logout";

interface ClientRelationsHeaderProps {
  onNewProposal?: () => void;
}

const subNav = [
  { label: "Home", href: "/client-relations-management", icon: Home, exact: true },
  { label: "Clients", href: "/client-relations-management/clients", icon: Users },
  { label: "Proposals", href: "/client-relations-management/proposals", icon: FileText },
  { label: "Notifications", href: "/client-relations-management/notifications", icon: Bell },
];

/**
 * CRM top-nav. Pixel-aligned with Figma 2222:7474.
 *
 *  ┌─────────────────┐       ┌────────────────┐ ┌──┐       ┌──────────┐
 *  │ System Switcher │       │ Home  Proposals│ │+│       │ ⏱ time   │
 *  └─────────────────┘       └────────────────┘ └──┘       └──────────┘
 *
 *  Each pill is wrapped in a 52px-tall bg-muted padding box (p-1.5)
 *  with a 40px-tall inner button.
 */
export function ClientRelationsHeader({ onNewProposal }: ClientRelationsHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const handleNew = onNewProposal ?? (() => router.push("/client-relations-management/proposals/new"));
  
  const [notificationCount, setNotificationCount] = React.useState(0);

  React.useEffect(() => {
    const updateCount = () => {
      try {
        const cached = window.localStorage.getItem("almaster:crm:clients");
        if (cached) {
          const clients = JSON.parse(cached);
          const todayStr = new Date().toISOString().split("T")[0];
          const count = clients.filter((c: any) => {
            if (!c.nextActionDate) return false;
            return c.nextActionDate.split("T")[0] === todayStr;
          }).length;
          setNotificationCount(count);
        }
      } catch (e) {}
    };

    updateCount();
    const interval = setInterval(updateCount, 2000);
    window.addEventListener("storage", updateCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  useAutoLogout();

  const handleLogout = () => {
    document.cookie = "almaster-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <header className="h-16 shrink-0 bg-background flex items-center justify-between sticky top-0 z-10 px-6 border-b border-border gap-3">
      {/* Left: System Switcher */}
      <div className="flex items-center gap-2 shrink-0">
        <SystemSwitcher />
      </div>

      {/* Center: Home + Proposals + Plus */}
      <div className="flex items-center gap-2 shrink-0">
        <PillWrapper>
          <nav className="flex items-center gap-2 h-10">
            {subNav.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "h-10 flex items-center gap-3 px-3 rounded-[8px] transition-all outline-none cursor-pointer relative",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-secondary text-foreground hover:bg-secondary/80",
                    )}>
                    <Icon className="size-3.5" strokeWidth={2.2} />
                    <span className="text-sm font-bold leading-none">
                      {item.label}
                    </span>
                    {item.label === "Notifications" && notificationCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </PillWrapper>

        <PillWrapper>
          <button
            type="button"
            onClick={handleNew}
            aria-label="New proposal"
            className="size-10 bg-primary text-primary-foreground flex items-center justify-center rounded-[8px] hover:bg-primary/90 transition-all outline-none shadow-lg shadow-primary/20">
            <Plus className="size-3.5" strokeWidth={2.4} />
          </button>
        </PillWrapper>
      </div>

      {/* Right: Time */}
      <div className="flex items-center shrink-0">
        <PillWrapper>
          <div className="bg-primary/10 h-10 flex items-center gap-3 rounded-[8px] px-3">
            <Clock className="size-3.5 text-primary" strokeWidth={2.2} />
            <LiveClock className="text-sm font-bold text-primary leading-none tabular-nums whitespace-nowrap" />
          </div>
        </PillWrapper>
        <PillWrapper>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="size-10 bg-destructive/10 text-destructive flex items-center justify-center rounded-[8px] hover:bg-destructive hover:text-white transition-all outline-none"
          >
            <LogOut className="size-3.5" strokeWidth={2.4} />
          </button>
        </PillWrapper>
      </div>
    </header>
  );
}

function PillWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted p-1.5 rounded-[12px] flex items-center">
      {children}
    </div>
  );
}
