import { test, expect } from '@playwright/test';

// The API is mocked, so these smoke tests need no backend or database.
const user = { id: '1', name: 'Test User', email: 'test@example.com', role: 'user', preferences: {} };

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  await expect(page.getByRole('button', { name: /log ?in|sign ?in/i })).toBeVisible();
});

test('wrong credentials keep the user on /login', async ({ page }) => {
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Invalid email or password' }) }),
  );
  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('test@example.com');
  await page.getByPlaceholder('Your password').fill('wrongpass1');
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('valid credentials leave /login', async ({ page }) => {
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, token: 't', user }) }),
  );
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, user }) }),
  );
  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('test@example.com');
  await page.getByPlaceholder('Your password').fill('password123');
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
});
