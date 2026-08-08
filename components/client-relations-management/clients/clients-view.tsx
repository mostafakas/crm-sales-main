"use client";

import * as React from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClients, deleteClient } from "@/lib/firebase/clients";
import type { Client } from "@/lib/types/client";
import { ClientDataTable } from "./client-data-table";
import { ClientFormModal } from "./client-form-modal";
import { ClientViewModal } from "./client-view-modal";
import { getColumns } from "./columns";
import { toast } from "sonner";

export function ClientsView() {
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
  const [search, setSearch] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [viewingClient, setViewingClient] = React.useState<Client | null>(null);

  const fetchClients = React.useCallback(async () => {
    try {
      const data = await getClients();
      setClients(data);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("almaster:crm:clients", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = React.useMemo(() => {
    if (!search) return clients;
    const lowerSearch = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.companyName.toLowerCase().includes(lowerSearch) ||
        c.contactName.toLowerCase().includes(lowerSearch) ||
        c.email.toLowerCase().includes(lowerSearch)
    );
  }, [search, clients]);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (confirm(`Are you sure you want to delete ${client.companyName}?`)) {
      try {
        await deleteClient(client.id);
        toast.success("Client deleted successfully!");
        fetchClients();
      } catch (error) {
        console.error("Failed to delete client:", error);
        toast.error("Failed to delete client.");
      }
    }
  };

  const handleView = (client: Client) => {
    setViewingClient(client);
    setIsViewModalOpen(true);
  };

  const tableColumns = React.useMemo(() => getColumns(handleView, handleEdit, handleDelete), [handleView, handleEdit, handleDelete]);

  return (
    <div className="flex flex-col h-full bg-muted/20 w-full">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-border bg-background">
        <div className="flex flex-col gap-1">
          <Typography className="text-[20px] font-bold text-foreground">
            Clients Management
          </Typography>
          <Typography className="text-sm text-muted-foreground">
            Manage your leads, prospects, and clients.
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="pl-9 w-[260px] bg-muted border-none h-10 rounded-[12px] text-xs font-bold placeholder:font-bold focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>

          <Button
            variant="outline"
            onClick={fetchClients}
            disabled={isLoading}
            className="h-10 px-4 rounded-[12px] border-border hover:bg-muted font-bold text-xs gap-2">
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white h-10 px-5 rounded-[12px] font-bold text-xs gap-2 shadow-sm">
            <Plus className="size-4" strokeWidth={2.5} />
            Add Client
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="flex-1 bg-background rounded-[16px] border border-border overflow-hidden shadow-sm flex flex-col">
          <ClientDataTable
            columns={tableColumns}
            data={filteredClients}
            isLoading={isLoading}
          />
        </div>
      </div>

      <ClientFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingClient(null);
        }}
        initialData={editingClient}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingClient(null);
          fetchClients();
        }}
      />

      <ClientViewModal
        open={isViewModalOpen}
        onOpenChange={(open) => {
          setIsViewModalOpen(open);
          if (!open) setViewingClient(null);
        }}
        client={viewingClient}
      />
    </div>
  );
}
