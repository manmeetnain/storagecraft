import test from 'node:test';
import assert from 'node:assert/strict';
import { createDualFabricTopology, setFabricState, topologyHealth } from '../public/lib/academy-topology.js';

test('dual fabric contains mixed-vendor multi-switch paths', () => {
  const topology = createDualFabricTopology();
  assert.equal(topology.nodes.filter((node) => node.type === 'brocade').length, 2);
  assert.equal(topology.nodes.filter((node) => node.type === 'cisco').length, 2);
  assert.deepEqual(topologyHealth(topology), { paths: { A: true, B: true }, reachable: true, redundant: true, state: 'HEALTHY' });
});

test('one fabric failure preserves access without redundancy', () => {
  const topology = setFabricState(createDualFabricTopology(), 'A', 'down');
  assert.deepEqual(topologyHealth(topology), { paths: { A: false, B: true }, reachable: true, redundant: false, state: 'DEGRADED' });
});

test('both fabric failures produce an outage without mutating baseline', () => {
  const baseline = createDualFabricTopology();
  const failed = setFabricState(setFabricState(baseline, 'A', 'down'), 'B', 'down');
  assert.equal(topologyHealth(failed).state, 'OUTAGE');
  assert.equal(topologyHealth(baseline).state, 'HEALTHY');
});
