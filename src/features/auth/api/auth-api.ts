import type {
  LoginCredentials,
  PasswordReset,
  PasswordResetRequest,
  Session,
} from "../model/session";

/**
 * Transport-neutral auth port. Its future implementation should rely on a
 * secure backend session, preferably an HttpOnly cookie.
 */
export interface AuthApi {
  getCurrentSession(): Promise<Session | null>;
  login(credentials: LoginCredentials): Promise<Session>;
  logout(): Promise<void>;
  requestPasswordReset(request: PasswordResetRequest): Promise<void>;
  resetPassword(request: PasswordReset): Promise<void>;
}
