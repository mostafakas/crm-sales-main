"use client";

import * as React from "react";
import { Plus, Download, Filter, RefreshCw, Search, TableProperties } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClients } from "@/lib/firebase/clients";
import type { Client } from "@/lib/types/client";
import { ClientDataTable } from "./client-data-table";
import { ClientFormModal } from "./client-form-modal";
import { columns } from "./columns";

export function ClientsView() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchClients = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
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
  }, [clients, search]);

  return (
    <div className="flex flex-col h-full bg-muted/20">
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
            columns={columns}
            data={filteredClients}
            isLoading={isLoading}
          />
        </div>
      </div>

      <ClientFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchClients();
        }}
      />
    </div>
  );
}
