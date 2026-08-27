import { ACADEMY_DEVICES, executeOperationsCommand, selectOperationsDevice } from './academy-operations.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

export function createConfigurationSafety(workspace) {
  return { workspace, checkpoints: {}, lastRun: null };
}

export function createCheckpoint(safety, name) {
  const key = String(name ?? '').trim();
  if (!/^[A-Za-z][A-Za-z0-9_.-]{0,31}$/.test(key)) throw new Error('checkpoint name must start with a letter and contain at most 32 safe characters');
  safety.checkpoints[key] = clone(safety.workspace);
  return { name: key, devices: Object.keys(safety.workspace.sessions).length };
}

export function listCheckpoints(safety) {
  return Object.keys(safety.checkpoints).sort();
}

export function rollbackCheckpoint(safety, name) {
  if (!safety.checkpoints[name]) throw new Error(`unknown checkpoint: ${name}`);
  const restored = clone(safety.checkpoints[name]);
  Object.keys(safety.workspace).forEach((key) => delete safety.workspace[key]);
  Object.assign(safety.workspace, restored);
  return { name, activeDevice: safety.workspace.activeDevice };
}

export function deleteCheckpoint(safety, name) {
  if (!safety.checkpoints[name]) throw new Error(`unknown checkpoint: ${name}`);
  delete safety.checkpoints[name];
}

export function configurationDiff(before, after) {
  const changes = [];
  walk(before, after, '', changes);
  return changes;
}

function walk(before, after, path, changes) {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object' || Array.isArray(before) || Array.isArray(after)) {
    changes.push({ path: path || '/', before: cloneValue(before), after: cloneValue(after) });
    return;
  }
  for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) walk(before[key], after[key], `${path}/${key}`, changes);
}

const cloneValue = (value) => value === undefined ? null : clone(value);

export function parseConfigurationScript(source) {
  return String(source ?? '').split(/\r?\n/).map((line, index) => ({ line: index + 1, text: line.trim() })).filter((item) => item.text && !item.text.startsWith('#')).map((item) => {
    const match = /^(?:\[([^\]]+)\]|([^:]+)::)\s*(.+)$/.exec(item.text);
    if (!match) throw new Error(`line ${item.line}: expected [device-id] command or device-id :: command`);
    const deviceId = (match[1] || match[2]).trim().toLowerCase();
    if (!ACADEMY_DEVICES[deviceId]) throw new Error(`line ${item.line}: unknown device ${deviceId}`);
    return { line: item.line, deviceId, command: match[3].trim() };
  });
}

export function runConfigurationScript(safety, source, options = {}) {
  const commands = parseConfigurationScript(source);
  const before = clone(safety.workspace);
  const beforeConfiguration = clone(configurationView(safety.workspace));
  const results = [];
  for (const item of commands) {
    selectOperationsDevice(safety.workspace, item.deviceId);
    const result = executeOperationsCommand(safety.workspace, item.command);
    results.push({ ...item, ok: result.ok, output: result.output });
    if (!result.ok && options.atomic !== false) {
      Object.keys(safety.workspace).forEach((key) => delete safety.workspace[key]);
      Object.assign(safety.workspace, before);
      safety.lastRun = { ok: false, atomic: true, rolledBack: true, results, diff: [] };
      return safety.lastRun;
    }
  }
  safety.lastRun = { ok: results.every((item) => item.ok), atomic: options.atomic !== false, rolledBack: false, results, diff: configurationDiff(beforeConfiguration, configurationView(safety.workspace)) };
  return safety.lastRun;
}

function configurationView(workspace) {
  return {
    topology: workspace.topology,
    devices: Object.fromEntries(Object.entries(workspace.sessions).map(([id, session]) => [id, session.state])),
  };
}
