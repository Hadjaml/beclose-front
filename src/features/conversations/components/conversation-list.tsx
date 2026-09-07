import {
  conversationStateLabels,
  type ConversationInboxItem,
} from "../model/conversation";

interface ConversationListProps {
  items: readonly ConversationInboxItem[];
  activeConversationId: string | undefined;
  onSelect: (conversationId: string) => void;
}

export function ConversationList({
  items,
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  return (
    <nav aria-label="Conversations" className="overflow-hidden rounded-app-lg border border-border bg-surface">
      <ul className="divide-y divide-border">
        {items.map(({ conversation, prospect }) => {
          const contactName =
            prospect.contact?.fullName ??
            [prospect.contact?.firstName, prospect.contact?.lastName].filter(Boolean).join(" ") ??
            prospect.company.name;
          const displayName = contactName.length > 0 ? contactName : prospect.company.name;

          return (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                aria-current={activeConversationId === conversation.id ? "true" : undefined}
                className={
                  activeConversationId === conversation.id
                    ? "w-full border-l-2 border-brand-blue-violet bg-surface-muted px-4 py-4 text-left"
                    : "w-full border-l-2 border-transparent px-4 py-4 text-left hover:bg-surface-muted"
                }
              >
                <span className="block truncate text-sm font-semibold text-text-primary">{displayName}</span>
                <span className="mt-1 block truncate text-sm text-text-secondary">{prospect.company.name}</span>
                <span className="mt-2 block text-xs font-medium text-text-tertiary">
                  {conversationStateLabels[conversation.state]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
