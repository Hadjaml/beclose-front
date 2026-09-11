import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Lean production image for Docker: only traced files + a minimal
  // server.js are emitted to .next/standalone (see self-hosting guide in
  // node_modules/next/dist/docs/01-app/02-guides/self-hosting.md).
  output: "standalone",
};

export default nextConfig;
