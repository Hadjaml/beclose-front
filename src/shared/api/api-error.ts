import { ZodError } from "zod";

export type ApiErrorKind =
  | "aborted"
  | "configuration"
  | "http"
  | "network"
  | "parse"
  | "unsupported"
  | "validation"
  | "unknown";

interface ApiErrorOptions {
  kind: ApiErrorKind;
  message: string;
  cause?: unknown;
  status?: number;
  details?: unknown;
  requestId?: string;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;
  readonly details: unknown;
  readonly requestId: string | undefined;

  constructor({ kind, message, cause, status, details, requestId }: ApiErrorOptions) {
    super(message, { cause });
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.details = details;
    this.requestId = requestId;
  }
}

export interface ApiErrorPresentation {
  title: string;
  description: string;
  requestId?: string;
  sessionExpired?: boolean;
}

export function getApiErrorPresentation(error: ApiError): ApiErrorPresentation {
  const base = error.requestId === undefined ? {} : { requestId: error.requestId };
  if (error.kind === "network") {
    return {
      title: "Connexion impossible",
      description: "Vérifiez votre connexion puis réessayez.",
      ...base,
    };
  }
  if (error.kind === "unsupported") {
    return {
      title: "Fonctionnalité indisponible",
      description: "Cette action n’est pas encore proposée. Contactez un administrateur.",
      ...base,
    };
  }
  switch (error.status) {
    case 401:
      return {
        title: "Session expirée",
        description: "Reconnectez-vous pour continuer.",
        sessionExpired: true,
        ...base,
      };
    case 403:
      return {
        title: "Accès non autorisé",
        description: "Vous ne disposez pas des permissions nécessaires.",
        ...base,
      };
    case 404:
      return {
        title: "Ressource introuvable",
        description: "Cette ressource n’existe pas ou n’est plus disponible.",
        ...base,
      };
    case 409:
      return {
        title: "Modification impossible",
        description: "Les données ont changé. Actualisez la page avant de réessayer.",
        ...base,
      };
    case 422:
      return {
        title: "Informations à corriger",
        description: "Vérifiez les informations indiquées puis réessayez.",
        ...base,
      };
    case 429:
      return {
        title: "Trop de demandes",
        description: "Patientez quelques instants avant de réessayer.",
        ...base,
      };
    default:
      if (error.status !== undefined && error.status >= 500) {
        return {
          title: "Service temporairement indisponible",
          description: "Réessayez dans quelques instants.",
          ...base,
        };
      }
      return {
        title: "Une erreur est survenue",
        description: "Réessayez dans quelques instants.",
        ...base,
      };
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof ZodError) {
    return new ApiError({
      kind: "validation",
      message: "The API response does not match the expected contract.",
      cause: error,
      details: error.issues,
    });
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError({ kind: "aborted", message: "The API request was cancelled.", cause: error });
  }
  if (error instanceof TypeError) {
    return new ApiError({ kind: "network", message: "The API could not be reached.", cause: error });
  }
  return new ApiError({ kind: "unknown", message: "An unexpected API error occurred.", cause: error });
}
