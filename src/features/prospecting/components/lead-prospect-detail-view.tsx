import { MessageLogSection } from "@/features/supervision";
import { bantStatusLabel } from "@/features/client-configuration";
import {
  handoffReasonLabel,
  handoffReasonToneClass,
  icpFitLabel,
  leadStatusLabel,
  qualificationResultLabel,
} from "../model/lead-prospect";
import { icpVerdictBasisLabel } from "../model/icp-evaluation";
import { formatDate } from "@/shared/format/format-date-time";
import type { LeadProspectDetail as LeadProspectDetailModel } from "../model/lead-prospect-detail";

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

type IcpRecord = Extract<NonNullable<LeadProspectDetailModel["icpEvaluation"]>, { verdictBasis: unknown }>;

function EvidenceList({ items }: { items: IcpRecord["positiveSignals"][number]["evidence"] }) {
  return (
    <ul className="mt-1 space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-sm leading-6 text-text-secondary">
          « {item.text} »
          {item.sourceInteractionId === null ? null : (
            <a
              href={`#message-${item.sourceInteractionId}`}
              className="ml-2 text-xs font-semibold text-brand-blue-violet hover:underline"
            >
              Voir le message source ↓
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function SignalGroup({ title, signals }: { title: string; signals: IcpRecord["positiveSignals"] }) {
  if (signals.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{title}</h3>
      <ul className="mt-1 space-y-2">
        {signals.map((signal, index) => (
          <li key={index}>
            <p className="text-sm font-medium text-text-primary">{signal.signal}</p>
            <EvidenceList items={signal.evidence} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The per-lead ICP evaluation (B06): the agent observes signals with their
 * evidence, deterministic rules give the verdict. It never changes the lead's
 * status, and the rules are provisional. */
function IcpEvaluationSection({
  evaluation,
  qualificationResult,
}: {
  evaluation: IcpRecord;
  qualificationResult: LeadProspectDetailModel["qualificationResult"];
}) {
  const weak = evaluation.verdict === "weak" || evaluation.verdict === "none";
  return (
    <section aria-labelledby="icp-evaluation-title" className="space-y-3">
      <h2 id="icp-evaluation-title" className="text-lg font-semibold text-text-primary">
        Évaluation ICP
      </h2>
      <div className="space-y-4 rounded-app-lg border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-text-primary">
          Adéquation : {icpFitLabel(evaluation.verdict)}
          {evaluation.profileVersion === null ? null : (
            <span className="font-normal text-text-secondary"> — profil ICP version {evaluation.profileVersion}</span>
          )}
          {evaluation.evaluatedAt === null ? null : (
            <span className="font-normal text-text-secondary"> — évaluée le {formatDate(evaluation.evaluatedAt)}</span>
          )}
        </p>
        {evaluation.verdictBasis.length === 0 ? null : (
          <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
            {evaluation.verdictBasis.map((code) => (
              <li key={code}>{icpVerdictBasisLabel(code)}</li>
            ))}
          </ul>
        )}
        {qualificationResult === "qualified" && weak ? (
          <p className="text-sm text-amber-900">
            Ce prospect est qualifié selon la grille BANT, mais son adéquation ICP est faible : les
            deux mesures répondent à des questions différentes (l’intérêt exprimé d’un côté, la
            ressemblance avec la cible de l’autre).
          </p>
        ) : null}
        <SignalGroup title="Critères éliminatoires observés" signals={evaluation.hardDisqualifiers} />
        <SignalGroup title="Signaux positifs" signals={evaluation.positiveSignals} />
        <SignalGroup title="Signaux négatifs" signals={evaluation.negativeSignals} />
        {evaluation.commercialMaturity === null ? null : (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Maturité commerciale : {evaluation.commercialMaturity.level}
            </h3>
            <EvidenceList items={evaluation.commercialMaturity.evidence} />
          </div>
        )}
        <p className="text-xs leading-5 text-text-tertiary">
          Le verdict ICP ne change jamais le statut du prospect. Les règles qui le calculent sont
          provisoires.
        </p>
      </div>
    </section>
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

      {prospect.icpEvaluation !== null && "verdictBasis" in prospect.icpEvaluation ? (
        <IcpEvaluationSection
          evaluation={prospect.icpEvaluation}
          qualificationResult={prospect.qualificationResult}
        />
      ) : null}

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
              return (
                <CriterionCard
                  key={criterion}
                  title={criterionTitles[criterion]}
                  statusLabel={bantStatusLabel(criterion, field.status)}
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
