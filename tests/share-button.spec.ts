import { test, expect } from './fixtures/test-fixtures';

test.describe('ShareFunctionality', () => {
  test('should open popup with share link on click', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    const shareLink = page.locator('a').filter({ hasText: 'Share' }).first();
    await expect(shareLink).toBeVisible();
    
    await shareLink.click();
    
    const popup = page.locator('div').filter({ hasText: 'Share Link' }).first();
    await expect(popup).toBeVisible();
    
    await page.waitForSelector('input[type="text"][readonly]', { state: 'visible', timeout: 10000 });
    
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"][readonly]') as HTMLInputElement;
      return input && input.value.length > 0;
    }, { timeout: 10000 });
    
    const urlInput = page.locator('input[type="text"][readonly]');
    await expect(urlInput).toBeVisible();
    
    const shareUrl = await urlInput.inputValue();
    expect(shareUrl).toBeTruthy();
    expect(shareUrl).toContain('share=');
    
    const url = new URL(shareUrl);
    const token = url.searchParams.get('share');
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(0);
    
    const copyButton = page.locator('button').filter({ hasText: /Copy URL|Copied!/ });
    await expect(copyButton).toBeVisible();
    
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await copyButton.click();
    
    await page.waitForTimeout(500);
    
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    
    expect(clipboardText).toBe(shareUrl);
    
    const apiUrl = `http://localhost:3000/api/share/${token}`;
    const response = await page.request.get(apiUrl);
    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    expect(responseData).toHaveProperty('state');
  });
});

