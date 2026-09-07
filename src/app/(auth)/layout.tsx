import type { ReactNode } from "react";
import { BrandLogo } from "@/shared/ui/shell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-muted p-6">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center">
          <BrandLogo priority className="h-10 max-w-40" />
        </div>
        {children}
      </div>
    </main>
  );
}
