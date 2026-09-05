import type { ReactNode } from "react";
import { backofficeNavigation, resolveNavigation } from "@/features/navigation";
import { AppShell } from "@/shared/ui/shell";

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  const navigation = resolveNavigation(backofficeNavigation);

  return (
    <AppShell
      eyebrow="Vue Bewise"
      title="Back Office"
      navigation={navigation}
      context={<span className="hidden text-sm text-zinc-500 sm:inline">Tous les workspaces</span>}
    >
      {children}
    </AppShell>
  );
}
