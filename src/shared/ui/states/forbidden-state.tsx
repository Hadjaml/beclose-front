import type { ReactNode } from "react";
import { StateLayout } from "./state-layout";

interface ForbiddenStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ForbiddenState({
  title = "Accès non autorisé",
  description = "Vous ne disposez pas des permissions nécessaires.",
  action,
}: ForbiddenStateProps) {
  return <StateLayout title={title} description={description} action={action} />;
}
