import { test, expect } from '@playwright/test';
import path from 'path';

test('should register a new student successfully', async ({ page }) => {
  // 1. Navigate to the registration page
  // Using 127.0.0.1 can sometimes resolve timeout issues better than 'localhost'
  await page.goto('http://localhost:5173/student-register');

  // 2. Fill Text Details
  // Using { exact: true } on 'Address' prevents the strict mode error 
  // caused by 'Email Address' also containing the word 'Address'.
  await page.getByPlaceholder('Full Name').fill('Test Student');
  await page.getByPlaceholder('Address', { exact: true }).fill('123 Hostel Lane');
  await page.getByPlaceholder('City').fill('Colombo');
  await page.getByPlaceholder('Student Phone Number').fill('0771234567');
  
  // Create a unique email for every test run
  const uniqueEmail = `testuser${Date.now()}@gmail.com`;
  await page.getByPlaceholder('Email Address').fill(uniqueEmail);
  
  await page.getByPlaceholder('Create Password').fill('Password123!');
  await page.getByPlaceholder('Guardian Name').fill('Guardian Name');
  await page.getByPlaceholder('Guardian Phone Number').fill('0719876543');

  // 3. Handle File Uploads
  // Ensure 'public/vite.svg' exists in your project root, or update this path
  const dummyImagePath = path.resolve('public/vite.svg'); 
  
  // In your React code, you have 3 file inputs (Profile, ID Front, ID Back)
  const fileInputs = page.locator('input[type="file"]');
  
  // Upload Profile Photo (index 0)
  await fileInputs.nth(0).setInputFiles(dummyImagePath);
  
  // Upload ID Card Front (index 1)
  await fileInputs.nth(1).setInputFiles(dummyImagePath);
  
  // Upload ID Card Back (index 2)
  await fileInputs.nth(2).setInputFiles(dummyImagePath);

  // 4. Accept Terms & Conditions
  // Using getByLabel is best practice for accessibility and reliability
  await page.getByLabel('I have read and agree to the Terms and Conditions').check();

  // 5. Submit Registration
  // Using a regex with 'i' makes the locator case-insensitive
  await page.getByRole('button', { name: /Register Student/i }).click();

  // 6. Verify Redirection
  // Playwright will wait for the URL to change to the dashboard
  await expect(page).toHaveURL(/.*student-dashboard/);
});