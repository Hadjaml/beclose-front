# Bewise frontend

Frontend V1 de Bewise, plateforme B2B multi-client utilisée pour superviser des
systèmes d’acquisition et permettre aux clients d’intervenir lorsque nécessaire.
Le backend est développé séparément et reste la source de vérité.

## Stack

- Next.js App Router 16
- React 19 et React Compiler
- TypeScript strict
- Tailwind CSS 4
- TanStack Query pour le futur server state
- Zod pour les contrats externes et formulaires
- Vitest et Testing Library
- Playwright

## Installation

```bash
npm install
npm run dev
```

L’application est ensuite disponible sur
[http://localhost:3000](http://localhost:3000).

## Commandes

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run test:watch
npm run test:e2e
npm run build
npm start
```

Playwright utilise Chromium. Sur une nouvelle machine, installer une fois le
navigateur avec `npx playwright install chromium`.

## Architecture

```text
src/
├── app/          # routes, layouts et composition
├── features/     # domaines métier feature-first
├── providers/    # providers React applicatifs
└── shared/       # API, query keys, realtime, workspace et UI générique

tests/
├── integration/  # fonctions pures, contrats et composants
└── e2e/          # parcours et séparation des expériences
```

Une feature expose son API publique depuis `index.ts`. Les pages ne chargent
pas directement de données et aucun composant ne doit appeler `fetch()`.
L’accès réseau passera par `src/shared/api`, puis par le module `api` de la
feature concernée. Toute réponse externe devra être validée par Zod.

## Expériences

- **Back Office** : supervision globale Bewise, clients, équipe, abonnements et
  paramètres.
- **Workspace** : environnement explicitement scoped par
  `/backoffice/workspaces/[workspaceId]`.
- **Client Portal** : expérience simplifiée sous `/portal/[workspaceId]`,
  sans configuration interne ni données d’autres clients.

Les composants Prospecting, Conversations, Appointments, Performance,
Supervision et Subscription sont réutilisables entre Back Office et Portal.
Les différences de détail passent par des profils de visibilité et des
callbacks autorisés, pas par des copies des domaines.

## Isolation multi-tenant

Le `workspaceId` vient toujours de l’URL pour les routes scoped. Il est passé
explicitement aux APIs et aux query keys. Le contexte React facilite seulement
la composition et ne remplace jamais l’URL comme source de vérité. Le cache du
workspace précédent est retiré lors d’un changement de scope.

## Backend et API

Ce repository ne contient ni base de données, ni ORM, ni route handler métier,
ni faux backend. Les interfaces dans `features/*/api` sont des ports à
implémenter lorsque les endpoints existeront.

Le client HTTP central :

- envoie les cookies avec `credentials: "include"` ;
- normalise les erreurs réseau, HTTP et Zod ;
- conserve un éventuel `x-request-id` ou `x-correlation-id` ;
- exige un `workspaceId` explicite pour les opérations scoped.

## Authentification

Aucun fournisseur d’authentification n’est choisi. `AuthApi`,
`SessionProvider` et `SessionBoundary` distinguent session inconnue,
utilisateur non authentifié, session expirée et session valide.

La future implémentation doit privilégier une session serveur protégée par
cookie `HttpOnly`, `Secure` et `SameSite`. Aucun token sensible ne doit
être placé dans `localStorage` ou exposé au bundle client. Les contrôles de
permissions frontend servent uniquement à la présentation ; le backend doit
réautoriser chaque opération.

## Tests

- Vitest teste permissions, validation Zod, isolation des query keys et
  résolution des navigations.
- Testing Library vérifie que les mutations critiques restent invisibles sans
  callback.
- Playwright vérifie les routes et l’absence de fuite Back Office vers Portal.

Les données utilisées dans les tests sont isolées des chemins de production et
ne constituent pas des mocks métier de l’application.

## Variables d’environnement

Aucune variable d’environnement n’est requise tant que le backend n’est pas
raccordé. Une future URL publique d’API pourra être exposée par une variable
comme `NEXT_PUBLIC_API_BASE_URL`, car une URL publique n’est pas un secret.

Ne jamais placer de clé privée, secret OAuth, token de session ou secret de
paiement dans une variable `NEXT_PUBLIC_*`.

## Dépendances backend restantes

Le backend doit encore fournir :

- création, lecture et révocation des sessions ;
- récupération et réinitialisation de mot de passe ;
- permissions effectives, memberships et délégations View as client ;
- endpoints workspace-scoped ;
- catalogue de plans, entitlements, abonnements, factures et actions ;
- équipe, invitations et états de compte ;
- notifications et marquage comme lu ;
- providers, connexions et capacités d’intégration ;
- mutations d’approvals, handoff, rendez-vous et configuration.

Avant raccordement, définir avec l’équipe backend les enveloppes d’erreur,
l’identifiant de corrélation, la stratégie CSRF, les règles CORS, les cookies
de session et la politique d’expiration.
