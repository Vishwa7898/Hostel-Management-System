import { test, expect } from '@playwright/test';
import { uiLoginAsAdmin, uiLoginAsStudent } from './helpers/ui-auth.js';

const ADMIN_EMAIL = 'admin@staysphere.com';
const ADMIN_PASSWORD = 'password123';
const STUDENT_EMAIL = 'student@staysphere.com';
const STUDENT_PASSWORD = 'password123';

test.describe('Maintenance Notices Module', () => {

  test.beforeEach(async ({ page }) => {
    // Mock Login
    await page.route('**/api/auth/login', async route => {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-token',
          name: body.role === 'Student' ? 'John Student' : 'Super Admin',
          email: body.email,
          role: body.role
        })
      });
    });

    // Mock Notices GET/POST/PUT/DELETE
    await page.route(/\/api\/notices/, async route => {
      const method = route.request().method();
      console.log(`Mocking ${method} ${route.request().url()}`);
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              _id: 'notice-1',
              title: 'Scheduled Maintenance',
              description: 'Water supply will be interrupted on Sunday.',
              author: 'Super Admin',
              createdAt: new Date().toISOString()
            }
          ])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Success' })
        });
      }
    });
  });


  test('Admin can create, edit, and delete a notice', async ({ page }) => {
    await uiLoginAsAdmin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    
    await page.goto('/admin-notices');
    
    // Create
    await page.click('button:has-text("New Notice")');
    const title = `Notice ${Date.now()}`;
    await page.fill('input[placeholder="e.g. Water Supply Interruption"]', title);
    await page.fill('textarea[placeholder="Provide full details about the maintenance..."]', 'This is a test notice description with at least fifteen characters.');
    await page.click('button:has-text("Save Notice")');
    
    // Wait for modal to close
    await expect(page.getByText('Create New Notice')).toBeHidden();
    
    // Edit (since we mock, we'll edit the mocked notice)
    const noticeCard = page.locator('div.bg-white\\/80').filter({ hasText: 'Scheduled Maintenance' });
    await expect(noticeCard).toBeVisible();
    
    await noticeCard.locator('button:has-text("Edit")').click();
    await page.fill('input[placeholder="e.g. Water Supply Interruption"]', 'Updated Notice Title');
    await page.click('button:has-text("Save Notice")');
    
    // Wait for modal to close
    await expect(page.getByText('Edit Notice')).toBeHidden();
    
    // Delete
    page.on('dialog', dialog => dialog.accept());
    await noticeCard.locator('button:has-text("Delete")').click();
  });

  test('Student can view notices', async ({ page }) => {
    // Login as student
    await uiLoginAsStudent(page, STUDENT_EMAIL, STUDENT_PASSWORD);
    await page.goto('/student-notices');
    
    // Verify notice is visible (the one we mocked)
    await expect(page.getByText('Scheduled Maintenance')).toBeVisible();
  });
});


