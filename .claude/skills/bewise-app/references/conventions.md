# Conventions — bewise-app

Ce fichier se remplit à mesure que des choix concrets sont pris pendant le
développement (au-delà de ce que couvre déjà `AGENTS.md`).

## Git — nommage des branches (2026-09-11)

Convention alignée sur celle documentée dans le skill projet de `../Beclose`
(`.claude/skills/bewise-beclose/`) pour le même utilisateur :

- Format `<type>/<slug-kebab-case>`, `type` = préfixe Conventional Commits
  (`feat`, `fix`, `chore`, `build`, `docs`, `refactor`, `test`).
- **Une branche par chantier**, pas par micro-tâche — ni par « MVP » comme
  Beclose (ce dépôt n'a pas de découpage MVP explicite à ce jour), ni un
  commit = une branche.
- Commits en Conventional Commits, référençant un identifiant d'exigence du
  cahier des charges Beclose quand c'est pertinent au frontend.
- Exemple réel : `chore/agent-skill-and-docker` (2026-09-11) — création de ce
  skill + containerisation, un seul chantier, une seule branche, comme
  demandé explicitement par l'utilisateur (« tout sera fait dans une
  branche »).

## Docker (2026-09-11)

- **Build multi-stage** (`deps` → `builder` → `runner`) dans `Dockerfile`,
  basé sur `node:24-alpine` (aligné sur le Node local, `v24.19.0` au moment du
  scaffold — pas de version fixée dans `package.json` via `engines`, à ajouter
  si un jour la CI construit l'image).
- **`next.config.ts` : `output: "standalone"`** — Output File Tracing de
  Next.js, confirmé toujours d'actualité et non déprécié en lisant
  `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md`
  et le guide self-hosting
  (`.../02-guides/self-hosting.md`) avant d'y toucher, comme l'exige
  `AGENTS.md`. Les « Adapters » (nouveauté Next 16,
  `01-app/03-api-reference/07-adapters/`) sont pour des intégrations
  plateforme (type Vercel) — pas requis pour un self-host Docker classique,
  `output: "standalone"` reste le bon mécanisme.
- Le dossier `.next/standalone` ne copie pas `public/` ni `.next/static` par
  conception (pensés pour un CDN) — copiés manuellement dans le stage
  `runner` du `Dockerfile`, exactement comme documenté dans le guide
  self-hosting.
- **Vérifié réellement, pas supposé** : `docker build` passe (~105 s à froid,
  cache npm/Next inclus), le conteneur démarre (`node server.js`, `Ready in
  0ms`), `GET /login` répond `200`, `GET /` répond `307` (redirection —
  attendue, session inconnue côté `SessionBoundary`). Testé sur le port hôte
  `3050` pour ne pas entrer en conflit avec un `next dev` local sur `3000`.
- **`docker-compose.yml`** : un seul service `web` (ce dépôt n'a pas de base
  de données propre, voir `AGENTS.md` « Scope » — pas de service
  Postgres/Redis à containeriser ici, contrairement à Beclose). Nommage de
  service/`container_name` aligné sur la convention Beclose (services nommés
  explicitement, healthcheck systématique). Healthcheck en `wget --spider`
  (busybox, déjà présent dans `node:alpine`, pas de `curl` à installer en
  plus).
- **Aucune variable d'environnement requise pour builder l'image** —
  cohérent avec le README (« Aucune variable d'environnement n'est requise
  tant que le backend n'est pas raccordé »). Un `NEXT_PUBLIC_API_BASE_URL`
  pourra être ajouté en `environment:`/build arg le jour du raccordement,
  jamais un secret (voir `AGENTS.md`, section Backend-driven capabilities).

## Vérification avant commit sur ce dépôt (rappel `AGENTS.md`)

- **Résolu (2026-09-11)** : `npm run typecheck` échouait sur
  `Cannot find name 'LayoutProps'` si `.next/types` n'existait pas encore
  (les helpers globaux `LayoutProps<...>`/`PageProps<...>`, nouveauté Next
  16, n'étaient générés que par `next build`/`next dev`). Corrigé en
  changeant le script vers `next typegen && tsc --noEmit --incremental
  false` — `next typegen` (CLI ajoutée en Next 15.5, voir
  `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`)
  génère les types de routes sans build complet, explicitement recommandé
  pour le typecheck en CI/CD par la doc elle-même. Vérifié réellement :
  `rm -rf .next && npm run typecheck` passe seul, sans autre commande avant.
- Séquence complète vérifiée le 2026-09-11 : `npm ci` → `npm run typecheck`
  (seul, 0 erreur) → `npm run lint` (0 erreur) → `npm test` (10 tests, 0
  échec) → `npm run build` (13 routes générées, succès) → `docker build` →
  `docker run` + requêtes HTTP réelles → `gitleaks detect` en local (0 leak).
- **`npx playwright install chromium` échoue sur cette machine de dev**
  (« Playwright does not support chromium on ubuntu26.04-x64 ») — limite de
  la sandbox locale (Ubuntu 26.04), pas un problème du projet. Non vérifié
  localement pour cette raison ; le job `e2e` de la CI tourne sur
  `ubuntu-latest` (GitHub-hosted, 24.04 au moment de l'écriture), une
  plateforme supportée par Playwright — à vérifier sur un vrai run GitHub
  Actions dès le premier push, ne pas supposer que ça marche parce que ça
  compile.

## CI GitHub Actions (2026-09-11)

- `.github/workflows/ci.yml` : jobs indépendants et parallèles
  (`lint`/`typecheck`/`test`/`build`/`docker`/`secrets-scan`), même
  philosophie que la CI de Beclose, sauf `e2e` qui dépend de `build`
  (`needs: build`) — c'est le job le plus coûteux (install navigateur +
  exécution), pas la peine de le lancer si l'app ne build même pas ; il ne
  réutilise pas l'artefact de `build` pour autant, `playwright.config.ts`
  démarre son propre `npm run dev`.
- **Déclencheurs différents de Beclose, volontairement** : `push` limité à
  `branches: [main]` + `pull_request` (au lieu de `push` sur toutes les
  branches) pour éviter un double run sur une branche avec PR ouverte
  (push + pull_request se déclenchant tous les deux sur le même commit).
  Conséquence assumée : une branche poussée sans PR ouverte n'a pas de CI
  tant qu'aucune PR n'existe. `workflow_dispatch` ajouté pour lancer
  manuellement si besoin. `concurrency` avec `cancel-in-progress: true` pour
  ne pas empiler les runs sur une même branche.
- `permissions: contents: read` au niveau du workflow (principe du moindre
  privilège) — aucun job ne pousse d'image ni n'écrit dans le repo.
- Cache Next.js (`.next/cache`) dans le job `build` : recette officielle
  GitHub Actions de
  `node_modules/next/dist/docs/01-app/02-guides/ci-build-caching.md`, pas
  inventée.
- Cache des navigateurs Playwright (`~/.cache/ms-playwright`) dans le job
  `e2e`, avec bascule `playwright install --with-deps` (cache miss) vs
  `playwright install-deps` seul (cache hit, dépendances OS uniquement) —
  recette standard Playwright.
- Job `docker` : `docker/build-push-action@v6` avec `push: false` et cache
  `type=gha` — valide seulement que le `Dockerfile` build encore, ne publie
  nulle part (aucun registre configuré à ce stade).
- `secrets-scan` : binaire CLI `gitleaks` en direct (`curl` + `tar`), pas
  l'action `gitleaks/gitleaks-action@v2` — même choix que Beclose, pour la
  même raison (licence désormais requise pour les repos d'organisation).
  Vérifié en local avant de commiter (`gitleaks detect --source . --verbose
  --redact`, 15 commits scannés, 0 leak) pour ne pas reproduire le
  démarrage en CI rouge rencontré sur Beclose.
- `.github/dependabot.yml` ajouté (npm hebdomadaire, groupé
  Next.js/React/TanStack Query pour éviter une mise à jour partielle qui
  casse les peer deps ; github-actions hebdomadaire séparément).
- **Non fait délibérément** : pas de règle de protection de branche
  configurée (changerait un paramètre du repo GitHub, action à part,
  seulement sur demande explicite) ; pas de publication d'image Docker
  (aucun registre/cible de déploiement choisi).
- `.nvmrc` (`24`) et `"engines": {"node": ">=24"}` dans `package.json`
  ajoutés pour que dev local, CI (`actions/setup-node`,
  `node-version-file: .nvmrc`) et `Dockerfile` (`node:24-alpine`) restent
  alignés sans dupliquer le numéro de version à trois endroits différents.

## Contrat d'API v0 Back Office — coordination transverse (2026-09-11)

Coordination pilotée par une session dédiée (skill global
`~/.claude/skills/bewise-techlead/`, décisions/trace complète dans son
`references/decisions.md` et `references/open-questions.md`) — ce fichier
n'en garde qu'un résumé propre à ce dépôt.

- Proposition envoyée : 6 endpoints en lecture seule (clients, overview par
  statut de lead, prospects, configuration, intégrations, messages),
  enveloppe `{ data, pagination? }`, enums backend (`LeadStatus`,
  `InteractionStatus`) passés **tels quels** — pas de fusion avec le
  vocabulaire de statuts frontend existant, encore un point ouvert non
  tranché par l'utilisateur.
- **Confirmé par l'utilisateur** : `organizationId` (Beclose) ≡ `workspaceId`
  (frontend), 1:1 — pas de mapping à construire.
- **Bloquant confirmé** : Beclose n'a aucun système d'authentification/
  session à ce jour. Tant que ça n'est pas débloqué côté Beclose, **ne pas
  écrire de vrais schémas Zod ni d'implémentation concrète des `*Api`** pour
  ce contrat — seul l'affinage du texte du contrat (formes de réponse,
  enveloppe d'erreur) peut continuer.
- Les schémas Zod déjà présents dans ce dépôt (ex. `clientSummarySchema`
  avec `onboardingProgress`/`systemStatus`/`subscriptionStatus`) sont plus
  spéculatifs que ce que Beclose peut fournir aujourd'hui — à revoir une
  fois le contrat calé, pas à faire semblant qu'ils correspondent déjà.

## Auth réelle — Back Office (2026-09-11)

- **Endpoints réels** (`api/routers/auth.py` côté Beclose, vérifiés dans le
  code, pas supposés) : `POST /auth/login` (`{email,password}` →
  `{id,email,full_name}`), `POST /auth/logout` (`204`), `GET /auth/me`
  (même forme que login). Cookie `beclose_session`, `HttpOnly`,
  `SameSite=lax`, `Secure` piloté par `Settings.api_cookie_secure` (défaut
  `True`) — **en dev local sans HTTPS, Beclose doit tourner avec
  `API_COOKIE_SECURE=false`, sinon le navigateur rejette le cookie et
  l'auth échoue silencieusement contre `localhost:3000`**.
- **Erreurs** : FastAPI par défaut, `{"detail": "..."}` — pas l'enveloppe
  `{error:{code,message,details}}` proposée dans le brouillon de contrat
  v0 transverse. `normalizeApiError`/`ApiError` n'en dépendent pas
  (`details` reste `unknown`), donc rien à corriger côté front pour
  l'instant, juste à ne pas supposer que l'enveloppe proposée a été
  adoptée telle quelle.
- **`sessionSchema` volontairement réduit** à `{ user }` — pas d'`id`
  de session ni d'`expiresAt` : le backend ne les expose pas au client
  (cookie opaque, expiry gérée côté serveur). Ne pas réinventer ces champs.
- **`createAuthApi`** (`features/auth/api/auth-api.ts`) : `getCurrentSession`
  intercepte un `401` et renvoie `null` (pas une erreur) — c'est le signal
  `UNAUTHENTICATED`, distinct d'un vrai échec réseau/serveur (`ERROR`).
  `requestPasswordReset`/`resetPassword` rejettent immédiatement avec
  `ApiError({kind:"unsupported"})`, sans appeler le backend : Beclose n'a
  et n'aura pas de flux de reset self-serve avant longtemps (comptes
  provisionnés par `workers/create_staff_user.py`).
- **Nouveau kind `"unsupported"`** sur `ApiError`/`ApiErrorKind`
  (`shared/api/api-error.ts`) — pour « cette action n'existe pas côté
  backend », distinct de `"configuration"` (config front invalide) et de
  `"http"` (le backend a répondu une erreur). Présentation dédiée ajoutée
  à `getApiErrorPresentation`.
- **`SessionBoundary` gagne un état `ERROR`** (vérification de session
  impossible — réseau/serveur, pas juste « pas connecté ») avec bouton
  « Réessayer » (`ErrorState`, déjà existant dans `shared/ui/states`).
- **`RequireSession` protège le Back Office, pas le Portail** — l'auth
  livrée est interne Bewise uniquement (pas de compte client dans Beclose,
  onboarding client fait à la main). Gater le Portail derrière ce login
  aurait été sémantiquement faux (ça laisserait entendre que les clients
  se connectent avec des identifiants staff).
- **Bug de course trouvé en testant réellement** (`session-provider.test.tsx`) :
  `queryClient.clear()` sur un `useQuery` de session encore monté déclenche
  un refetch automatique de l'observer — si on fait `clear()` puis
  `setQueryData(sessionKey, null)`, le refetch (résolu de façon asynchrone,
  après le `setQueryData` synchrone) peut écraser le `null` et repasser
  l'état à `AUTHENTICATED` juste après un logout, y compris si l'appel
  réseau de logout a échoué. Corrigé : `removeQueries({predicate: ...})`
  exclut explicitement la clé de session du nettoyage plutôt que de tout
  `clear()` sans distinction, donc son cache n'est jamais retiré (pas de
  refetch déclenché) et le `setQueryData(null)` qui suit reste la valeur
  finale.
- **`tests/setup.ts` ne nettoyait jamais le DOM entre les tests** — Testing
  Library n'enregistre son `afterEach(cleanup)` automatique que si
  `vitest.config.mts` a `test.globals: true`, ce qui n'est pas le cas ici.
  Invisible jusqu'ici (aucun fichier de test précédent ne faisait plusieurs
  `render()` dans le même fichier) ; découvert en écrivant
  `session-provider.test.tsx` (plusieurs `it` avec `render()` chacun,
  `getByTestId` trouvait plusieurs éléments). Corrigé en ajoutant
  `afterEach(cleanup)` dans `tests/setup.ts` — bénéficie à toute la suite,
  pas seulement au nouveau fichier.
- **`backendClient`** (`shared/api/backend-client.ts`) : singleton
  `ApiClient` construit depuis `NEXT_PUBLIC_API_BASE_URL`, avec repli sur
  `http://localhost:8000` (défaut `uvicorn` local de Beclose,
  `uv run uvicorn api.main:app --reload`) pour que `npm run dev` reste
  utilisable sans config le jour où Beclose tourne en local.
- **`.gitignore` corrigé** : le motif `.env*` avalait aussi `.env.example`
  (jamais remarqué avant, ce fichier n'existait pas) — ajout de
  `!.env.example` pour le laisser commitable, comme sur Beclose.

## Principe : câbler un endpoint réel sur une feature dont le modèle est plus
## riche que le backend (2026-09-11)

Rencontré 5 fois de suite en câblant les 6 endpoints v0 (clients, overview,
prospects, configuration, intégrations, messages) — presque toutes les
features du scaffold V1 ont un modèle Zod pensé pour un backend plus
avancé (statuts calculés, workflow d'approbation en UI, catalogue
d'intégrations, wizard de configuration détaillé) que ce que Beclose fournit
aujourd'hui (RLS/state machine bruts, pas de champs dérivés).

**Ne jamais forcer une vraie réponse API dans un modèle existant qui exige
des champs que le backend ne fournit pas** — ça obligerait à inventer une
valeur (ex. un `systemStatus` calculé, un découpage de texte libre en
sections structurées). À la place : nouveau schéma/modèle/api/composant,
strictement aligné sur la vraie réponse (voir `api/routers/organizations.py`
côté Beclose comme source de vérité, pas les schémas front pré-existants),
ajouté à côté. L'ancien modèle reste inchangé et non câblé — il documente
une intention future (mutations, workflow), pas une régression à corriger.
Nommage : préfixer par le concept réel (`LeadProspect`, `WorkspaceLeadPipeline`,
`WorkspaceConfiguration`, `WorkspaceIntegrationStatus`, `MessageLogEntry`)
plutôt que réutiliser le nom déjà pris par le modèle spéculatif.

`shared/api/api-envelope.ts` centralise l'enveloppe `{data}`/
`{data,pagination}` commune à ces 6 endpoints — à réutiliser pour tout
nouvel endpoint Beclose plutôt que de la redéfinir.
