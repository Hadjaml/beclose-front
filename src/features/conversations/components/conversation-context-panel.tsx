import {
  ConversationOwnershipStatus,
  HandoffActions,
  HandoffRecommendationCard,
} from "@/features/human-handoff";
import { conversationIntentLabels, type ConversationInboxItem } from "../model/conversation";
import { QualificationPanel } from "./qualification-panel";
import { RecommendedActionCard } from "./recommended-action-card";

interface ConversationContextPanelProps {
  item: ConversationInboxItem;
  onTakeOver?: () => void;
  onLetSystemContinue?: () => void;
  onReturnToSystem?: () => void;
}

export function ConversationContextPanel({
  item,
  onTakeOver,
  onLetSystemContinue,
  onReturnToSystem,
}: ConversationContextPanelProps) {
  const { conversation, prospect } = item;

  return (
    <aside aria-label="Contexte commercial" className="space-y-5 rounded-app-lg border border-border bg-surface p-5">
      <header>
        <p className="text-sm font-medium text-text-secondary">
          {prospect.contact?.fullName ?? prospect.contact?.role ?? "Prospect"}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-text-primary">{prospect.company.name}</h2>
      </header>

      <ConversationOwnershipStatus ownership={conversation.ownership} />

      {conversation.handoffRecommendation === undefined ? null : (
        <HandoffRecommendationCard recommendation={conversation.handoffRecommendation} />
      )}

      <HandoffActions
        ownership={conversation.ownership}
        {...(conversation.handoffRecommendation === undefined
          ? {}
          : { recommendation: conversation.handoffRecommendation })}
        {...(onTakeOver === undefined ? {} : { onTakeOver })}
        {...(onLetSystemContinue === undefined ? {} : { onLetSystemContinue })}
        {...(onReturnToSystem === undefined ? {} : { onReturnToSystem })}
      />

      {conversation.summary === undefined ? null : (
        <section>
          <h3 className="text-sm font-semibold text-text-primary">Résumé</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{conversation.summary}</p>
        </section>
      )}

      {conversation.intent === undefined ? null : (
        <section>
          <h3 className="text-sm font-semibold text-text-primary">Intention détectée</h3>
          <p className="mt-2 text-sm text-text-secondary">{conversationIntentLabels[conversation.intent]}</p>
        </section>
      )}

      {conversation.qualification === undefined ? null : (
        <QualificationPanel qualification={conversation.qualification} />
      )}

      {conversation.recommendation === undefined ? null : (
        <RecommendedActionCard recommendation={conversation.recommendation} />
      )}
    </aside>
  );
}
