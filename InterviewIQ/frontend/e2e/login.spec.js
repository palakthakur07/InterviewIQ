import { test, expect } from '@playwright/test';

// The API is fully mocked, so these smoke tests need no backend or database.
// Mock only the backend origin: a broader pattern like '**/api/**' would also catch Vite's
// own /src/api/*.js module requests and stop the app from loading.
const API = 'http://localhost:5000/api';
const user = { id: '1', name: 'Test User', email: 'test@example.com', role: 'user', preferences: {} };
const json = (body, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(body) });

test.beforeEach(async ({ page }) => {
  // Catch-all first: Playwright runs the most recently registered matching route first,
  // so the specific mocks inside each test override this one. It keeps the dashboard from
  // hitting a real (absent) backend and showing the app-wide "network error" page.
  await page.route(`${API}/**`, (route) =>
    route.fulfill(json({ success: true, resumes: [], interviews: [], notifications: [], session: null, unreadCount: 0 })),
  );
});

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  await expect(page.getByPlaceholder('Your password')).toBeVisible();
  await expect(page.getByRole('button', { name: /log ?in|sign ?in/i })).toBeVisible();
});

test('empty form shows validation errors and sends no request', async ({ page }) => {
  let loginCalls = 0;
  await page.route(`${API}/auth/login`, (route) => {
    loginCalls += 1;
    return route.fulfill(json({ success: true }));
  });
  await page.goto('/login');
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();
  await expect(page).toHaveURL(/\/login/);
  expect(loginCalls).toBe(0);
});

test('wrong credentials show an error and keep the user on /login', async ({ page }) => {
  await page.route(`${API}/auth/login`, (route) =>
    route.fulfill(json({ success: false, message: 'Invalid email or password' }, 401)),
  );
  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('test@example.com');
  await page.getByPlaceholder('Your password').fill('wrongpass1');
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid email or password');
  await expect(page).toHaveURL(/\/login/);
});

test('valid credentials reach the dashboard', async ({ page }) => {
  await page.route(`${API}/auth/login`, (route) => route.fulfill(json({ success: true, token: 't', user })));
  await page.route(`${API}/auth/me`, (route) => route.fulfill(json({ success: true, user })));
  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('test@example.com');
  await page.getByPlaceholder('Your password').fill('password123');
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});