"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ProposalRecord } from "@/lib/types/proposal";
import { ProposalRow } from "@/components/client-relations-management/proposals/proposal-row";
import { ProposalServiceBadge } from "@/components/client-relations-management/proposals/proposal-service-badge";
import { ProposalCountryBadge } from "@/components/client-relations-management/proposals/proposal-country-badge";
import { ProposalLanguageBadge } from "@/components/client-relations-management/proposals/proposal-language-badge";
import { ProposalActions } from "@/components/client-relations-management/proposals/proposal-actions";

interface LatestProposalsTableProps {
  proposals: ProposalRecord[];
  onView?: (proposal: ProposalRecord) => void;
  onExport?: (proposal: ProposalRecord) => void;
  onDuplicate?: (proposal: ProposalRecord) => void;
}

/**
 * Latest Proposals table — Figma 2222:7686.
 *
 *   The table is a flex row of columns, NOT a CSS grid. Each column has
 *   its header at top and a flex-col body with consistent vertical gaps
 *   between data rows.
 *
 *   Column gaps (Figma):
 *     Headline col body: gap-[41px]   (file-row is 32px tall)
 *     Service col body : gap-[54px]   (badge is ~22px)
 *     Client col body  : gap-[39px]   (avatar+name is 20px tall)
 *     Country col body : gap-[54px]
 *     Created col body : gap-[60px]   (text is ~14px)
 *     Expires col body : gap-[60px]
 *     Language col body: gap-[53px]   (text is ~22.4px)
 *     Actions col body : gap-[48px]   (button is 28px tall)
 *
 *   Headers: Janna Bold 14px / leading-16 / #343434, with 16×10 chevron-down
 *   icon next to label (gap-[8px]).
 *
 *   Column → header column gap is 32px (between header and first data row).
 */
export function LatestProposalsTable({
  proposals,
  onView,
  onExport,
  onDuplicate,
}: LatestProposalsTableProps) {
  return (
    <div className="flex items-start justify-between gap-[24px] w-full">
      {/* Proposal Headline column */}
      <Column header={<Header label="Proposal Headline" />} bodyGap={41}>
        {proposals.map((p) => (
          <div key={p.id} className="h-[32px]">
            <ProposalRow proposal={p} />
          </div>
        ))}
      </Column>

      {/* Service column */}
      <Column
        header={<Header label="Service" sortable />}
        bodyGap={54}
        align="center">
        {proposals.map((p) => (
          <ProposalServiceBadge key={p.id} service={p.service} />
        ))}
      </Column>

      {/* Client column */}
      <Column header={<Header label="Client" />} bodyGap={39}>
        {proposals.map((p) => (
          <div key={p.id} className="flex items-center gap-[8px]">
            <Avatar className="size-[20px]">
              <AvatarImage src={p.client.avatar} />
              <AvatarFallback>{p.client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-bold text-[14px] leading-[16px] text-[#707070] whitespace-nowrap">
              {p.client.name}
            </span>
          </div>
        ))}
      </Column>

      {/* Country column */}
      <Column
        header={<Header label="Country" sortable />}
        bodyGap={54}
        align="center">
        {proposals.map((p) => (
          <ProposalCountryBadge key={p.id} market={p.market} />
        ))}
      </Column>

      {/* Created column */}
      <Column
        header={<Header label="Created" sortable />}
        bodyGap={60}
        align="center">
        {proposals.map((p) => (
          <span
            key={p.id}
            className="font-bold text-[14px] leading-[16px] text-[#707070] whitespace-nowrap">
            {formatDate(p.createdAt)}
          </span>
        ))}
      </Column>

      {/* Expires column */}
      <Column
        header={<Header label="Expires" sortable />}
        bodyGap={60}
        align="center">
        {proposals.map((p) => {
          const expired = new Date(p.expiresAt) < new Date();
          return (
            <span
              key={p.id}
              className={cn(
                "font-bold text-[14px] leading-[16px] whitespace-nowrap",
                expired ? "text-[#f55050]" : "text-[#707070]",
              )}>
              {formatDate(p.expiresAt)}
            </span>
          );
        })}
      </Column>

      {/* Language column */}
      <Column
        header={<Header label="Language" sortable />}
        bodyGap={53}
        align="center">
        {proposals.map((p) => (
          <ProposalLanguageBadge key={p.id} language={p.language} />
        ))}
      </Column>

      {/* Actions column */}
      <Column header={<Header label="Actions" />} bodyGap={48}>
        {proposals.map((p) => (
          <ProposalActions
            key={p.id}
            onDownload={() => onExport?.(p)}
            onView={() => onView?.(p)}
            onCopy={() => onDuplicate?.(p)}
          />
        ))}
      </Column>
    </div>
  );
}

function Column({
  header,
  bodyGap,
  align = "start",
  children,
}: {
  header: React.ReactNode;
  bodyGap: number;
  align?: "start" | "center";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start shrink-0",
        align === "center" && "items-center",
      )}
      style={{ gap: 32 /* header → first row */ }}>
      {header}
      <div
        className={cn(
          "flex flex-col",
          align === "center" ? "items-center" : "items-start",
        )}
        style={{ gap: bodyGap }}>
        {children}
      </div>
    </div>
  );
}

function Header({ label, sortable }: { label: string; sortable?: boolean }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="font-bold text-[14px] leading-[16px] text-[#343434] whitespace-nowrap">
        {label}
      </span>
      {sortable ? (
        <ChevronDown
          className="size-[16px] text-[#707070]"
          strokeWidth={2.2}
        />
      ) : null}
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
