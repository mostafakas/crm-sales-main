import { Building2, Phone, Mail, CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import type { Client } from "@/lib/types/client";

interface NotificationCardProps {
  client: Client;
  onActionTaken: (client: Client) => void;
  onPostpone: (client: Client) => void;
  isProcessing?: boolean;
}

export function NotificationCard({ client, onActionTaken, onPostpone, isProcessing }: NotificationCardProps) {
  return (
    <div className="bg-background rounded-[16px] border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Top Banner indicating urgency */}
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-[16px]" />

      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1 pl-2">
          <Typography className="text-foreground text-[16px] font-bold line-clamp-1">
            {client.contactName}
          </Typography>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <Building2 className="size-3.5" />
            <span className="line-clamp-1">{client.companyName}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pl-2">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
          <Phone className="size-3.5 text-primary" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
          <Mail className="size-3.5 text-primary" />
          <span className="truncate">{client.email}</span>
        </div>
        
        {client.projectDetails && (
          <div className="mt-1">
            <Typography className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Project Details
            </Typography>
            <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">
              {client.projectDetails}
            </p>
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-[12px] p-3 flex flex-col gap-3 mt-1 ml-2">
        <div className="flex flex-col gap-1">
          <Typography className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Previous Action
          </Typography>
          <Typography className="text-xs font-medium text-foreground">
            {client.lastFeedback || "No previous actions recorded."}
          </Typography>
        </div>
        <div className="h-[1px] w-full bg-border" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5 text-blue-600" />
            <Typography className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Today's Action
            </Typography>
          </div>
          <Typography className="text-xs font-bold text-foreground">
            {client.nextAction || "Follow up with client."}
          </Typography>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 ml-2">
        <Button
          onClick={() => onActionTaken(client)}
          disabled={isProcessing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 rounded-[8px] gap-1.5 shadow-sm"
        >
          <CheckCircle2 className="size-4" />
          Action Taken
        </Button>
        <Button
          onClick={() => onPostpone(client)}
          disabled={isProcessing}
          variant="outline"
          className="flex-1 font-bold text-xs h-9 rounded-[8px] gap-1.5 border-border hover:bg-muted"
        >
          <Clock className="size-3.5 text-muted-foreground" />
          Postpone
        </Button>
      </div>
    </div>
  );
}
