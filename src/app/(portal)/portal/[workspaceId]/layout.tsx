import type { ReactNode } from "react";
import { portalNavigation, resolveNavigation } from "@/features/navigation";
import { AppShell, WorkspaceContextHeader } from "@/shared/ui/shell";
import { WorkspaceProvider } from "@/shared/workspace/workspace-context";
import { parseWorkspaceId } from "@/shared/workspace/workspace";

interface PortalLayoutProps {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}

export default async function PortalLayout({
  children,
  params,
}: PortalLayoutProps) {
  const { workspaceId: workspaceIdParam } = await params;
  const workspaceId = parseWorkspaceId(workspaceIdParam);
  const navigation = resolveNavigation(portalNavigation, { workspaceId });

  return (
    <WorkspaceProvider key={workspaceId} initialWorkspaceId={workspaceId}>
      <AppShell eyebrow="Expérience client" title="Client Portal" navigation={navigation}>
        <div className="space-y-6">
          <WorkspaceContextHeader workspaceId={workspaceId} />
          {children}
        </div>
      </AppShell>
    </WorkspaceProvider>
  );
}
