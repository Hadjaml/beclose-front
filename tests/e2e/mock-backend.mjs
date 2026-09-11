// Minimal stand-in for Beclose's real API, started by playwright.config.ts
// (webServer) alongside `npm run dev`, so e2e navigation checks don't need
// a real backend running. Real HTTP, not a browser-level fetch/route
// override: those turned out to be an unreliable way to fake a
// cross-origin, credentialed request (see
// .claude/skills/bewise-app/references/conventions.md for the two attempts
// that both silently failed before this one, same symptom either way).
//
// Only `/auth/me` matters today (RequireSession gates the Back Office). No
// external dependencies (Node's http module only) so it doesn't need
// npm ci to touch anything extra.
import http from "node:http";

const FAKE_STAFF_USER = { id: "e2e-staff", email: "e2e@bewise.test", full_name: "E2E Staff" };
const ALLOWED_ORIGIN = "http://127.0.0.1:3000";
const port = process.env.MOCK_BACKEND_PORT ?? 8000;

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "content-type");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.url === "/auth/me") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(FAKE_STAFF_USER));
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: { code: "NOT_FOUND", message: "Not mocked." } }));
});

server.listen(port, () => {
  console.log(`[e2e mock backend] listening on :${port}`);
});
