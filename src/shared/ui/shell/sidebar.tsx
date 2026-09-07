import type { ResolvedNavigationItem } from "@/features/navigation";
import { BrandLogo } from "./brand-logo";
import { NavigationItem } from "./navigation-item";

interface SidebarProps {
  title: string;
  items: readonly ResolvedNavigationItem[];
  brandTone?: "standard" | "subtle";
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
      <p className="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary lg:block">
        {label}
      </p>
      <div className="flex gap-1 lg:flex-col">
        {items.map((item) => <NavigationItem key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export function Sidebar({ title, items, brandTone = "standard" }: SidebarProps) {
  const primary = items.filter((item) => item.area === "primary");
  const secondary = items.filter((item) => item.area === "secondary");

  return (
    <aside className="border-b border-border bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-66 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center gap-3 border-b border-border px-4 lg:h-20 lg:px-5">
        <BrandLogo compact subtle={brandTone === "subtle"} priority className="lg:hidden" />
        <BrandLogo subtle={brandTone === "subtle"} priority className="hidden max-w-24 lg:block" />
        <span className="h-7 w-px bg-border" aria-hidden="true" />
        <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          {title}
        </p>
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
