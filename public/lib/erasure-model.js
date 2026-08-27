const positive = (value, name, integer = false) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || (integer && !Number.isInteger(number))) throw new Error(`${name} must be a positive${integer ? ' integer' : ''}`);
  return number;
};

export function calculateErasure({ data = 10, parity = 4, dataset = 100, fragmentSize = 64, failures = 1 } = {}) {
  const k = positive(data, 'data fragments', true); const m = positive(parity, 'parity fragments', true);
  const logical = positive(dataset, 'dataset size'); const fragmentMiB = positive(fragmentSize, 'fragment size');
  const failed = Number(failures);
  if (!Number.isInteger(failed) || failed < 0) throw new Error('failures must be a non-negative integer');
  const totalFragments = k + m; const efficiency = k / totalFragments; const physical = logical / efficiency; const overhead = physical - logical;
  const available = totalFragments - failed; const recoverable = available >= k; const missingPhysical = physical * failed / totalFragments;
  const baselineRepairRead = failed === 0 ? 0 : logical * Math.min(failed, m) / k;
  const stripeDataMiB = k * fragmentMiB; const stripePhysicalMiB = totalFragments * fragmentMiB;
  return { k, m, totalFragments, logical, physical, overhead, efficiency, failed, available, recoverable, toleratedFailures: m, minimumFragments: k, missingPhysical, baselineRepairRead, stripeDataMiB, stripePhysicalMiB, amplification: physical / logical, warnings: ['Repair traffic depends on code, placement, implementation, locality, and whether multiple missing fragments are reconstructed together.', 'Durability also depends on independent failure-domain placement and timely repair—not fragment count alone.'] };
}

export function compareReplication(result, copies = 3) {
  const replicaCount = positive(copies, 'replica copies', true);
  return { copies: replicaCount, physical: result.logical * replicaCount, efficiency: 1 / replicaCount, overhead: result.logical * (replicaCount - 1), toleratedFailures: replicaCount - 1, saving: result.logical * replicaCount - result.physical };
}
