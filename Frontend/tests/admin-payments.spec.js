import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth.js';

const ADMIN_EMAIL = process.env.PW_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PW_ADMIN_PASSWORD;
const ADMIN_ROLE = process.env.PW_ADMIN_ROLE || 'Warden';

test('Admin can view payments and filter by paid/unpaid', async ({ page, request }) => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set PW_ADMIN_EMAIL and PW_ADMIN_PASSWORD');
  await loginAsAdmin(request, page, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ROLE);

  await page.goto('/admin-payments');

  await expect(page.getByText('Payments Overview')).toBeVisible();

  const paymentFilter = page.getByRole('combobox').first();
  await paymentFilter.selectOption('paid');
  await page.getByText('Loading payments...').waitFor({ state: 'hidden', timeout: 20000 });
  await expect(
    page.locator('table').or(page.getByText('No payments found.'))
  ).toBeVisible();

  await paymentFilter.selectOption('unpaid');
  await page.getByText('Loading payments...').waitFor({ state: 'hidden', timeout: 20000 });
  await expect(
    page.locator('table').or(page.getByText('No payments found.'))
  ).toBeVisible();
});