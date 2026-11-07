import { expect, test } from "@playwright/test";

test("首頁顯示 PlanRise", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "PlanRise" })).toBeVisible();
});
