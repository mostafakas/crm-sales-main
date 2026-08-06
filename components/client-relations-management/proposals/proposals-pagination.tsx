"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalsPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ProposalsPagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: ProposalsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const visiblePages = React.useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return Array.from({ length: 4 }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 w-full",
        className,
      )}>
      <span className="text-sm font-bold text-muted-foreground">
        Showing <span className="text-foreground">{from}-{to}</span> of{" "}
        <span className="text-foreground">{total}</span>
      </span>

      <div className="flex items-center gap-1.5">
        <NavButton
          ariaLabel="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-3.5" />
        </NavButton>

        {visiblePages.map((p) => {
          const active = p === page;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "size-8 rounded-[8px] text-xs font-bold flex items-center justify-center transition-all outline-none",
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-muted",
              )}>
              {p}
            </button>
          );
        })}

        <NavButton
          ariaLabel="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="size-3.5" />
        </NavButton>
      </div>
    </div>
  );
}

interface NavButtonProps {
  ariaLabel: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function NavButton({ ariaLabel, disabled, onClick, children }: NavButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="size-8 rounded-[8px] bg-secondary text-muted-foreground hover:bg-muted transition-all outline-none flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}
