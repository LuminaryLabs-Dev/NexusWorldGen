import { expect, test } from "@playwright/test";

test("renders a playable deterministic expedition", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  const experience = page.locator("main.experience-shell");
  await expect(experience).toHaveAttribute("data-render-ready", "true", { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: /Aurelia Reach/i })).toBeVisible();
  await expect(page.getByText("WORLD ONLINE")).toBeVisible();

  await page.getByRole("button", { name: /begin expedition/i }).click();
  await page.keyboard.down("KeyW");
  await page.waitForTimeout(850);
  await page.keyboard.up("KeyW");
  await expect(page.getByText("Read the terrain")).toBeVisible();

  await page.keyboard.press("KeyF");
  await expect(page.getByText("Open the world model")).toBeVisible();
  await page.keyboard.press("KeyB");
  await expect(page.getByRole("heading", { name: "Aurelia Reach", exact: true })).toBeVisible();
  await expect(page.getByText("NEXUSENGINE ECS")).toBeVisible();

  const previousSeed = await experience.getAttribute("data-seed");
  await page.getByRole("button", { name: /reforge next frontier/i }).click();
  await expect(experience).not.toHaveAttribute("data-seed", previousSeed ?? "AURELIA-7");
  await expect(experience).toHaveAttribute("data-render-ready", "true", { timeout: 30_000 });
  await expect(page.getByText("The atlas is yours")).toBeVisible();
  expect(errors).toEqual([]);
});

test("keeps primary controls available on a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("main.experience-shell")).toHaveAttribute("data-render-ready", "true", { timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Move forward" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resonance scan" })).toBeVisible();
  await page.getByRole("button", { name: "Open expedition menu" }).click();
  await expect(page.getByRole("heading", { name: "Wake Nexus Prime" })).toBeVisible();
});
