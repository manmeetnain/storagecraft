import { createAcademySession, executeAcademyCommand, academyPrompt } from './network-academy-engine.js?v=academy-20260828-2';
import { createDualFabricTopology, setFabricState, topologyHealth } from './academy-topology.js?v=academy-20260828-2';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const ACADEMY_DEVICES = Object.freeze({
  'brocade-a1': { label: 'FC-A1', profile: 'brocade', fabric: 'A' },
  'cisco-a2': { label: 'MDS-A2', profile: 'cisco', fabric: 'A' },
  'brocade-b1': { label: 'FC-B1', profile: 'brocade', fabric: 'B' },
  'cisco-b2': { label: 'MDS-B2', profile: 'cisco', fabric: 'B' },
  'iscsi-gw1': { label: 'ISCSI-GW1', profile: 'iscsi', fabric: 'IP' },
});

export const OPERATIONS_INCIDENTS = Object.freeze([
  { id: 'fabric-a-loss', title: 'Complete Fabric A path loss', brief: 'Fabric A is unavailable. Prove Fabric B preserves access, restore A, and verify redundancy.' },
  { id: 'cross-switch-crc', title: 'Cross-switch CRC escalation', brief: 'FC-A1 port 0 reports CRC and encoding errors. Diagnose, correct speed, and clear counters.' },
  { id: 'asymmetric-fc-path', title: 'Asymmetric FC host path', brief: 'MDS-B2 host-facing interface is administratively down. Restore it and confirm the dual-fabric topology.' },
]);

export function createOperationsWorkspace() {
  const sessions = Object.fromEntries(Object.entries(ACADEMY_DEVICES).map(([id, device]) => {
    const session = createAcademySession(device.profile);
    session.state.hostname = device.label;
    return [id, session];
  }));
  return { activeDevice: 'brocade-a1', sessions, topology: createDualFabricTopology(), incident: null, transcript: [] };
}

export function selectOperationsDevice(workspace, deviceId) {
  if (!ACADEMY_DEVICES[deviceId]) throw new Error(`unknown Academy device: ${deviceId}`);
  workspace.activeDevice = deviceId;
  return { device: ACADEMY_DEVICES[deviceId], prompt: academyPrompt(workspace.sessions[deviceId]) };
}

export function executeOperationsCommand(workspace, input) {
  const command = String(input ?? '').trim();
  const lower = command.toLowerCase();
  if (lower.startsWith('use ')) {
    const selected = selectOperationsDevice(workspace, lower.slice(4));
    return { ok: true, changed: false, output: `Connected to ${selected.device.label}`, prompt: selected.prompt };
  }
  if (lower === 'terminals') {
    return { ok: true, changed: false, output: Object.entries(ACADEMY_DEVICES).map(([id, d]) => `${id === workspace.activeDevice ? '*' : ' '} ${id.padEnd(12)} ${d.label.padEnd(10)} ${d.profile} · Fabric ${d.fabric}`).join('\n'), prompt: academyPrompt(workspace.sessions[workspace.activeDevice]) };
  }
  const fabricCommand = /^fabric (fail|restore) ([ab])$/i.exec(command);
  if (fabricCommand) {
    const fabric = fabricCommand[2].toUpperCase();
    workspace.topology = setFabricState(workspace.topology, fabric, fabricCommand[1].toLowerCase() === 'fail' ? 'down' : 'up');
    const health = topologyHealth(workspace.topology);
    const result = { ok: true, changed: true, output: `Fabric ${fabric} ${health.paths[fabric] ? 'restored' : 'failed'} · ${health.state}`, prompt: academyPrompt(workspace.sessions[workspace.activeDevice]), health };
    record(workspace, command, result);
    return result;
  }
  const session = workspace.sessions[workspace.activeDevice];
  const result = executeAcademyCommand(session, command);
  record(workspace, command, result);
  return result;
}

function record(workspace, command, result) {
  workspace.transcript.push({ sequence: workspace.transcript.length + 1, deviceId: workspace.activeDevice, command, ok: result.ok, changed: result.changed });
  if (workspace.incident && !command.startsWith('incident ')) workspace.incident.commands += 1;
}

export function loadOperationsIncident(workspace, incidentId) {
  if (!OPERATIONS_INCIDENTS.some((item) => item.id === incidentId)) throw new Error(`unknown operations incident: ${incidentId}`);
  const fresh = createOperationsWorkspace();
  Object.assign(workspace, fresh);
  if (incidentId === 'fabric-a-loss') workspace.topology = setFabricState(workspace.topology, 'A', 'down');
  if (incidentId === 'cross-switch-crc') Object.assign(workspace.sessions['brocade-a1'].state.ports[0], { speed: '16', expectedSpeed: '32', crc: 422, encOut: 91 });
  if (incidentId === 'asymmetric-fc-path') Object.assign(workspace.sessions['cisco-b2'].state.interfaces['fc1/1'], { enabled: false, state: 'down' });
  workspace.incident = { id: incidentId, commands: 0, complete: false };
  return clone(OPERATIONS_INCIDENTS.find((item) => item.id === incidentId));
}

export function evaluateOperationsIncident(workspace) {
  if (!workspace.incident) throw new Error('no operations incident is active');
  const id = workspace.incident.id;
  const passed = id === 'fabric-a-loss'
    ? topologyHealth(workspace.topology).redundant
    : id === 'cross-switch-crc'
      ? workspace.sessions['brocade-a1'].state.ports[0].speed === '32' && workspace.sessions['brocade-a1'].state.ports[0].crc === 0 && workspace.sessions['brocade-a1'].state.ports[0].encOut === 0
      : workspace.sessions['cisco-b2'].state.interfaces['fc1/1'].enabled;
  workspace.incident.complete = passed;
  const score = passed ? Math.max(60, 100 - Math.max(0, workspace.incident.commands - 4) * 4) : 0;
  return { passed, score, commands: workspace.incident.commands, state: topologyHealth(workspace.topology).state };
}
