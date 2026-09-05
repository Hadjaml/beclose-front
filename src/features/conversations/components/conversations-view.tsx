"use client";

import { useState } from "react";
import { EmptyState } from "@/shared/ui/states";
import type { ConversationInboxItem } from "../model/conversation";
import { ConversationContextPanel } from "./conversation-context-panel";
import {
  ConversationFilters,
  type ConversationFilter,
} from "./conversation-filters";
import { ConversationList } from "./conversation-list";
import { ConversationsEmptyState } from "./conversations-empty-state";
import { MessageThread } from "./message-thread";

type ConversationsViewProps =
  | { items: null }
  | {
      items: readonly ConversationInboxItem[];
      formatTimestamp: (timestamp: string) => string;
      onTakeOver: (conversationId: string) => void;
      onLetSystemContinue: (conversationId: string) => void;
      onReturnToSystem: (conversationId: string) => void;
    };

function matchesFilter(item: ConversationInboxItem, filter: ConversationFilter) {
  const { conversation } = item;
  switch (filter) {
    case "AGENT_ACTIVE":
      return conversation.ownership.owner === "AGENT" && conversation.state === "ACTIVE";
    case "MONITORING":
      return conversation.state === "MONITORING";
    case "INTERVENTION_REQUIRED":
      return (
        conversation.state === "INTERVENTION_REQUIRED" ||
        conversation.handoffRecommendation?.recommended === true
      );
    case "HUMAN":
      return conversation.ownership.owner === "HUMAN";
    case "ALL":
      return true;
  }
}

export function ConversationsView(props: ConversationsViewProps) {
  const [filter, setFilter] = useState<ConversationFilter>("ALL");
  const [activeConversationId, setActiveConversationId] = useState<string>();

  if (props.items === null || props.items.length === 0) {
    return <ConversationsEmptyState />;
  }

  const visibleItems = props.items.filter((item) => matchesFilter(item, filter));
  const activeItem =
    visibleItems.find(({ conversation }) => conversation.id === activeConversationId) ??
    visibleItems[0];

  return (
    <div className="space-y-4">
      <ConversationFilters value={filter} onChange={setFilter} />
      {activeItem === undefined ? (
        <EmptyState
          title="Aucune conversation dans cette vue"
          description="Choisissez une autre vue pour retrouver les conversations disponibles."
        />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(22rem,1fr)_21rem]">
          <ConversationList
            items={visibleItems}
            activeConversationId={activeItem.conversation.id}
            onSelect={setActiveConversationId}
          />
          <MessageThread
            conversation={activeItem.conversation}
            formatTimestamp={props.formatTimestamp}
          />
          <div className="lg:col-span-2 xl:col-span-1">
            <ConversationContextPanel
              item={activeItem}
              onTakeOver={() => props.onTakeOver(activeItem.conversation.id)}
              onLetSystemContinue={() => props.onLetSystemContinue(activeItem.conversation.id)}
              onReturnToSystem={() => props.onReturnToSystem(activeItem.conversation.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
