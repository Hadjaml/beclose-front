import { createApiClient } from "./api-client";

/**
 * Beclose's local `uvicorn` default (`uv run uvicorn api.main:app --reload`,
 * see ../../../.claude/skills/bewise-app/references/conventions.md). Only a
 * fallback for local dev so `npm run dev` keeps working without extra setup
 * once Beclose is running locally — never used to guess a real deployment
 * target.
 */
const LOCAL_DEV_API_BASE_URL = "http://localhost:8000";

/**
 * Singleton HTTP client for the whole app. `NEXT_PUBLIC_API_BASE_URL` is a
 * public URL, never a secret — see AGENTS.md, "Backend-driven capabilities".
 */
export const backendClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? LOCAL_DEV_API_BASE_URL,
});
