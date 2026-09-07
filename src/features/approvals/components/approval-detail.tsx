import {
  approvalDeliveryChannelLabels,
  approvalDeliveryStatusLabels,
  approvalStatusLabels,
  type Approval,
  type ApprovalDecisionOption,
} from "../model/approval";
import { ApprovalActions } from "./approval-actions";

interface ApprovalDetailProps {
  approval: Approval | null;
  onDecide?: (approval: Approval, option: ApprovalDecisionOption) => void;
}

export function ApprovalDetail({ approval, onDecide }: ApprovalDetailProps) {
  if (approval === null) return null;

  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <header className="border-b border-border pb-5">
        <p className="text-sm font-semibold text-text-secondary">
          {approvalStatusLabels[approval.status]}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-text-primary">{approval.title}</h2>
      </header>

      <div className="mt-5 space-y-5">
        {approval.context === undefined ? null : (
          <section>
            <h3 className="text-sm font-semibold text-text-primary">Contexte</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{approval.context}</p>
          </section>
        )}

        {approval.recommendation === undefined ? null : (
          <section className="rounded-app-lg bg-surface-muted p-4">
            <h3 className="text-sm font-semibold text-text-primary">Ce que Bewise recommande</h3>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              {approval.recommendation.summary}
            </p>
            {approval.recommendation.reason === undefined ? null : (
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {approval.recommendation.reason}
              </p>
            )}
          </section>
        )}

        {approval.decisionOptions.length === 0 ? null : (
          <section>
            <h3 className="text-sm font-semibold text-text-primary">Décision attendue</h3>
            <ul className="mt-2 space-y-2 text-sm text-text-secondary">
              {approval.decisionOptions.map((option) => (
                <li key={option.id}>
                  <span className="font-medium text-text-primary">{option.label}</span>
                  {option.description === undefined ? null : (
                    <span className="block leading-6 text-text-secondary">{option.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {approval.deliveries?.length ? (
          <section>
            <h3 className="text-sm font-semibold text-text-primary">Mise à disposition</h3>
            <ul className="mt-2 space-y-2">
              {approval.deliveries.map((delivery, index) => (
                <li
                  key={`${delivery.channel}-${delivery.destinationLabel ?? index}`}
                  className="flex flex-wrap justify-between gap-2 text-sm text-text-secondary"
                >
                  <span>
                    {approvalDeliveryChannelLabels[delivery.channel]}
                    {delivery.destinationLabel === undefined
                      ? ""
                      : ` · ${delivery.destinationLabel}`}
                  </span>
                  <span className="font-medium">
                    {approvalDeliveryStatusLabels[delivery.status]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ApprovalActions
          approval={approval}
          {...(onDecide === undefined ? {} : { onDecide })}
        />
      </div>
    </article>
  );
}
