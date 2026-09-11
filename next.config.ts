import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Lean production image for Docker: only traced files + a minimal
  // server.js are emitted to .next/standalone (see self-hosting guide in
  // node_modules/next/dist/docs/01-app/02-guides/self-hosting.md).
  output: "standalone",
  // `next dev` initializes with `localhost` by default and blocks
  // cross-origin requests to dev-only assets/endpoints from any other
  // origin (node_modules/next/dist/docs/.../allowedDevOrigins.md).
  // playwright.config.ts's baseURL is 127.0.0.1 - a different origin from
  // the dev server's point of view even on the same machine. Printed as a
  // warning on every e2e run in CI ("Blocked cross-origin request to
  // Next.js dev resource /_next/hmr") but initially dismissed as unrelated
  // noise; turned out to be the actual cause of a client-side query that
  // never ran at all (RequireSession's session check stuck pending forever
  // - confirmed from a Playwright trace showing zero network attempt, no
  // matter the timeout).
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
