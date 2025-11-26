import { test, expect } from '../../fixtures/test-fixtures';

test.describe('MapInteractions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-MapInteractions-001: Verify map loads with default basemap (street)', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();
    
    const basemapSelector = page.locator('select').or(page.locator('button')).filter({ hasText: /street/i }).first();
    await expect(basemapSelector).toBeVisible({ timeout: 5000 });
  });

  test('TC-MapInteractions-003: Pan map and verify map updates', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const boundsBefore = await mapHelpers.getMapBounds();
    
    await mapHelpers.panMap('right', 100);
    await page.waitForTimeout(1000);
    
    const boundsAfter = await mapHelpers.getMapBounds();
    expect(boundsAfter).not.toEqual(boundsBefore);
  });

  test('TC-MapInteractions-004: Zoom in/out and verify zoom level updates', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const zoomBefore = await mapHelpers.getCurrentZoom();
    
    await mapHelpers.zoomMap(zoomBefore + 1);
    await page.waitForTimeout(1000);
    
    const zoomAfter = await mapHelpers.getCurrentZoom();
    expect(zoomAfter).toBeGreaterThan(zoomBefore);
  });

  test('TC-MapInteractions-005: Verify map bounds update on pan/zoom', async ({ page, mapHelpers }) => {
    await mapHelpers.waitForMapLoad();
    
    const boundsBefore = await mapHelpers.getMapBounds();
    
    await mapHelpers.panMap('left', 100);
    await page.waitForTimeout(1000);
    
    const boundsAfter = await mapHelpers.getMapBounds();
    expect(boundsAfter).not.toEqual(boundsBefore);
  });
});

