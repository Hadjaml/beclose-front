import type { ReactNode } from "react";
import { StateLayout } from "./state-layout";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <StateLayout
      title={title}
      action={action}
      {...(description === undefined ? {} : { description })}
    />
  );
}
