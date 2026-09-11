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
- **Non fait à ce stade** : commit/push (à confirmer avec l'utilisateur),
  CI GitHub Actions pour construire/publier l'image (aucun workflow
  `.github/` n'existe encore dans ce dépôt, contrairement à Beclose), et tout
  raccordement réel au backend Beclose (aucune API n'existe encore côté
  Beclose pour ce faire).
