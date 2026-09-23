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

### Corrections post-validation croisée (2026-09-12, même branche)

Validation croisée faite par le coordinateur **en lisant les fichiers**, pas
sur parole — deux corrections avant merge, une clarification qui les
accompagne :

- **Incohérence de rattachement entre les deux schémas d'évaluation** :
  `icpEvaluationSchema` portait `icpProfileId` (FK) mais `bantEvaluationSchema`
  portait `criteriaVersion` (numéro brut, suivant l'exemple §25 du document
  source). Tranché : **FK dans les deux cas** —
  `bantEvaluationSchema.qualificationCriteriaId` remplace `criteriaVersion`.
  Le numéro de version reste disponible pour l'affichage
  (`qualificationCriteriaVersion`, optionnel) mais **toujours dérivé de la
  FK, jamais saisi indépendamment** — deux sources de vérité pourraient
  diverger sinon.
- **Traçabilité de la preuve, BANT seulement** : `sourceInteractionId`
  optionnel ajouté sur chaque critère évalué (`budget`/`authority`/`need`/
  `timing`) — une preuve BANT vient nécessairement d'un message du
  prospect, ce qui rend l'évaluation contestable en Back Office (ES-04,
  journal append-only = piste d'audit).
- **Rien changé côté ICP** : le coordinateur a corrigé son propre livrable
  (§3.6 sur-généralisait l'exigence de traçabilité à toute preuve) —
  l'évaluation ICP porte sur des données d'entreprise sourcées
  (`companies`/`contacts`), pas sur une conversation, donc aucune
  interaction à référencer. `icpEvaluationSchema` reste inchangé.
- **Vérifié réellement après corrections** : lint, typecheck seul, 41/41
  tests (1 nouveau), build (13 routes).

### Dépendances en avant à ne pas perdre de vue

- **Visibilité du `nurture`** : une fois câblé, l'API devra exposer
  `qualification_result` à côté du statut de lead, et le front l'afficher
  — sinon un lead en nurture (`replied` + `qualification_result: nurture`)
  sera indistinguable d'un lead qui vient tout juste de répondre.
- **Migration de `qualification-panel.tsx`** vers `bantEvaluationSchema`
  une fois le câblage réel possible — le composant actuel reste sur
  `progressiveQualificationSchema` (statut générique `KNOWN/UNKNOWN/
  TO_CONFIRM`) en attendant.
- **Garde-fou non négociable réaffirmé** (Rochinel) : aucune modification
  automatique de l'ICP/BANT par le LLM — l'apprentissage produit des
  recommandations, jamais appliquées sans un geste humain explicite. Rien
  à représenter côté front pour l'instant ; si un affichage de
  recommandation d'évolution est conçu un jour, il devra toujours passer
  par une validation humaine explicite dans l'UI, jamais s'appliquer seul.

### Divergence backend détectée en validation croisée (2026-09-12)

Nile (Beclose) avait `not_fit` pour `icpFitSchema`, ce dépôt a `none`.
Tranché en faveur de **ce dépôt** (cohérence avec `strong/moderate/weak/none`
du `need`, énuméré tel quel dans le document source ; ce schéma était déjà
mergé sur `main`) — Nile s'aligne de son côté. Ne pas s'étonner de croiser
`not_fit` dans un vieux diff/commit backend. `qualification_result`
(`qualified`/`nurture`/`not_qualified`) est identique des deux côtés,
vérifié, aucune divergence.

## Câblage réel des champs ICP/BANT (2026-09-16, branche `feat/wire-icp-bant-fields`)

Étape 6a du contrat mergée côté Beclose (confirmé en lisant
`api/routers/organizations.py` directement, pas sur relais) — les 4 champs
demandés comme besoin d'affichage sont réels et câblés.

- `leadProspectSchema` étendu avec `qualificationResult`/`icpFit`/
  `handoffReason`/`nurtureFollowUpsSent` — vérifiés contre
  `core/models/lead.py`. `icpFit` réutilise le `icpFitSchema` déjà existant
  d'`icp-evaluation-schema.ts` (évite un doublon d'enum que j'avais
  introduit par erreur en premier jet, corrigé avant tout commit).
- **Nouvel endpoint** `GET /organizations/{id}/prospects/{leadId}`
  (n'existait pas dans le contrat v0) — `leadProspectDetailSchema` réutilise
  `bantEvaluationSchema`/`icpEvaluationSchema` déjà écrits à l'étape
  précédente (cross-validés), plus un nouveau `policyReferenceSchema`
  partagé (`{id, name, version}`) dans `shared/schemas/`.
- **Nouvelle page** `/backoffice/workspaces/[workspaceId]/prospecting/[leadId]`
  — première vraie page de détail prospect. Affiche les 2 évaluations, la
  grille BANT utilisée (nom + version), et le log de messages **filtré par
  lead** (`MessageLogSection` étendu avec un `leadId` optionnel — la
  capacité de filtrage existait déjà côté hook, jamais exposée en UI avant).
  Chaque critère BANT a un lien d'ancre (`#message-{sourceInteractionId}`)
  vers son message source dans ce log — pas de nouvel endpoint nécessaire,
  confirmé par Beclose que `sourceInteractionId` = `id` de `/messages`.
- **`icpFit` volontairement minimal** : toujours `null` en pratique
  aujourd'hui (aucun agent ne l'écrit, confirmé par Beclose) — affiché
  comme "Non évalué" en texte simple, pas de breakdown riche autour d'un
  champ qui reste vide.
- **`handoffReason`** : distinction visuelle succès (`strong_need_signal`,
  vert) vs échec technique (les 4 autres, rouge) — c'est le seul axe qui
  compte pour l'affichage, jamais les 5 valeurs à plat avec le même poids
  visuel (`handoffReasonKind` dans le modèle).
- **Liste de prospects** : badge `qualificationResult` sur chaque ligne,
  `handoffReason` visible seulement pour les leads `handed_off` (rare, pas
  de bruit), compteur de relances visible seulement pour les leads en
  `nurture`. Lien vers la page de détail sur le nom de l'entreprise.
- **Overview** : nouvelle section `qualificationResultCounts` (qualified/
  nurture/not_qualified/not_evaluated) **en complément** des compteurs par
  statut existants, pas en remplacement — c'est exactement le problème de
  nurture invisible signalé comme dépendance en avant à l'étape précédente,
  maintenant résolu.
- **Configuration** : profil ICP actif affiché à côté de la grille BANT
  (même traitement, JSON brut pour l'instant faute d'un rendu structuré des
  critères).
- **Vérifié réellement** : lint, typecheck seul, 43/43 tests (2 nouveaux
  fichiers, 2 tests étendus), build (14 routes, +1 nouvelle).
- **Non fait** : rendu structuré (pas JSON brut) de la grille BANT/profil
  ICP en configuration — les schémas cibles existent déjà
  (`bantCriteriaSchema`) mais la vraie réponse `/configuration` renvoie
  encore `criteria` en JSONB non typé, pas la forme structurée du contrat
  cible ; surlignage dynamique (pas juste l'ancrage natif) du message
  source dans le log filtré.

## Alignement réel du schéma qualificationEvaluation (2026-09-17)

Lors du test de la première démo réelle avec conversion du lead QR-CLEAN
(`98fbe8a8-1ebf-4079-ab39-2f71c8f4dad2`, statut `booked`), la fiche prospect
n'affichait rien (`Impossible de charger ce prospect`) en raison d'une divergence
entre la forme réelle persistée par Beclose (`QualificationEvaluationRecord`) et
le schéma Zod `bantEvaluationSchema` :
- Beclose envoie `evidence: [{ text, source_interaction_id }]` (liste d'objets)
  et non un `evidence` plat en chaîne.
- `qualificationCriteriaId` et `result` ne font pas partie de l'objet
  `qualification_evaluation` côté backend (ils sont portés au niveau racine
  du lead).
- `leadQualificationEvaluationSchema` (`lead-prospect-detail-schema.ts`)
  normalise désormais la forme réelle de Beclose : extrait `evidence` (texte)
  et `sourceInteractionId` (`source_interaction_id`), tout en restant compatible
  avec la forme directe.
- **Vérifié réellement** : test d'intégration en direct contre Beclose sur le lead
  QR-CLEAN (succès), `npm run lint` (0 erreur), `npm run typecheck` (0 erreur),
  `npm test` (44/44 tests réussis, 1 nouveau test pour la forme wire Beclose),
  `npm run build` (succès).


### Volet icpEvaluation + finalisation de la branche (2026-09-19 → 2026-09-23)

- Beclose écrit `icp_evaluation` sous la forme `{ fit, tier?, sector?,
  reasons?[] }`, pas la forme document §24 (`icpProfileId`/`evidence`/
  `positiveSignals`/`negativeSignals`/`reasoningSummary`).
  `icpEvaluationSchema` devient une union `icpEvaluationDocumentSchema |
  icpEvaluationWireSchema` (commit `80dded1`). Tests sur les formes réelles
  des leads Nanfa (`handed_off`) et ML-HANDC (`contacted`, BANT `null`).
- Fiche prospect : `icpFit` affiché via `icpFitLabels` (n'est plus
  toujours `null` en pratique), référence du profil ICP à côté de la grille
  BANT, liste `reasons` quand présente.
- **Écart de contrat à suivre** : les deux évaluations (ICP et BANT)
  divergent de la forme cible du document ; le front accepte les deux
  formes via union en attendant que le contrat tranche. Les `status` BANT
  de la forme wire sont en `z.string()` (pas d'enum) — à resserrer quand la
  forme est figée.
- **Vérifié réellement le 2026-09-23** : lint (0 erreur), typecheck seul
  (0 erreur), 47/47 tests, build (succès, 14 routes).

## Rendu structuré BANT/ICP en configuration (2026-09-23, branche `feat/configuration-bant-icp-structured`)

Dépendance en avant notée à l'étape 6a, résolue.

- Vérification préalable de la vraie forme `/configuration` avant tout code
  (demandée explicitement, contrat partagé) : lecture directe de
  `api/routers/organizations.py` (Beclose) + `core/profiles/bant_schema.py`
  + `core/profiles/icp_schema.py` (Pydantic `extra="forbid"`, la validation
  réelle à l'écriture du JSONB). Écart significatif avec les schémas cibles
  spéculatifs (`bant-criteria-schema.ts`/`icp-profile-schema.ts`) sur
  plusieurs points : enveloppe (`/configuration` n'expose ni id/status/
  supersedesId/activatedAt/createdBy/notes, pas de `name` pour la grille
  BANT), `authority`/`timing` sans `positiveSignals` réels, `need` en 3
  signaux (strong/moderate/negative) au lieu de positive/negative,
  `qualificationRules` en dict libre (pas la forme figée par critère),
  `nurtureRules`/`profileName`/`customCriteria` (BANT) et `purpose`/
  `profileName`/`levels`/`rejectBelow`/`rejectAbove` (ICP) réels absents de
  la cible, secteurs prioritaires pouvant être des objets `{id, labelFr}`
  pas seulement des chaînes. Détail envoyé à l'utilisateur avant tout code ;
  décision (confirmée par le coordinateur transverse) : nouveau schéma
  aligné sur la forme réelle, à côté du schéma cible spéculatif — même
  principe que pour `icpEvaluation`/`qualificationEvaluation` (EF-705),
  pas de retraitement du cas par cas la prochaine fois.
- **`bant-criteria-wire-schema.ts`/`icp-criteria-wire-schema.ts`** (nouveaux,
  `client-configuration/schemas/`) : forme réelle snake_case (passthrough
  JSONB, pas camelCasée par `CamelModel` — même constat que
  `qualification_evaluation`/`icp_evaluation` sur EF-705), normalisée en
  camelCase via `.transform()`. `qualificationCriteriaVersionSchema`/
  `icpProfileVersionSchema` (`workspace-configuration-schema.ts`) les
  utilisent désormais au lieu de `z.record(string, unknown)`.
- **`BantCriteriaView`/`IcpCriteriaView`** (nouveaux composants) remplacent
  le `<pre>{JSON.stringify(...)}</pre>` dans `WorkspaceConfigurationView` —
  rendu structuré des 4 critères BANT (définition, statuts, signaux,
  règles de qualification/handoff/nurture) et du profil ICP (marché,
  adéquation entreprise, secteurs, maturité, décideurs, signaux).
  Présentation pure, aucune règle métier dans les composants.
- **Vérifié réellement** : lint (0 erreur, 0 warning), typecheck (seul, 0
  erreur), 55/55 tests (7 nouveaux : 3+4 sur les schémas wire, 1 nouveau
  cas sur l'API de configuration), build (succès, 15 routes, inchangé).
- **Non fait** : pas de push/PR à ce stade (pas demandé pour cette tâche,
  contrairement à EF-705) — reste sur la branche locale
  `feat/configuration-bant-icp-structured` en attente d'instruction.

## Kit de formulaire partagé + nouvelles primitives de champ (2026-09-23, branche `refactor/shared-form-kit-and-primitives`)

Préparation du nouveau chantier (créer une organisation + une vraie grille
ICP/BANT, en attente du contrat de Beclose — 3 endpoints atomiques : création
organisation, création version ICP, création version BANT, chacun persisté
immédiatement, pas un gros brouillon local soumis à la fin). Décidé avec le
coordinateur transverse : le squelette du wizard onboarding est réutilisable,
son contenu (champs texte libre) ne l'est pas — voir analyse dans la
coordination du 2026-09-23. Rien codé sur les steps organisation/ICP/BANT
elles-mêmes, comme convenu (le contrat n'est pas encore là).

- **`shared/ui/forms/`** (nouveau) : `FieldFrame`, `TextField`,
  `TextAreaField`, `useStepForm`, `StepFormLayout`, `WizardProgress` sortis
  de `features/onboarding` (business-agnostiques, `AGENTS.md` les voulait
  dans `shared/ui`). `WizardProgress` généralisée : ne dépend plus de
  `OnboardingStepId`/`OnboardingStepStatus`, générique sur le type d'id
  d'étape (`WizardStepDefinition<StepId>`), `ariaLabel` maintenant fourni
  par l'appelant. `features/onboarding` importe désormais ce kit au lieu de
  ses propres copies (supprimées) — comportement inchangé, vérifié par les
  tests existants + build (14 routes, `/backoffice/clients/new` inchangée).
- **4 nouvelles primitives de champ**, absentes avant car jamais nécessaires
  à l'onboarding en texte libre, mais requises par la vraie forme ICP/BANT
  (`bant-criteria-wire-schema.ts`/`icp-criteria-wire-schema.ts`) :
  - `StringListField` : liste de chaînes ajoutable/supprimable (signaux,
    questions, titres…).
  - `NumericRangeField` : plage min/max, avec bornes de rejet optionnelles
    (`showRejectBounds`) — calqué sur `employeeRange`
    (`min/max/rejectBelow/rejectAbove`).
  - `EnumSelectField` : select générique sur un jeu fermé de valeurs
    (`{value, label}[]`), pour les enums de statut BANT.
  - `RepeatableGroupField` : groupe d'objets structurés ajoutable/
    supprimable (ex. tiers de secteurs prioritaires), via `renderItem`/
    `createItem` — ignore tout du contenu réel d'un item.
  - Toutes génériques sur le type de donnée, aucun nom de champ Vega en dur
    — pas d'anticipation du contrat, juste le type de widget.
- **Vérifié réellement** : lint (0 erreur/0 warning), typecheck (seul, 0
  erreur), 72/72 tests (17 nouveaux : composants des 4 primitives + 3 sur
  `WizardProgress` généralisée), build (14 routes, inchangé).
- **Non fait, en attente du contrat Vega** : les steps organisation/ICP/BANT
  elles-mêmes (schémas de requête, mutations TanStack Query une par étape,
  wizard reparamétré sur ces 3-4 steps).

## Flux réel de provisioning client — organisation + ICP + BANT (2026-09-23,
## branche `feat/client-provisioning-organization-icp-bant`)

Contrat EF-601/602 mergé côté Beclose (PR #29, `f4005d9`, lu directement
dans `api/routers/organizations.py` + `core/profiles/icp_schema.py` +
`core/profiles/bant_schema.py`, pas pris sur relais) : 3 endpoints
atomiques et indépendants, `POST /organizations`,
`POST /organizations/{id}/icp-profile`, `POST /organizations/{id}/bant-criteria`.
Chaque champ de `IcpProfileCriteria`/`BantCriteria` porte désormais un
`Field(description=...)` en français orienté métier — texte repris tel
quel comme aide sous chaque champ, pas reformulé.

**Retiré** : `features/onboarding` (wizard + 8 steps + schémas, jamais
branché sur aucune API — confirmé cause de la confusion de Rochinel) et sa
chaîne dépendante dans `client-configuration` (`clientConfigurationSchema`/
`ClientConfigurationView`/`ConfigurationSection`/`model/client-configuration.ts`,
jamais rendus sur aucune page réelle). `tests/integration/onboarding-validation.test.ts`
retiré avec, son intention de couverture reprise par les nouveaux tests de
schéma de formulaire.

**Construit** :
- `clients` : `organization-create-schema.ts` (requête + hints FR),
  `ClientsApi.create` (`POST /organizations`, réutilise le schéma
  `OrganizationOut` déjà exact), `useCreateClientMutation` (invalide
  `globalKeys.workspaces()`).
- `client-configuration` : `icp-criteria-form-schema.ts`/
  `bant-criteria-form-schema.ts` — forme camelCase native (Beclose accepte
  désormais camelCase directement, `alias_generator=to_camel,
  populate_by_name=True`), **délibérément séparée** des schémas wire
  (GET, snake_case) et des schémas cibles spéculatifs. Champs `dict[str,X]`
  de Beclose (`commercialMaturity.levels`, `qualificationRules.*`,
  `nurtureRules.followUpDelayDays`) édités comme listes de paires
  (`RepeatableGroupField`) puis repliés en `Record` via
  `toIcpCriteriaPayload`/`toBantCriteriaPayload` avant l'envoi — types
  `*Payload` distincts des types `*FormValue` de brouillon (le premier jet
  envoyait le brouillon tel quel, bug réel : `levels` partait en liste au
  lieu du dict attendu, corrigé avant tout commit). `*-field-hints.ts` :
  description Beclose copiées verbatim. `createIcpProfileVersion`/
  `createBantCriteriaVersion` sur `WorkspaceConfigurationApi`, mutations
  associées (invalident `workspaceKeys.feature(workspaceId,"configuration")`).
- **Déduplication assumée** : Beclose a deux champs "nom" qui se recouvrent
  (`{Icp,Bant}CriteriaCreateRequest.name` et `criteria.profileName`, mêmes
  descriptions quasi identiques) — un seul champ "Nom de cette version"
  dans le formulaire, envoyé aux deux, pas deux champs qui pourraient
  diverger aux yeux de l'utilisateur.
- `client-provisioning` (nouvelle feature) : `ClientProvisioningWizard`,
  3 steps (`organization`/`icp`/`bant`) sur le kit `shared/ui/forms`.
  **Persistance progressive** (décision transverse 23/09) : chaque step
  appelle sa mutation immédiatement, avance seulement en cas de succès —
  pas de brouillon global soumis à la fin. Steps **à sens unique** : aucun
  endpoint `PATCH`/update n'existe, revenir en arrière ne peut rien
  annuler — bouton retour désactivé une fois une étape créée. Redirige
  vers `/backoffice/workspaces/{id}/configuration` après la grille BANT
  (referme la boucle sur `BantCriteriaView`/`IcpCriteriaView` déjà
  construites le matin même).
- 2 nouvelles primitives partagées (`shared/ui/forms/`) au-delà des 4
  prévues la veille : `CheckboxField` (nécessaire partout — ICP/BANT sont
  pleins de booléens) et `MutationErrorBanner` (bannière d'échec de
  mutation, réutilisable, plus légère que `ErrorState` plein écran).
- Sections ICP découpées en 7 fichiers (marché, adéquation entreprise,
  secteurs prioritaires — groupe imbriqué, maturité commerciale — options
  d'enum dynamiques depuis les niveaux saisis, atteignabilité, décideurs,
  signaux) ; BANT en 8 fichiers (4 critères, règles de qualification —
  groupe de paires, handoff, nurture — activable/désactivable, politique
  de conversation).
- **Simplification assumée, documentée** : `customCriteria` (JSON
  vraiment libre côté Beclose, aucun agent ne le consomme) sans champ de
  formulaire — reste `null` à la création, pas un textarea JSON pour
  l'instant. `targetLevels`/`preferredLevels`/`excludedLevels` de
  `commercialMaturity` en listes de texte libre plutôt qu'un vrai
  multi-select synchronisé sur les clés de `levels` (pas de primitive
  multi-select construite) — l'utilisateur retape la même clé.
- **Vérifié réellement** : lint (0 erreur/0 warning), typecheck (seul, 0
  erreur), 88/88 tests (22 nouveaux : schémas formulaire ICP/BANT + repli
  payload, `ClientsApi.create`, mutations de création), build (13 routes,
  `/backoffice/clients/new` toujours statique). **Non vérifié en
  navigateur réel** (Playwright indisponible sur cette machine, comme déjà
  documenté) — un `curl` confirme que la page sert bien la coquille et
  s'arrête à `RequireSession` (`Vérification de la session…`), attendu
  sans session ; le rendu du wizard lui-même n'a pas pu être vérifié
  visuellement en local, à faire par Rochinel ou en CI e2e après merge.
- **Non fait à ce stade, sur consigne du coordinateur** : pas de PR
  ouverte par étape — une seule PR groupant les 3 steps + l'intégration,
  ouverte une fois le tout vérifié (ce point).

## Correction — 2 bugs réels trouvés par Rochinel sur le flux provisioning
## (2026-09-23, branche `fix/provisioning-flow-nav-and-validation`)

Test réel de Rochinel après reconstruction du conteneur sur `b15ff12` : deux
bugs bloquants.

- **Bug 1 — bouton introuvable** : le bouton "Onboarder un client" n'existait
  que dans `ClientsEmptyState`, affiché seulement quand la liste est vide.
  Une organisation (Bewise) existe déjà en base → jamais vide → jamais
  affiché sur la vraie page. Corrigé : bouton "Nouveau client" persistant
  ajouté à l'en-tête de `/backoffice/clients` (composition, pas dans la
  feature `ClientsList` elle-même).
- **Bug 2 — "cliquer ne fait rien"** : investigué en conditions réelles, pas
  juste relu. Créé un compte staff jetable + une organisation de test
  jetable pour reproduire l'appel exact avec un vrai `curl` authentifié
  contre l'API réelle sur `localhost:8000` : `POST /organizations` avec le
  payload exact du front répond **201** sans problème — le contrat/réseau
  n'est pas en cause. Écrit un test d'intégration exerçant le vrai
  `OrganizationStep` (vraie validation Zod, vrai `useStepForm`, vraie
  `useMutation`) avec seulement le réseau simulé — a d'abord accidentellement
  tapé la vraie API locale (leçon : `backendClient` capture `fetch` une
  seule fois à l'import du module, un `vi.stubGlobal("fetch", ...)`
  postérieur n'a aucun effet sur ce singleton ; corrigé avec `vi.mock` sur
  le module `backend-client` lui-même). Une fois isolé correctement : la
  chaîne clic → validation → mutation → succès → avancement du wizard
  fonctionne intégralement. **Vrai gap trouvé en cours de route** :
  une validation Zod échouée (champ requis vide) ne produisait qu'un petit
  texte rouge sous le champ concerné, sans bannière — facilement confondu
  avec "rien ne se passe" sur un formulaire long. Ajouté
  `ValidationErrorBanner` (`shared/ui/forms`), affichée dans les 3 steps
  (organisation/ICP/BANT) quand `form.validate()` échoue, à côté de
  `MutationErrorBanner` (échec réseau) déjà en place.
- **Nettoyage** : le compte staff et l'organisation de test créés pour la
  reproduction n'ont pas pu être supprimés par le script — le rôle
  back-office n'a que `SELECT`/`INSERT` sur `staff_users` (permissions
  minimales, cohérent avec le reste du projet), pas de `DELETE`. Deux
  comptes `lyra-debug-temp@bewise.{fr,local}` et une organisation
  "Test Curl Org" restent en base, à supprimer manuellement par quelqu'un
  avec un accès direct à la base si souhaité — signalé à Orion.
- **Vérifié réellement** : lint (0 erreur/warning), typecheck seul, 91/91
  tests (3 nouveaux, le test d'intégration ci-dessus), build (13 routes,
  inchangé).
- **Non résolu avec certitude** : je n'ai pas pu reproduire "rien ne se
  passe" à l'identique en conditions de navigateur réel (toujours pas de
  Playwright local) — la validation silencieuse était la meilleure piste
  concrète trouvée et corrigée ; si le vrai problème de Rochinel était
  différent (page restée sur un ancien build en cache, session expirée
  dans son navigateur au moment du test), ça reste à confirmer par un
  nouveau test de sa part après ce correctif.
