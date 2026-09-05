import { EmptyState } from "@/shared/ui/states";
import type {
  Invoice,
  Subscription,
  SubscriptionAction,
} from "../model/subscription";
import { InvoiceList } from "./invoice-list";
import { SubscriptionActions } from "./subscription-actions";
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { UsageList } from "./usage-list";

export interface SubscriptionVisibility {
  showEntitlements: boolean;
  showPaymentSummary: boolean;
  showHistory: boolean;
}

export const backofficeSubscriptionVisibility: SubscriptionVisibility = {
  showEntitlements: true,
  showPaymentSummary: true,
  showHistory: true,
};

export const portalSubscriptionVisibility: SubscriptionVisibility = {
  showEntitlements: false,
  showPaymentSummary: true,
  showHistory: false,
};

export function SubscriptionView({
  subscription,
  visibility = backofficeSubscriptionVisibility,
  onAction,
  renderInvoiceAction,
}: {
  subscription: Subscription | null;
  visibility?: SubscriptionVisibility;
  onAction?: (subscription: Subscription, action: SubscriptionAction) => void;
  renderInvoiceAction?: (invoice: Invoice) => React.ReactNode;
}) {
  if (subscription === null) {
    return (
      <EmptyState
        title="Aucun abonnement disponible"
        description="Le plan, l’usage et les informations de facturation apparaîtront ici lorsqu’ils seront fournis."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-600">Plan actuel</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              {subscription.plan.commercialName}
            </h2>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
        {subscription.renewsAt === undefined ? null : (
          <p className="mt-4 text-sm text-zinc-600">
            Renouvellement prévu : <time dateTime={subscription.renewsAt}>{subscription.renewsAt}</time>
          </p>
        )}
        {visibility.showPaymentSummary && subscription.paymentSummary !== undefined ? (
          <p className="mt-2 text-sm text-zinc-600">
            Paiement : {subscription.paymentSummary.label}
          </p>
        ) : null}
        <div className="mt-5">
          <SubscriptionActions
            subscription={subscription}
            {...(onAction === undefined ? {} : { onAction })}
          />
        </div>
      </section>

      {subscription.usage.length === 0 ? null : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-950">Usage</h2>
          <UsageList usage={subscription.usage} />
        </section>
      )}

      {visibility.showEntitlements && subscription.plan.entitlements.length > 0 ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Capacités du plan</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            {subscription.plan.entitlements.map((entitlement) => (
              <li key={entitlement.key}>
                {entitlement.label} · {entitlement.enabled ? "Incluse" : "Non incluse"}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {subscription.invoices.length === 0 ? null : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-950">Factures</h2>
          <InvoiceList
            invoices={subscription.invoices}
            {...(renderInvoiceAction === undefined ? {} : { renderAction: renderInvoiceAction })}
          />
        </section>
      )}

      {visibility.showHistory && subscription.history?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-950">Historique</h2>
          <ol className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white px-5">
            {subscription.history.map((entry) => (
              <li key={entry.id} className="py-4">
                <p className="text-sm font-semibold text-zinc-950">{entry.label}</p>
                {entry.summary === undefined ? null : (
                  <p className="mt-1 text-sm text-zinc-600">{entry.summary}</p>
                )}
                <time dateTime={entry.occurredAt} className="mt-1 block text-xs text-zinc-500">
                  {entry.occurredAt}
                </time>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
