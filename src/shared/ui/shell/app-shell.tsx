import type { ReactNode } from "react";
import type { ResolvedNavigationItem } from "@/features/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  children: ReactNode;
  navigation: readonly ResolvedNavigationItem[];
  title: string;
  context?: ReactNode;
  banner?: ReactNode;
  notifications?: ReactNode;
  account?: ReactNode;
}

export function AppShell({
  children,
  navigation,
  title,
  context,
  banner,
  notifications,
  account,
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 lg:flex">
      <Sidebar title={title} items={navigation} />
      <div className="min-w-0 flex-1">
        {banner}
        <Topbar
          title={title}
          context={context}
          notifications={notifications}
          account={account}
        />
        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
