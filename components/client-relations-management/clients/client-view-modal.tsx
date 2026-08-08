"use client";

import * as React from "react";
import { X, Calendar, MapPin, Briefcase, Mail, Phone, DollarSign, Activity, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import type { Client } from "@/lib/types/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ClientViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ClientViewModal({ open, onOpenChange, client }: ClientViewModalProps) {
  if (!client) return null;

  const getStatusVariant = (state: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (state) {
      case "Won": return "default";
      case "High": return "outline";
      case "Medium": return "secondary";
      case "Low": return "secondary";
      case "Lost": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent showCloseButton={false} className="sm:max-w-[700px] p-0 border-none rounded-[16px] bg-background overflow-hidden flex flex-col max-h-[90vh] font-janna">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-border shrink-0 bg-primary/5">
          <div className="flex flex-col gap-2">
            <Typography className="text-primary text-[22px] font-bold">
              {client.companyName}
            </Typography>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(client.potentialState)} className="text-xs px-3">
                {client.potentialState}
              </Badge>
              <span className="text-muted-foreground text-xs font-medium bg-white px-2 py-1 rounded-md shadow-sm border border-border">
                {client.source}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-white size-8 rounded-full flex items-center justify-center hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors shadow-sm border border-border"
          >
            <X className="size-4" strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <InfoCard icon={<Briefcase />} label="Contact Person" value={client.contactName} subValue={client.contactTitle} />
            <InfoCard icon={<MapPin />} label="Location & Sector" value={client.country} subValue={client.sector} />
            <InfoCard icon={<Mail />} label="Email Address" value={client.email} />
            <InfoCard icon={<Phone />} label="Phone Number" value={client.phone} />
          </div>

          <div className="h-px bg-border w-full" />

          <div className="grid grid-cols-2 gap-6">
            <InfoCard 
              icon={<DollarSign />} 
              label="Project Value" 
              value={formatCurrency(client.projectValue, client.currency)} 
              valueClass="text-primary text-lg"
            />
            <InfoCard 
              icon={<Activity />} 
              label="Next Action" 
              value={client.nextAction || "No action set"} 
              subValue={client.nextActionDate ? formatDate(client.nextActionDate, "PPP") : ""} 
            />
          </div>

          <div className="h-px bg-border w-full" />

          <div className="grid grid-cols-2 gap-6">
            <InfoCard icon={<Calendar />} label="First Contact" value={formatDate(client.firstContactDate, "PPP")} />
            <InfoCard icon={<Calendar />} label="Last Follow-up" value={client.lastFollowUpDate ? formatDate(client.lastFollowUpDate, "PPP") : "Not followed up yet"} />
          </div>

          <div className="bg-muted p-4 rounded-[12px] space-y-3">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <FileText className="size-4 text-primary" />
              Project Details
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {client.projectDetails}
            </p>
          </div>

          {client.lastFeedback && (
            <div className="bg-yellow-50 p-4 rounded-[12px] border border-yellow-100 space-y-2">
              <div className="font-bold text-yellow-800 text-sm">Last Feedback</div>
              <p className="text-sm text-yellow-700 leading-relaxed">
                {client.lastFeedback}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-end shrink-0 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:bg-muted font-bold rounded-[8px]"
          >
            إغلاق
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

function InfoCard({ icon, label, value, subValue, valueClass }: { icon: React.ReactNode; label: string; value: string; subValue?: string; valueClass?: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 size-8 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {React.cloneElement(icon as any, { className: "size-4" })}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-muted-foreground mb-1">{label}</span>
        <span className={`text-sm font-bold text-foreground ${valueClass || ""}`}>{value}</span>
        {subValue && <span className="text-xs text-muted-foreground font-medium mt-0.5">{subValue}</span>}
      </div>
    </div>
  );
}
