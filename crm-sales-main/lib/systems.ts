import { Contact, type LucideIcon } from "lucide-react";

export type SystemId = "crm";

export interface SystemDefinition {
  id: SystemId;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const SYSTEMS: SystemDefinition[] = [
  {
    id: "crm",
    name: "Client Relations Management",
    shortName: "Client Relations Management",
    description: "Manage proposals, clients, and customer relations.",
    icon: Contact,
    href: "/client-relations-management",
  },
];

export function getSystemById(id: SystemId): SystemDefinition {
  return SYSTEMS.find((s) => s.id === id) ?? SYSTEMS[0];
}

export function getSystemByPath(pathname: string): SystemDefinition | null {
  return (
    SYSTEMS.find((s) => pathname.startsWith(s.href)) ?? null
  );
}
