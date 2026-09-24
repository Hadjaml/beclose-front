import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { messageLogEntrySchema } from "../schemas/message-log-schema";
import { MessageLogList } from "./message-log-list";

const wire = {
  id: "msg-1",
  leadId: "lead-1",
  channel: "email",
  direction: "outbound",
  status: "sent",
  supersedesId: null,
  content: "Bonjour",
  sentAt: null,
  createdAt: "2026-09-24T09:00:00Z",
};

describe("MessageLogList — status vocabulary drift", () => {
  it("still renders every message, labelling an unknown status neutrally", () => {
    const messages = [
      messageLogEntrySchema.parse(wire),
      messageLogEntrySchema.parse({ ...wire, id: "msg-2", status: "some_future_status" }),
    ];
    render(<MessageLogList messages={messages} />);
    expect(screen.getAllByText(/Bonjour/)).toHaveLength(2);
    expect(screen.getByText(/Statut inconnu : some_future_status/)).toBeInTheDocument();
    expect(screen.getByText(/Envoyé/)).toBeInTheDocument();
  });
});
