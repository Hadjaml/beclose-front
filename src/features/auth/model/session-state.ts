import type { ApiError } from "@/shared/api/api-error";
import type { Session } from "./session";

export type SessionState =
  | { status: "UNKNOWN" }
  | { status: "UNAUTHENTICATED" }
  | { status: "EXPIRED" }
  | { status: "ERROR"; error: ApiError }
  | { status: "AUTHENTICATED"; session: Session };
