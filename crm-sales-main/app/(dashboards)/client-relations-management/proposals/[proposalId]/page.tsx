import { ProposalDetailPage } from "@/components/client-relations-management/proposals/proposal-detail-page";

interface PageProps {
  params: Promise<{ proposalId: string }>;
}

/* Proposals live in client-side storage, so the title can't be resolved on
 * the server — use a stable generic title. */
export const metadata = {
  title: "Proposal — AlMaster CRM",
};

export async function generateStaticParams() {
  return [
    { proposalId: "prop-1" },
    { proposalId: "prop-2" },
    { proposalId: "prop-3" },
  ];
}

export default async function CRMProposalDetailPage({ params }: PageProps) {
  const { proposalId } = await params;
  return <ProposalDetailPage proposalId={proposalId} />;
}
