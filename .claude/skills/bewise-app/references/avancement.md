# État d'avancement — bewise-app

> 🔄 **Ce fichier est la source de vérité.** À mettre à jour à la fin de
> chaque étape, avant le commit. Toute session reprenant le travail lit ce
> fichier pour savoir où on en est exactement.

**Dernière mise à jour** : 2026-09-11 · **Par** : Claude Code (session
`session_01UQr35VuriyDCxiZKYMPZuM`)

## Création du skill projet + containerisation (2026-09-11)

Premier skill projet pour ce dépôt (n'existait pas avant, contrairement à
`../Beclose` qui en a un depuis son scaffold). Fait sur une branche dédiée
(`chore/agent-skill-and-docker`), à la demande explicite de l'utilisateur —
voir « Git » dans `references/conventions.md` pour le choix de nom.

- **Analyse préalable** : lecture de `bewise-app` (architecture feature-first,
  `AGENTS.md`) et de `../Beclose` (backend Python : `AGENTS.md`, `README.md`,
  `core/state_machine.py`, `core/models/lead.py`) pour établir le lien entre
  les deux dépôts avant d'écrire quoi que ce soit — voir « Lien avec Beclose »
  dans `SKILL.md`, table de correspondance features ↔ briques/statuts
  backend.
- **`.claude/skills/bewise-app/`** créé : `SKILL.md` + `references/avancement.md`
  (ce fichier) + `references/conventions.md`, même structure que le skill
  Beclose.
- **Containerisation** :
  - `next.config.ts` : ajout de `output: "standalone"`, après lecture de la
    doc locale (`node_modules/next/dist/docs/...`, requis par `AGENTS.md` —
    `npm ci` lancé d'abord car `node_modules` était absent). Confirmé non
    déprécié malgré les « Adapters » introduits en Next 16 (voir
    `conventions.md`).
  - `Dockerfile` (multi-stage `deps`/`builder`/`runner`, `node:24-alpine`),
    `.dockerignore`, `docker-compose.yml` (service unique `web`, pas de base
    de données — ce dépôt est frontend-only).
  - **Vérifié réellement** : `npm run lint` (0 erreur), `npm run build` (13
    routes générées, succès), `npm run typecheck` (0 erreur après le premier
    build — voir le piège `LayoutProps`/`PageProps` noté dans
    `conventions.md`), `docker build` (image `bewise-app:local` construite
    avec succès), `docker run` sur le port `3050` avec requêtes HTTP réelles
    (`GET /login` → `200`, `GET /` → `307`, logs du serveur standalone
    propres). Conteneur de test supprimé après vérification.
- **Non fait à ce stade** : push (commit fait en local sur
  `chore/agent-skill-and-docker`), et tout raccordement réel au backend
  Beclose (aucune API n'existe encore côté Beclose pour ce faire).

## CI GitHub Actions (2026-09-11, même branche, même chantier)

- `.github/workflows/ci.yml` créé : jobs `lint`, `typecheck`, `test`,
  `build`, `e2e`, `docker`, `secrets-scan`. Voir « CI GitHub Actions » dans
  `references/conventions.md` pour le détail de chaque choix et sa
  justification (cache Next.js officiel, cache Playwright, `docker
  build-push-action` sans push, gitleaks en CLI direct, déclencheurs
  `push: [main]` + `pull_request` au lieu de `push` illimité).
- `.github/dependabot.yml` créé (npm hebdomadaire groupé Next/React/Query,
  github-actions hebdomadaire).
- **Correction en cours de route** : `npm run typecheck` échouait seul
  (`Cannot find name 'LayoutProps'`, avant tout build) — corrigé en changeant
  le script vers `next typegen && tsc --noEmit --incremental false`
  (commande dédiée découverte en lisant
  `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`,
  recommandée explicitement par Next.js pour le typecheck en CI). Vérifié
  réellement (`rm -rf .next && npm run typecheck` passe seul).
- **Vérifié réellement avant de commiter** : `npm run lint` (0 erreur),
  `npm run typecheck` (0 erreur, seul), `npm test` (10 tests, 0 échec),
  `npm run build` (13 routes, succès), `docker build` (image reconstruite
  avec succès après les changements de `package.json`), `gitleaks detect
  --source . --verbose --redact` en local (15 commits scannés, 0 leak — pour
  ne pas reproduire le démarrage en CI rouge rencontré sur Beclose).
- **Non vérifié localement** : le job `e2e` (Playwright). `npx playwright
  install chromium` échoue sur cette machine de dev
  (« Playwright does not support chromium on ubuntu26.04-x64 », limite de la
  sandbox locale). Le job tourne sur `ubuntu-latest` côté GitHub Actions
  (plateforme supportée par Playwright) — **à vérifier sur le premier run
  réel après push**, ne pas supposer que ça marche sans l'avoir vu tourner.
- **Non fait délibérément** : pas de protection de branche configurée (
  paramètre du repo GitHub, à faire seulement sur demande explicite), pas de
  publication d'image Docker vers un registre (aucune cible de déploiement
  choisie à ce stade).

## Auth réelle — Back Office (2026-09-11, branche `feat/wire-auth-api`)

Beclose a livré une auth interne Bewise minimale (`api/routers/auth.py` :
`POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, cookie `HttpOnly`
`beclose_session`) — vérifié directement dans le code Beclose (commit
`29e30ed`), pas pris pour argent comptant sur la parole d'une session
relais. Voir `references/conventions.md` pour le détail technique complet.

- `createAuthApi` (implémentation concrète, `features/auth/api/auth-api.ts`)
  branchée sur `/auth/login`/`/auth/me`/`/auth/logout`. `sessionSchema`
  simplifié (plus d'`id`/`expiresAt` inventés — le backend ne les expose
  pas). `requestPasswordReset`/`resetPassword` rejettent explicitement
  (`ApiError` kind `"unsupported"`, nouveau) — aucun flux de reset n'existe
  côté Beclose (comptes provisionnés à la main).
- `SessionProvider` bootstrap désormais la session via TanStack Query
  (`globalKeys.session()`), expose `login`/`logout` réels. `SessionBoundary`
  gagne un état `ERROR` (`ApiError`, avec retry). `RequireSession` (nouveau)
  protège le layout **Back Office uniquement** — pas le Portail, qui n'a
  aucune auth backend (client onboardé à la main, pas de self-serve).
  `LoginPage`/`CurrentSessionMenu` câblés (formulaire réel, redirection,
  déconnexion).
- **Bug réel trouvé en testant** (pas en le devinant) : `queryClient.clear()`
  appelé juste après `setQueryData(sessionKey, null)` lors du logout
  ré-écrasait la donnée avec une réponse d'un refetch automatique déclenché
  par `clear()` sur l'observer encore monté de la query de session — l'état
  repassait à `AUTHENTICATED` juste après un logout raté côté réseau.
  Corrigé en excluant explicitement la clé de session du `removeQueries`
  plutôt que de tout `clear()` sans distinction. Voir le commentaire dans
  `session-provider.tsx`.
- **Infra de test corrigée** : `tests/setup.ts` n'appelait jamais `cleanup()`
  de Testing Library entre les tests (`vitest.config.mts` n'a pas
  `test.globals: true`, donc l'auto-cleanup ne s'enclenchait jamais) — invisible
  jusqu'ici car aucun fichier de test précédent ne faisait plusieurs `render()`
  dans le même fichier. Découvert en écrivant `session-provider.test.tsx`.
- `.env.example` créé (`NEXT_PUBLIC_API_BASE_URL`, défaut `localhost:8000`
  dans `backend-client.ts` si absent). `.gitignore` corrigé : `.env*` avalait
  aussi `.env.example` (ajout de `!.env.example`).
- **Vérifié réellement avant de commiter** : `npm run lint` (0 erreur),
  `npm run typecheck` (0 erreur, seul), `npm test` (20 tests, 0 échec —
  10 nouveaux : 6 pour `createAuthApi`, 4 pour `SessionProvider`),
  `npm run build` (13 routes, succès).
- **Non fait à ce stade** : Portail non touché (auth staff ≠ auth client,
  volontairement).

## 6 endpoints v0 câblés (2026-09-11, même branche, autorisé explicitement
## par l'utilisateur pour continuer sans reconfirmation cas par cas)

Vérifié réellement dans le code Beclose (`api/routers/organizations.py`,
commit `e59c499`) avant d'écrire quoi que ce soit — pas pris pour argent
comptant sur la parole d'une session relais.

- **Clients** (`GET /organizations`) et **overview**
  (`GET /organizations/{id}/overview`) : voir commit `2636bb4`.
- **Prospects** (`GET /organizations/{id}/prospects`) : nouveau modèle
  honnête `LeadProspect` (`features/prospecting`), séparé du `prospectSchema`
  existant (workflow de ciblage/stratégie de contact spéculatif, sans
  contrepartie backend — aucune mutation n'existe dans ce contrat v0).
  `LeadProspectsSection` remplace `<ProspectingView prospects={null} />` sur
  la page.
- **Configuration** (`GET /organizations/{id}/configuration`) : nouveau
  `WorkspaceConfiguration` honnête (`features/client-configuration`), séparé
  du schéma d'onboarding (company/offer/target/qualification/approach/tools)
  — Beclose ne stocke que `pitch`/`signature` en texte libre et
  `qualification_criteria.criteria` en JSONB volontairement non structuré,
  aucun découpage fiable vers les nombreux champs du wizard n'existe.
  Affiché tel quel (JSON brut pour les critères).
- **Intégrations** (`GET /organizations/{id}/integrations`) : nouveau
  `WorkspaceIntegrationStatus` honnête (`features/integrations`), séparé du
  catalogue `workspaceIntegrationsSchema` (états `CONNECTING`/
  `NEEDS_ATTENTION`/`ERROR`... qui n'existent pas côté backend). Juste
  Google, connecté ou pas, dérivé de `organization_credentials`.
- **Messages** (`GET /organizations/{id}/messages`) : nouveau
  `MessageLogEntry` (`features/supervision`, pas `conversations` — la
  richesse de `conversations` (intent, état, action recommandée) n'a pas de
  source backend ; le backend lui-même qualifie cet endpoint de
  « supervision lecture seule »). Affiché sur la page Conversations, à côté
  de la vue existante (non remplacée, toujours sans donnée).
- **Principe appliqué aux 4 dernières** (comme pour clients/overview) :
  chaque feature existante avait un modèle bien plus riche/spéculatif que ce
  que Beclose fournit réellement — ne jamais forcer les vraies données dans
  ces modèles (ça exigerait d'inventer des champs, ex. `systemStatus`,
  `ProspectStatus`, découpage du pitch en sections de wizard). À chaque
  fois : nouveau schéma honnête, séparé, ajouté à côté ; l'ancien modèle
  reste inchangé, non câblé, pour un futur où le backend le supporterait
  vraiment.
- `shared/api/api-envelope.ts` (`detailEnvelopeSchema`/`paginatedEnvelopeSchema`)
  utilisé partout — évite de redéfinir `{data}`/`{data,pagination}` 6 fois.
- **Vérifié réellement avant de commiter** : `npm run lint` (0 erreur),
  `npm run typecheck` (0 erreur, seul), `npm test` (20 tests, 0 échec —
  inchangé, pas de nouveau test ajouté pour ces 4 dernières features faute
  de temps, à rattraper), `npm run build` (13 routes, succès).
- **Non fait** : pagination UI (prospects/messages acceptent déjà
  `limit`/`offset`/filtres côté API, pas encore de contrôles dans l'UI — la
  première page suffit pour l'instant, peu de données réelles) ; tests pour
  les 4 nouvelles features (seuls `clients-api`/`session-provider` ont des
  tests dédiés) ; petite duplication assumée du vocabulaire `LeadStatus`
  entre `prospecting` et `supervision` (deux petites copies plutôt qu'un
  couplage prématuré entre features — à reconsidérer si un 3e endroit en a
  besoin).

## CI e2e rouge après le câblage de l'auth — 8 runs, cause réelle trouvée
## (2026-09-11, branche `feat/wire-auth-api`, PR #12)

`RequireSession` (auth réelle) a fait échouer `navigation.spec.ts` en CI.
**8 runs, 8 théories, la 8e était la bonne** — détail complet et leçon dans
`references/conventions.md` (« Piège critique : next dev bloque les
origines cross-site »). Résumé : `next dev` bloque les requêtes cross-origin
vers ses ressources de dev (`localhost` vs `127.0.0.1` de Playwright) —
`allowedDevOrigins: ["127.0.0.1"]` dans `next.config.ts` a réglé le
problème en une ligne, après 7 correctifs sur des théories plausibles mais
fausses (CORS de mock, timeout de compile, `networkMode` de TanStack
Query). Confirmé réellement : run `34651068809`, 7/7 jobs verts dont `e2e`
(8/8 tests). Infrastructure de debug ajoutée en cours de route et gardée :
upload des traces Playwright sur échec (`ci.yml`), serveur mock backend
réel (`tests/e2e/mock-backend.mjs`).

**PR #12 mergée dans `main`** (squash, commit `79789d6`) — un seul commit
propre plutôt que les 11 (dont 7 de tâtonnement e2e). Branches
`feat/wire-auth-api` et `chore/agent-skill-and-docker` supprimées (locales
+ remote) une fois leur contenu confirmé présent sur `main`.

## Tests des 6 endpoints v0 (2026-09-12, branche `test/v0-api-coverage`)

Aucun des 6 modules `*-api.ts` du contrat v0 n'avait de test dédié (seuls
`auth-api`/`session-provider` en avaient) — corrigé pour les 6, pas
seulement 4 comme suggéré initialement par la coordination transverse
(`clients-api` et `lead-pipeline-api`/overview manquaient aussi à l'appel).

- `tests/support/fake-api-client.ts` : `fakeClient`/`rejectingClient`
  extraits de `auth-api.test.ts` (dupliqués sinon 6 fois) — mimique le
  contrat de `createApiClient` sans vrai `fetch`, fait passer la réponse
  brute à travers le vrai schéma Zod de chaque module.
- 11 nouveaux tests (2 par module sauf `lead-pipeline-api`, 1 seul cas
  utile) : forme de la requête (path, méthode, `context.workspaceId`,
  query params), mapping `id`/`organizationId` → `workspaceId`, valeurs
  `null` légitimes (pas d'erreur) — `qualificationCriteria: null`,
  `google: null`, `status: null` sur un message entrant.
- **Vérifié réellement** : `npm run lint` (0 erreur), `npm run typecheck`
  (0 erreur, seul), `npm test` (31/31, 11 nouveaux), `npm run build` (13
  routes, succès).

## Pagination UI — prospects et messages (2026-09-12, branche `feat/pagination-ui`)

Le backend acceptait déjà `limit`/`offset` (contrat v0), rien à changer côté
API — juste l'UI qui manquait.

- `shared/ui/pagination/PaginationControls` (nouveau, business-agnostic :
  `limit/offset/total` + callbacks `onPrevious`/`onNext`, pas de logique
  métier) — même dossier que `shared/ui/states`.
- `LeadProspectsSection`/`MessageLogSection` : `offset` en state local,
  page fixe à 20. Contrôles affichés seulement si `total > limit` (pas de
  pagination visible s'il n'y a qu'une page).
- `useLeadProspectsQuery`/`useMessageLogQuery` : `placeholderData:
  keepPreviousData` (TanStack Query v5) — garde la page précédente affichée
  pendant le chargement de la suivante, évite un flash de `LoadingState` à
  chaque clic.
- **Vérifié réellement** : lint, typecheck seul, 31/31 tests (inchangé,
  pas de nouveau test ajouté pour la pagination — UI pure, pas de nouvelle
  logique dans les modules `*-api.ts` déjà testés), build (13 routes).

## Schémas cibles ICP/BANT (2026-09-12, branche `feat/icp-bant-target-schemas`,
## PAS mergée — touche le contrat partagé, coordinateur prévenu avant merge)

Suite à `decision_projet/bewise_beclose_icp_bant_handoff.md` (note de
cadrage produit) et `decision_projet/reponse_techlead_icp_bant.md`
(livrable Tech Lead, décisions A-E validées par l'utilisateur). Analyse
complète (champ par champ, avant tout code) dans l'historique de
coordination — résumé : 1 des 4 schémas spéculatifs existants
(`progressiveQualificationSchema`) était déjà quasiment la bonne forme,
les 3 autres nécessitaient une vraie reconstruction, pas un simple
retaillage.

**Périmètre strict de cette étape : types et schémas Zod uniquement,
aucun câblage** — `icp_profiles` n'existe pas encore côté Beclose (Nile
commence les migrations après ce livrable), aucun endpoint pour ces
données n'existera avant l'étape 6 du plan de migration.

- `shared/schemas/versioned-policy-envelope.ts` : enveloppe commune
  `{id, organizationId, name, version, status, criteria, supersedesId,
  createdAt, activatedAt, createdBy, notes}` — pas une invention front,
  le document réponse Tech Lead (§3.1) spécifie explicitement cette
  structure commune à `icp_profiles` et `qualification_criteria`.
- `client-configuration/schemas/icp-profile-schema.ts` : ICP complet
  (market/companyFit/prioritySectors/commercialMaturity/prospectability/
  decisionMakers/signaux/disqualifiants), **reconstruit** depuis zéro —
  remplace à terme le `targetSegmentSchema` tout en texte libre de
  l'onboarding (pas touché dans cette étape, le formulaire wizard n'est
  pas dans le périmètre).
- `client-configuration/schemas/bant-criteria-schema.ts` : configuration
  BANT par critère (definition/statusValues/signaux/questions), avec les
  4 enums exacts du document (`budgetStatusSchema`,
  `authorityStatusSchema`, `needStatusSchema`, `timingStatusSchema`) +
  `qualificationRules`/`handoffRules`/`conversationPolicy`. **Retaille**
  `qualificationStepSchema` (le découpage en 4 critères existait déjà).
- `prospecting/schemas/icp-evaluation-schema.ts` : évaluation ICP par
  lead — `fit` **qualitatif** (`strong/moderate/weak/none`), pas de score
  numérique (décision D) ; `evidence` en `z.record` (clés libres, comme
  l'exemple du document) plutôt qu'un objet à clés fixes ; borne de
  longueur sur `reasoningSummary` pour empêcher un raisonnement libre du
  LLM d'y passer (§3.6). Schéma **séparé** de `prospectSchema` existant
  (`recommendation`/`score` non touchés) — les deux coexistent (décision
  C : action ≠ propriété).
- `conversations/schemas/bant-evaluation-schema.ts` : évaluation BANT par
  lead, avec `criteriaVersion` + `result`
  (`qualified`/`nurture`/`not_qualified`) + `customCriteria[]` conservé
  (décision E). **Volontairement séparé** de `progressiveQualificationSchema`
  existant plutôt que retaillé en place : celui-ci a de vrais
  consommateurs (`qualification-panel.tsx`,
  `commercial-handoff-schemas.ts`) qu'il aurait fallu adapter en même
  temps — hors périmètre « schémas seulement » de cette étape.
- **`nurture` sans nouveau statut de lead** (décision Tech Lead) : les
  compteurs par statut de l'overview rangeront un lead en nurture sous
  `replied` — `qualification_result` (nouveau champ ci-dessus) devra être
  affiché à côté du statut une fois câblé, sinon indistinguable d'un lead
  qui vient de répondre. **Non appliqué aux schémas déjà câblés**
  (`leadProspectSchema`, `workspaceLeadPipelineSchema`) dans cette étape —
  Beclose ne renvoie pas encore ce champ, l'ajouter maintenant serait
  l'inventer.
- 4 fichiers de test valident les schémas contre les **exemples JSON réels
  du document source** (§10, §16, §24, §25, transcrits en camelCase) — pas
  juste "ça compile", ça accepte la vraie forme cible.
- **Vérifié réellement** : lint, typecheck seul, 40/40 tests (9 nouveaux),
  build (13 routes).
- **Non fait, hors périmètre explicite** : câblage de tout ça à une API
  (n'existe pas), mise à jour du formulaire d'onboarding (`target`/
  `qualification` steps) pour utiliser les nouveaux schémas, migration de
  `qualification-panel.tsx` vers `bantEvaluationSchema`.
