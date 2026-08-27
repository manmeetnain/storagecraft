/** Canonical public identity for every StorageCraft surface. */
export const STORAGECRAFT_BRAND = Object.freeze({
  schemaVersion: 1,
  productName: 'StorageCraft',
  academyName: 'Storage Network Academy',
  creatorName: 'Manmeet Nain',
  creatorHandle: '@manmeetnain',
  tagline: 'Operate the data path beneath modern AI.',
  githubUrl: 'https://github.com/manmeetnain',
  repositoryUrl: 'https://github.com/manmeetnain/storagecraft',
  siteUrl: 'https://manmeetnain.github.io/storagecraft/',
  sponsorUrl: 'https://github.com/sponsors/manmeetnain',
});

export function creatorAttribution() {
  return `Built by ${STORAGECRAFT_BRAND.creatorName} (${STORAGECRAFT_BRAND.creatorHandle})`;
}

export function productTitle(surface = '') {
  return surface ? `${surface} — ${STORAGECRAFT_BRAND.productName}` : STORAGECRAFT_BRAND.productName;
}
