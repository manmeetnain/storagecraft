export const RAID_LEVELS = {
  jbod: { name: 'JBOD', family: 'Concatenation', min: 1, description: 'Concatenated capacity without RAID protection.', layout: 'concatenated', parity: 0, writePenalty: 1, status: 'common' },
  '0': { name: 'RAID 0', family: 'Striping', min: 2, description: 'Block striping for performance; no redundancy.', layout: 'striped', parity: 0, writePenalty: 1, status: 'common' },
  '1': { name: 'RAID 1', family: 'Mirroring', min: 2, description: 'Every member stores a complete copy.', layout: 'mirror', parity: 0, writePenalty: 2, status: 'common' },
  '2': { name: 'RAID 2', family: 'Hamming code', min: 3, description: 'Historical bit-level striping with dedicated Hamming-code disks.', layout: 'hamming', parity: 'dynamic', writePenalty: null, status: 'historical' },
  '3': { name: 'RAID 3', family: 'Dedicated parity', min: 3, description: 'Byte-level striping with one dedicated parity disk.', layout: 'dedicated-parity', parity: 1, writePenalty: 4, status: 'rare' },
  '4': { name: 'RAID 4', family: 'Dedicated parity', min: 3, description: 'Block-level striping with one dedicated parity disk.', layout: 'dedicated-parity', parity: 1, writePenalty: 4, status: 'rare' },
  '5': { name: 'RAID 5', family: 'Distributed parity', min: 3, description: 'Block striping with single distributed parity.', layout: 'distributed-parity', parity: 1, writePenalty: 4, status: 'common' },
  '6': { name: 'RAID 6', family: 'Distributed parity', min: 4, description: 'Block striping with dual distributed parity.', layout: 'distributed-parity', parity: 2, writePenalty: 6, status: 'common' },
  '01': { name: 'RAID 0+1', family: 'Nested RAID', min: 4, description: 'A mirror of striped sets; less failure-isolated than RAID 10.', layout: 'mirror-of-stripes', parity: 0, writePenalty: 2, status: 'common' },
  '10': { name: 'RAID 10 (1+0)', family: 'Nested RAID', min: 4, description: 'A stripe across mirrored pairs.', layout: 'stripe-of-mirrors', parity: 0, writePenalty: 2, status: 'common' },
  '50': { name: 'RAID 50 (5+0)', family: 'Nested RAID', min: 6, description: 'A stripe across RAID 5 groups.', layout: 'stripe-of-raid5', parity: 'groups', writePenalty: 4, status: 'common' },
  '60': { name: 'RAID 60 (6+0)', family: 'Nested RAID', min: 8, description: 'A stripe across RAID 6 groups.', layout: 'stripe-of-raid6', parity: 'groups', writePenalty: 6, status: 'common' },
  z1: { name: 'RAID-Z1', family: 'ZFS RAID-Z', min: 3, description: 'ZFS single-parity variable-stripe layout.', layout: 'raidz', parity: 1, writePenalty: null, status: 'common' },
  z2: { name: 'RAID-Z2', family: 'ZFS RAID-Z', min: 4, description: 'ZFS dual-parity variable-stripe layout.', layout: 'raidz', parity: 2, writePenalty: null, status: 'common' },
  z3: { name: 'RAID-Z3', family: 'ZFS RAID-Z', min: 5, description: 'ZFS triple-parity variable-stripe layout.', layout: 'raidz', parity: 3, writePenalty: null, status: 'common' },
};

const positiveInteger = (value, name) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) throw new Error(`${name} must be a positive integer`);
  return number;
};

export function normalizeLevel(level) {
  const value = String(level).toLowerCase().replace(/^raid[- ]?/, '').replace('1+0', '10').replace('0+1', '01').replace('5+0', '50').replace('6+0', '60').replace('raidz', 'z');
  if (!RAID_LEVELS[value]) throw new Error(`unsupported RAID level: ${level}`);
  return value;
}

function hammingLayout(total) {
  for (let parity = 2; parity < total; parity++) {
    const data = total - parity;
    if (2 ** parity >= data + parity + 1) return { data, parity };
  }
  throw new Error('RAID 2 requires enough members for data and Hamming-code disks');
}

export function calculateRaid({ level = '5', disks = 6, size = 4, groups = 2 } = {}) {
  const key = normalizeLevel(level); const spec = RAID_LEVELS[key];
  const memberCount = positiveInteger(disks, 'disks'); const memberSize = Number(size);
  if (!Number.isFinite(memberSize) || memberSize <= 0) throw new Error('size must be a positive number');
  if (memberCount < spec.min) throw new Error(`${spec.name} requires at least ${spec.min} disks`);

  let dataDisks; let parityDisks = 0; let guaranteedFailures = 0; let maximumFailures = 0; let groupCount = 1;
  if (key === 'jbod' || key === '0') dataDisks = memberCount;
  else if (key === '1') { dataDisks = 1; guaranteedFailures = maximumFailures = memberCount - 1; }
  else if (key === '2') { const h = hammingLayout(memberCount); dataDisks = h.data; parityDisks = h.parity; guaranteedFailures = maximumFailures = 1; }
  else if (['3', '4', '5', '6', 'z1', 'z2', 'z3'].includes(key)) {
    parityDisks = Number(spec.parity); dataDisks = memberCount - parityDisks; guaranteedFailures = maximumFailures = parityDisks;
  } else if (key === '10' || key === '01') {
    if (memberCount % 2) throw new Error(`${spec.name} requires an even disk count`);
    dataDisks = memberCount / 2; guaranteedFailures = 1; maximumFailures = memberCount / 2;
  } else if (key === '50' || key === '60') {
    groupCount = positiveInteger(groups, 'groups');
    const perGroup = memberCount / groupCount; const parityPerGroup = key === '50' ? 1 : 2; const minimumGroup = key === '50' ? 3 : 4;
    if (!Number.isInteger(perGroup) || perGroup < minimumGroup) throw new Error(`${spec.name} requires equal groups of at least ${minimumGroup} disks`);
    parityDisks = parityPerGroup * groupCount; dataDisks = memberCount - parityDisks; guaranteedFailures = parityPerGroup; maximumFailures = parityDisks;
  }

  const raw = memberCount * memberSize; const usable = dataDisks * memberSize; const overhead = raw - usable;
  const warnings = [];
  if (spec.status !== 'common') warnings.push(`${spec.name} is ${spec.status}; validate controller and workload support.`);
  if (key === '0' || key === 'jbod') warnings.push('No redundancy: one member failure can cause data loss.');
  if (key === '5') warnings.push('Rebuild exposure grows with member size and workload; assess URE and recovery risk.');
  if (key.startsWith('z')) warnings.push('Simplified ceiling: ZFS slop space, metadata, padding, ashift, and record size reduce usable space.');
  if (['10', '01', '50', '60'].includes(key)) warnings.push('Maximum survivable failures depend on which members or groups fail.');

  return { key, ...spec, disks: memberCount, size: memberSize, groups: groupCount, dataDisks, parityDisks, raw, usable, overhead, efficiency: usable / raw, guaranteedFailures, maximumFailures, readProfile: key === '0' ? 'Very high' : key === '1' ? 'High' : ['10', '01'].includes(key) ? 'Very high' : 'High', writeProfile: spec.writePenalty === 1 ? 'Very high' : spec.writePenalty === 2 ? 'High' : spec.writePenalty ? 'Parity-limited' : 'Implementation-dependent', warnings };
}

export function compareRaids({ disks = 8, size = 4, groups = 2, levels = Object.keys(RAID_LEVELS) } = {}) {
  return levels.map(level => { try { return calculateRaid({ level, disks, size, groups }); } catch (error) { return { key: level, name: RAID_LEVELS[level]?.name ?? level, error: error.message }; } });
}
