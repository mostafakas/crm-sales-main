"use client";

import * as React from "react";
import { X, Search, Calendar as CalendarIcon, Check } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_FORMAT_META,
  PROPOSAL_LANGUAGE_META,
  PROPOSAL_MARKET_META,
  PROPOSAL_SERVICE_META,
  type ProposalFormat,
  type ProposalLanguage,
  type ProposalMarket,
  type ProposalService,
} from "@/lib/types/proposal";
import {
  proposalFilterSchema,
  type ProposalFilterValues,
} from "@/lib/validations/proposal";

export interface FilterProposalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: ProposalFilterValues;
  onApply: (values: ProposalFilterValues) => void;
  onReset: () => void;
}

const SERVICE_OPTIONS = Object.entries(PROPOSAL_SERVICE_META) as [
  ProposalService,
  (typeof PROPOSAL_SERVICE_META)[keyof typeof PROPOSAL_SERVICE_META],
][];

const MARKET_OPTIONS = Object.entries(PROPOSAL_MARKET_META) as [
  ProposalMarket,
  (typeof PROPOSAL_MARKET_META)[keyof typeof PROPOSAL_MARKET_META],
][];

const LANGUAGE_OPTIONS = Object.entries(PROPOSAL_LANGUAGE_META) as [
  ProposalLanguage,
  (typeof PROPOSAL_LANGUAGE_META)[keyof typeof PROPOSAL_LANGUAGE_META],
][];

const FORMAT_OPTIONS = Object.entries(PROPOSAL_FORMAT_META) as [
  ProposalFormat,
  (typeof PROPOSAL_FORMAT_META)[keyof typeof PROPOSAL_FORMAT_META],
][];

export function FilterProposalsModal({
  open,
  onOpenChange,
  defaultValues,
  onApply,
  onReset,
}: FilterProposalsModalProps) {
  const form = useForm<ProposalFilterValues>({
    resolver: zodResolver(proposalFilterSchema),
    defaultValues: defaultValues ?? {
      client: "",
      markets: [],
      services: [],
      languages: [],
      formats: [],
    },
  });

  const { register, handleSubmit, control, reset } = form;

  React.useEffect(() => {
    if (open) reset(defaultValues ?? {});
  }, [open, defaultValues, reset]);

  const onSubmit = (values: ProposalFilterValues) => {
    onApply(values);
  };

  const handleReset = () => {
    reset({});
    onReset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[420px] max-w-[420px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-background shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-3 flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <Typography className="text-foreground text-[18px] font-bold leading-[22.4px]">
              Filter Proposals
            </Typography>
            <Typography className="text-muted-foreground text-[12px] leading-[16px]">
              Select filters to narrow down the proposals displayed
            </Typography>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-secondary size-8 rounded-full flex items-center justify-center hover:bg-secondary/70 transition-colors outline-none">
            <X className="size-4 text-foreground" strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <form
          id="filter-proposals-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 flex flex-col gap-6">
          {/* Client */}
          <Field label="Client">
            <div className="bg-muted rounded-[8px] h-10 px-3 flex items-center gap-2">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search by client name..."
                className="bg-transparent outline-none text-xs font-bold text-foreground placeholder:text-muted-foreground placeholder:font-bold w-full"
                {...register("client")}
              />
            </div>
          </Field>

          {/* Service */}
          <Field label="Service">
            <Controller
              control={control}
              name="services"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 gap-x-6">
                  {SERVICE_OPTIONS.map(([value, meta]) => (
                    <CheckRow
                      key={value}
                      checked={field.value?.includes(value) ?? false}
                      onToggle={() =>
                        toggleArray(field, value as ProposalService)
                      }
                      label={meta.label}
                      labelClass={meta.tintFg}
                    />
                  ))}
                </div>
              )}
            />
          </Field>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4">
            <Field label="Creation Date">
              <Controller
                control={control}
                name="createdAt"
                render={({ field }) => (
                  <DateField
                    value={field.value as Date | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>

            <Field label="Expiry Date">
              <Controller
                control={control}
                name="expiresAt"
                render={({ field }) => (
                  <DateField
                    value={field.value as Date | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
          </div>

          {/* Country */}
          <Field label="Country">
            <Controller
              control={control}
              name="markets"
              render={({ field }) => (
                <div className="flex flex-wrap items-center gap-3">
                  {MARKET_OPTIONS.map(([value, meta]) => (
                    <CheckRow
                      key={value}
                      checked={field.value?.includes(value) ?? false}
                      onToggle={() => toggleArray(field, value as ProposalMarket)}
                      label={
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 h-[22px] rounded-md text-xs font-bold",
                            meta.tintBg,
                            meta.tintFg,
                          )}>
                          <span aria-hidden>{meta.flag}</span>
                          {meta.label}
                        </span>
                      }
                    />
                  ))}
                </div>
              )}
            />
          </Field>

          {/* Dimensions (format) */}
          <Field label="Dimensions">
            <Controller
              control={control}
              name="formats"
              render={({ field }) => (
                <div className="flex flex-wrap items-center gap-6">
                  {FORMAT_OPTIONS.map(([value, meta]) => (
                    <CheckRow
                      key={value}
                      checked={field.value?.includes(value) ?? false}
                      onToggle={() => toggleArray(field, value as ProposalFormat)}
                      label={meta.label}
                    />
                  ))}
                </div>
              )}
            />
          </Field>

          {/* Language */}
          <Field label="Language">
            <Controller
              control={control}
              name="languages"
              render={({ field }) => (
                <div className="flex items-center gap-6">
                  {LANGUAGE_OPTIONS.map(([value, meta]) => (
                    <CheckRow
                      key={value}
                      checked={field.value?.includes(value) ?? false}
                      onToggle={() =>
                        toggleArray(field, value as ProposalLanguage)
                      }
                      label={meta.label}
                      labelClass={meta.fg}
                    />
                  ))}
                </div>
              )}
            />
          </Field>
        </form>

        {/* Footer */}
        <div className="p-6 pt-3 flex items-center gap-2 border-t border-border shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="bg-secondary hover:bg-secondary/80 h-10 px-5 rounded-[10px] text-foreground text-[12px] font-bold">
            Reset
          </Button>
          <Button
            type="submit"
            form="filter-proposals-form"
            className="flex-1 bg-primary hover:bg-primary/90 h-10 px-5 rounded-[10px] text-white text-[12px] font-bold flex items-center justify-center gap-2">
            <Check className="size-3.5" strokeWidth={2.5} />
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <Typography className="text-foreground text-[14px] font-bold leading-[16px]">
        {label}
      </Typography>
      {children}
    </div>
  );
}

interface CheckRowProps {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
  labelClass?: string;
}

function CheckRow({ checked, onToggle, label, labelClass }: CheckRowProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="size-4 rounded-[3px]"
      />
      <span className={cn("text-xs font-bold text-foreground", labelClass)}>
        {label}
      </span>
    </label>
  );
}

interface DateFieldProps {
  value?: Date;
  onChange: (value: Date | undefined) => void;
}

function DateField({ value, onChange }: DateFieldProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className="h-10! bg-muted border-none px-3 py-0 rounded-[8px] text-[12px] font-bold! outline-none w-full! shadow-none justify-between text-muted-foreground hover:bg-muted/80">
            <span>{value ? format(value, "dd/MM/yyyy") : "dd/mm/yyyy"}</span>
            <CalendarIcon className="size-3.5 text-muted-foreground" />
          </Button>
        }
      />
      <PopoverContent
        className="w-auto p-0 border-none shadow-xl"
        align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function toggleArray<T>(
  field: { value?: T[]; onChange: (next: T[]) => void },
  v: T,
) {
  const current = field.value ?? [];
  if (current.includes(v)) {
    field.onChange(current.filter((x) => x !== v));
  } else {
    field.onChange([...current, v]);
  }
}
