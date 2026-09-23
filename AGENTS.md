<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Bewise frontend architecture

## Scope

- This repository is frontend-only. Do not add a database, ORM, local business API, or backend business logic.
- The backend is the source of truth for authentication, authorization, validation, permissions, billing, and every critical business rule.
- Do not invent backend contracts. Keep unresolved integration details behind explicit interfaces and document the extension point.
- Do not build speculative screens, abstractions, dependencies, or empty feature trees.

## Dependency direction

- `src/app` owns routing, Next.js layouts, route boundaries, and composition only.
- `src/features/<feature>` owns a business domain. A feature may contain `api`, `components`, `hooks`, and `model` when they are needed.
- `src/shared` owns business-agnostic infrastructure, contracts, utilities, and reusable UI primitives.
- `src/providers` owns application-level React providers.
- Dependencies flow from `app` to `features` to `shared`. `shared` must never import a feature.
- Import another feature only through its public `index.ts`; do not reach into its internal files.
- Keep Server Components as the default. Add `"use client"` only at the smallest interactive boundary.

## API and server state

- Never call `fetch()` from a page, component, hook, or feature query definition. All HTTP access goes through `src/shared/api` and a feature-specific API module.
- Validate every untrusted API response with Zod at the API boundary. Infer TypeScript response types from their schemas instead of duplicating DTOs.
- Normalize transport, HTTP, parsing, and schema errors as `ApiError`.
- TanStack Query is the source of truth for remote/server state in interactive client experiences. Do not mirror query data in a global store.
- Query keys must be created by the centralized factories in `src/shared/query`.
- Every client-scoped request and query key must explicitly include a non-empty `workspaceId`.
- Keep global resources and workspace-scoped resources in distinct key namespaces.
- Mutations must invalidate or update the smallest relevant scoped keys.

## Workspace isolation and access control

- Never derive a workspace implicitly inside an API function. Pass `workspaceId` explicitly.
- The URL will be the canonical workspace selection for scoped routes; React context only exposes the current selection to the component tree.
- Clear cached data belonging to the previous workspace when switching context.
- Frontend permission checks control presentation only. They never replace backend authorization.
- Use the centralized permission helpers. Generic UI components must not contain roles, permissions, or business policy.
- “View as client” keeps the real Bewise actor identity intact. It may use only an opaque, backend-issued delegation context, with workspace and expiry. Never synthesize a client identity, token, or elevated permission in the frontend.

## UI, errors, and state

- Put business-agnostic UI in `src/shared/ui`; put domain components in their feature.
- Shared UI accepts content and callbacks and contains no feature-specific rules.
- Use the shared loading, empty, error, and forbidden states consistently.
- Handle expected API failures explicitly and reserve Next.js error boundaries for uncaught failures.
- Avoid giant components: split data access, orchestration, and presentation when responsibilities differ.

## TypeScript and code quality

- TypeScript remains strict with `allowJs: false`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`.
- Do not use `any`. Treat external values as `unknown` until validated or narrowed.
- Prefer named domain types and narrow unions over booleans with ambiguous meaning.
- Avoid catch-all `utils.ts` and `types.ts` files. Name modules after their responsibility.
- Preserve the React Compiler configuration; do not add manual memoization without a measured need.
- Prefer platform, React, and Next.js capabilities before adding a dependency.

## Realtime and testing

- Consume realtime updates through the transport-neutral contract in `src/shared/realtime`; features must not depend directly on SSE or WebSocket APIs.
- Realtime events must remain workspace-scoped and should update or invalidate TanStack Query data.
- Unit tests may be colocated with source. Integration tests belong in `tests/integration` and E2E tests in `tests/e2e` when those suites are introduced.
- Keep mocks behind injectable interfaces, isolated from production code paths, and never mock business data silently.
- Run pure/schema/component tests with Vitest and Testing Library. Keep browser journeys in `tests/e2e` and avoid backend dependencies.

## Backend-driven capabilities and actions

- Never infer permissions, integration capabilities, subscription entitlements, quotas, or plan behavior from a role, provider name, or plan name.
- Render a mutation action only when both the backend data exposes it and the composition layer supplies a real callback.
- Reuse domain components across Back Office and Portal through explicit visibility profiles and permission-aware composition; do not fork business features.
- Keep authentication secrets and access tokens out of browser storage and all `NEXT_PUBLIC_*` variables. Prefer a backend-managed HttpOnly session cookie.

## Verification

- Before writing Next.js code, consult the matching local documentation under `node_modules/next/dist/docs` as required above.
- After changes, run ESLint, TypeScript checking, and the production build. Fix all introduced errors.

<!-- agentmesh:canonical -->
The project source of truth is `.agentmesh/skills/project/`.
Before any work, every agent must read `AGENTS.md`, then
`.agentmesh/skills/project/SKILL.md`, `.agentmesh/skills/project/avancement.md`,
and `.agentmesh/skills/project/conventions.md`.
Update `avancement.md` after every meaningful stage with actual validation and next steps.
Provider-specific files (Claude, Codex, OpenCode, Gemini, Grok or any other runtime)
may only be pointers or shims to this canonical skill, never independent copies.
Operational tasks, checkpoints and handoffs live in PostgreSQL; presence and routing
live in Redis. The Markdown summary is human project context, not backend state.
<!-- /agentmesh:canonical -->
