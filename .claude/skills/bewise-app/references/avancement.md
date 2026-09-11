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
