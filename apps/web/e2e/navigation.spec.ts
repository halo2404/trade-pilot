import { expect, test } from "@playwright/test";

// Shared login helper
async function loginAs(page: Parameters<typeof test>[1], email: string, password = "sicher123") {
  await page.goto("/login");
  await page.getByLabel(/e-mail/i).fill(email);
  await page.getByLabel(/passwort/i).fill(password);
  await page.getByRole("button", { name: /anmelden/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Navigation", () => {
  const email = `nav-${Date.now()}@e2e.example.com`;

  test.beforeEach(async ({ page }) => {
    // Register once per suite (idempotent on re-runs via unique email)
    await page.goto("/register");
    await page.getByLabel(/e-mail/i).fill(email);
    await page.getByLabel(/passwort/i).fill("sicher123");
    await page.getByRole("button", { name: /registrieren/i }).click();
    if (!page.url().includes("/dashboard")) {
      await loginAs(page, email);
    }
  });

  test("dashboard loads and shows TradePilot branding", async ({ page }) => {
    await expect(page.getByText("TradePilot")).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("watchlist page is reachable from nav", async ({ page }) => {
    await page.getByRole("link", { name: /watchlist/i }).click();
    await expect(page).toHaveURL(/\/watchlist/);
  });

  test("paper trading page is reachable from nav", async ({ page }) => {
    await page.getByRole("link", { name: /paper trading/i }).click();
    await expect(page).toHaveURL(/\/paper-trading/);
    await expect(page.getByText(/simulationsmodus/i)).toBeVisible();
  });

  test("learning page shows modules", async ({ page }) => {
    await page.getByRole("link", { name: /lernen/i }).click();
    await expect(page).toHaveURL(/\/learning/);
    await expect(page.getByText(/lernmodule/i)).toBeVisible();
  });

  test("ai-assistant page is reachable", async ({ page }) => {
    await page.getByRole("link", { name: /ki-assistent/i }).click();
    await expect(page).toHaveURL(/\/ai-assistant/);
    await expect(page.getByText(/TradePilot KI-Assistent/i)).toBeVisible();
  });

  test("compliance banner is always visible", async ({ page }) => {
    await expect(page.getByText(/bildungsplattform/i)).toBeVisible();
  });

  test("dark mode toggle works", async ({ page }) => {
    const html = page.locator("html");
    const toggleBtn = page.locator("button[aria-label*='mode'], button[aria-label*='Mode'], button[title*='mode']").first();
    const initial = await html.getAttribute("class");
    await toggleBtn.click();
    await expect(html).not.toHaveAttribute("class", initial ?? "");
  });
});
