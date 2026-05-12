import { expect, test } from "@playwright/test";

const uniqueEmail = () => `test-${Date.now()}@e2e.example.com`;

test.describe("Auth flow", () => {
  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("register page is reachable", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /registrieren/i })).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/e-mail/i).fill("nobody@example.com");
    await page.getByLabel(/passwort/i).fill("wrong");
    await page.getByRole("button", { name: /anmelden/i }).click();
    await expect(page.getByText(/ungültig|falsch|fehler/i)).toBeVisible();
  });

  test("successful register then login navigates to dashboard", async ({ page }) => {
    const email = uniqueEmail();

    // Register
    await page.goto("/register");
    await page.getByLabel(/e-mail/i).fill(email);
    await page.getByLabel(/passwort/i).fill("sicher123");
    await page.getByRole("button", { name: /registrieren/i }).click();
    await expect(page).toHaveURL(/\/(login|dashboard)/);

    // Login if redirected to login
    if (page.url().includes("/login")) {
      await page.getByLabel(/e-mail/i).fill(email);
      await page.getByLabel(/passwort/i).fill("sicher123");
      await page.getByRole("button", { name: /anmelden/i }).click();
    }

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
