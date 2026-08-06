"use client";

import * as React from "react";
import { Download, Eye, Copy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_FORMAT_META,
  PROPOSAL_SERVICE_META,
  type ProposalRecord,
} from "@/lib/types/proposal";
import { ProposalCoverPreview } from "./proposal-cover-preview";
import { ProposalCountryBadge } from "./proposal-country-badge";
import { ProposalLanguageBadge } from "./proposal-language-badge";

export interface ProposalCardProps {
  proposal: ProposalRecord;
  onExport?: (proposal: ProposalRecord) => void;
  onView?: (proposal: ProposalRecord) => void;
  onDuplicate?: (proposal: ProposalRecord) => void;
  className?: string;
}

/**
 * Grid-view proposal card — Figma frame 2222:8849.
 *
 * Padding 12px, gap 12px between rows, 12px outer radius. Cover overlay
 * service badge top-right uses 4px radius pill.
 */
export function ProposalCard({
  proposal,
  onExport,
  onView,
  onDuplicate,
  className,
}: ProposalCardProps) {
  const formatMeta = PROPOSAL_FORMAT_META[proposal.format];
  const serviceMeta = PROPOSAL_SERVICE_META[proposal.service];

  return (
    <div
      className={cn(
        "bg-background border border-border rounded-[12px] p-3 flex flex-col gap-3 hover:shadow-lg hover:border-primary/30 transition-all",
        className,
      )}>
      {/* Cover with service badge overlay */}
      <div className="relative">
        <ProposalCoverPreview headline="Website Project Proposal" />
        <span
          className={cn(
            "absolute top-2 right-2 inline-flex items-center justify-center px-2 h-[22px] rounded-[4px] text-xs leading-none font-bold text-white",
            serviceMeta.solidBg,
          )}>
          {serviceMeta.label}
        </span>
      </div>

      {/* Code + pages + format · language */}
      <div className="flex items-center justify-between text-xs leading-none">
        <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
          <span>{proposal.code}</span>
          <span aria-hidden>•</span>
          <span>{proposal.pages} pages</span>
          <span aria-hidden>•</span>
          <span>{formatMeta.label}</span>
        </div>
        <ProposalLanguageBadge language={proposal.language} />
      </div>

      {/* Headline */}
      <h3 className="text-sm font-bold leading-none text-foreground truncate">
        {proposal.headline}
      </h3>

      {/* Client + country */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="size-[22px]">
            <AvatarImage src={proposal.client.avatar} />
            <AvatarFallback>{proposal.client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs leading-none font-bold text-foreground truncate">
            {proposal.client.name}
          </span>
        </div>
        <ProposalCountryBadge market={proposal.market} />
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between text-xs leading-none font-bold">
        <span className="text-foreground">
          Created:{" "}
          <span className="text-muted-foreground ml-0.5">
            {formatDate(proposal.createdAt)}
          </span>
        </span>
        <span className="text-foreground">
          Expires:{" "}
          <span
            className={cn(
              "ml-0.5",
              new Date(proposal.expiresAt) < new Date()
                ? "text-destructive"
                : "text-muted-foreground",
            )}>
            {formatDate(proposal.expiresAt)}
          </span>
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <CardAction
          variant="primary"
          onClick={() => onExport?.(proposal)}
          icon={Download}>
          Export
        </CardAction>
        <CardAction
          variant="muted"
          onClick={() => onView?.(proposal)}
          icon={Eye}>
          View
        </CardAction>
        <CardAction
          variant="ghost"
          onClick={() => onDuplicate?.(proposal)}
          icon={Copy}>
          Duplicate
        </CardAction>
      </div>
    </div>
  );
}

interface CardActionProps {
  variant: "primary" | "muted" | "ghost";
  icon: React.ElementType;
  onClick?: () => void;
  children: React.ReactNode;
}

function CardAction({
  variant,
  icon: Icon,
  onClick,
  children,
}: CardActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-[8px] flex items-center justify-center gap-1.5 text-xs leading-none font-bold transition-all outline-none",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
        variant === "muted" &&
          "bg-primary/10 text-primary hover:bg-primary/15",
        variant === "ghost" &&
          "bg-muted text-muted-foreground hover:bg-secondary",
      )}>
      <Icon className="size-3" strokeWidth={2.2} />
      {children}
    </button>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
