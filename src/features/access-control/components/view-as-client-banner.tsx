"use client";

import type { ViewAsClientContext } from "../model/view-as-client";
import { isViewAsClientContextActive } from "../model/view-as-client";

type ViewAsClientBannerProps =
  | { context: null }
  | { context: ViewAsClientContext; onExit: () => void };

export function ViewAsClientBanner(props: ViewAsClientBannerProps) {
  if (props.context === null || !isViewAsClientContextActive(props.context)) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-amber-100 px-4 py-2 text-center text-sm text-amber-950 ring-1 ring-inset ring-amber-200">
      <p>Vous visualisez actuellement l’expérience Client Admin de ce workspace.</p>
      <button
        type="button"
        className="font-semibold underline decoration-amber-500 underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
        onClick={props.onExit}
      >
        Quitter le mode aperçu
      </button>
    </div>
  );
}
