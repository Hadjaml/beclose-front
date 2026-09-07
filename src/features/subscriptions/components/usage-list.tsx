import {
  usageAttentionLabels,
  type SubscriptionUsage,
} from "../model/subscription";

export function UsageList({ usage }: { usage: readonly SubscriptionUsage[] }) {
  if (usage.length === 0) return null;
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {usage.map((item) => (
        <div key={item.key} className="rounded-app-lg border border-border p-4">
          <dt className="text-sm font-medium text-text-secondary">{item.label}</dt>
          <dd className="mt-2 text-lg font-semibold text-text-primary">
            {item.formattedConsumed ?? item.consumed}
            {item.formattedLimit === undefined ? "" : ` / ${item.formattedLimit}`}
          </dd>
          {item.attention === undefined ? null : (
            <dd className="mt-1 text-sm text-text-secondary">{usageAttentionLabels[item.attention]}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}
