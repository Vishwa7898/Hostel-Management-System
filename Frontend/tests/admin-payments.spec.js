import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth.js';

test('Admin can view payments and filter by paid/unpaid', async ({ page, request }) => {
  // TODO: replace with real account
  await loginAsAdmin(request, page, 'admin@staysphere.com', 'password123', 'admin');

  await page.goto('http://localhost:5173/admin-payments');

  await expect(page.getByText('Payments Overview')).toBeVisible();

  await page.getByRole('combobox').selectOption('paid');
  await expect(page.locator('table')).toBeVisible();

  await page.getByRole('combobox').selectOption('unpaid');
  await expect(page.locator('table')).toBeVisible();
});