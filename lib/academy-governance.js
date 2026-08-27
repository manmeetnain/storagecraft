import { ACADEMY_DEVICES, executeOperationsCommand } from './academy-operations.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const COMPATIBILITY_PROFILES = Object.freeze({
  brocade: { id: 'brocade-fos-9.2-learning', label: 'Brocade FOS-style 9.2', version: '9.2-learning', commandFamilies: ['fabric health', 'ports and optics', 'zoning', 'MAPS concepts'], disclaimer: 'Educational syntax profile; validate commands against the licensed FOS release and hardware.' },
  cisco: { id: 'cisco-mds-nxos-9.4-learning', label: 'Cisco MDS NX-OS-style 9.4', version: '9.4-learning', commandFamilies: ['VSAN', 'FC interfaces', 'device aliases', 'zones and zonesets'], disclaimer: 'Educational syntax profile; validate commands against the installed NX-OS release and platform.' },
  iscsi: { id: 'iscsi-rfc-learning-2026', label: 'Standards-based iSCSI 2026', version: 'RFC-learning-2026', commandFamilies: ['network', 'targets and LUNs', 'CHAP', 'sessions and multipath'], disclaimer: 'Vendor-neutral learning profile; production initiator and target tools differ.' },
});

export const ACADEMY_ROLES = Object.freeze({
  observer: { label: 'Observer', description: 'Read-only health, inventory, help, and reports.' },
  operator: { label: 'Operator', description: 'Read-only access plus approved path and interface remediation.' },
  administrator: { label: 'Administrator', description: 'Full simulated configuration authority.' },
});

const readOnly = /^(help|\?|show\b|version$|firmwareshow$|uptime$|licenseshow$|chassisshow$|fanshow$|psshow$|tempshow$|sensorshow$|switchstatus|switchshow$|fabricshow$|islshow$|trunkshow$|topologyshow$|portshow\b|portcfgshow$|porterrshow$|sfpshow\b|nsshow$|nodefind\b|alishow$|zoneshow$|cfgshow$|errshow$|errdump$|mapsdb|sessions$|multipath show$|terminals$|academy report$|report$)/i;
const operatorChange = /^(portenable|portdisable|portcfgspeed|portstatsclear|interface (up|down)|path (fail|restore)|multipath policy|fabric (fail|restore)|configure terminal$|interface fc|shutdown$|no shutdown$|switchport speed)/i;

export function commandPermission(role, command) {
  if (!ACADEMY_ROLES[role]) return { allowed: false, reason: `unknown role: ${role}` };
  if (role === 'administrator' || readOnly.test(command)) return { allowed: true, reason: role === 'administrator' ? 'administrator authority' : 'read-only command' };
  if (role === 'operator' && operatorChange.test(command)) return { allowed: true, reason: 'approved operational remediation' };
  return { allowed: false, reason: `${role} role cannot execute configuration command` };
}

export function createGovernedWorkspace(workspace, identity = {}) {
  return { workspace, actor: identity.actor || 'learner', role: identity.role || 'operator', audit: [], compatibility: Object.fromEntries(Object.entries(ACADEMY_DEVICES).map(([id, device]) => [id, COMPATIBILITY_PROFILES[device.profile].id])) };
}

export function setGovernedIdentity(governance, actor, role) {
  if (!/^[A-Za-z][A-Za-z0-9_.-]{1,31}$/.test(actor)) throw new Error('actor must be 2-32 safe characters');
  if (!ACADEMY_ROLES[role]) throw new Error(`role must be one of: ${Object.keys(ACADEMY_ROLES).join(', ')}`);
  governance.actor = actor;
  governance.role = role;
}

export function executeGovernedCommand(governance, command) {
  const permission = commandPermission(governance.role, command);
  const deviceId = governance.workspace.activeDevice;
  const result = permission.allowed ? executeOperationsCommand(governance.workspace, command) : { ok: false, changed: false, output: `RBAC DENIED · ${permission.reason}` };
  const previousHash = governance.audit.at(-1)?.hash || 'GENESIS';
  const event = { sequence: governance.audit.length + 1, actor: governance.actor, role: governance.role, deviceId, compatibilityProfile: governance.compatibility[deviceId], command, decision: permission.allowed ? 'ALLOW' : 'DENY', ok: result.ok, changed: result.changed, previousHash };
  event.hash = auditHash(event);
  governance.audit.push(event);
  return { ...result, auditEvent: clone(event) };
}

export function verifyAuditChain(events) {
  return events.every((event, index) => event.sequence === index + 1 && event.previousHash === (index ? events[index - 1].hash : 'GENESIS') && event.hash === auditHash({ ...event, hash: undefined }));
}

export function exportAuditLog(governance) {
  return { schemaVersion: 1, actor: governance.actor, role: governance.role, verified: verifyAuditChain(governance.audit), events: clone(governance.audit) };
}

function auditHash(event) {
  const canonical = JSON.stringify(Object.fromEntries(Object.entries(event).filter(([key, value]) => key !== 'hash' && value !== undefined)));
  let hash = 2166136261;
  for (let index = 0; index < canonical.length; index += 1) { hash ^= canonical.charCodeAt(index); hash = Math.imul(hash, 16777619); }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
