import {
  backofficeSubscriptionVisibility,
  SubscriptionView,
} from "@/features/subscriptions";

export default function WorkspaceSubscriptionPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Contrat client</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-primary">Abonnement</h1>
      </header>
      <SubscriptionView subscription={null} visibility={backofficeSubscriptionVisibility} />
    </div>
  );
}
