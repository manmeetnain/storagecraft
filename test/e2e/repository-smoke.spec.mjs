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

test('documentation homepage exposes the learning journey and creator identity', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.getByRole('heading', { name: 'StorageCraft', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Manmeet Nain · @manmeetnain', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Repository ↗', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start at your level', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Start Zero-to-SAN', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'StorageCraft Foundations: Zero-to-SAN Engineer', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The complete path', exact: true })).toBeVisible();
  await page.goto('concepts/index.html');
  await expect(page.getByRole('heading', { name: 'Storage Concepts Index', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Storage concepts, connected', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

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
  await page.getByRole('button', { name: 'PROMPT STUDIO', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Research brief' })).toBeVisible();
  const researchCopy = page.getByRole('button', { name: 'Copy Research brief prompt' });
  await researchCopy.click();
  await expect(researchCopy).toHaveText('COPIED');
  await page.getByLabel('Search Manmeet AI Command Center').fill('codex://skills');
  await page.getByRole('button', { name: 'SHORTCUTS', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Open skills', exact: true })).toBeVisible();
});

test('command center hero navigation and prompt compiler work', async ({ page }) => {
  await page.goto('ai-resource-hub/index.html');
  await page.getByRole('button', { name: 'Explore skills' }).click();
  await expect(page.getByRole('heading', { name: 'Skill shelf: invoke a proven workflow' })).toBeVisible();
  await page.getByRole('button', { name: 'PROMPT STUDIO', exact: true }).click();
  await page.getByLabel('Outcome', { exact: true }).fill('Design a verified storage learning lab');
  await page.getByRole('button', { name: 'COMPILE PROMPT' }).click();
  await expect(page.locator('#compiledPrompt')).toContainText('Design a verified storage learning lab');
  await expect(page.locator('#promptScore')).toHaveText('QUALITY 100/100');
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

test('guided goals, workflows, CLI lab, and updates produce useful outcomes', async ({ page }) => {
  await page.goto('ai-resource-hub/index.html');
  await page.getByRole('button', { name: 'Research & learn' }).click();
  await expect(page.locator('#recommendation')).toContainText('ChatGPT Deep Research');
  await page.getByRole('button', { name: 'WORKFLOWS' }).click();
  await expect(page.getByRole('heading', { name: 'Outcome recipes: from idea to verified result' })).toBeVisible();
  await page.getByRole('button', { name: 'OPEN IN PROMPT STUDIO' }).first().click();
  await expect(page.getByRole('heading', { name: 'Prompt Studio v2: compile an execution brief' })).toBeVisible();
  await expect(page.getByLabel('Outcome', { exact: true })).toHaveValue(/Research brief/);
  await page.getByRole('button', { name: 'CLI LAB' }).click();
  await page.getByLabel('AI CLI command').fill('help');
  await page.getByRole('button', { name: 'RUN', exact: true }).click();
  await expect(page.locator('#cliOutput')).toContainText('explore <platform>');
  await page.getByRole('button', { name: 'UPDATES' }).click();
  await expect(page.getByRole('heading', { name: 'What changed: maintained source watch' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'SEARCH LATEST UPDATES' }).first()).toHaveAttribute('href', /^https:/);
});

test('animated outcome journey advances through product stages', async ({ page }) => {
  await page.goto('ai-resource-hub/index.html');
  await expect(page.locator('#outcomeOrbit')).toHaveAttribute('data-stage', 'chatgpt');
  await page.evaluate(() => window.advanceOutcomeJourney());
  await expect(page.locator('#outcomeOrbit')).toHaveAttribute('data-stage', 'codex');
  await expect(page.locator('[data-journey="codex"]')).toHaveClass(/active/);
  await expect(page.locator('#journeyTitle')).toHaveText('BUILD');
  const animationName = await page.locator('.outcome-runner').evaluate(el => getComputedStyle(el).animationName);
  expect(animationName).toBe('outcome-journey');
  await page.getByRole('button', { name: 'PAUSE MOTION' }).click();
  await expect(page.getByRole('button', { name: 'RESUME MOTION' })).toHaveAttribute('aria-pressed', 'true');
});

test('outcome journey remains visible on mobile and official updates are searchable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('ai-resource-hub/index.html');
  await expect(page.locator('#outcomeOrbit')).toBeVisible();
  await page.getByRole('button', { name: 'UPDATES' }).click();
  await page.getByLabel('Search official AI update sources').fill('Copilot');
  await expect(page.getByRole('heading', { name: 'GitHub Copilot changelog' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'OpenAI product updates' })).toBeHidden();
});
