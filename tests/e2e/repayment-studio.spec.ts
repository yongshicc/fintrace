import { expect, test } from '@playwright/test';

test('updates the calculation and applies an interest scenario', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Kreditkosten nachvollziehbar simulieren',
    }),
  ).toBeVisible();

  const principal = page.getByLabel('Kreditbetrag');
  await principal.fill('12000');
  await page.getByRole('button', { name: 'Simulation aktualisieren' }).click();

  await expect(principal).toHaveValue('12000');
  await expect(page.locator('.assumption-strip')).toContainText(
    /€\s*12\.000,00/,
  );

  await page.getByRole('button', { name: '9,00 % übernehmen' }).click();

  await expect(page.getByLabel('Effektiver Jahreszins')).toHaveValue('9');
  await expect(page.getByText('Aktuell: 9,00 %')).toBeVisible();

  await page
    .getByRole('button', { name: 'Was bringt die Sondertilgung?' })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'So wirkt die gewählte Sondertilgung im Modell',
    }),
  ).toBeVisible();
  await expect(
    page.getByText('Quelle: ExtraRepaymentResult.interestSavings'),
  ).toBeVisible();
});

test('shows repayment details on mobile without horizontal overflow', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');

  await page.goto('/');

  const firstMonth = page.locator('.mobile-schedule details').first();
  await firstMonth.locator('summary').click();
  await expect(firstMonth).toHaveAttribute('open', '');

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
