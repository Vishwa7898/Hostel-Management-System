import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers/auth.js';

const STUDENT_EMAIL = process.env.PW_STUDENT_EMAIL;
const STUDENT_PASSWORD = process.env.PW_STUDENT_PASSWORD;

test('Student can open payment modal and interact with card form', async ({ page, request }) => {
  test.skip(!STUDENT_EMAIL || !STUDENT_PASSWORD, 'Set PW_STUDENT_EMAIL and PW_STUDENT_PASSWORD');
  await loginAsStudent(request, page, STUDENT_EMAIL, STUDENT_PASSWORD);

  await page.goto('/student-food-order');

  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await page.getByRole('main').getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.getByRole('button', { name: 'Proceed to Payment' }).nth(1).click();

  await expect(page.getByText('💳 Complete Payment')).toBeVisible();

  // Stripe card fields are hosted inside an iframe.
  const stripeFrame = page.frameLocator('iframe').first();
  await stripeFrame.getByRole('textbox', { name: /card number/i }).fill('4242424242424242');
  await stripeFrame.getByRole('textbox', { name: /expiration/i }).fill('1234');
  await stripeFrame.getByRole('textbox', { name: /cvc/i }).fill('123');

  await expect(page.getByRole('button', { name: /Pay Rs\./ })).toBeEnabled();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('💳 Complete Payment')).not.toBeVisible();
});