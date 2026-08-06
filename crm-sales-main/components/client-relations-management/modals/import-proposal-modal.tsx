"use client";

import * as React from "react";
import { X, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ProposalRecord } from "@/lib/types/proposal";

export interface ImportProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (record: ProposalRecord) => void;
}

/**
 * "Import proposal" modal — upload existing documents to convert into
 * editable proposals. Mirrors Figma frame 2222:10371.
 */
export function ImportProposalModal({
  open,
  onOpenChange,
  onImport,
}: ImportProposalModalProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const format: ProposalRecord["format"] =
      ext === "pdf" ? "pdf" : ext === "pptx" || ext === "ppt" ? "pptx" : "docx";
    const code = `PRP-${Math.floor(2100 + Math.random() * 900)}`;
    const today = new Date().toISOString().slice(0, 10);
    const record: ProposalRecord = {
      id: code.toLowerCase(),
      code,
      headline: file.name,
      service: "content-writing",
      client: { id: `client-${Date.now()}`, name: "Untitled Client" },
      market: "saudi",
      language: "english",
      format,
      pages: 1,
      createdAt: today,
      expiresAt: today,
      sentAt: null,
    };
    onImport?.(record);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[420px] max-w-[420px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-background shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-3 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Typography className="text-foreground text-[18px] font-bold leading-[22.4px]">
              Import proposal
            </Typography>
            <Typography className="text-muted-foreground text-[12px] leading-[16px]">
              Upload existing documents to convert into editable proposals.
            </Typography>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-secondary size-8 rounded-full flex items-center justify-center hover:bg-secondary/70 transition-colors outline-none">
            <X className="size-4 text-foreground" strokeWidth={3} />
          </button>
        </div>

        {/* Drop zone */}
        <div className="px-6 pb-6">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            className={cn(
              "rounded-[12px] bg-muted p-8 flex flex-col items-center gap-3 cursor-pointer transition-all",
              isDragging && "ring-2 ring-primary ring-offset-2",
            )}>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            <div className="size-12 bg-background rounded-[10px] flex items-center justify-center shadow-sm">
              <Upload className="size-5 text-primary" strokeWidth={2.4} />
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <Typography className="text-foreground text-[14px] font-bold leading-[16px]">
                Drop files here or browse
              </Typography>
              <Typography className="text-muted-foreground text-[11px] font-bold leading-[16px]">
                PDF, Word, Excel, Images (max. 50MB)
              </Typography>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-1 h-9 px-4 bg-background rounded-[10px] flex items-center gap-2 text-xs font-bold text-primary shadow-sm hover:bg-background/80 transition-all outline-none">
              <Upload className="size-3.5" strokeWidth={2.4} />
              Choose files
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
