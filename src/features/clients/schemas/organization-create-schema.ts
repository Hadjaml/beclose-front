import { z } from "zod";

/**
 * Request-body / form-draft shape for `POST /organizations`
 * (`OrganizationCreateRequest`, `api/routers/organizations.py`, EF-601/602,
 * 2026-09-23) — the first step of the real client-provisioning flow
 * (replaces the free-text onboarding prototype, never wired to any API).
 */
export const organizationCreateSchema = z.object({
  name: z.string().trim().min(1),
  pitch: z.string().trim().min(1).nullable(),
  signature: z.string().trim().min(1).nullable(),
  telegramChatId: z.string().trim().min(1).nullable(),
});
export type OrganizationCreateValue = z.infer<typeof organizationCreateSchema>;

export const emptyOrganizationCreateDraft: OrganizationCreateValue = {
  name: "",
  pitch: null,
  signature: null,
  telegramChatId: null,
};

/**
 * French, business-oriented help text — copied verbatim from Beclose's own
 * `Field(description=...)` on `OrganizationCreateRequest`.
 */
export const organizationFieldHints = {
  name: "Nom du client, affiché partout dans le back-office (page Clients, en-tête des pages suivantes). Le seul champ obligatoire pour créer une organisation.",
  pitch: "Résumé de l'offre et du ton de ce client, utilisé comme contexte par l'IA pour personnaliser les messages générés. Peut être renseigné plus tard, une fois le site du client consulté à l'onboarding.",
  signature:
    "Signature à ajouter telle quelle à la fin de chaque message généré (ex. « Camille — Bewise »). Sans elle, l'IA invente parfois un nom : à renseigner avant le premier envoi réel, peut rester vide pour l'instant.",
  telegramChatId:
    "Identifiant du groupe Telegram dédié à ce client, une fois le bot ajouté au groupe. Peut être renseigné plus tard : sans lui, les messages restent en attente de validation mais ne sont notifiés nulle part.",
} as const;
