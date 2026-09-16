import Link from "next/link";
import { LeadProspectDetailSection } from "@/features/prospecting";
import { parseWorkspaceId } from "@/shared/workspace/workspace";

interface ProspectDetailPageProps {
  params: Promise<{ workspaceId: string; leadId: string }>;
}

export default async function ProspectDetailPage({ params }: ProspectDetailPageProps) {
  const { workspaceId: workspaceIdParam, leadId } = await params;
  const workspaceId = parseWorkspaceId(workspaceIdParam);

  return (
    <div className="space-y-6">
      <Link
        href={`/backoffice/workspaces/${workspaceId}/prospecting`}
        className="text-sm font-semibold text-brand-blue-violet hover:underline"
      >
        ← Retour à la prospection
      </Link>
      <LeadProspectDetailSection workspaceId={workspaceId} leadId={leadId} />
    </div>
  );
}
