"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { SessionState } from "../model/session-state";

interface SessionContextValue {
  state: SessionState;
  setState: (state: SessionState) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  initialState = { status: "UNKNOWN" },
}: {
  children: ReactNode;
  initialState?: SessionState;
}) {
  const [state, setState] = useState<SessionState>(initialState);
  return (
    <SessionContext.Provider value={{ state, setState }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
