import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const surfaces = [
  ['AI Data Path Lab', 'simulators/ai-data-path/index.html'],
  ['Erasure Coding Lab', 'simulators/erasure-coding/index.html'],
  ['GPU Memory Planner', 'simulators/gpu-memory/index.html'],
  ['LSM-Tree Compaction Lab', 'simulators/lsm-compaction/index.html'],
  ['NVMe Queue Lab', 'simulators/nvme-queues/index.html'],
  ['RAG Storage Sizer', 'simulators/rag-storage/index.html'],
  ['RAID-5 Interactive Visualizer', 'simulators/raid/index.html'],
  ['SAN Failure-Domain Lab', 'simulators/san-failure/index.html'],
  ['Write Amplification Explorer', 'simulators/write-amplification/index.html'],
  ['AI Resource & Prompt Hub', 'ai-resource-hub/index.html'],
];

for (const [title, path] of surfaces) {
  test(`${title} loads as a complete, accessible, responsive surface`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    const audit = await new AxeBuilder({ page }).analyze();
    expect(audit.violations.filter(item => ['serious', 'critical'].includes(item.impact))).toEqual([]);
  });
}

test('AI hub search, filters, and prompt copy controls work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('ai-resource-hub/index.html');
  await page.getByLabel('Search AI resource hub').fill('research');
  await expect(page.getByRole('heading', { name: 'Deep research', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'PROMPTS' }).click();
  await expect(page.getByRole('heading', { name: 'Source-grounded research' })).toBeVisible();
  await page.locator('.copy:visible').click();
  await expect(page.locator('.copy:visible')).toHaveText('COPIED');
});
