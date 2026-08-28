#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const roots = ['src/content/docs', 'public'];
const files = [];
const errors = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (['.md', '.mdx', '.html'].includes(extname(path))) files.push(path);
  }
}

for (const root of roots) walk(root);

const publicRoutes = new Set();
for (const file of files) {
  if (file.startsWith('public/')) publicRoutes.add(`/${file.slice('public/'.length)}`);
  if (file.startsWith('src/content/docs/')) {
    const route = file.slice('src/content/docs/'.length).replace(/index\.mdx?$/, '').replace(/\.mdx?$/, '/');
    publicRoutes.add(`/storagecraft/${route}`.replace(/\/+/g, '/'));
  }
}

function hasRoute(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/storagecraft/') return true;
  if (clean.startsWith('/storagecraft/')) {
    const publicCandidate = clean.slice('/storagecraft'.length);
    return publicRoutes.has(clean) || publicRoutes.has(publicCandidate) || publicRoutes.has(`${publicCandidate}index.html`) || existsSync(`public${publicCandidate}`);
  }
  return true;
}

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const hrefs = [...source.matchAll(/(?:href=["']|\]\()([^"')\s]+)(?:["']|\))/g)].map(match => match[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|#|javascript:)/.test(href)) continue;
    if (href.startsWith('/') && !hasRoute(href)) errors.push(`${file}: unresolved route ${href}`);
  }
  if (file === 'public/ai-resource-hub/index.html') {
    const ids = new Set([...source.matchAll(/\sid=["']([^"']+)/g)].map(match => match[1]));
    for (const hash of [...source.matchAll(/href=["']#([^"']+)/g)].map(match => match[1])) {
      if (!ids.has(hash)) errors.push(`${file}: missing anchor #${hash}`);
    }
  }
}

if (errors.length) {
  errors.forEach(error => console.error(`✗ ${error}`));
  process.exit(1);
}
console.log(`✓ Navigation contract: ${files.length} content surfaces · internal routes and AI anchors resolved`);
