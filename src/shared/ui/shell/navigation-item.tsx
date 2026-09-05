"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ResolvedNavigationItem } from "@/features/navigation";

export function NavigationItem({ item }: { item: ResolvedNavigationItem }) {
  const pathname = usePathname();
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const className =
    "flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

  if (item.availability === "planned") {
    return (
      <span
        className={`${className} cursor-not-allowed text-zinc-400`}
        aria-disabled="true"
        title="Cette section sera disponible prochainement"
      >
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${className} ${
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {item.label}
    </Link>
  );
}
