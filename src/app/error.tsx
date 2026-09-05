"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/ui/states";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-xl"><ErrorState onRetry={reset} /></div>
    </main>
  );
}
