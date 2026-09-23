---
name: project-context
description: Canonical project context for all agents working in this project.
---

# bewise-app — pilotage du développement et coordination

## ⚠️ PROTOCOLE OBLIGATOIRE — à lire en premier, à chaque session

1. Lire dans l'ordre : `../../../AGENTS.md`, ce `SKILL.md`, `avancement.md`, puis `conventions.md`.
2. Ce dépôt est frontend-only (voir `AGENTS.md`, section « Scope »). Le backend qui le consomme se développe séparément dans **`../Beclose`** (dépôt Python distinct) — voir « Lien avec Beclose » ci-dessous avant d'inventer un contrat d'API ou une forme de donnée.
3. Avant tout changement touchant à Next.js (config, conventions de fichiers, API de rendu), consulter la doc locale sous `node_modules/next/dist/docs/` (résolue depuis ce dépôt — cette version de Next.js contient des changements non standards par rapport à ce qu'un modèle a pu apprendre). Si `node_modules` est absent, lancer `npm ci` d'abord.
4. À la fin de CHAQUE étape notable, avant de commiter : mettre à jour `avancement.md` (dater, résumer ce qui a été fait et vérifié réellement — pas supposé). Si une convention ou un piège est découvert en cours de route, l'ajouter dans `conventions.md`.

## Qui travaille, et comment

- Utilisateur : Rochinel (Nanfa Rochinel), co-fondateur technique de Bewise — même personne que sur `../Beclose` (identité confirmée : e-mail de session `bienvenunanfa@gmail.com`, identique à l'identité git locale configurée sur Beclose).
- Ce dépôt n'avait pas de skill projet avant le 2026-09-11 — contrairement à Beclose qui en a un depuis le début. La posture exacte (qui commit, qui push, granularité de validation) n'a pas encore été explicitement tranchée ici ; ne pas supposer qu'elle est identique à celle de Beclose sans confirmation. Par défaut : une branche par chantier (pas par micro-tâche), commits explicites, push/PR seulement sur demande.
- Respecter le périmètre fixé par l'utilisateur ; poser l'objectif, les dépendances, le propriétaire et les critères d'acceptation observables.

## Coordination multi-agents (AgentMesh)

- Propriété de fichiers disjointe, ou worktrees isolés, pour des rédacteurs concurrents. Un relecteur lit par défaut. Ne jamais écraser le travail d'un autre agent ni forcer une fusion.
- **PostgreSQL** détient l'état opérationnel : tâches, checkpoints, handoffs et décisions.
- **Redis** détient l'état vivant : présence en direct et routage.
- **Markdown** est un résumé lisible pour l'humain, jamais la file de tâches opérationnelle.
- Préserver les contrôles de permissions natifs.
- Avant une reprise de rôle : charger le checkpoint durable et le handoff structuré ; préserver branches, fichiers, tests, décisions, blocages et travail en attente.
- Hygiène : tableaux d'arguments pour les sous-processus, délais bornés sur toute I/O externe. Aucun secret dans le versionnement, les logs ou les checkpoints.

## Lien avec Beclose

`bewise-app` est le futur frontend (Back Office Bewise + Portail client) du
produit développé dans `../Beclose` : un outil interne de génération de leads
qualifiés par IA (sourcing → premier contact → qualification conversationnelle
→ rendez-vous → dépôt du lead dans le CRM client). Les domaines métier des
deux dépôts se recouvrent presque terme à terme :

| Frontend (`src/features/*`) | Backend Beclose | Lien |
|---|---|---|
| `prospecting` | `core/sourcing/`, `workers/sourcing.py` | statut `identified` |
| `outreach` | `core/channels/`, `core/messaging/`, `workers/outreach.py` | `contacted` → `bounced`/`opted_out` |
| `conversations` | brique 3 qualification (agent à boucle d'outils, pas encore codée) | `replied` → `qualified` |
| `approvals` | `interactions.status = pending_approval`, `workers/approve_cli.py`, bot Telegram | file de validation découplée du canal |
| `human-handoff` | transition `replied → handed_off` (EF-403b) | besoin fort sans RDV |
| `commercial-handoff` | statut terminal `handed_off`, ou `booked → converted` | dépôt lead + résumé en CRM |
| `appointments` | `core/models/appointment.py`, statut `booked` | — |
| `client-configuration` / `onboarding` | `core/models/qualification_criteria.py` (grille BANT versionnée) | initialisée avec le client |
| `clients` / workspace | `organizations` + Row Level Security par `organization_id` | `workspaceId` frontend ↔ cloisonnement RLS |
| `integrations` | `organization_credential`, OAuth Gmail, sourcing (Hunter/gouv) | — |
| `notifications` | `core/notifications/` (Telegram, canal V1) | — |
| `supervision` | vue back-office sur `core/state_machine.py` (10 statuts) | — |
| `subscriptions` | forfait + abonnement mensuel indexé au volume de leads (jamais au closed-won) | — |
| `learning` | apprentissage de la grille BANT depuis les issues closed-won/lost | — |
| `performance` | mesure de précision — **volontairement non définie** des deux côtés (décision ouverte Beclose, ne pas trancher seul) | — |

Points de cohérence à connaître :

- **Aucune API REST n'existe encore côté Beclose** (`api/__init__.py` vide) —
  c'est attendu, pas un oubli. Les modules `features/*/api` de ce dépôt
  restent des ports (interfaces), jamais un faux backend.
- **Isolation multi-tenant symétrique** : `workspaceId` explicite obligatoire
  ici ↔ `organization_id` + RLS obligatoire côté Beclose. Même règle, deux
  couches.
- **Deux machines à états distinctes, pas encore réconciliées** :
  `LeadStatus` (backend, `identified…converted` + 4 terminaux) et les statuts
  d'approbation frontend (`approvalStatusSchema` :
  `PENDING/APPROVED/MODIFIED/REJECTED/EXPIRED/CANCELED`). Vocabulaire à
  aligner quand le contrat d'API sera écrit — ne pas fusionner soi-même sans
  l'utilisateur.
- **Canal abstrait des deux côtés** : Beclose interdit « e-mail » en dur
  (`AGENTS.md` Beclose, section Canaux) ; le frontend a déjà
  `approvalDeliveryChannelSchema` (`PORTAL/CRM/SLACK/TEAMS/EMAIL/OTHER`).
  Cohérent, à garder ainsi.
- **Sécurité alignée** : Beclose impose `SecretStr` partout et chiffrement
  applicatif des secrets en base ; ce dépôt interdit tokens en
  `localStorage`/`NEXT_PUBLIC_*` et attend un cookie `HttpOnly`. Pas de
  conflit, ne pas relâcher l'un en supposant que l'autre compense.

Avant de raccorder les deux dépôts pour de vrai : fixer ensemble l'enveloppe
d'erreur, l'id de corrélation (`x-request-id`/`x-correlation-id`), CORS/CSRF,
les cookies de session, et le vocabulaire de statuts ci-dessus.

## Conteneurisation

Ce dépôt est conteneurisé (`Dockerfile`, `.dockerignore`, `docker-compose.yml`
à la racine) — voir `conventions.md` pour le détail vérifié
réellement (build + run + requêtes HTTP réussies). `npm run dev` reste le
chemin normal en développement ; Docker sert à valider l'image de production
et, plus tard, à un déploiement self-hosted aux côtés de Beclose.

## Références et état d'avancement

- Avancement et historique validé : [`avancement.md`](avancement.md)
- Conventions techniques et pièges documentés : [`conventions.md`](conventions.md)
- Documents et décisions d'architecture : `references/`
