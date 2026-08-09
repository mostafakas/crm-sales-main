"use client";

import * as React from "react";
import { Bell, BellOff, RefreshCw, Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getClients, saveClient } from "@/lib/firebase/clients";
import type { Client } from "@/lib/types/client";
import { NotificationCard } from "./notification-card";
import { PostponeModal } from "./postpone-modal";
import { toast } from "sonner";

export function NotificationsView() {
  const [clients, setClients] = React.useState<Client[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = window.localStorage.getItem("almaster:crm:clients");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = React.useState(clients.length === 0);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  
  // Postpone Modal State
  const [postponeModalOpen, setPostponeModalOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);

  const fetchClients = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("almaster:crm:clients", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filter clients who have nextActionDate equal to TODAY
  const todayNotifications = React.useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return clients.filter((c) => {
      if (!c.nextActionDate) return false;
      const actionDateStr = c.nextActionDate.split("T")[0];
      return actionDateStr === todayStr;
    });
  }, [clients]);

  const handleActionTaken = async (client: Client) => {
    try {
      setProcessingId(client.id);
      
      const updatedClient = {
        ...client,
        // Move current next action to last feedback
        lastFeedback: client.nextAction ? `[Completed] ${client.nextAction}` : "Follow-up completed.",
        // Update last follow up to today
        lastFollowUpDate: new Date().toISOString(),
        // Clear next action and date
        nextAction: "",
        nextActionDate: "",
      };

      await saveClient(updatedClient);
      
      // Update local state immediately for snappy UI
      setClients(prev => prev.map(c => c.id === client.id ? updatedClient : c));
      
      toast.success("Action marked as taken!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update client.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenPostpone = (client: Client) => {
    setSelectedClient(client);
    setPostponeModalOpen(true);
  };

  const handleConfirmPostpone = async (newDate: string) => {
    if (!selectedClient) return;
    try {
      const updatedClient = {
        ...selectedClient,
        nextActionDate: new Date(newDate).toISOString(),
      };

      await saveClient(updatedClient);
      
      // Update local state
      setClients(prev => prev.map(c => c.id === selectedClient.id ? updatedClient : c));
      
      toast.success("Action postponed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to postpone action.");
      throw error; // Rethrow to let modal handle loading state
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/20 w-full">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2.5 rounded-[12px]">
            <Bell className="size-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <Typography className="text-[20px] font-bold text-foreground flex items-center gap-2">
              Notifications
              {todayNotifications.length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {todayNotifications.length} New
                </span>
              )}
            </Typography>
            <Typography className="text-sm text-muted-foreground">
              Clients requiring your attention today.
            </Typography>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={fetchClients}
          disabled={isLoading}
          className="h-10 px-4 rounded-[12px] border-border hover:bg-muted font-bold text-xs gap-2"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading && clients.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : todayNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
            <div className="bg-muted p-6 rounded-full">
              <BellOff className="size-10 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <Typography className="text-lg font-bold text-foreground">All caught up!</Typography>
              <Typography className="text-sm">You have no pending actions for today.</Typography>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 content-start">
            {todayNotifications.map((client) => (
              <NotificationCard
                key={client.id}
                client={client}
                onActionTaken={handleActionTaken}
                onPostpone={handleOpenPostpone}
                isProcessing={processingId === client.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedClient && (
        <PostponeModal
          open={postponeModalOpen}
          onOpenChange={(open) => {
            setPostponeModalOpen(open);
            if (!open) setSelectedClient(null);
          }}
          onConfirm={handleConfirmPostpone}
          clientName={selectedClient.companyName}
        />
      )}
    </div>
  );
}
