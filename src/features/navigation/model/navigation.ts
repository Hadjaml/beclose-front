import type { AccessContext, Permission } from "@/features/access-control";
import { hasAllPermissions } from "@/features/access-control";
import type { WorkspaceId } from "@/shared/workspace/workspace";

export type NavigationArea = "primary" | "secondary";

export interface NavigationItemDefinition {
  id: string;
  label: string;
  area: NavigationArea;
  href: string | ((workspaceId: WorkspaceId) => string);
  availability: "available" | "planned";
  exact?: boolean;
  requiredPermissions?: readonly Permission[];
}

export interface ResolvedNavigationItem
  extends Omit<NavigationItemDefinition, "href"> {
  href: string;
}

export function resolveNavigation(
  definitions: readonly NavigationItemDefinition[],
  options: {
    accessContext?: AccessContext | null;
    workspaceId?: WorkspaceId;
  } = {},
): ResolvedNavigationItem[] {
  return definitions.flatMap((definition) => {
    if (definition.availability !== "available") {
      return [];
    }

    const requirements = definition.requiredPermissions ?? [];
    if (
      requirements.length > 0 &&
      (options.accessContext === undefined ||
        options.accessContext === null ||
        !hasAllPermissions(options.accessContext, requirements))
    ) {
      return [];
    }

    if (typeof definition.href === "function") {
      if (options.workspaceId === undefined) return [];
      return [{ ...definition, href: definition.href(options.workspaceId) }];
    }

    return [{ ...definition, href: definition.href }];
  });
}
