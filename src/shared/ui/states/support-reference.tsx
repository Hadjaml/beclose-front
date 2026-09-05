"use client";

import { useState } from "react";

export function SupportReference({ requestId }: { requestId: string }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(requestId);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
      <span>
        Référence support : <code className="select-all">{requestId}</code>
      </span>
      <button
        type="button"
        onClick={() => void copyReference()}
        className="font-semibold text-zinc-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
      >
        Copier
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Référence copiée" : copyFailed ? "Copie impossible" : ""}
      </span>
    </div>
  );
}
