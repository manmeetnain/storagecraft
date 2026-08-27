import { test, expect } from '@playwright/test';

const planner = 'simulators/raid-planner/index.html';

test('reveals only freshly calculated RAID results', async ({ page }) => {
  await page.goto(planner);
  await expect(page.getByRole('heading', { name: 'Configure your array first' })).toBeVisible();
  await expect(page.locator('#comparison-section')).toBeHidden();

  await page.getByRole('button', { name: /Calculate and compare/ }).click();
  await expect(page.getByRole('heading', { name: 'RAID 6' })).toBeVisible();
  await expect(page.locator('#comparison-section')).toBeVisible();

  await page.getByLabel('Member disks').fill('10');
  await expect(page.getByRole('heading', { name: 'Ready to calculate' })).toBeVisible();
  await expect(page.locator('#comparison-section')).toBeHidden();

  await page.getByRole('button', { name: 'RAID-Z2' }).click();
  await expect(page.getByRole('heading', { name: 'Ready to calculate' })).toBeVisible();
  await page.getByRole('button', { name: /Calculate and compare/ }).click();
  await expect(page.getByRole('heading', { name: 'RAID-Z2' })).toBeVisible();
});
