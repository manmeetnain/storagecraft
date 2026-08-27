import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRaid, compareRaids, normalizeLevel } from '../public/lib/raid-model.js';

test('normalizes common aliases', () => {
  assert.equal(normalizeLevel('RAID-6'), '6'); assert.equal(normalizeLevel('1+0'), '10'); assert.equal(normalizeLevel('RAIDZ2'), 'z2');
});
test('calculates standard levels', () => {
  assert.equal(calculateRaid({ level: 0, disks: 8, size: 4 }).usable, 32);
  assert.equal(calculateRaid({ level: 1, disks: 4, size: 4 }).usable, 4);
  assert.equal(calculateRaid({ level: 5, disks: 8, size: 4 }).usable, 28);
  assert.equal(calculateRaid({ level: 6, disks: 8, size: 4 }).usable, 24);
});
test('calculates nested levels', () => {
  const raid50 = calculateRaid({ level: 50, disks: 12, size: 4, groups: 2 });
  assert.equal(raid50.usable, 40); assert.equal(raid50.guaranteedFailures, 1); assert.equal(raid50.maximumFailures, 2);
  assert.equal(calculateRaid({ level: 60, disks: 16, size: 4, groups: 2 }).usable, 48);
});
test('calculates RAID-Z ceilings', () => {
  assert.equal(calculateRaid({ level: 'z1', disks: 8, size: 4 }).usable, 28);
  assert.equal(calculateRaid({ level: 'z2', disks: 8, size: 4 }).usable, 24);
  assert.equal(calculateRaid({ level: 'z3', disks: 8, size: 4 }).usable, 20);
});
test('rejects invalid layouts', () => {
  assert.throws(() => calculateRaid({ level: 6, disks: 3, size: 4 }), /at least 4/);
  assert.throws(() => calculateRaid({ level: 10, disks: 5, size: 4 }), /even/);
  assert.throws(() => calculateRaid({ level: 50, disks: 10, size: 4, groups: 3 }), /equal groups/);
});
test('comparison explains invalid configurations', () => {
  const rows = compareRaids({ disks: 4, size: 2, groups: 2, levels: ['5', '60'] });
  assert.equal(rows[0].usable, 6); assert.match(rows[1].error, /at least 8/);
});
