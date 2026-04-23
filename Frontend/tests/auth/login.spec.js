import { test, expect } from '@playwright/test';

test.describe('StaySphere Student Authentication Flow', () => {
  
  test('should login successfully as a student', async ({ page }) => {
    // Navigate to your local Vite server
    await page.goto('http://localhost:5173/');

    // Click Student Login
    await page.getByRole('button', { name: 'Student Login' }).click();

    // Fill credentials
    await page.getByPlaceholder('Email Address').fill('nimesha@gmail.com');
    await page.getByPlaceholder('••••••').fill('nimesha12345');

    // Click Login
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    // Assert navigation and welcome message
    await expect(page).toHaveURL(/.*student-home/);
    await expect(page.getByText('Welcome, nimesha', { exact: false })).toBeVisible();
  });
});