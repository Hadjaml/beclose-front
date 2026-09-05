import Link from "next/link";
import type { ViewAsClientContext } from "../model/view-as-client";
import { isViewAsClientContextActive } from "../model/view-as-client";

interface ViewAsClientPortalLinkProps {
  context: ViewAsClientContext | null;
  label?: string;
}

/**
 * A portal entry point is exposed only for a still-valid delegation supplied
 * by the backend. This component never creates or refreshes that delegation.
 */
export function ViewAsClientPortalLink({
  context,
  label = "Voir comme client",
}: ViewAsClientPortalLinkProps) {
  if (context === null || !isViewAsClientContextActive(context)) {
    return null;
  }

  return (
    <Link
      href={`/portal/${encodeURIComponent(context.workspaceId)}`}
      className="inline-flex min-h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
    >
      {label}
    </Link>
  );
}
