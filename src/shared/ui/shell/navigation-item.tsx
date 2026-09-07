"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ResolvedNavigationItem } from "@/features/navigation";

export function NavigationItem({ item }: { item: ResolvedNavigationItem }) {
  const pathname = usePathname();
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const className =
    "flex min-h-10 items-center gap-2 rounded-app-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet";

  if (item.availability === "planned") {
    return (
      <span
        className={`${className} cursor-not-allowed text-text-muted`}
        aria-disabled="true"
        title="Cette section sera disponible prochainement"
      >
        <span className="size-1.5 rounded-full bg-current opacity-50" aria-hidden="true" />
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${className} ${
        active
          ? "bg-brand-soft text-brand-navy ring-1 ring-brand-blue-violet/10"
          : "text-text-secondary hover:bg-brand-soft/60 hover:text-brand-navy"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`size-1.5 rounded-full ${active ? "brand-gradient" : "bg-current opacity-45"}`}
        aria-hidden="true"
      />
      {item.label}
    </Link>
  );
}
