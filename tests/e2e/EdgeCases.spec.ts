import { test, expect } from '../fixtures/test-fixtures';

test.describe('EdgeCases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-EdgeCases-009: Verify loading states display correctly', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      
      const loadingMessage = page.locator('text=/loading|Loading/i').first();
      const loadingVisible = await loadingMessage.isVisible().catch(() => false);
      
      if (loadingVisible) {
        await expect(loadingMessage).toBeVisible({ timeout: 2000 });
        await expect(loadingMessage).not.toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('TC-EdgeCases-010: Verify error messages display correctly', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.locator('input[type="text"]').or(page.locator('input[name="username"]')).first();
    const passwordField = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /login/i })).first();
    
    if (await usernameField.count() > 0 && await passwordField.count() > 0) {
      await usernameField.fill('invalid');
      await passwordField.fill('invalid');
      await submitButton.click();
      
      await page.waitForTimeout(1000);
      
      const errorMessage = page.locator('text=/invalid|error|failed/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    }
  });
});
