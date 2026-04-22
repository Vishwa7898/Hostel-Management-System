import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test('Admin can view payments and filter by paid/unpaid', async ({ page, request }) => {
  // TODO: put a real existing admin/warden account here
  await loginAsAdmin(request, page, 'warden@example.com', 'password123', 'Warden');

  await page.goto('http://localhost:5173/admin-payments');

  await expect(page.getByText('Payments Overview')).toBeVisible();

  await page.getByRole('combobox').selectOption('paid');
  // Table should still render (exact row asserts depend on your DB data)
  await expect(page.locator('table')).toBeVisible();

  await page.getByRole('combobox').selectOption('unpaid');
  await expect(page.locator('table')).toBeVisible();
});