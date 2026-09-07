import type { ReactNode } from "react";
import { CurrentSessionMenu } from "@/features/auth";
import { backofficeNavigation, resolveNavigation } from "@/features/navigation";
import { NotificationCenter } from "@/features/notifications";
import { AppShell } from "@/shared/ui/shell";

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  const navigation = resolveNavigation(backofficeNavigation);

  return (
    <AppShell
      title="Back Office"
      navigation={navigation}
      context={<span className="hidden text-sm text-text-tertiary sm:inline">Tous les workspaces</span>}
      notifications={<NotificationCenter notifications={null} />}
      account={<CurrentSessionMenu />}
    >
      {children}
    </AppShell>
  );
}
