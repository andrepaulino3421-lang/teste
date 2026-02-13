import { test, expect } from '@playwright/test';

test('register -> login -> calcular -> salvar -> ver history', async ({ page }) => {
  const email = `user${Date.now()}@teste.com`;

  await page.goto('/register');
  await page.getByTestId('register-name').fill('Usuário Teste');
  await page.getByTestId('register-email').fill(email);
  await page.getByTestId('register-password').fill('12345678');
  await page.getByTestId('register-submit').click();

  await expect(page).toHaveURL(/\/app\/onboarding/);
  await page.goto('/app/calculator');
  await page.getByTestId('calc-cogs').fill('30');
  await page.getByTestId('calc-save').click();
  await expect(page.getByTestId('calc-message')).toContainText('Cálculo salvo');

  await page.goto('/app/history');
  await expect(page.getByText('STORE')).toBeVisible();

  await page.getByTestId('logout-btn').click();
  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill('12345678');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/app\/dashboard/);
});
