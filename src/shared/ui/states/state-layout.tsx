import type { ReactNode } from "react";

interface StateLayoutProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  role?: "alert" | "status";
}

export function StateLayout({ title, description, icon, action, role = "status" }: StateLayoutProps) {
  return (
    <section
      className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white p-8 text-center"
      role={role}
    >
      {icon}
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        {description === undefined ? null : <p className="max-w-md text-sm text-zinc-600">{description}</p>}
      </div>
      {action}
    </section>
  );
}
