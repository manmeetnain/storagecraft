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
  ['Manmeet AI Command Center', 'ai-resource-hub/index.html'],
];

for (const [title, path] of surfaces) {
  test(`${title} loads as a complete, accessible, responsive surface`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByText('Manmeet Nain', { exact: false }).first()).toBeVisible();
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    const audit = await new AxeBuilder({ page }).analyze();
    expect(audit.violations.filter(item => ['serious', 'critical'].includes(item.impact))).toEqual([]);
  });
}

test('AI atlas search, filters, shortcuts, and prompt copy controls work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('ai-resource-hub/index.html');
  await page.getByLabel('Search Manmeet AI Command Center').fill('research');
  await expect(page.getByRole('heading', { name: 'Deep research', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'PROMPTS' }).click();
  await expect(page.getByRole('heading', { name: 'Research brief' })).toBeVisible();
  await page.locator('.copy:visible').click();
  await expect(page.locator('.copy:visible')).toHaveText('COPIED');
  await page.getByLabel('Search Manmeet AI Command Center').fill('codex://skills');
  await page.getByRole('button', { name: 'SHORTCUTS' }).click();
  await expect(page.getByRole('heading', { name: 'Open skills', exact: true })).toBeVisible();
});

test('command center hero navigation and prompt compiler work', async ({ page }) => {
  await page.goto('ai-resource-hub/index.html');
  await page.getByRole('button', { name: 'Explore skills' }).click();
  await expect(page.getByRole('heading', { name: 'Skill shelf: invoke a proven workflow' })).toBeVisible();
  await page.getByRole('button', { name: 'PROMPT LAB' }).click();
  await page.getByLabel('Outcome', { exact: true }).fill('Design a verified storage learning lab');
  await page.getByRole('button', { name: 'COMPILE PROMPT' }).click();
  await expect(page.locator('#compiledPrompt')).toContainText('Design a verified storage learning lab');
});

test('command center header and bookmarked deep links reveal their destinations', async ({ page }) => {
  const destinations = [
    ['chatgpt', 'ChatGPT: think, learn, research, create'],
    ['codex', 'Codex: inspect, change, verify, ship'],
    ['skills', 'Skill shelf: invoke a proven workflow'],
    ['shortcuts', 'Shortcut decoder'],
    ['connectors', 'Plugins, connectors, and MCP'],
  ];
  for (const [hash, heading] of destinations) {
    await page.goto('about:blank');
    await page.goto(`ai-resource-hub/index.html#${hash}`);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  await page.goto('ai-resource-hub/index.html');
  await page.locator('.topbar nav a[href="#skills"]').click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(page.getByRole('heading', { name: 'Skill shelf: invoke a proven workflow' })).toBeVisible();
});

test('ChatGPT and Codex widgets open useful playbooks', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('ai-resource-hub/index.html#chatgpt');
  const searchCard = page.locator('.guide-card').filter({ hasText: 'Current answers with source links' });
  await searchCard.getByRole('button', { name: 'VIEW PLAYBOOK' }).click();
  await expect(searchCard.getByText('Starter instruction')).toBeVisible();
  await expect(searchCard.getByRole('link', { name: 'OFFICIAL GUIDE' })).toHaveAttribute('href', /openai\.com/);
  await searchCard.getByRole('button', { name: 'COPY STARTER' }).click();
  await expect(searchCard.getByRole('button', { name: 'COPIED' })).toBeVisible();
  await page.goto('ai-resource-hub/index.html#codex');
  const cliCard = page.locator('.guide-card').filter({ hasText: 'Terminal-native agent' });
  await cliCard.click();
  await expect(cliCard.getByText('Starter instruction')).toBeVisible();
});
