import test from 'node:test';
import assert from 'node:assert/strict';
import { createOperationsWorkspace } from '../public/lib/academy-operations.js';
import { createConfigurationSafety, createCheckpoint, listCheckpoints, rollbackCheckpoint, parseConfigurationScript, runConfigurationScript } from '../public/lib/academy-config-safety.js';

const script = `[brocade-a1] switchname PROD-A1
[brocade-b1] switchname PROD-B1
cisco-a2 :: configure terminal
cisco-a2 :: hostname CORE-A2`;

test('parses explicit multi-device script targets', () => {
  const commands = parseConfigurationScript(script);
  assert.equal(commands.length, 4);
  assert.deepEqual([...new Set(commands.map((item) => item.deviceId))], ['brocade-a1', 'brocade-b1', 'cisco-a2']);
});

test('runs multi-device script and produces path-level diff', () => {
  const safety = createConfigurationSafety(createOperationsWorkspace());
  const result = runConfigurationScript(safety, script);
  assert.equal(result.ok, true);
  assert.equal(safety.workspace.sessions['brocade-a1'].state.hostname, 'PROD-A1');
  assert.ok(result.diff.some((change) => change.path.endsWith('/hostname')));
});

test('atomic script restores every device after a command failure', () => {
  const safety = createConfigurationSafety(createOperationsWorkspace());
  const result = runConfigurationScript(safety, `[brocade-a1] switchname SHOULD-ROLLBACK\n[cisco-a2] impossible command`);
  assert.equal(result.rolledBack, true);
  assert.equal(safety.workspace.sessions['brocade-a1'].state.hostname, 'FC-A1');
});

test('named checkpoint rollback restores multi-device state', () => {
  const safety = createConfigurationSafety(createOperationsWorkspace());
  createCheckpoint(safety, 'known-good');
  runConfigurationScript(safety, script);
  rollbackCheckpoint(safety, 'known-good');
  assert.equal(safety.workspace.sessions['brocade-a1'].state.hostname, 'FC-A1');
  assert.deepEqual(listCheckpoints(safety), ['known-good']);
});

test('reapplying an idempotent desired-state script has no state diff', () => {
  const safety = createConfigurationSafety(createOperationsWorkspace());
  runConfigurationScript(safety, script);
  const second = runConfigurationScript(safety, script);
  assert.equal(second.ok, true);
  assert.deepEqual(second.diff, []);
});
