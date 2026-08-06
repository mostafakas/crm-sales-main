import { ProposalDraftProvider } from "@/components/client-relations-management/new-proposal/proposal-draft-context";
import { WizardShell } from "@/components/client-relations-management/new-proposal/wizard-shell";

export default function NewProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProposalDraftProvider>
      <WizardShell>{children}</WizardShell>
    </ProposalDraftProvider>
  );
}
