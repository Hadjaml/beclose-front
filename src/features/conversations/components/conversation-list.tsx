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
    <nav aria-label="Conversations" className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-100">
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
                    ? "w-full border-l-2 border-zinc-950 bg-zinc-50 px-4 py-4 text-left"
                    : "w-full border-l-2 border-transparent px-4 py-4 text-left hover:bg-zinc-50"
                }
              >
                <span className="block truncate text-sm font-semibold text-zinc-950">{displayName}</span>
                <span className="mt-1 block truncate text-sm text-zinc-600">{prospect.company.name}</span>
                <span className="mt-2 block text-xs font-medium text-zinc-500">
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
