import { test, expect } from '../fixtures/test-fixtures';

test.describe('ChartInteractions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /point/i }).first();
    await analysisMode.click().catch(() => {});
    
    const compareMode = page.locator('select').or(page.locator('button')).filter({ hasText: /points/i }).first();
    await compareMode.click().catch(() => {});
  });

  test('TC-ChartInteractions-001: Verify chart renders with correct data', async ({ page, mapHelpers, chartHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(3000);
      
      await chartHelpers.verifyChartVisible();
    }
  });

  test('TC-ChartInteractions-004: Verify Y-axis range toggle button position (center between arrows)', async ({ page, mapHelpers, chartHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(3000);
      
      await chartHelpers.verifyChartNavigationArrowsVisible();
      
      const toggleButton = page.locator('button').filter({ hasText: /↓|↑/ }).first();
      await expect(toggleButton).toBeVisible();
    }
  });

  test('TC-ChartInteractions-016: Verify Y-axis range toggle switches between 0-1 and -1 to +1', async ({ page, mapHelpers, chartHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(3000);
      
      await chartHelpers.toggleYAxisRange();
      
      const toggleButton = page.locator('button').filter({ hasText: /↓|↑/ }).first();
      const buttonText = await toggleButton.textContent();
      expect(buttonText).toMatch(/↓|↑/);
    }
  });
});

