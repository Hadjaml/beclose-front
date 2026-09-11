import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      // Stands in for Beclose so Back Office auth (RequireSession) doesn't
      // need a real backend for navigation checks. See tests/e2e/mock-backend.mjs.
      command: "node tests/e2e/mock-backend.mjs",
      url: "http://localhost:8000/auth/me",
      reuseExistingServer: true,
    },
    {
      command: "npm run dev",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
