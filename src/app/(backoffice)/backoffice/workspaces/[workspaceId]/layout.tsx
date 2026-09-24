import type { ReactNode } from "react";
import { resolveNavigation, workspaceNavigation } from "@/features/navigation";
import { ClientWorkspaceHeader } from "@/features/clients";
import { ContextNavigation } from "@/shared/ui/shell";
import { WorkspaceProvider } from "@/shared/workspace/workspace-context";
import { parseWorkspaceId } from "@/shared/workspace/workspace";

interface BackofficeWorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}

export default async function BackofficeWorkspaceLayout({
  children,
  params,
}: BackofficeWorkspaceLayoutProps) {
  const { workspaceId: workspaceIdParam } = await params;
  const workspaceId = parseWorkspaceId(workspaceIdParam);
  const navigation = resolveNavigation(workspaceNavigation, { workspaceId });

  return (
    <WorkspaceProvider key={workspaceId} initialWorkspaceId={workspaceId}>
      <div className="space-y-5">
        <ClientWorkspaceHeader workspaceId={workspaceId} switcherHref="/backoffice/clients" />
        <ContextNavigation items={navigation} />
        {children}
      </div>
    </WorkspaceProvider>
  );
}
