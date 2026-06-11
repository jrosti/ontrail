import { expect, test } from '@playwright/test';

test('renders the feed shell in the full app', async ({ page }) => {
  await page.goto('/feed');

  await expect(page.getByText('trail').first()).toBeVisible();
  await expect(page.getByText(/Syöte|Feed/).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Suodattimet|Filters/ })).toBeVisible();
});
