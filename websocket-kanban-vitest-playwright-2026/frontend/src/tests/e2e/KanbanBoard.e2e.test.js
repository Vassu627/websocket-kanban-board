import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

/* LOAD TEST  */
test("Board loads correctly", async ({ page }) => {
  await expect(page.getByText("Real-Time Kanban Board")).toBeVisible();
});

/*  CREATE TASK*/
test("User can create a task", async ({ page }) => {
  await page.getByText("Add Task").click();

  const task = page.locator(".task-card").first();
  await expect(task).toBeVisible();
});

/*DELETE TASK  */
test("User can delete a task", async ({ page }) => {
  const tasks = page.locator(".task-card");

  const beforeCount = await tasks.count();

  await page.getByText("Add Task").click();

  await expect(tasks).toHaveCount(beforeCount + 1);

  await tasks.first().locator(".delete-btn").click();

  await expect(tasks).toHaveCount(beforeCount);
});

/*  EDIT TITLE  */
test("User can edit task title", async ({ page }) => {
  await page.getByText("Add Task").click();

  const titleInput = page
    .locator(".task-card")
    .first()
    .locator('input[type="text"]')
    .first();

  await expect(titleInput).toBeVisible();

  await titleInput.fill("Updated Task");

  await expect(titleInput).toHaveValue("Updated Task");
});
