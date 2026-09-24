import { NotAvailableState } from "@/shared/ui/states";
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
      <NotAvailableState description="Le plan, l’usage et la facturation ne sont pas encore raccordés." />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-secondary">Plan actuel</p>
            <h2 className="mt-1 text-2xl font-semibold text-text-primary">
              {subscription.plan.commercialName}
            </h2>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
        {subscription.renewsAt === undefined ? null : (
          <p className="mt-4 text-sm text-text-secondary">
            Renouvellement prévu : <time dateTime={subscription.renewsAt}>{subscription.renewsAt}</time>
          </p>
        )}
        {visibility.showPaymentSummary && subscription.paymentSummary !== undefined ? (
          <p className="mt-2 text-sm text-text-secondary">
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
          <h2 className="text-lg font-semibold text-text-primary">Usage</h2>
          <UsageList usage={subscription.usage} />
        </section>
      )}

      {visibility.showEntitlements && subscription.plan.entitlements.length > 0 ? (
        <section className="rounded-app-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">Capacités du plan</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
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
          <h2 className="text-lg font-semibold text-text-primary">Factures</h2>
          <InvoiceList
            invoices={subscription.invoices}
            {...(renderInvoiceAction === undefined ? {} : { renderAction: renderInvoiceAction })}
          />
        </section>
      )}

      {visibility.showHistory && subscription.history?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">Historique</h2>
          <ol className="divide-y divide-border rounded-app-lg border border-border bg-surface px-5">
            {subscription.history.map((entry) => (
              <li key={entry.id} className="py-4">
                <p className="text-sm font-semibold text-text-primary">{entry.label}</p>
                {entry.summary === undefined ? null : (
                  <p className="mt-1 text-sm text-text-secondary">{entry.summary}</p>
                )}
                <time dateTime={entry.occurredAt} className="mt-1 block text-xs text-text-tertiary">
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
