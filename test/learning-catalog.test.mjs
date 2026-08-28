import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync(new URL('../learning/catalog.json', import.meta.url)));

test('learning program is ordered and covers every practice mode', () => {
  assert.deepEqual(catalog.modes, ['learn', 'practice', 'challenge', 'assess']);
  assert.equal(catalog.modules.length, 9);
  assert.deepEqual(catalog.modules.map(module => module.order), [10, 20, 30, 40, 50, 60, 70, 80, 90]);
});

test('each module gives learners a destination and a measurable outcome', () => {
  for (const module of catalog.modules) {
    assert.match(module.doc, /^src\/content\/docs\/learning\/.+\.md$/);
    assert.ok(module.practice.length > 0, `${module.id} needs practice`);
    assert.ok(module.outcome.length > 20, `${module.id} needs a specific outcome`);
    assert.ok(module.minutes >= 20, `${module.id} duration is implausibly short`);
  }
});
