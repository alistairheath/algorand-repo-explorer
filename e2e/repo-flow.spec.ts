import { test, expect, type Page } from "@playwright/test";

test("user can browse repos and open details", async ({ page }: { page: Page }) => {
  await page.goto("http://localhost:5173/repos");

  // Wait for repo cards
  await page.waitForSelector(".repo-card");

  // Click first repo card
  await page.locator(".repo-card").first().click();
  console.log(page.url());

  // Repo detail page loads
  await expect(page.locator(".repo-detail-header")).toBeVisible();

  // README section exists
  await expect(page.locator(".readme")).toBeVisible();
});
