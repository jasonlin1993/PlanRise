import { expect, test } from "@playwright/test";

test("首頁顯示主標與試用入口", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /直接升成 3D/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /立即試用/ })).toHaveAttribute("href", "/demo");
});
