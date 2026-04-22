import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers/auth.js';

const STUDENT_EMAIL = process.env.PW_STUDENT_EMAIL;
const STUDENT_PASSWORD = process.env.PW_STUDENT_PASSWORD;

test('Student payments page loads summary and history', async ({ page, request }) => {
  test.skip(!STUDENT_EMAIL || !STUDENT_PASSWORD, 'Set PW_STUDENT_EMAIL and PW_STUDENT_PASSWORD');
  await loginAsStudent(request, page, STUDENT_EMAIL, STUDENT_PASSWORD);

  await page.goto('/student-payments');
  await expect(page.getByRole('heading', { name: 'Payments & History' })).toBeVisible();
  await expect(page.getByText('Unpaid Orders')).toBeVisible();
  await expect(page.getByText('Paid Orders', { exact: true })).toBeVisible();
  await expect(page.getByText('Payment History')).toBeVisible();
});
