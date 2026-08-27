import test from 'node:test';
import assert from 'node:assert/strict';
import { createOperationsWorkspace } from '../public/lib/academy-operations.js';
import { COMPATIBILITY_PROFILES, createGovernedWorkspace, executeGovernedCommand, setGovernedIdentity, exportAuditLog, verifyAuditChain } from '../public/lib/academy-governance.js';

test('observer can inspect but cannot change configuration', () => {
  const governed = createGovernedWorkspace(createOperationsWorkspace(), { actor: 'newhire', role: 'observer' });
  assert.equal(executeGovernedCommand(governed, 'switchshow').ok, true);
  const denied = executeGovernedCommand(governed, 'switchname forbidden');
  assert.equal(denied.ok, false);
  assert.match(denied.output, /RBAC DENIED/);
});

test('operator can remediate a port but administrator owns configuration', () => {
  const governed = createGovernedWorkspace(createOperationsWorkspace(), { actor: 'operator1', role: 'operator' });
  assert.equal(executeGovernedCommand(governed, 'portstatsclear 0').ok, true);
  assert.equal(executeGovernedCommand(governed, 'alicreate host1, 10:00:00:00:00:00:00:01').ok, false);
  setGovernedIdentity(governed, 'admin1', 'administrator');
  assert.equal(executeGovernedCommand(governed, 'alicreate host1, 10:00:00:00:00:00:00:01').ok, true);
});

test('audit chain records allow and deny decisions with actor and profile', () => {
  const governed = createGovernedWorkspace(createOperationsWorkspace(), { actor: 'auditor1', role: 'observer' });
  executeGovernedCommand(governed, 'switchshow');
  executeGovernedCommand(governed, 'switchname denied');
  const report = exportAuditLog(governed);
  assert.equal(report.verified, true);
  assert.deepEqual(report.events.map((event) => event.decision), ['ALLOW', 'DENY']);
  assert.match(report.events[0].compatibilityProfile, /brocade-fos/);
  const tampered = structuredClone(report.events); tampered[0].actor = 'changed';
  assert.equal(verifyAuditChain(tampered), false);
});

test('all technologies expose explicit versioned learning profiles', () => {
  assert.deepEqual(Object.keys(COMPATIBILITY_PROFILES), ['brocade', 'cisco', 'iscsi']);
  Object.values(COMPATIBILITY_PROFILES).forEach((profile) => { assert.ok(profile.version); assert.match(profile.disclaimer, /production|validate/i); });
});
