import type { ReactNode } from "react";
import { ViewAsClientBanner } from "@/features/access-control";
import { CurrentSessionMenu } from "@/features/auth";
import { portalNavigation, resolveNavigation } from "@/features/navigation";
import { NotificationCenter } from "@/features/notifications";
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
      <AppShell
        title="Espace client"
        navigation={navigation}
        banner={<ViewAsClientBanner context={null} />}
        notifications={<NotificationCenter notifications={null} />}
        account={<CurrentSessionMenu />}
      >
        <div className="space-y-6">
          <WorkspaceContextHeader
            workspaceId={workspaceId}
            showSwitcher={false}
            label="Espace client"
            description="Vous consultez les informations de ce workspace."
          />
          {children}
        </div>
      </AppShell>
    </WorkspaceProvider>
  );
}
