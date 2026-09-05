import { expect, test } from "@playwright/test";

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
