import test from 'node:test';
import assert from 'node:assert/strict';
import { createOperationsWorkspace, executeOperationsCommand, loadOperationsIncident, evaluateOperationsIncident } from '../public/lib/academy-operations.js';

test('workspace preserves independent state across five terminals', () => {
  const workspace = createOperationsWorkspace();
  executeOperationsCommand(workspace, 'switchname learner-a1');
  executeOperationsCommand(workspace, 'use brocade-b1');
  assert.equal(workspace.sessions['brocade-a1'].state.hostname, 'learner-a1');
  assert.equal(workspace.sessions['brocade-b1'].state.hostname, 'FC-B1');
  assert.match(executeOperationsCommand(workspace, 'terminals').output, /\* brocade-b1/);
});

test('fabric loss incident requires topology restoration', () => {
  const workspace = createOperationsWorkspace();
  loadOperationsIncident(workspace, 'fabric-a-loss');
  assert.equal(evaluateOperationsIncident(workspace).passed, false);
  executeOperationsCommand(workspace, 'fabric restore A');
  assert.equal(evaluateOperationsIncident(workspace).passed, true);
});

test('cross-switch CRC incident is repaired on the targeted terminal', () => {
  const workspace = createOperationsWorkspace();
  loadOperationsIncident(workspace, 'cross-switch-crc');
  executeOperationsCommand(workspace, 'portcfgspeed 0 32');
  executeOperationsCommand(workspace, 'portstatsclear 0');
  assert.equal(evaluateOperationsIncident(workspace).passed, true);
  assert.deepEqual(workspace.transcript.map((entry) => entry.deviceId), ['brocade-a1', 'brocade-a1']);
});

test('asymmetric path incident requires Cisco interface recovery', () => {
  const workspace = createOperationsWorkspace();
  loadOperationsIncident(workspace, 'asymmetric-fc-path');
  executeOperationsCommand(workspace, 'use cisco-b2');
  executeOperationsCommand(workspace, 'configure terminal');
  executeOperationsCommand(workspace, 'interface fc1/1');
  executeOperationsCommand(workspace, 'no shutdown');
  assert.equal(evaluateOperationsIncident(workspace).passed, true);
});
