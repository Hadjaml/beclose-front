import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import {
  integrationCategoryLabels,
  type IntegrationAction,
  type IntegrationCategory,
  type IntegrationConnection,
  type WorkspaceIntegrations,
} from "../model/integration";
import { IntegrationConnectionCard } from "./integration-connection-card";

const categoryOrder: readonly IntegrationCategory[] = [
  "CRM",
  "MESSAGING",
  "CALENDAR",
  "INTERNAL_COMMUNICATION",
  "OTHER",
];

type IntegrationsViewProps =
  | { integrations: null }
  | {
      integrations: WorkspaceIntegrations;
      renderAction?: (
        connection: IntegrationConnection,
        action: IntegrationAction,
      ) => ReactNode;
    };

export function IntegrationsView(props: IntegrationsViewProps) {
  if (props.integrations === null || props.integrations.providers.length === 0) {
    return (
      <EmptyState
        title="Aucune intégration disponible"
        description="Les outils compatibles et leurs capacités apparaîtront ici lorsqu’ils seront fournis."
      />
    );
  }

  return (
    <div className="space-y-8">
      {categoryOrder.map((category) => {
        const providers = props.integrations.providers.filter(
          (provider) => provider.category === category,
        );
        if (providers.length === 0) return null;

        return (
          <section key={category} className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">
              {integrationCategoryLabels[category]}
            </h2>
            <div className="grid gap-3 lg:grid-cols-2">
              {providers.map((provider) => (
                <IntegrationConnectionCard
                  key={provider.id}
                  provider={provider}
                  connection={
                    props.integrations.connections.find(
                      (connection) => connection.providerId === provider.id,
                    ) ?? null
                  }
                  {...(props.renderAction === undefined
                    ? {}
                    : {
                        renderAction: (connection, action) => (
                          <div key={action.id}>
                            {props.renderAction?.(connection, action)}
                          </div>
                        ),
                      })}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
