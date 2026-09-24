"use client";

import { useWorkspaceConfigurationQuery } from "@/features/client-configuration";
import { WorkspaceContextHeader } from "@/shared/ui/shell";
import type { WorkspaceId } from "@/shared/workspace/workspace";

/** The workspace header with the client's real name (read from its
 * configuration, cached and shared with the Configuration page). Until the
 * name is known — or if it cannot be read — the identifier stays the title,
 * so the header never breaks. */
export function ClientWorkspaceHeader({
  workspaceId,
  switcherHref,
}: {
  workspaceId: WorkspaceId;
  switcherHref?: string;
}) {
  const query = useWorkspaceConfigurationQuery(workspaceId);

  return (
    <WorkspaceContextHeader
      workspaceId={workspaceId}
      {...(query.isSuccess ? { workspaceName: query.data.name } : {})}
      {...(switcherHref === undefined ? {} : { switcherHref })}
    />
  );
}
