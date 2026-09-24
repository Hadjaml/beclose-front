"use client";

import {
  sourcingBlockerLabels,
  sourcingBlockers,
  useWorkspaceConfigurationQuery,
} from "@/features/client-configuration";
import { resumeOnboardingHref } from "@/shared/workspace/onboarding-route";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import { StartSourcingRunButton, type SourcingRunBlock } from "./start-sourcing-run-button";

export function SourcingRunSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <SourcingRunSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function SourcingRunSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useWorkspaceConfigurationQuery(workspaceId);
  // While the configuration loads, or if it cannot be read, the run stays
  // offered: Beclose remains the authority and refuses a run it cannot do.
  const blockers = query.isSuccess ? sourcingBlockers(query.data) : [];
  const blocked: SourcingRunBlock | undefined =
    blockers.length === 0
      ? undefined
      : {
          reasons: blockers.map((blocker) => sourcingBlockerLabels[blocker]),
          fixHref: resumeOnboardingHref(workspaceId, "icp"),
        };

  return (
    <StartSourcingRunButton workspaceId={workspaceId} {...(blocked === undefined ? {} : { blocked })} />
  );
}
