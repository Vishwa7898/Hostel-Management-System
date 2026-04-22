import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers/auth.js';

const STUDENT_EMAIL = process.env.PW_STUDENT_EMAIL;
const STUDENT_PASSWORD = process.env.PW_STUDENT_PASSWORD;

test('Student can add menu items and open order confirmation', async ({ page, request }) => {
  test.skip(!STUDENT_EMAIL || !STUDENT_PASSWORD, 'Set PW_STUDENT_EMAIL and PW_STUDENT_PASSWORD');
  await loginAsStudent(request, page, STUDENT_EMAIL, STUDENT_PASSWORD);

  await page.goto('/student-food-order');
  await expect(page.getByRole('heading', { name: 'Food Order Menu' })).toBeVisible();

  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.getByRole('heading', { name: 'Your Order' })).toBeVisible();
  await expect(page.getByText(/items/i)).toBeVisible();

  await page.getByRole('main').getByRole('button', { name: 'Proceed to Payment' }).click();
  await expect(page.getByRole('heading', { name: '📝 Confirm Your Order' })).toBeVisible();

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: '📝 Confirm Your Order' })).not.toBeVisible();
});
