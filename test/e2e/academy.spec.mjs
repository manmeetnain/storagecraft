import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const academy = 'simulators/network-academy/index.html';

test.beforeEach(async ({ page }) => {
  await page.goto(academy);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Storage Network Academy' })).toBeVisible();
});

test('persists and resumes guided learning after a reload', async ({ page }) => {
  await expect(page.locator('#continue-title')).toHaveText('Ready to begin');
  await expect(page.locator('#continue-percent')).toHaveText('0%');
  await page.getByRole('button', { name: 'START LAB 01' }).click();
  await page.getByLabel('Simulator command').fill('version');
  await page.getByRole('button', { name: 'RUN', exact: true }).click();
  await expect(page.locator('#continue-title')).toContainText('command 2/24');
  await expect(page.locator('#progress-export')).toHaveAttribute('download', 'storagecraft-academy-progress.json');

  await page.reload();
  await expect(page.locator('#continue-title')).toContainText('command 2/24');
  await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
  await expect(page.locator('#expected')).toHaveText('firmwareshow');
});

test('renders branded topology, five terminals, and three incidents', async ({ page }) => {
  await expect(page.getByText('Built by Manmeet Nain (@manmeetnain)')).toBeVisible();
  await expect(page.locator('#stage-progress')).toHaveText('STAGE 1 OF 5 · BEGINNER');
  await expect(page.locator('.lesson:visible')).toHaveCount(1);
  await expect(page.locator('.topology')).toBeHidden();
  await expect(page.locator('.certification')).toBeHidden();
  await expect(page.locator('.topology-node')).toHaveCount(6);
  await expect(page.locator('.terminal-tab')).toHaveCount(5);
  await expect(page.locator('.operations-incident')).toHaveCount(3);
  await expect(page.locator('#topology-summary')).toHaveText('HEALTHY · A UP · B UP');
});

test('fails and restores a redundant fabric', async ({ page }) => {
  await page.getByRole('button', { name: /Understand dual fabrics/ }).click();
  await page.getByRole('button', { name: 'TOGGLE A' }).click();
  await expect(page.locator('#topology-summary')).toHaveText('DEGRADED · A DOWN · B UP');
  await page.getByRole('button', { name: 'RESTORE', exact: true }).click();
  await expect(page.locator('#topology-summary')).toHaveText('HEALTHY · A UP · B UP');
});

test('retains independent terminal state across vendors', async ({ page }) => {
  await page.getByRole('button', { name: /Configure safely/ }).click();
  await page.getByRole('button', { name: 'FC-A1 · A' }).click();
  await page.getByLabel('Simulator command').fill('switchname E2E-A1');
  await page.getByRole('button', { name: 'RUN', exact: true }).click();
  await page.getByRole('button', { name: 'MDS-A2 · A' }).click();
  await expect(page.locator('#prompt')).toHaveText('MDS-A2#');
  await page.getByRole('button', { name: 'FC-A1 · A' }).click();
  await expect(page.locator('#prompt')).toHaveText('E2E-A1:admin>');
});

test('runs Cisco guided commands and advances without an invalid-command dead end', async ({ page }) => {
  await page.getByRole('button', { name: /Configure safely/ }).click();
  await page.getByRole('button', { name: /Cisco MDS NX-OS-style FC/ }).click();
  await expect(page.locator('#expected')).toHaveText('show clock');
  await expect(page.locator('#command-queue')).toContainText('show clock');
  for (let step = 0; step < 15; step += 1) {
    await page.getByRole('button', { name: 'RUN SUGGESTED', exact: true }).click();
  }
  await expect(page.locator('#expected')).toHaveText('✓ Lab complete');
  await page.getByRole('button', { name: 'NEXT LAB', exact: true }).click();
  await expect(page.locator('#lesson-title')).toHaveText('Create a VSAN');
  await expect(page.locator('#expected')).toHaveText('configure terminal');
  await expect(page.getByText(/Invalid command/)).toHaveCount(0);
});

test('completes an inspect diagnose configure verify rollback workflow', async ({ page }) => {
  await page.getByRole('button', { name: /Configure safely/ }).click();
  await page.getByRole('button', { name: /Vendor-neutral iSCSI/ }).click();
  await page.getByRole('button', { name: /Publish a LUN and establish a session/ }).click();
  await page.getByRole('button', { name: 'START CLEAN WORKFLOW', exact: true }).click();
  for (const stage of ['Inspect','Diagnose','Configure','Verify','Rollback']) {
    await expect(page.locator('#workflow-title')).toContainText(stage);
    await page.getByRole('button', { name: 'RUN THIS STAGE', exact: true }).click();
    await expect(page.locator('#workflow-result')).toContainText(`PASS · ${stage}`);
    await page.locator('#workflow-next').click();
  }
  await expect(page.locator('#workflow-result')).toContainText('COMPLETE');
  await expect(page.getByText(/Invalid command/)).toHaveCount(0);
});

test('runs atomic configuration, reports diff, and rolls back', async ({ page }) => {
  await page.getByRole('button', { name: /Configure safely/ }).click();
  await page.getByText('CONFIGURATION SAFETY · ATOMIC SCRIPTS / DIFF / CHECKPOINT / ROLLBACK').click();
  await page.getByRole('button', { name: 'CHECKPOINT' }).click();
  await expect(page.locator('#config-result')).toContainText('captured across 5 devices');
  await page.getByRole('button', { name: 'RUN ATOMIC' }).click();
  await expect(page.locator('#config-result')).toContainText('PASS · 2 commands · 2 state changes');
  await page.getByRole('button', { name: 'ROLLBACK' }).click();
  await expect(page.locator('#config-result')).toHaveText('Rolled back to known-good.');
});

test('enforces observer RBAC and exposes a verified audit chain', async ({ page }) => {
  await page.getByRole('button', { name: /Configure safely/ }).click();
  await page.getByLabel('Academy role').selectOption('observer');
  await page.getByLabel('Simulator command').fill('switchname DENIED');
  await page.getByRole('button', { name: 'RUN', exact: true }).click();
  await expect(page.getByText(/RBAC DENIED/)).toBeVisible();
  await page.getByRole('button', { name: 'AUDIT LOG' }).click();
  await expect(page.getByText(/AUDIT LOG · CHAIN VERIFIED/)).toBeVisible();
});

test('provides structured downloadable certification reports', async ({ page }) => {
  await page.getByRole('button', { name: /Prove job readiness/ }).click();
  await expect(page.locator('.cert-task')).toHaveCount(5);
  await expect(page.locator('#cert-json')).toHaveAttribute('download', /\.json$/);
  await expect(page.locator('#cert-json')).toHaveAttribute('href', /^data:application\/json/);
  await expect(page.locator('#cert-csv')).toHaveAttribute('download', /\.csv$/);
  await expect(page.locator('#cert-csv')).toHaveAttribute('href', /^data:text\/csv/);
});

test('has no serious accessibility violations or horizontal viewport overflow', async ({ page }) => {
  for (const stage of ['Start with one switch','Configure safely','Understand dual fabrics','Troubleshoot incidents','Prove job readiness']) {
    await page.getByRole('button', { name: new RegExp(stage) }).click();
    const results = await new AxeBuilder({ page }).analyze();
    const material = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    expect(material, `${stage} accessibility`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${stage} overflow`).toBe(true);
  }
});
