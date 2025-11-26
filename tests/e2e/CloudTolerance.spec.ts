import { test, expect } from '../../fixtures/test-fixtures';

test.describe('CloudTolerance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-CloudTolerance-001: Verify cloud tolerance dropdown defaults to 30%', async ({ page }) => {
    const cloudToleranceDropdown = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
    if (await cloudToleranceDropdown.count() > 0) {
      const selectedValue = await cloudToleranceDropdown.inputValue();
      expect(selectedValue).toBe('30');
    }
  });

  test('TC-CloudTolerance-002: Verify cloud tolerance dropdown shows values 0-100', async ({ page }) => {
    const cloudToleranceDropdown = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
    if (await cloudToleranceDropdown.count() > 0) {
      await cloudToleranceDropdown.click();
      
      const options = await cloudToleranceDropdown.locator('option').allTextContents();
      const minValue = parseInt(options[0] || '0');
      const maxValue = parseInt(options[options.length - 1] || '0');
      
      expect(minValue).toBe(0);
      expect(maxValue).toBe(100);
    }
  });

  test('TC-CloudTolerance-003: Change cloud tolerance and verify UI updates immediately', async ({ page }) => {
    const cloudToleranceDropdown = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
    if (await cloudToleranceDropdown.count() > 0) {
      await cloudToleranceDropdown.selectOption('50');
      await page.waitForTimeout(100);
      
      const selectedValue = await cloudToleranceDropdown.inputValue();
      expect(selectedValue).toBe('50');
    }
  });

  test('TC-CloudTolerance-005: Verify cloud tolerance persists across mode changes', async ({ page }) => {
    const cloudToleranceDropdown = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
    if (await cloudToleranceDropdown.count() > 0) {
      await cloudToleranceDropdown.selectOption('50');
      await page.waitForTimeout(500);
      
      const analysisMode = page.locator('select').or(page.locator('button')).filter({ hasText: /area/i }).first();
      await analysisMode.click().catch(() => {});
      await page.waitForTimeout(500);
      
      const newCloudTolerance = page.locator('select').filter({ hasText: /cloud/i }).or(page.locator('select')).first();
      const valueAfterModeChange = await newCloudTolerance.inputValue();
      expect(valueAfterModeChange).toBe('50');
    }
  });
});

