import { test, expect } from '@playwright/test';

test('fluxo smoke da calculadora', async ({ page }) => {
  await page.goto('/app/calculator');
  await expect(page.getByText('Preço recomendado')).toBeVisible();
  await page.getByPlaceholder('COGS').fill('30');
  await expect(page.getByText('Salvar no histórico')).toBeVisible();
});
