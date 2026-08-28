#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync('learning/catalog.json', 'utf8'));
const errors = [];
const ids = new Set();
let priorOrder = -Infinity;

if (catalog.version !== 1) errors.push('learning catalog version must be 1');
if (!Array.isArray(catalog.modules) || catalog.modules.length < 8) errors.push('learning catalog requires at least eight modules');
if (!['learn', 'practice', 'challenge', 'assess'].every(mode => catalog.modes?.includes(mode))) errors.push('learning modes must include learn, practice, challenge, and assess');

for (const module of catalog.modules || []) {
  if (ids.has(module.id)) errors.push(`duplicate module id: ${module.id}`);
  ids.add(module.id);
  if (module.order <= priorOrder) errors.push(`${module.id}: modules must be strictly ordered`);
  priorOrder = module.order;
  for (const field of ['level', 'minutes', 'title', 'doc', 'practice', 'outcome']) if (!module[field]) errors.push(`${module.id}: missing ${field}`);
  if (module.doc && !existsSync(module.doc)) errors.push(`${module.id}: document not found at ${module.doc}`);
  if (module.doc && existsSync(module.doc)) {
    const source = readFileSync(module.doc, 'utf8');
    for (const heading of ['## Outcome', '## Learn', '## Practice', '## Check your understanding', '## Production boundary', '## Next step']) {
      if (!source.includes(heading)) errors.push(`${module.id}: missing standard section ${heading}`);
    }
  }
}

if (errors.length) {
  errors.forEach(error => console.error(`✗ ${error}`));
  process.exit(1);
}
console.log(`✓ Learning contract: ${catalog.modules.length} ordered modules · ${catalog.modes.length} practice modes`);
