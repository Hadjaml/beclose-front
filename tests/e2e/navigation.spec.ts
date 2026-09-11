import { expect, test } from "@playwright/test";

// Back Office content (including the nested workspace layout's own
// navigation) is gated behind a real session since RequireSession/AuthApi
// wired against Beclose (2026-09-11). playwright.config.ts starts
// tests/e2e/mock-backend.mjs alongside the app so GET /auth/me resolves to
// a fake staff user - a real HTTP server, needed regardless of the timeout
// issue below (see next comment): without it the session query settles into
// ERROR, not AUTHENTICATED, and the workspace nav still never renders.

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
  test.setTimeout(45_000); // default 30s is tight once the assertion below waits up to 20s
  await page.goto("/backoffice/workspaces/workspace-e2e");
  const navigation = page.getByRole("navigation", { name: "Navigation du workspace" });
  const subscription = navigation.getByRole("link", { name: "Abonnement" });
  // Longer timeout than the default 5s: this route pulls in a lot of new
  // client code (auth + the 6 v0 API integrations - tanstack query, zod
  // schemas, several new components), and RequireSession keeps this nav
  // hidden behind a LoadingState until the session query resolves. On a
  // cold `next dev`/Turbopack compile in CI this genuinely took longer than
  // 5s - confirmed for real from a downloaded trace's network log: zero
  // request to /auth/me had even been attempted yet when the assertion
  // timed out, only page/JS-chunk requests were in flight. Not a mocking
  // or auth-logic bug (three attempts at fixing those in turn were each
  // chasing the wrong cause) - the element genuinely just isn't there yet.
  await expect(subscription).toHaveAttribute(
    "href",
    "/backoffice/workspaces/workspace-e2e/subscription",
    { timeout: 20_000 },
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
