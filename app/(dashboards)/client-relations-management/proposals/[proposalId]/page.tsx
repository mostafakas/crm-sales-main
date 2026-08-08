import { ProposalDetailPage } from "@/components/client-relations-management/proposals/proposal-detail-page";

interface PageProps {
  params: Promise<{ proposalId: string }>;
}

/* Proposals live in client-side storage, so the title can't be resolved on
 * the server — use a stable generic title. */
export const metadata = {
  title: "Proposal — AlMaster CRM",
};

/* No real proposal ids are known at build time (they're generated at
 * runtime and live in Firestore/localStorage). On the web build (Vercel,
 * no TAURI_ENV_PLATFORM) this list is irrelevant — Next renders any id on
 * demand. The Tauri desktop build is a static export with no server, so it
 * requires at least one entry here or the build fails outright; that
 * placeholder id is otherwise unreachable in the desktop app, which is
 * fine since the in-app "view" action opens a modal and never navigates
 * to this route — this page only serves shareable deep links, and those
 * only make sense on the web build anyway. */
export async function generateStaticParams() {
  if (process.env.TAURI_ENV_PLATFORM) {
    return [{ proposalId: "placeholder" }];
  }
  return [];
}

export default async function CRMProposalDetailPage({ params }: PageProps) {
  const { proposalId } = await params;
  return <ProposalDetailPage proposalId={proposalId} />;
}
