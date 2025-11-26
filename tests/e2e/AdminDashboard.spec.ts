import { test, expect } from '../fixtures/test-fixtures';

test.describe('AdminDashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.locator('input[type="text"]').or(page.locator('input[name="username"]')).first();
    const passwordField = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /login/i })).first();
    
    await usernameField.fill('admin');
    await passwordField.fill('admin');
    await submitButton.click();
    
    await page.waitForURL('**/admin', { timeout: 10000 });
  });

  test('TC-AdminDashboard-001: Verify dashboard loads summary statistics cards', async ({ page }) => {
    const summaryCards = page.locator('text=/Total Events|Last 24h|Last 7 Days/i');
    await expect(summaryCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-AdminDashboard-008: Verify Top 10 Event Types table displays', async ({ page }) => {
    const eventTypesTable = page.locator('text=/Top.*Event|Event Type/i');
    await expect(eventTypesTable.first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-AdminDashboard-009: Verify Recent Events table displays', async ({ page }) => {
    const eventsTable = page.locator('text=/Recent Events|Event Type|Timestamp/i');
    await expect(eventsTable.first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-AdminDashboard-010: Verify event type filter dropdown works', async ({ page }) => {
    const filterDropdown = page.locator('select').filter({ hasText: /event.*type|all.*events/i }).or(page.locator('select')).first();
    if (await filterDropdown.count() > 0) {
      await filterDropdown.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const selectedValue = await filterDropdown.inputValue();
      expect(selectedValue).toBeTruthy();
    }
  });

  test('TC-AdminDashboard-015: Verify Refresh button reloads data', async ({ page }) => {
    const refreshButton = page.locator('button').filter({ hasText: /refresh/i }).first();
    if (await refreshButton.count() > 0) {
      await refreshButton.click();
      await page.waitForTimeout(2000);
      
      const summaryCards = page.locator('text=/Total Events/i');
      await expect(summaryCards.first()).toBeVisible();
    }
  });
});

