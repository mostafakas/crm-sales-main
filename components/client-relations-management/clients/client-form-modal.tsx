"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveClient } from "@/lib/firebase/clients";
import type { Client, ClientSource, ClientPotentialState } from "@/lib/types/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const clientSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactName: z.string().min(1, "Contact Name is required"),
  contactTitle: z.string().min(1, "Contact Title is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  country: z.string().min(1, "Country is required"),
  sector: z.string().min(1, "Sector is required"),
  source: z.enum([
    "Egyptian WhatsApp", "Email", "Website", "Form",
    "Saudi WhatsApp", "Call", "Personal"
  ]),
  potentialState: z.enum(["Low", "Medium", "High", "Won", "Lost"]),
  projectValue: z.coerce.number().min(0, "Invalid value"),
  currency: z.string().min(1, "Currency is required"),
  projectDetails: z.string().min(1, "Project Details are required"),
  lastFeedback: z.string().min(1, "Required"),
  nextAction: z.string().min(1, "Required"),
  firstContactDate: z.string().min(1, "Required"),
  lastFollowUpDate: z.string().min(1, "Required"),
  nextActionDate: z.string().min(1, "Required"),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Client | null;
}

export function ClientFormModal({ open, onOpenChange, onSuccess, initialData }: ClientFormModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as any,
    defaultValues: {
      companyName: "",
      contactName: "",
      contactTitle: "",
      email: "",
      phone: "",
      country: "",
      sector: "",
      source: "Website",
      potentialState: "Medium",
      projectValue: 0,
      currency: "USD",
      projectDetails: "",
      lastFeedback: "",
      nextAction: "",
      firstContactDate: new Date().toISOString().split("T")[0],
      lastFollowUpDate: "",
      nextActionDate: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          ...initialData,
          firstContactDate: initialData.firstContactDate.split("T")[0],
          lastFollowUpDate: initialData.lastFollowUpDate ? initialData.lastFollowUpDate.split("T")[0] : "",
          nextActionDate: initialData.nextActionDate ? initialData.nextActionDate.split("T")[0] : "",
        });
      } else {
        form.reset({
          companyName: "",
          contactName: "",
          contactTitle: "",
          email: "",
          phone: "",
          country: "",
          sector: "",
          source: "Website",
          potentialState: "Medium",
          projectValue: 0,
          currency: "USD",
          projectDetails: "",
          lastFeedback: "",
          nextAction: "",
          firstContactDate: new Date().toISOString().split("T")[0],
          lastFollowUpDate: "",
          nextActionDate: "",
        });
      }
    }
  }, [open, initialData, form]);

  const onSubmit = async (values: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      await saveClient({
        id: initialData?.id,
        ...values,
        firstContactDate: new Date(values.firstContactDate).toISOString(),
        lastFollowUpDate: new Date(values.lastFollowUpDate).toISOString(),
        nextActionDate: new Date(values.nextActionDate).toISOString(),
      });
      toast.success(initialData ? "Client updated successfully!" : "Client added successfully!");
      onSuccess();
    } catch (error) {
      console.error("Failed to save client", error);
      toast.error("Failed to save client.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent showCloseButton={false} className="sm:max-w-[700px] p-0 border-none rounded-[16px] bg-background overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-border shrink-0">
          <div className="flex flex-col gap-1">
            <Typography className="text-foreground text-[18px] font-bold">
              {initialData ? "Edit Client" : "Add New Client"}
            </Typography>
            <Typography className="text-muted-foreground text-xs">Enter the client details below.</Typography>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-muted size-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="size-4 text-foreground" strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="client-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            
            <FormField label="Company Name" error={form.formState.errors.companyName?.message}>
              <Input {...form.register("companyName")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Sector" error={form.formState.errors.sector?.message}>
              <Input {...form.register("sector")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Contact Person" error={form.formState.errors.contactName?.message}>
              <Input {...form.register("contactName")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Contact Title" error={form.formState.errors.contactTitle?.message}>
              <Input {...form.register("contactTitle")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" {...form.register("email")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Phone" error={form.formState.errors.phone?.message}>
              <Input {...form.register("phone")} placeholder="+966..." className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Country" error={form.formState.errors.country?.message}>
              <select {...form.register("country")} className="bg-muted border-none h-10 rounded-[8px] px-3 w-full text-sm outline-none">
                <option value="">Select Country</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Egypt">Egypt</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Other">Other</option>
              </select>
            </FormField>

            <FormField label="Source" error={form.formState.errors.source?.message}>
              <select {...form.register("source")} className="bg-muted border-none h-10 rounded-[8px] px-3 w-full text-sm outline-none">
                <option value="Egyptian WhatsApp">Egyptian WhatsApp</option>
                <option value="Saudi WhatsApp">Saudi WhatsApp</option>
                <option value="Email">Email</option>
                <option value="Website">Website</option>
                <option value="Form">Form</option>
                <option value="Call">Call</option>
                <option value="Personal">Personal</option>
              </select>
            </FormField>

            <FormField label="Status" error={form.formState.errors.potentialState?.message}>
              <select {...form.register("potentialState")} className="bg-muted border-none h-10 rounded-[8px] px-3 w-full text-sm outline-none">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-2">
              <FormField label="Project Value" error={form.formState.errors.projectValue?.message}>
                <Input type="number" {...form.register("projectValue")} className="bg-muted border-none h-10 rounded-[8px]" />
              </FormField>
              <FormField label="Currency" error={form.formState.errors.currency?.message}>
                <select {...form.register("currency")} className="bg-muted border-none h-10 rounded-[8px] px-3 w-full text-sm outline-none">
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="EGP">EGP</option>
                  <option value="AED">AED</option>
                </select>
              </FormField>
            </div>

            <FormField label="First Contact Date" error={form.formState.errors.firstContactDate?.message}>
              <Input type="date" {...form.register("firstContactDate")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Last Follow-up" error={form.formState.errors.lastFollowUpDate?.message}>
              <Input type="date" {...form.register("lastFollowUpDate")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <div className="col-span-2">
              <FormField label="Project Details" error={form.formState.errors.projectDetails?.message}>
                <Textarea {...form.register("projectDetails")} className="bg-muted border-none min-h-[80px] rounded-[8px] resize-none" />
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Last Feedback" error={form.formState.errors.lastFeedback?.message}>
                <Input {...form.register("lastFeedback")} className="bg-muted border-none h-10 rounded-[8px]" />
              </FormField>
            </div>

            <FormField label="Next Action" error={form.formState.errors.nextAction?.message}>
              <Input {...form.register("nextAction")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

            <FormField label="Next Action Date" error={form.formState.errors.nextActionDate?.message}>
              <Input type="date" {...form.register("nextActionDate")} className="bg-muted border-none h-10 rounded-[8px]" />
            </FormField>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="hover:bg-muted font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="client-form"
            disabled={isSubmitting}
            className="bg-primary text-white hover:bg-primary/90 font-bold px-8 rounded-[8px]"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Client
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-foreground">{label}</label>
      {children}
      {error && <span className="text-[10px] font-bold text-destructive">{error}</span>}
    </div>
  );
}
