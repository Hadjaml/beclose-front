import { describe, expect, it } from "vitest";
import { fakeClient } from "../../../../tests/support/fake-api-client";
import { createWorkspaceAppointmentsApi } from "./workspace-appointments-api";

const company = { id: "c1", name: "Acme", siren: "123456789", sector: null, headcount: null, source: "gouv_api" };
const contact = { id: "p1", fullName: "Ada", email: "ada@acme.fr", role: "CEO", linkedinUrl: null, source: null };
const appointment = {
  id: "a1",
  scheduledAt: "2026-10-01T09:00:00Z",
  status: "confirmed",
  externalEventId: "evt1",
  eventUrl: "https://www.google.com/calendar/event?eid=abc",
  leadId: "lead-1",
  company,
  contact,
};

describe("createWorkspaceAppointmentsApi (GET /organizations/{id}/appointments)", () => {
  it("asks for confirmed appointments by default and parses the real shape", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/organizations/ws-1/appointments");
      expect(options.method).toBe("GET");
      expect(options.query).toMatchObject({ status: "confirmed", limit: 200 });
      expect(options.context).toEqual({ workspaceId: "ws-1" });
      return { data: [appointment], pagination: { limit: 200, offset: 0, total: 1 } };
    });

    const page = await createWorkspaceAppointmentsApi(client).list("ws-1");

    expect(page.data[0]).toMatchObject({ id: "a1", status: "confirmed", leadId: "lead-1", eventUrl: appointment.eventUrl });
    expect(page.data[0]?.company.name).toBe("Acme");
    expect(page.pagination.total).toBe(1);
  });

  it("accepts a confirmed appointment without a calendar link (confirmed before the field existed)", async () => {
    const client = fakeClient(() => ({
      data: [{ ...appointment, eventUrl: null, externalEventId: null }],
      pagination: { limit: 200, offset: 0, total: 1 },
    }));
    const page = await createWorkspaceAppointmentsApi(client).list("ws-1");
    expect(page.data[0]?.eventUrl).toBeNull();
  });

  it("does not fail the list on a status Beclose adds later", async () => {
    const client = fakeClient(() => ({
      data: [{ ...appointment, status: "rescheduled" }],
      pagination: { limit: 200, offset: 0, total: 1 },
    }));
    const page = await createWorkspaceAppointmentsApi(client).list("ws-1");
    expect(page.data[0]?.status).toBe("rescheduled");
  });
});
