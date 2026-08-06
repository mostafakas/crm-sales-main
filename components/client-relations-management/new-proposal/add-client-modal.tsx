"use client";

import * as React from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { ImageUploadField } from "./image-upload-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ProposalDraftClient } from "@/lib/types/proposal-draft";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  country: z.string().optional(),
  phoneCountry: z.string(),
  phone: z.string().optional(),
});

type ClientValues = z.infer<typeof clientSchema>;

export interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (client: ProposalDraftClient) => void;
}

/** Add New Client modal — Figma frame 2222:22717. */
export function AddClientModal({
  open,
  onOpenChange,
  onCreate,
}: AddClientModalProps) {
  const form = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      phoneCountry: "+966",
      phone: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const [avatar, setAvatar] = React.useState("");

  const onSubmit = (values: ClientValues) => {
    const client: ProposalDraftClient = {
      id: `c-${Date.now()}`,
      name: values.name,
      email: values.email,
      country: values.country,
      phone: values.phone
        ? `${values.phoneCountry} ${values.phone}`
        : undefined,
      avatar: avatar || undefined,
    };
    onCreate?.(client);
    setAvatar("");
    reset();
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
              Add New Client
            </Typography>
            <Typography className="text-muted-foreground text-[12px] leading-[16px]">
              Add a new client to your company Clients list.
            </Typography>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-muted size-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors outline-none">
            <X className="size-4 text-foreground" strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <form
          id="add-client-form"
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 pb-6 flex flex-col gap-4">
          {/* Avatar */}
          <div className="my-2 self-center">
            <ImageUploadField
              variant="avatar"
              value={avatar}
              onChange={setAvatar}
            />
          </div>

          <Field label="Name" error={errors.name?.message}>
            <Input
              placeholder="Ex. John Smith"
              className={cn(
                "bg-muted border-none h-10 px-3 rounded-[8px] text-xs font-bold text-foreground placeholder:text-muted-foreground placeholder:font-bold focus-visible:ring-0 w-full",
                errors.name && "ring-1 ring-destructive",
              )}
              {...register("name")}
            />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="Ex. johnsmith@almaster.com"
              className={cn(
                "bg-muted border-none h-10 px-3 rounded-[8px] text-xs font-bold text-foreground placeholder:text-muted-foreground placeholder:font-bold focus-visible:ring-0 w-full",
                errors.email && "ring-1 ring-destructive",
              )}
              {...register("email")}
            />
          </Field>

          <Field label="Country">
            <div className="bg-muted h-10 px-3 rounded-[8px] flex items-center justify-between text-xs font-bold text-muted-foreground">
              <select
                {...register("country")}
                className="bg-transparent outline-none w-full text-foreground appearance-none">
                <option value="">Country</option>
                <option>Saudi Arabia</option>
                <option>Egypt</option>
                <option>Other</option>
              </select>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </div>
          </Field>

          <Field label="Phone Number">
            <div className="flex gap-2">
              <div className="bg-muted h-10 px-2.5 rounded-[8px] flex items-center gap-1 text-xs font-bold text-foreground w-24">
                <span className="text-base leading-none">🇸🇦</span>
                <span>+966</span>
                <ChevronDown className="size-3 text-muted-foreground ml-auto" />
              </div>
              <Input
                placeholder="Ex. 1231 4567 589"
                className="bg-muted border-none h-10 px-3 rounded-[8px] text-xs font-bold text-foreground placeholder:text-muted-foreground placeholder:font-bold focus-visible:ring-0 flex-1"
                {...register("phone")}
              />
            </div>
          </Field>

          {/* Footer */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="bg-muted hover:bg-secondary h-10 px-5 rounded-[10px] text-foreground text-xs font-bold">
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-client-form"
              className="flex-1 bg-primary hover:bg-primary/90 h-10 px-5 rounded-[10px] text-white text-xs font-bold flex items-center justify-center gap-2">
              <Plus className="size-3.5" strokeWidth={2.5} />
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Typography className="text-foreground text-xs font-bold leading-none">
        {label}
      </Typography>
      {children}
      {error ? (
        <span className="text-destructive text-[10px] font-bold">{error}</span>
      ) : null}
    </div>
  );
}
