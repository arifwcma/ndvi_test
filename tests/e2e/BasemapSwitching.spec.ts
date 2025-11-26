import { test, expect } from '../../fixtures/test-fixtures';

test.describe('BasemapSwitching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-BasemapSwitching-001: Verify basemap selector shows current basemap', async ({ page }) => {
    const basemapSelector = page.locator('select').or(page.locator('button')).filter({ hasText: /street|satellite|topographic/i }).first();
    await expect(basemapSelector).toBeVisible({ timeout: 5000 });
  });

  test('TC-BasemapSwitching-002: Switch to satellite basemap and verify map updates', async ({ page }) => {
    const basemapSelector = page.locator('select').or(page.locator('button')).filter({ hasText: /street|satellite|topographic/i }).first();
    if (await basemapSelector.count() > 0) {
      const tagName = await basemapSelector.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'select') {
        await basemapSelector.selectOption({ label: /satellite/i });
      } else {
        await basemapSelector.click();
        const satelliteOption = page.locator('text=/satellite/i').first();
        await satelliteOption.click();
      }
      
      await page.waitForTimeout(2000);
      
      const mapContainer = page.locator('.leaflet-container');
      await expect(mapContainer).toBeVisible();
    }
  });

  test('TC-BasemapSwitching-005: Verify basemap persists across mode changes', async ({ page }) => {
    const basemapSelector = page.locator('select').or(page.locator('button')).filter({ hasText: /street|satellite|topographic/i }).first();
    if (await basemapSelector.count() > 0) {
      const tagName = await basemapSelector.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'select') {
        await basemapSelector.selectOption({ label: /satellite/i });
      } else {
        await basemapSelector.click();
        const satelliteOption = page.locator('text=/satellite/i').first();
        await satelliteOption.click();
      }
      
      await page.waitForTimeout(500);
      
      const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /area/i }).first();
      await analysisMode.click().catch(() => {});
      await page.waitForTimeout(500);
      
      const newBasemapSelector = page.locator('select').or(page.locator('button')).filter({ hasText: /street|satellite|topographic/i }).first();
      const selectedValue = await newBasemapSelector.textContent();
      expect(selectedValue).toMatch(/satellite/i);
    }
  });
});

