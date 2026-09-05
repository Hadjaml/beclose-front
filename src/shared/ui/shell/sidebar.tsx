import type { ResolvedNavigationItem } from "@/features/navigation";
import { NavigationItem } from "./navigation-item";

interface SidebarProps {
  eyebrow: string;
  title: string;
  items: readonly ResolvedNavigationItem[];
}

function NavigationGroup({
  label,
  items,
}: {
  label: string;
  items: readonly ResolvedNavigationItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="min-w-max lg:min-w-0">
      <p className="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 lg:block">
        {label}
      </p>
      <div className="flex gap-1 lg:flex-col">
        {items.map((item) => <NavigationItem key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export function Sidebar({ eyebrow, title, items }: SidebarProps) {
  const primary = items.filter((item) => item.area === "primary");
  const secondary = items.filter((item) => item.area === "secondary");

  return (
    <aside className="border-b border-zinc-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
          B
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-zinc-500">{eyebrow}</p>
          <p className="truncate text-sm font-semibold text-zinc-950">{title}</p>
        </div>
      </div>
      <nav
        aria-label="Navigation principale"
        className="flex gap-5 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:justify-between lg:overflow-y-auto lg:py-5"
      >
        <NavigationGroup label="Supervision" items={primary} />
        <NavigationGroup label="Administration" items={secondary} />
      </nav>
    </aside>
  );
}
