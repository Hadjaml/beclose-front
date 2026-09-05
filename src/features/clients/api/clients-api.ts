import type { ClientSummary } from "../schemas/client-summary-schema";

/** Consumer contract only. The endpoint and transport adapter remain undefined until the backend contract exists. */
export interface ClientsApi {
  list: (signal?: AbortSignal) => Promise<readonly ClientSummary[]>;
}
