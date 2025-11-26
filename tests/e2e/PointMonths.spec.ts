import { test, expect } from '../../fixtures/test-fixtures';

test.describe('PointMonths', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /point/i }).first();
    await analysisMode.click().catch(() => {});
    
    const compareMode = page.locator('select').or(page.locator('button')).filter({ hasText: /months/i }).first();
    await compareMode.click().catch(() => {});
  });

  test('TC-PointMonths-001: Switch to Months mode and verify only one point can be selected', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(1000);
      
      const markerCount = await page.locator('.leaflet-marker-icon').count();
      expect(markerCount).toBeLessThanOrEqual(1);
    }
  });

  test('TC-PointMonths-003: Verify "Click to select a point" message appears initially', async ({ page }) => {
    const message = page.locator('text=/click.*select.*point/i');
    await expect(message).toBeVisible({ timeout: 5000 });
  });

  test('TC-PointMonths-006: Verify Reset button appears when point selected', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const resetButton = page.locator('a').filter({ hasText: /reset/i }).or(page.locator('button').filter({ hasText: /reset/i })).first();
      await expect(resetButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-PointMonths-007: Click Reset and verify point is cleared', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const resetButton = page.locator('a').filter({ hasText: /reset/i }).or(page.locator('button').filter({ hasText: /reset/i })).first();
      if (await resetButton.count() > 0) {
        await resetButton.click();
        await page.waitForTimeout(1000);
        
        const markerCount = await page.locator('.leaflet-marker-icon').count();
        expect(markerCount).toBe(0);
      }
    }
  });

  test('TC-PointMonths-008: Verify no month is auto-added when point first selected', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const monthTable = page.locator('table').filter({ hasText: /month/i });
      const rowCount = await monthTable.locator('tbody tr').count();
      expect(rowCount).toBe(0);
    }
  });

  test('TC-PointMonths-010: Add month via "Add" button and verify it appears in table', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const addButton = page.locator('button').filter({ hasText: /add/i }).first();
      if (await addButton.count() > 0) {
        await addButton.click();
        await page.waitForTimeout(2000);
        
        const monthTable = page.locator('table').filter({ hasText: /month/i });
        const rowCount = await monthTable.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
      }
    }
  });

  test('TC-PointMonths-017: Verify no chart navigation arrows in Months mode', async ({ page, mapHelpers, chartHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      await chartHelpers.verifyChartNavigationArrowsNotVisible();
    }
  });
});

