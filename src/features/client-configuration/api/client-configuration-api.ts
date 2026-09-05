import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { ClientConfiguration } from "../model/client-configuration";

/**
 * Consumer-side port for the future backend adapter. It intentionally does not
 * prescribe an endpoint, payload envelope, or transport.
 */
export interface ClientConfigurationApi {
  getConfiguration(
    workspaceId: WorkspaceId,
    signal?: AbortSignal,
  ): Promise<ClientConfiguration | null>;
}
