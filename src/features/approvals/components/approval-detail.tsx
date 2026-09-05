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
    <article className="rounded-2xl border border-zinc-200 bg-white p-6">
      <header className="border-b border-zinc-100 pb-5">
        <p className="text-sm font-semibold text-zinc-600">
          {approvalStatusLabels[approval.status]}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">{approval.title}</h2>
      </header>

      <div className="mt-5 space-y-5">
        {approval.context === undefined ? null : (
          <section>
            <h3 className="text-sm font-semibold text-zinc-950">Contexte</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{approval.context}</p>
          </section>
        )}

        {approval.recommendation === undefined ? null : (
          <section className="rounded-xl bg-zinc-50 p-4">
            <h3 className="text-sm font-semibold text-zinc-950">Ce que Bewise recommande</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-800">
              {approval.recommendation.summary}
            </p>
            {approval.recommendation.reason === undefined ? null : (
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {approval.recommendation.reason}
              </p>
            )}
          </section>
        )}

        {approval.decisionOptions.length === 0 ? null : (
          <section>
            <h3 className="text-sm font-semibold text-zinc-950">Décision attendue</h3>
            <ul className="mt-2 space-y-2 text-sm text-zinc-700">
              {approval.decisionOptions.map((option) => (
                <li key={option.id}>
                  <span className="font-medium text-zinc-950">{option.label}</span>
                  {option.description === undefined ? null : (
                    <span className="block leading-6 text-zinc-600">{option.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {approval.deliveries?.length ? (
          <section>
            <h3 className="text-sm font-semibold text-zinc-950">Mise à disposition</h3>
            <ul className="mt-2 space-y-2">
              {approval.deliveries.map((delivery, index) => (
                <li
                  key={`${delivery.channel}-${delivery.destinationLabel ?? index}`}
                  className="flex flex-wrap justify-between gap-2 text-sm text-zinc-700"
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
