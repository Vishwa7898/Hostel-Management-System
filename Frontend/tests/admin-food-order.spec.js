import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth.js';

const ADMIN_EMAIL = process.env.PW_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PW_ADMIN_PASSWORD;
const ADMIN_ROLE = process.env.PW_ADMIN_ROLE || 'Warden';

test('Admin can open food order management and switch tabs', async ({ page, request }) => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set PW_ADMIN_EMAIL and PW_ADMIN_PASSWORD');
  await loginAsAdmin(request, page, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ROLE);

  await page.goto('/admin-food-order');
  await expect(page.getByRole('heading', { name: 'Food Order Management' })).toBeVisible();

  await page.getByRole('button', { name: 'Menu Items' }).click();
  await expect(page.getByRole('button', { name: 'Add Food Item' })).toBeVisible();

  await page.getByRole('button', { name: 'Orders' }).click();
  await expect(page.locator('select').first()).toBeVisible();
});
