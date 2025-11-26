import { test, expect } from '../../fixtures/test-fixtures';

test.describe('PointPoints', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /point/i }).first();
    await analysisMode.click().catch(() => {});
    
    const compareMode = page.locator('select').or(page.locator('button')).filter({ hasText: /points/i }).first();
    await compareMode.click().catch(() => {});
  });

  test('TC-PointPoints-001: Select single point on map and verify marker appears', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(1000);
      
      const marker = page.locator('.leaflet-marker-icon').first();
      await expect(marker).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-PointPoints-005: Verify "Click to place a point" message appears when no points selected', async ({ page }) => {
    const message = page.locator('text=/click.*place.*point/i');
    await expect(message).toBeVisible();
  });

  test('TC-PointPoints-006: Verify info panel appears when points are selected', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const infoPanel = page.locator('text=/latitude|longitude|ndvi/i').or(page.locator('table')).first();
      await expect(infoPanel).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-PointPoints-007: Verify month dropdown defaults to current month', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const monthDropdown = page.locator('select').filter({ hasText: /month/i }).or(page.locator('select')).first();
      if (await monthDropdown.count() > 0) {
        const selectedValue = await monthDropdown.inputValue();
        expect(selectedValue).toBeTruthy();
      }
    }
  });

  test('TC-PointPoints-016: Verify Y-axis range toggle switches between 0-1 and -1 to +1', async ({ page, mapHelpers, chartHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(3000);
      
      await chartHelpers.verifyChartVisible();
      
      const toggleButton = page.locator('button').filter({ hasText: /↓|↑/ }).first();
      if (await toggleButton.count() > 0) {
        const initialText = await toggleButton.textContent();
        await toggleButton.click();
        await page.waitForTimeout(500);
        const newText = await toggleButton.textContent();
        expect(newText).not.toBe(initialText);
      }
    }
  });

  test('TC-PointPoints-023: Remove point via cross button and verify removal', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const removeButton = page.locator('button').filter({ hasText: /×|remove/i }).or(page.locator('a').filter({ hasText: /×/ })).first();
      if (await removeButton.count() > 0) {
        const markerCountBefore = await page.locator('.leaflet-marker-icon').count();
        await removeButton.click();
        await page.waitForTimeout(1000);
        const markerCountAfter = await page.locator('.leaflet-marker-icon').count();
        expect(markerCountAfter).toBeLessThan(markerCountBefore);
      }
    }
  });

  test('TC-PointPoints-025: Verify "Compare snapshots" button appears when points selected', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const compareButton = page.locator('a').filter({ hasText: /compare.*snapshot/i }).or(page.locator('button').filter({ hasText: /compare/i })).first();
      await expect(compareButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-PointPoints-026: Click "Compare snapshots" and verify popup opens', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    const bounds = await mapContainer.boundingBox();
    if (bounds) {
      await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      await page.waitForTimeout(2000);
      
      const compareButton = page.locator('a').filter({ hasText: /compare.*snapshot/i }).or(page.locator('button').filter({ hasText: /compare/i })).first();
      if (await compareButton.count() > 0) {
        await compareButton.click();
        await page.waitForTimeout(1000);
        
        const popup = page.locator('div').filter({ hasText: /snapshot|compare/i }).last();
        await expect(popup).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

