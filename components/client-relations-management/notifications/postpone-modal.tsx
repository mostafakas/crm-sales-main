"use client";

import * as React from "react";
import { X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PostponeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newDate: string) => Promise<void>;
  clientName: string;
}

export function PostponeModal({ open, onOpenChange, onConfirm, clientName }: PostponeModalProps) {
  const [newDate, setNewDate] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) setNewDate("");
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    try {
      setIsSubmitting(true);
      await onConfirm(newDate);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent showCloseButton={false} className="sm:max-w-[400px] p-0 border-none rounded-[16px] bg-background overflow-hidden flex flex-col">
        <div className="p-6 pb-4 flex items-start justify-between border-b border-border">
          <div className="flex flex-col gap-1">
            <Typography className="text-foreground text-[18px] font-bold">
              Postpone Action
            </Typography>
            <Typography className="text-muted-foreground text-xs">
              Select a new date for <span className="font-bold text-foreground">{clientName}</span>.
            </Typography>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-muted size-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="size-4 text-foreground" strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">New Date</label>
            <Input 
              type="date" 
              required 
              value={newDate} 
              onChange={(e) => setNewDate(e.target.value)} 
              className="bg-muted border-none h-10 rounded-[8px]" 
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="hover:bg-muted font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !newDate}
              className="bg-primary text-white hover:bg-primary/90 font-bold px-6 rounded-[8px] text-xs"
            >
              {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Confirm Date
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
