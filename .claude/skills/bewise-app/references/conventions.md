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

- `npm run typecheck` échoue si `.next/types` n'existe pas encore (les
  helpers globaux `LayoutProps<...>`/`PageProps<...>`, nouveauté Next 16,
  sont générés par `next build`/`next dev`, pas présents avant un premier
  build). Ne pas confondre avec une vraie erreur de code — lancer `npm run
  build` (ou `npm run dev` une fois) avant de diagnostiquer plus loin.
- Séquence complète utilisée le 2026-09-11 : `npm ci` → `npm run typecheck`
  (échoue avant le premier build, cf. ci-dessus) → `npm run lint` (0 erreur)
  → `npm run build` (13 routes générées, succès) → `npm run typecheck`
  (0 erreur après build) → `docker build` → `docker run` + requêtes HTTP
  réelles.
