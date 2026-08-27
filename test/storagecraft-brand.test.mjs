import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGECRAFT_BRAND, creatorAttribution, productTitle } from '../public/lib/storagecraft-brand.js';

test('canonical creator identity is stable and linkable', () => {
  assert.equal(STORAGECRAFT_BRAND.creatorName, 'Manmeet Nain');
  assert.equal(STORAGECRAFT_BRAND.creatorHandle, '@manmeetnain');
  assert.match(STORAGECRAFT_BRAND.repositoryUrl, /manmeetnain\/storagecraft$/);
  assert.equal(creatorAttribution(), 'Built by Manmeet Nain (@manmeetnain)');
});

test('product titles remain consistently branded', () => {
  assert.equal(productTitle(), 'StorageCraft');
  assert.equal(productTitle('Storage Network Academy'), 'Storage Network Academy — StorageCraft');
});
