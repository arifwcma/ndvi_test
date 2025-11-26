import { test, expect } from '../fixtures/test-fixtures';

test.describe('AdminLogin', () => {
  test('TC-AdminLogin-001: Navigate to /admin and verify redirect to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/login');
  });

  test('TC-AdminLogin-002: Verify login page displays username and password fields', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.locator('input[type="text"]').or(page.locator('input[name="username"]')).first();
    const passwordField = page.locator('input[type="password"]').first();
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
  });

  test('TC-AdminLogin-003: Submit invalid credentials and verify error message', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.locator('input[type="text"]').or(page.locator('input[name="username"]')).first();
    const passwordField = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /login/i })).first();
    
    await usernameField.fill('invalid');
    await passwordField.fill('invalid');
    await submitButton.click();
    
    await page.waitForTimeout(1000);
    
    const errorMessage = page.locator('text=/invalid|error|failed/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('TC-AdminLogin-004: Submit valid credentials (admin/admin) and verify redirect to dashboard', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.locator('input[type="text"]').or(page.locator('input[name="username"]')).first();
    const passwordField = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /login/i })).first();
    
    await usernameField.fill('admin');
    await passwordField.fill('admin');
    await submitButton.click();
    
    await page.waitForURL('**/admin', { timeout: 10000 });
    expect(page.url()).toContain('/admin');
    expect(page.url()).not.toContain('/admin/login');
  });

  test('TC-AdminLogin-006: Verify logout button works', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.locator('input[type="text"]').or(page.locator('input[name="username"]')).first();
    const passwordField = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button').filter({ hasText: /login/i })).first();
    
    await usernameField.fill('admin');
    await passwordField.fill('admin');
    await submitButton.click();
    
    await page.waitForURL('**/admin', { timeout: 10000 });
    
    const logoutButton = page.locator('button').filter({ hasText: /logout/i }).first();
    await logoutButton.click();
    
    await page.waitForURL('**/admin/login', { timeout: 10000 });
    expect(page.url()).toContain('/admin/login');
  });
});

