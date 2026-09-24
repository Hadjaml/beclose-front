"use client";

import Link from "next/link";
import {
  missingConfiguration,
  sourcingBlockers,
  useWorkspaceConfigurationQuery,
} from "@/features/client-configuration";
import { resumeOnboardingHref } from "@/shared/workspace/onboarding-route";
import type { WorkspaceId } from "@/shared/workspace/workspace";

/**
 * What is left to do on a client, next to its name in the list. Reads the
 * client's configuration (one cached request per row, shared with its
 * Configuration page). A configuration that is loading or unreadable shows
 * nothing: a status that cannot be established must never break the list.
 */
export function ClientSetupStatus({ workspaceId }: { workspaceId: WorkspaceId }) {
  const query = useWorkspaceConfigurationQuery(workspaceId);
  if (!query.isSuccess) return null;

  const missing = missingConfiguration(query.data);
  const blockers = sourcingBlockers(query.data);

  if (missing.length > 0) {
    return (
      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-amber-900">
        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium">Configuration incomplète</span>
        <Link href={resumeOnboardingHref(workspaceId)} className="font-semibold underline underline-offset-2">
          Reprendre
        </Link>
      </p>
    );
  }
  if (blockers.length > 0) {
    return (
      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-red-800">
        <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium">
          Sourcing impossible : profil ICP sans secteur exploitable
        </span>
        <Link
          href={resumeOnboardingHref(workspaceId, "icp")}
          className="font-semibold underline underline-offset-2"
        >
          Corriger
        </Link>
      </p>
    );
  }
  return null;
}
