import type { Session } from "./session";

export type SessionState =
  | { status: "UNKNOWN" }
  | { status: "UNAUTHENTICATED" }
  | { status: "EXPIRED" }
  | { status: "AUTHENTICATED"; session: Session };
