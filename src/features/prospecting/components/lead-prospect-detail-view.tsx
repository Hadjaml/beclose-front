import { MessageLogSection } from "@/features/supervision";
import {
  authorityStatusLabels,
  budgetStatusLabels,
  needStatusLabels,
  timingStatusLabels,
} from "@/features/client-configuration";
import {
  handoffReasonLabel,
  handoffReasonToneClass,
  icpFitLabel,
  leadStatusLabel,
  qualificationResultLabel,
} from "../model/lead-prospect";
import type { LeadProspectDetail as LeadProspectDetailModel } from "../model/lead-prospect-detail";

const criterionLabels = {
  budget: budgetStatusLabels,
  authority: authorityStatusLabels,
  need: needStatusLabels,
  timing: timingStatusLabels,
} as const;

const criterionTitles = {
  budget: "Budget",
  authority: "Authority",
  need: "Need",
  timing: "Timing",
} as const;

function CriterionCard({
  title,
  statusLabel,
  evidence,
  sourceInteractionId,
}: {
  title: string;
  statusLabel: string;
  evidence?: string;
  sourceInteractionId?: string;
}) {
  return (
    <div className="rounded-app-lg border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{title}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{statusLabel}</p>
      {evidence === undefined ? null : (
        <p className="mt-2 text-sm leading-6 text-text-secondary">{evidence}</p>
      )}
      {sourceInteractionId === undefined ? null : (
        <a
          href={`#message-${sourceInteractionId}`}
          className="mt-2 inline-block text-xs font-semibold text-brand-blue-violet hover:underline"
        >
          Voir le message source ↓
        </a>
      )}
    </div>
  );
}

export function LeadProspectDetailView({ prospect }: { prospect: LeadProspectDetailModel }) {
  const { company, contact, qualificationEvaluation } = prospect;

  return (
    <div className="space-y-8">
      <section className="rounded-app-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold text-text-primary">{company.name}</h2>
        {company.sector === null ? null : <p className="text-text-secondary">{company.sector}</p>}
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Contact</dt>
            <dd className="mt-1 text-sm text-text-primary">
              {contact.fullName ?? contact.email}
              {contact.role === null ? null : <span className="text-text-tertiary"> — {contact.role}</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Statut</dt>
            <dd className="mt-1 text-sm text-text-primary">
              {leadStatusLabel(prospect.status)}
              {prospect.status === "handed_off" && prospect.handoffReason !== null ? (
                <span className={`ml-2 ${handoffReasonToneClass(prospect.handoffReason)}`}>
                  {handoffReasonLabel(prospect.handoffReason)}
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Résultat de qualification
            </dt>
            <dd className="mt-1 text-sm text-text-primary">
              {prospect.qualificationResult === null
                ? "Non évalué"
                : qualificationResultLabel(prospect.qualificationResult)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Adéquation ICP
            </dt>
            <dd className="mt-1 text-sm text-text-primary">
              {prospect.icpFit === null ? "Non évalué" : icpFitLabel(prospect.icpFit)}
            </dd>
          </div>
        </dl>
      </section>

      {prospect.icpProfile === null && prospect.qualificationCriteria === null ? null : (
        <div className="space-y-1 text-sm text-text-tertiary">
          {prospect.icpProfile === null ? null : (
            <p>
              Ciblé avec le profil ICP « {prospect.icpProfile.name} » v{prospect.icpProfile.version}.
            </p>
          )}
          {prospect.qualificationCriteria === null ? null : (
            <p>
              Évalué avec la grille BANT « {prospect.qualificationCriteria.name} » v
              {prospect.qualificationCriteria.version}.
            </p>
          )}
        </div>
      )}

      {prospect.icpEvaluation !== null &&
      "reasons" in prospect.icpEvaluation &&
      prospect.icpEvaluation.reasons &&
      prospect.icpEvaluation.reasons.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">Critères de ciblage ICP</h2>
          <div className="rounded-app-lg border border-border bg-surface p-4">
            <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
              {prospect.icpEvaluation.reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Évaluation BANT</h2>
        {qualificationEvaluation === null ? (
          <p className="text-sm text-text-secondary">Pas encore évalué.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(["budget", "authority", "need", "timing"] as const).map((criterion) => {
              const field = qualificationEvaluation[criterion];
              const labels = criterionLabels[criterion] as Record<string, string>;
              return (
                <CriterionCard
                  key={criterion}
                  title={criterionTitles[criterion]}
                  statusLabel={labels[field.status] ?? field.status}
                  {...(field.evidence === undefined ? {} : { evidence: field.evidence })}
                  {...(field.sourceInteractionId === undefined
                    ? {}
                    : { sourceInteractionId: field.sourceInteractionId })}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Messages de ce prospect</h2>
        <MessageLogSection leadId={prospect.leadId} />
      </section>
    </div>
  );
}
