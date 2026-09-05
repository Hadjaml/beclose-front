import type { ResolvedNavigationItem } from "@/features/navigation";
import { NavigationItem } from "./navigation-item";

export function ContextNavigation({ items }: { items: readonly ResolvedNavigationItem[] }) {
  return (
    <nav aria-label="Navigation du workspace" className="overflow-x-auto border-b border-zinc-200 py-3">
      <div className="flex min-w-max gap-1">
        {items.map((item) => <NavigationItem key={item.id} item={item} />)}
      </div>
    </nav>
  );
}
