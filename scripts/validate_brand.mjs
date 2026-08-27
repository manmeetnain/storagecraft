#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { STORAGECRAFT_BRAND } from '../public/lib/storagecraft-brand.js';

const required = {
  'package.json': [STORAGECRAFT_BRAND.creatorName, STORAGECRAFT_BRAND.repositoryUrl],
  'README.md': [STORAGECRAFT_BRAND.creatorName, 'manmeetnain'],
  'public/simulators/network-academy/index.html': ['storagecraft-brand.js', 'creator-attribution'],
  'scripts/storagecraft.mjs': ['storagecraft-brand.js', 'creatorAttribution'],
};
const errors = [];
for (const [path, markers] of Object.entries(required)) {
  const source = readFileSync(path, 'utf8');
  for (const marker of markers) if (!source.includes(marker)) errors.push(`${path}: missing ${marker}`);
}
if (errors.length) {
  errors.forEach((error) => console.error(`✗ ${error}`));
  process.exit(1);
}
console.log(`✓ Brand contract v${STORAGECRAFT_BRAND.schemaVersion}: ${STORAGECRAFT_BRAND.creatorName} ${STORAGECRAFT_BRAND.creatorHandle}`);
