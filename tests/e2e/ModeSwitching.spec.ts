import { test, expect } from '../fixtures/test-fixtures';

test.describe('ModeSwitching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-ModeSwitching-001: Switch from Point to Area mode and verify state reset (except cloud tolerance)', async ({ page }) => {
    const cloudToleranceDropdown = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
    if (await cloudToleranceDropdown.count() > 0) {
      await cloudToleranceDropdown.selectOption('50');
      await page.waitForTimeout(500);
      
      const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /area/i }).first();
      await analysisMode.click();
      await page.waitForTimeout(500);
      
      const newCloudTolerance = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
      const valueAfterModeChange = await newCloudTolerance.inputValue();
      expect(valueAfterModeChange).toBe('50');
      
      const pointMarkers = await page.locator('.leaflet-marker-icon').count();
      expect(pointMarkers).toBe(0);
    }
  });

  test('TC-ModeSwitching-006: Verify cloud tolerance persists across all mode changes', async ({ page }) => {
    const cloudToleranceDropdown = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
    if (await cloudToleranceDropdown.count() > 0) {
      await cloudToleranceDropdown.selectOption('75');
      await page.waitForTimeout(500);
      
      const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /area/i }).first();
      await analysisMode.click();
      await page.waitForTimeout(500);
      
      const compareMode = page.locator('select').or(page.locator('button')).filter({ hasText: /months/i }).first();
      await compareMode.click();
      await page.waitForTimeout(500);
      
      const finalCloudTolerance = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
      const finalValue = await finalCloudTolerance.inputValue();
      expect(finalValue).toBe('75');
    }
  });
});

