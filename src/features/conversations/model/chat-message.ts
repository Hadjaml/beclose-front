/**
 * How a message of the audit log must look in a chat. Only `sent` is a
 * message that really left; everything else on the outbound side is a draft
 * or a discarded one and must never read as an exchanged message. Anything
 * unrecognised is `unknown` — never guessed into one of the others.
 */
export type ChatMessageKind = "received" | "sent" | "awaiting" | "discarded" | "unknown";

export function chatMessageKind({ direction, status }: {
  direction: string;
  status: string | null;
}): ChatMessageKind {
  if (direction === "inbound") return "received";
  if (direction !== "outbound") return "unknown";
  switch (status) {
    case "sent":
      return "sent";
    case "pending_approval":
    case "approved":
      return "awaiting";
    case "rejected":
    case "superseded":
    case "cancelled":
      return "discarded";
    default:
      return "unknown";
  }
}

/** Oldest first (by send time, else creation time). Returns a new array. */
export function sortChronologically<T extends { sentAt: string | null; createdAt: string }>(
  messages: readonly T[],
): T[] {
  const moment = (message: T) => Date.parse(message.sentAt ?? message.createdAt);
  return [...messages].sort((left, right) => moment(left) - moment(right));
}
