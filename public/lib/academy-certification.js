import { STORAGECRAFT_BRAND } from './storagecraft-brand.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const CERTIFICATION_BLUEPRINT = Object.freeze([
  { id: 'fabric-health', title: 'Fabric health investigation', weight: 20, evidence: 'Complete a vendor-profile health baseline.' },
  { id: 'fabric-resilience', title: 'Dual-fabric incident recovery', weight: 25, evidence: 'Restore a failed fabric or asymmetric FC path.' },
  { id: 'configuration-safety', title: 'Safe configuration delivery', weight: 20, evidence: 'Run an atomic multi-device script and prove rollback.' },
  { id: 'governance', title: 'RBAC and audit verification', weight: 15, evidence: 'Demonstrate a denied change and verify the audit chain.' },
  { id: 'iscsi-operations', title: 'iSCSI discovery and multipath', weight: 20, evidence: 'Establish and validate an authenticated or redundant session.' },
]);

export function createCertificationAttempt(candidate, attemptId = `academy-${new Date().toISOString().slice(0, 10)}`) {
  const name = String(candidate ?? '').trim();
  if (name.length < 2 || name.length > 80) throw new Error('candidate name must be 2-80 characters');
  return { schemaVersion: 1, attemptId, candidate: name, status: 'IN_PROGRESS', tasks: Object.fromEntries(CERTIFICATION_BLUEPRINT.map((task) => [task.id, { score: null, evidence: null, completed: false }])) };
}

export function recordCertificationTask(attempt, taskId, score, evidence) {
  const task = CERTIFICATION_BLUEPRINT.find((item) => item.id === taskId);
  if (!task) throw new Error(`unknown certification task: ${taskId}`);
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('task score must be 0-100');
  if (!String(evidence ?? '').trim()) throw new Error('task evidence is required');
  attempt.tasks[taskId] = { score: Math.round(score), evidence: String(evidence).trim(), completed: true };
  return certificationSummary(attempt);
}

export function certificationSummary(attempt) {
  const completed = CERTIFICATION_BLUEPRINT.filter((task) => attempt.tasks[task.id].completed);
  const weightedScore = Math.round(CERTIFICATION_BLUEPRINT.reduce((sum, task) => sum + (attempt.tasks[task.id].score ?? 0) * task.weight / 100, 0));
  const allComplete = completed.length === CERTIFICATION_BLUEPRINT.length;
  const minimumDomain = allComplete ? Math.min(...CERTIFICATION_BLUEPRINT.map((task) => attempt.tasks[task.id].score)) : 0;
  const passed = allComplete && weightedScore >= 80 && minimumDomain >= 60;
  attempt.status = allComplete ? passed ? 'PASSED' : 'NOT_PASSED' : 'IN_PROGRESS';
  return { completed: completed.length, total: CERTIFICATION_BLUEPRINT.length, completionPercent: Math.round(completed.length / CERTIFICATION_BLUEPRINT.length * 100), weightedScore, minimumDomain, passed, status: attempt.status };
}

export function certificationReport(attempt, context = {}) {
  const summary = certificationSummary(attempt);
  return { reportType: 'Storage Network Academy Practical Assessment', issuer: `${STORAGECRAFT_BRAND.productName} by ${STORAGECRAFT_BRAND.creatorName} (${STORAGECRAFT_BRAND.creatorHandle})`, repository: STORAGECRAFT_BRAND.repositoryUrl, generatedAt: context.generatedAt || new Date().toISOString(), ...clone(attempt), summary, blueprint: clone(CERTIFICATION_BLUEPRINT), auditVerified: context.auditVerified === true, compatibilityProfiles: clone(context.compatibilityProfiles || []) };
}

export function certificationReportJson(attempt, context = {}) {
  return JSON.stringify(certificationReport(attempt, context), null, 2);
}

export function certificationReportCsv(attempt, context = {}) {
  const report = certificationReport(attempt, context);
  const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = [['task_id', 'task', 'weight', 'score', 'completed', 'evidence'], ...report.blueprint.map((task) => [task.id, task.title, task.weight, report.tasks[task.id].score ?? '', report.tasks[task.id].completed, report.tasks[task.id].evidence ?? ''])];
  return [`# ${report.reportType}`, `# candidate,${quote(report.candidate)}`, `# status,${report.summary.status}`, ...rows.map((row) => row.map(quote).join(','))].join('\n');
}
