import type { ReactNode } from "react";
import type { ClientConfigurationSectionId } from "../model/client-configuration";

interface ConfigurationSectionProps {
  id: ClientConfigurationSectionId;
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
  saveStatus?: ReactNode;
}

export function ConfigurationSection({
  id,
  title,
  description,
  children,
  action,
  saveStatus,
}: ConfigurationSectionProps) {
  const titleId = `configuration-${id}-title`;

  return (
    <section aria-labelledby={titleId} className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-lg font-semibold text-zinc-950">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus}
          {action}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
