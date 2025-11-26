import { test, expect } from '../../fixtures/test-fixtures';

test.describe('ShareFunctionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-ShareFunctionality-001: Click Share button and verify modal opens', async ({ page }) => {
    const shareLink = page.locator('a').filter({ hasText: 'Share' }).first();
    await expect(shareLink).toBeVisible();
    
    await shareLink.click();
    
    const popup = page.locator('div').filter({ hasText: 'Share Link' }).first();
    await expect(popup).toBeVisible({ timeout: 10000 });
  });

    await page.waitForSelector('input[type="text"][readonly]', { state: 'visible', timeout: 10000 });
    
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"][readonly]') as HTMLInputElement;
      return input && input.value.length > 0;
    }, { timeout: 10000 });
  });

  test('TC-ShareFunctionality-002: Verify share URL is generated', async ({ page }) => {
    const shareLink = page.locator('a').filter({ hasText: 'Share' }).first();
    await shareLink.click();
    
    await page.waitForSelector('input[type="text"][readonly]', { state: 'visible', timeout: 10000 });
    
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"][readonly]') as HTMLInputElement;
      return input && input.value.length > 0;
    }, { timeout: 10000 });
    
    const urlInput = page.locator('input[type="text"][readonly]');
    const shareUrl = await urlInput.inputValue();
    expect(shareUrl).toBeTruthy();
    expect(shareUrl.length).toBeGreaterThan(0);
  });

  test('TC-ShareFunctionality-003: Verify share URL contains token parameter', async ({ page }) => {
    const shareLink = page.locator('a').filter({ hasText: 'Share' }).first();
    await shareLink.click();
    
    await page.waitForSelector('input[type="text"][readonly]', { state: 'visible', timeout: 10000 });
    
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"][readonly]') as HTMLInputElement;
      return input && input.value.length > 0;
    }, { timeout: 10000 });
    
    const urlInput = page.locator('input[type="text"][readonly]');
    const shareUrl = await urlInput.inputValue();
    expect(shareUrl).toContain('share=');
    
    const url = new URL(shareUrl);
    const token = url.searchParams.get('share');
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(0);
  });

  test('TC-ShareFunctionality-004: Copy share URL and verify clipboard functionality', async ({ page }) => {
    const shareLink = page.locator('a').filter({ hasText: 'Share' }).first();
    await shareLink.click();
    
    await page.waitForSelector('input[type="text"][readonly]', { state: 'visible', timeout: 10000 });
    
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"][readonly]') as HTMLInputElement;
      return input && input.value.length > 0;
    }, { timeout: 10000 });
    
    const urlInput = page.locator('input[type="text"][readonly]');
    const shareUrl = await urlInput.inputValue();
    
    const copyButton = page.locator('button').filter({ hasText: /Copy URL|Copied!/ });
    await copyButton.click();
    
    await page.waitForTimeout(500);
    
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    
    expect(clipboardText).toBe(shareUrl);
  });

  test('TC-ShareFunctionality-005: Open share URL in new session and verify state restoration', async ({ page, browser }) => {
    const shareLink = page.locator('a').filter({ hasText: 'Share' }).first();
    await shareLink.click();
    
    await page.waitForSelector('input[type="text"][readonly]', { state: 'visible', timeout: 10000 });
    
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"][readonly]') as HTMLInputElement;
      return input && input.value.length > 0;
    }, { timeout: 10000 });
    
    const urlInput = page.locator('input[type="text"][readonly]');
    const shareUrl = await urlInput.inputValue();
    
    const newPage = await browser.newPage();
    await newPage.goto(shareUrl);
    await newPage.waitForLoadState('networkidle');
    
    const mapContainer = newPage.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();
    
    await newPage.close();
  });
});

