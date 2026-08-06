import { ClientsView } from "@/components/client-relations-management/clients/clients-view";

export const metadata = {
  title: "Clients | Almaster CRM",
  description: "Manage your clients",
};

export default function ClientsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ClientsView />
    </div>
  );
}
