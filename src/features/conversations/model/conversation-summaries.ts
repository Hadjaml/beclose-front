import type { MessageLogEntry } from "@/features/supervision";
import { sortChronologically } from "./chat-message";
import { splitQuotedReply } from "./quoted-reply";

export interface ConversationSummary {
  leadId: string;
  title: string;
  subtitle: string | null;
  lastAt: string;
  lastPreview: string;
  messageCount: number;
}

interface KnownProspect {
  leadId: string;
  company: { name: string };
  contact: { fullName: string | null; email: string };
}

const PREVIEW_LENGTH = 80;
const SHORT_REFERENCE_LENGTH = 8;

/** One entry per prospect that has at least one message, most recent
 * activity first. The prospect's name comes from the prospects list; a
 * prospect that list does not cover (older than the loaded page) keeps a
 * short reference instead of a wrong or empty name. */
export function summarizeConversations(
  messages: readonly MessageLogEntry[],
  prospects: readonly KnownProspect[],
): ConversationSummary[] {
  const byLead = new Map<string, MessageLogEntry[]>();
  for (const message of messages) {
    byLead.set(message.leadId, [...(byLead.get(message.leadId) ?? []), message]);
  }
  const prospectById = new Map(prospects.map((prospect) => [prospect.leadId, prospect]));

  const summaries = [...byLead.entries()].map(([leadId, leadMessages]): ConversationSummary => {
    const last = sortChronologically(leadMessages).at(-1) as MessageLogEntry;
    const prospect = prospectById.get(leadId);
    const text = last.direction === "inbound" ? splitQuotedReply(last.content).fresh : last.content;
    const preview = text.length > PREVIEW_LENGTH ? `${text.slice(0, PREVIEW_LENGTH)}…` : text;
    return {
      leadId,
      title: prospect?.company.name ?? `Prospect ${leadId.slice(0, SHORT_REFERENCE_LENGTH)}`,
      subtitle: prospect === undefined ? null : (prospect.contact.fullName ?? prospect.contact.email),
      lastAt: last.sentAt ?? last.createdAt,
      lastPreview: preview,
      messageCount: leadMessages.length,
    };
  });

  return summaries.sort((left, right) => Date.parse(right.lastAt) - Date.parse(left.lastAt));
}
