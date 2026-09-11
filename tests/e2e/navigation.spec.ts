import { expect, test } from "@playwright/test";

// Back Office content (including the nested workspace layout's own
// navigation) is gated behind a real session since RequireSession/AuthApi
// wired against Beclose (2026-09-11) - stub /auth/me so these navigation
// checks don't need a real backend running in CI. See
// .claude/skills/bewise-app/references/conventions.md.
//
// page.route() alone isn't enough here: the app runs on
// http://127.0.0.1:3000 (playwright.config.ts baseURL) and calls
// http://localhost:8000 (backend-client.ts's default) with
// `credentials: "include"` (api-client.ts) - different origins even on the
// same machine, and a fulfilled route response is still subject to the
// browser's real CORS enforcement unless it carries matching
// Access-Control-Allow-Origin/-Credentials headers (verified for real: a
// first attempt without them still failed in CI, run 34647340281, same
// "element not found" as before any stub - the query fails as a network/CORS
// error, not a 401, so getCurrentSession() rethrows instead of resolving to
// `null`). Overriding `window.fetch` for this one path instead sidesteps the
// browser's network/CORS layer entirely - no real cross-origin request is
// ever made for /auth/me.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const realFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = input instanceof Request ? input.url : input.toString();
      if (url.endsWith("/auth/me")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({ id: "e2e-staff", email: "e2e@bewise.test", full_name: "E2E Staff" }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
        );
      }
      return realFetch(input, init);
    };
  });
});

test("global Back Office exposes only implemented routes", async ({ page }) => {
  await page.goto("/backoffice");
  const navigation = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(navigation.getByRole("link", { name: "Accueil" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Abonnements" })).toBeVisible();
  await expect(navigation.getByText("Prospection", { exact: true })).toHaveCount(0);
});

test("Portal contains no Back Office configuration", async ({ page }) => {
  await page.goto("/portal/workspace-e2e");
  const navigation = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(navigation.getByRole("link", { name: "À valider" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Abonnement" })).toBeVisible();
  await expect(navigation.getByText("Configuration", { exact: true })).toHaveCount(0);
  await expect(navigation.getByText("Apprentissage", { exact: true })).toHaveCount(0);
});

test("workspace navigation keeps the URL scope", async ({ page }) => {
  await page.goto("/backoffice/workspaces/workspace-e2e");
  const navigation = page.getByRole("navigation", { name: "Navigation du workspace" });
  const subscription = navigation.getByRole("link", { name: "Abonnement" });
  await expect(subscription).toHaveAttribute(
    "href",
    "/backoffice/workspaces/workspace-e2e/subscription",
  );
});

test("every visible navigation destination resolves", async ({ page }) => {
  const navigationRoots = [
    "/backoffice",
    "/backoffice/workspaces/workspace-e2e",
    "/portal/workspace-e2e",
  ];

  for (const root of navigationRoots) {
    await page.goto(root);
    const hrefs = await page
      .getByRole("navigation")
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

    for (const href of hrefs) {
      if (href === null) continue;
      const response = await page.goto(href);
      expect(response?.ok(), `Route inaccessible : ${href}`).toBe(true);
    }
  }
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`all shells remain usable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of [
      "/backoffice",
      "/backoffice/workspaces/workspace-responsive",
      "/portal/workspace-responsive",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("navigation").first()).toBeVisible();
      await expect(
        page.locator("summary").getByText("Notifications", { exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  });
}
