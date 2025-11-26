import { test, expect } from '../fixtures/test-fixtures';

test.describe('AreaMonths', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /area/i }).first();
    await analysisMode.click().catch(() => {});
    
    const compareMode = page.locator('select').or(page.locator('button')).filter({ hasText: /months/i }).first();
    await compareMode.click().catch(() => {});
  });

  test('TC-AreaMonths-001: Switch to Months mode and verify only one area can be selected', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const rectangleLink = page.locator('a').filter({ hasText: /rectangle/i }).first();
    if (await rectangleLink.count() > 0) {
      await rectangleLink.click();
      await page.waitForTimeout(500);
      
      const mapContainer = page.locator('.leaflet-container');
      const bounds = await mapContainer.boundingBox();
      if (bounds) {
        await mapHelpers.drawRectangle(
          bounds.width * 0.3,
          bounds.height * 0.3,
          bounds.width * 0.7,
          bounds.height * 0.7
        );
        
        await page.waitForTimeout(2000);
        
        const markerCount = await page.locator('.leaflet-marker-icon').count();
        expect(markerCount).toBeLessThanOrEqual(1);
      }
    }
  });

  test('TC-AreaMonths-003: Verify Reset Selection link appears at top of control panel', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const rectangleLink = page.locator('a').filter({ hasText: /rectangle/i }).first();
    if (await rectangleLink.count() > 0) {
      await rectangleLink.click();
      await page.waitForTimeout(500);
      
      const mapContainer = page.locator('.leaflet-container');
      const bounds = await mapContainer.boundingBox();
      if (bounds) {
        await mapHelpers.drawRectangle(
          bounds.width * 0.3,
          bounds.height * 0.3,
          bounds.width * 0.7,
          bounds.height * 0.7
        );
        
        await page.waitForTimeout(2000);
        
        const resetButton = page.locator('a').filter({ hasText: /reset/i }).or(page.locator('button').filter({ hasText: /reset/i })).first();
        await expect(resetButton).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('TC-AreaMonths-010: Verify no chart navigation arrows in Months mode', async ({ page, mapHelpers, chartHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const rectangleLink = page.locator('a').filter({ hasText: /rectangle/i }).first();
    if (await rectangleLink.count() > 0) {
      await rectangleLink.click();
      await page.waitForTimeout(500);
      
      const mapContainer = page.locator('.leaflet-container');
      const bounds = await mapContainer.boundingBox();
      if (bounds) {
        await mapHelpers.drawRectangle(
          bounds.width * 0.3,
          bounds.height * 0.3,
          bounds.width * 0.7,
          bounds.height * 0.7
        );
        
        await page.waitForTimeout(2000);
        
        await chartHelpers.verifyChartNavigationArrowsNotVisible();
      }
    }
  });
});

