"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { useWorkspace } from "@/shared/workspace/workspace-context";
import { useSourcingRunsQuery } from "../api/use-sourcing-runs-query";
import { SourcingRunsList } from "./sourcing-runs-list";

export function SourcingRunsSection() {
  const { activeWorkspaceId } = useWorkspace();
  if (activeWorkspaceId === null) return null;

  return <SourcingRunsSectionForWorkspace workspaceId={activeWorkspaceId} />;
}

function SourcingRunsSectionForWorkspace({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useSourcingRunsQuery(workspaceId);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Derniers sourcings</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Le bilan par étape explique pourquoi un run produit peu de prospects.
        </p>
      </div>
      {query.isPending ? <LoadingState label="Chargement des sourcings…" /> : null}
      {query.isError ? (
        <ErrorState
          title="Impossible de charger les sourcings"
          onRetry={() => void query.refetch()}
        />
      ) : null}
      {query.isSuccess ? <SourcingRunsList runs={query.data} /> : null}
    </section>
  );
}
