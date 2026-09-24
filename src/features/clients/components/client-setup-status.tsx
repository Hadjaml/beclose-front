"use client";

import Link from "next/link";
import { resumeOnboardingHref } from "@/shared/workspace/onboarding-route";
import type { WorkspaceId } from "@/shared/workspace/workspace";

/**
 * What is left to do on a client, next to its name in the list, from the
 * `icpActive` / `bantActive` flags Beclose puts on each organization (no
 * request per row). A flag that is `null` means the backend does not send it:
 * unknown, never "missing" — nothing is shown, so the list never breaks or
 * lies.
 */
export function ClientSetupStatus({
  workspaceId,
  icpActive,
  bantActive,
}: {
  workspaceId: WorkspaceId;
  icpActive: boolean | null;
  bantActive: boolean | null;
}) {
  if (icpActive === null || bantActive === null) return null;
  if (icpActive && bantActive) return null;

  return (
    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-amber-900">
      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium">Configuration incomplète</span>
      <Link href={resumeOnboardingHref(workspaceId)} className="font-semibold underline underline-offset-2">
        Reprendre
      </Link>
    </p>
  );
}
