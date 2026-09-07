import {
  portalSubscriptionVisibility,
  SubscriptionView,
} from "@/features/subscriptions";

export default function PortalSubscriptionPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Votre offre</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-primary">Abonnement</h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Consultez votre plan, votre usage et les documents disponibles.
        </p>
      </header>
      <SubscriptionView subscription={null} visibility={portalSubscriptionVisibility} />
    </div>
  );
}
