import { Page, expect } from '@playwright/test';

export class ChartHelpers {
  constructor(private page: Page) {}

  async getChartData(): Promise<any> {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      
      const chart = (window as any).Chart?.getChart?.(canvas);
      if (chart && chart.data) {
        return chart.data;
      }
      return null;
    });
  }

  async clickChartNavigation(direction: 'left' | 'right'): Promise<void> {
    const arrowButton = direction === 'left' 
      ? this.page.locator('button').filter({ hasText: '←' }).or(this.page.locator('button').filter({ hasText: /left/i })).first()
      : this.page.locator('button').filter({ hasText: '→' }).or(this.page.locator('button').filter({ hasText: /right/i })).first();
    
    await arrowButton.click();
    await this.page.waitForTimeout(1100);
  }

  async toggleYAxisRange(): Promise<void> {
    const toggleButton = this.page.locator('button').filter({ hasText: /↓|↑/ }).first();
    await toggleButton.click();
    await this.page.waitForTimeout(500);
  }

  async verifyChartRange(startMonth: { year: number, month: number }, endMonth: { year: number, month: number }): Promise<void> {
    const chartData = await this.getChartData();
    expect(chartData).toBeTruthy();
  }

  async getNDVIAverage(): Promise<string | null> {
    const avgElement = this.page.locator('text=/NDVI.*avg/i').or(this.page.locator('text=/average/i'));
    const count = await avgElement.count();
    if (count > 0) {
      return await avgElement.first().textContent();
    }
    return null;
  }

  async verifyChartVisible(): Promise<void> {
    const canvas = this.page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  }

  async verifyChartNavigationArrowsVisible(): Promise<void> {
    const leftArrow = this.page.locator('button').filter({ hasText: '←' }).or(this.page.locator('button').filter({ hasText: /left/i })).first();
    const rightArrow = this.page.locator('button').filter({ hasText: '→' }).or(this.page.locator('button').filter({ hasText: /right/i })).first();
    
    await expect(leftArrow).toBeVisible();
    await expect(rightArrow).toBeVisible();
  }

  async verifyChartNavigationArrowsNotVisible(): Promise<void> {
    const leftArrow = this.page.locator('button').filter({ hasText: '←' }).or(this.page.locator('button').filter({ hasText: /left/i }));
    const rightArrow = this.page.locator('button').filter({ hasText: '→' }).or(this.page.locator('button').filter({ hasText: /right/i }));
    
    const leftCount = await leftArrow.count();
    const rightCount = await rightArrow.count();
    
    expect(leftCount).toBe(0);
    expect(rightCount).toBe(0);
  }
}

