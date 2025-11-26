import { Page, expect } from '@playwright/test';

export class MapHelpers {
  constructor(private page: Page) {}

  async clickOnMap(lat: number, lon: number): Promise<void> {
    const mapContainer = this.page.locator('.leaflet-container');
    await mapContainer.waitFor({ state: 'visible' });
    
    const bounds = await mapContainer.boundingBox();
    if (!bounds) throw new Error('Map container not found');
    
    await this.page.evaluate(({ lat, lon }) => {
      const mapElement = document.querySelector('.leaflet-container');
      if (mapElement) {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        mapElement.dispatchEvent(event);
      }
    }, { lat, lon });
    
    await mapContainer.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
  }

  async drawRectangle(startX: number, startY: number, endX: number, endY: number): Promise<void> {
    const mapContainer = this.page.locator('.leaflet-container');
    await mapContainer.waitFor({ state: 'visible' });
    
    await mapContainer.hover({ position: { x: startX, y: startY } });
    await this.page.mouse.down();
    await mapContainer.hover({ position: { x: endX, y: endY } });
    await this.page.mouse.up();
    await this.page.waitForTimeout(500);
  }

  async selectParcel(index: number): Promise<void> {
    const parcelElements = this.page.locator('.leaflet-interactive');
    const count = await parcelElements.count();
    if (index < count) {
      await parcelElements.nth(index).click();
    }
  }

  async panMap(direction: 'up' | 'down' | 'left' | 'right', distance: number = 100): Promise<void> {
    const mapContainer = this.page.locator('.leaflet-container');
    await mapContainer.waitFor({ state: 'visible' });
    
    const bounds = await mapContainer.boundingBox();
    if (!bounds) throw new Error('Map container not found');
    
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    
    let deltaX = 0;
    let deltaY = 0;
    
    switch (direction) {
      case 'up':
        deltaY = -distance;
        break;
      case 'down':
        deltaY = distance;
        break;
      case 'left':
        deltaX = -distance;
        break;
      case 'right':
        deltaX = distance;
        break;
    }
    
    await mapContainer.hover({ position: { x: centerX, y: centerY } });
    await this.page.mouse.down();
    await mapContainer.hover({ position: { x: centerX + deltaX, y: centerY + deltaY } });
    await this.page.mouse.up();
    await this.page.waitForTimeout(500);
  }

  async zoomMap(level: number): Promise<void> {
    const currentZoom = await this.getCurrentZoom();
    const diff = level - currentZoom;
    
    for (let i = 0; i < Math.abs(diff); i++) {
      if (diff > 0) {
        await this.page.keyboard.press('+');
      } else {
        await this.page.keyboard.press('-');
      }
      await this.page.waitForTimeout(200);
    }
  }

  async getCurrentZoom(): Promise<number> {
    return await this.page.evaluate(() => {
      const map = (window as any).L?.map?.getContainer?.();
      if (map && (window as any).L?.map?.getZoom) {
        return (window as any).L.map.getZoom();
      }
      return 10;
    });
  }

  async waitForMapLoad(): Promise<void> {
    await this.page.waitForSelector('.leaflet-container', { state: 'visible' });
    await this.page.waitForTimeout(1000);
  }

  async getMapBounds(): Promise<[[number, number], [number, number]] | null> {
    return await this.page.evaluate(() => {
      const map = (window as any).L?.map?.getContainer?.();
      if (map && (window as any).L?.map?.getBounds) {
        const bounds = (window as any).L.map.getBounds();
        return [
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ];
      }
      return null;
    });
  }
}

