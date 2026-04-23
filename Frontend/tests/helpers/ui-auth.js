export async function uiLoginAsStudent(page, email, password) {
  await page.goto('/student-login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Login")');
  await page.waitForURL('**/student-home');
}

export async function uiLoginAsAdmin(page, email, password) {
  await page.goto('/admin-login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Login")');
  await page.waitForURL('**/admin-dashboard');
}
