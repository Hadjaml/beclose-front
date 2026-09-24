import type { ReactNode } from "react";
import { EmptyState, NotAvailableState } from "@/shared/ui/states";
import type {
  LearningDomain,
  LearningOverview as LearningOverviewData,
} from "../model/learning";
import { LearningDomainCard } from "./learning-domain-card";

interface LearningOverviewProps {
  domains: LearningOverviewData | null;
  renderHistoryAction?: (domain: LearningDomain) => ReactNode;
}

export function LearningOverview({ domains, renderHistoryAction }: LearningOverviewProps) {
  if (domains === null) return <NotAvailableState />;

  if (domains.length === 0) {
    return (
      <EmptyState
        title="Pas encore de données d’apprentissage"
        description="Elles apparaîtront après les premières recommandations confirmées ou corrigées par une personne. Bewise pourra alors dégager des enseignements et proposer des règles à valider."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {domains.map((domain) => (
        <LearningDomainCard
          key={domain.domain}
          snapshot={domain}
          historyAction={renderHistoryAction?.(domain.domain)}
        />
      ))}
    </div>
  );
}
