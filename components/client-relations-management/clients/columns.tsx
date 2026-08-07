"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import type { Client } from "@/lib/types/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { deleteClient } from "@/lib/firebase/clients";

export const getColumns = (
  onEdit: (client: Client) => void,
  onDelete: (client: Client) => void
): ColumnDef<Client>[] => [
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted font-bold text-xs"
        >
          Company
          <ArrowUpDown className="ml-2 size-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-bold text-foreground text-sm ml-4">
        {row.getValue("companyName")}
      </div>
    ),
  },
  {
    accessorKey: "contactName",
    header: "Contact Person",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground text-xs">{row.getValue("contactName")}</span>
        <span className="text-muted-foreground text-[10px] font-medium">{row.original.contactTitle}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-xs font-medium">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="text-xs font-medium">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "potentialState",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("potentialState") as string;
      const getVariant = (state: string) => {
        switch (state) {
          case "Won": return "default";
          case "High": return "outline";
          case "Medium": return "secondary";
          case "Low": return "secondary";
          case "Lost": return "destructive";
          default: return "secondary";
        }
      };
      return <Badge variant={getVariant(status) as any} className="text-[10px]">{status}</Badge>;
    },
  },
  {
    accessorKey: "projectValue",
    header: () => <div className="text-right">Project Value</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("projectValue"));
      const formatted = formatCurrency(amount, row.original.currency);
      return <div className="text-right font-bold text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "nextAction",
    header: "Next Action",
    cell: ({ row }) => {
      const date = row.original.nextActionDate;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">{row.getValue("nextAction") || "-"}</span>
          {date && <span className="text-[10px] text-muted-foreground">{formatDate(date, "MMM d, yyyy")}</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-muted flex items-center justify-center rounded-md outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border border-border shadow-md rounded-[12px]">
            <DropdownMenuLabel className="text-xs font-bold">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="text-xs font-medium cursor-pointer"
              onClick={() => navigator.clipboard.writeText(client.email)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-xs font-medium cursor-pointer"
              onClick={() => onEdit(client)}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-xs font-medium cursor-pointer"
              onClick={() => onEdit(client)}
            >
              Edit client
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-xs font-bold text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(client)}
            >
              Delete client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
