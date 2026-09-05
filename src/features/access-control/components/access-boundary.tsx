import type { ReactNode } from "react";
import { ForbiddenState } from "@/shared/ui/states";
import { hasAllPermissions, type AccessContext } from "../model/access-context";
import type { Permission } from "../model/permission";

interface AccessBoundaryProps {
  accessContext: AccessContext;
  requiredPermissions: readonly Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function AccessBoundary({
  accessContext,
  requiredPermissions,
  children,
  fallback = <ForbiddenState />,
}: AccessBoundaryProps) {
  return hasAllPermissions(accessContext, requiredPermissions) ? children : fallback;
}
