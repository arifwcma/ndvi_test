import { test, expect } from '../fixtures/test-fixtures';

test.describe('AreaAreas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /area/i }).first();
    await analysisMode.click().catch(() => {});
    
    const compareMode = page.locator('select').or(page.locator('button')).filter({ hasText: /areas/i }).first();
    await compareMode.click().catch(() => {});
  });

  test('TC-AreaAreas-001: Switch to Area mode and verify Areas is default compare mode', async ({ page }) => {
    const areasMode = page.locator('text=/areas/i').or(page.locator('select').filter({ hasText: /areas/i })).first();
    await expect(areasMode).toBeVisible({ timeout: 5000 });
  });

  test('TC-AreaAreas-002: Verify "Select area by choosing a parcel or drawing a rectangle" prompt appears', async ({ page }) => {
    const prompt = page.locator('text=/select.*area/i').or(page.locator('text=/parcel.*rectangle/i')).first();
    await expect(prompt).toBeVisible({ timeout: 5000 });
  });

  test('TC-AreaAreas-004: Click "rectangle" link and verify rectangle drawing mode activates', async ({ page }) => {
    const rectangleLink = page.locator('a').filter({ hasText: /rectangle/i }).first();
    if (await rectangleLink.count() > 0) {
      await rectangleLink.click();
      await page.waitForTimeout(500);
      
      const drawingMessage = page.locator('text=/click.*drag.*draw/i').or(page.locator('text=/drawing/i')).first();
      await expect(drawingMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('TC-AreaAreas-011: Draw rectangle and verify area is added', async ({ page, mapHelpers }) => {
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
        
        const areaMarker = page.locator('.leaflet-marker-icon').or(page.locator('text=/area.*1/i')).first();
        await expect(areaMarker).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('TC-AreaAreas-029: Remove area via cross button and verify removal', async ({ page, mapHelpers }) => {
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
        
        const removeButton = page.locator('button').filter({ hasText: /×|remove/i }).or(page.locator('a').filter({ hasText: /×/ })).first();
        if (await removeButton.count() > 0) {
          const markerCountBefore = await page.locator('.leaflet-marker-icon').count();
          await removeButton.click();
          await page.waitForTimeout(1000);
          const markerCountAfter = await page.locator('.leaflet-marker-icon').count();
          expect(markerCountAfter).toBeLessThan(markerCountBefore);
        }
      }
    }
  });

  test('TC-AreaAreas-030: Verify "Compare snapshots" button appears when areas selected', async ({ page, mapHelpers }) => {
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
        
        const compareButton = page.locator('a').filter({ hasText: /compare.*snapshot/i }).or(page.locator('button').filter({ hasText: /compare/i })).first();
        await expect(compareButton).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

