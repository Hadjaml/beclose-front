import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppointmentsView } from "@/features/appointments/components/appointments-view";
import { LearningOverview } from "@/features/learning";
import { SettingsView } from "@/features/settings";
import { SubscriptionView } from "@/features/subscriptions/components/subscription-view";
import { SubscriptionsOverview } from "@/features/subscriptions";
import { GlobalSupervisionView, WorkspaceOverviewView } from "@/features/supervision";
import { TeamView } from "@/features/team";

/**
 * Audit C03 (2026-09-24): screens whose data is not wired to any backend
 * endpoint said "Aucun … pour le moment / apparaîtront ici", which lets a
 * user believe data will show up once there is some. `null` means "not
 * wired" and must say so; an empty list ([]) is a real, different state.
 */
const notAvailable = "Non disponible dans cette version";

const screens: [string, () => React.ReactElement][] = [
  ["global supervision", () => <GlobalSupervisionView supervision={null} />],
  ["workspace overview", () => <WorkspaceOverviewView supervision={null} />],
  ["learning", () => <LearningOverview domains={null} />],
  ["settings", () => <SettingsView settings={null} />],
  ["workspace subscription", () => <SubscriptionView subscription={null} />],
  ["subscriptions overview", () => <SubscriptionsOverview subscriptions={null} />],
  ["team", () => <TeamView team={null} />],
  ["appointments", () => <AppointmentsView items={null} />],
];

describe("screens not wired to a backend say so", () => {
  it.each(screens)("%s shows an explicit 'not available' state, not a hopeful empty one", (_name, view) => {
    render(view());

    expect(screen.getByText(notAvailable)).toBeInTheDocument();
    expect(screen.queryByText(/apparaîtront/i)).not.toBeInTheDocument();
  });

  it("an empty list stays a real empty state, distinct from 'not available'", () => {
    render(<SubscriptionsOverview subscriptions={[]} />);
    expect(screen.queryByText(notAvailable)).not.toBeInTheDocument();
    expect(screen.getByText("Aucun abonnement disponible")).toBeInTheDocument();
  });
});
