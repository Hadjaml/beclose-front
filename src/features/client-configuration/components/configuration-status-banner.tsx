import Link from "next/link";
import { resumeOnboardingHref } from "@/shared/workspace/onboarding-route";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { describeGeographyScope } from "../model/geography-scope";
import {
  missingConfiguration,
  missingConfigurationLabels,
  sourcingBlockerLabel,
  sourcingBlockers,
  type ReadinessInput,
} from "../model/configuration-readiness";

const linkClass = "text-sm font-semibold underline underline-offset-2";

/**
 * Where the client's configuration stands, so an organization left half-set-up
 * is never shown as configured and always offers a way to finish it (audit
 * A06/A08). It never says "prêt": Gmail and Telegram are outside this data.
 */
export function ConfigurationStatusBanner({
  workspaceId,
  configuration,
}: {
  workspaceId: WorkspaceId;
  configuration: ReadinessInput;
}) {
  const missing = missingConfiguration(configuration);
  const blockers = sourcingBlockers(configuration);
  // A missing ICP profile is already reported as incomplete.
  const sourcingIssues = blockers.filter((blocker) => blocker !== "ICP_PROFILE_MISSING");

  const geography = configuration.sourcingReadiness?.geography;
  const geographyNote =
    geography === undefined || geography === null ? null : <GeographyNote geography={geography} />;

  if (missing.length === 0 && sourcingIssues.length === 0) {
    return (
      <div className="space-y-3">
        <div role="status" className="rounded-app-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-950">Profils en place</p>
          <p className="mt-1 text-sm text-emerald-800">
            Le profil ICP et la grille BANT sont enregistrés ; le sourcing peut être lancé.
          </p>
        </div>
        {geographyNote}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {geographyNote}
      {missing.length === 0 ? null : (
        <div role="status" className="rounded-app-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-950">Configuration incomplète</p>
          <p className="mt-1 text-sm text-amber-900">
            Il manque : {missing.map((item) => missingConfigurationLabels[item]).join(", ")}.
            Reprendre poursuit l’onboarding de ce client, sans le recréer.
          </p>
          <Link href={resumeOnboardingHref(workspaceId)} className={`${linkClass} mt-2 inline-block text-amber-950`}>
            Reprendre la configuration
          </Link>
        </div>
      )}
      {sourcingIssues.length === 0 ? null : (
        <div role="status" className="rounded-app-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">Sourcing impossible</p>
          <ul className="mt-1 list-inside list-disc text-sm text-red-800">
            {sourcingIssues.map((blocker) => (
              <li key={blocker}>{sourcingBlockerLabel(blocker)}</li>
            ))}
          </ul>
          <Link
            href={resumeOnboardingHref(workspaceId, "icp")}
            className={`${linkClass} mt-2 inline-block text-red-900`}
          >
            Nouvelle version du profil ICP
          </Link>
        </div>
      )}
    </div>
  );
}

const geographyToneClass = {
  info: "border-border bg-surface text-text-secondary",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  neutral: "border-border bg-surface-muted text-text-secondary",
} as const;

function GeographyNote({ geography }: { geography: NonNullable<NonNullable<ReadinessInput["sourcingReadiness"]>["geography"]> }) {
  const { tone, text } = describeGeographyScope(geography);
  return (
    <p role="status" className={`rounded-app-lg border p-3 text-sm ${geographyToneClass[tone]}`}>
      {text}
    </p>
  );
}
