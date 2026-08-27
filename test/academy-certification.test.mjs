import test from 'node:test';
import assert from 'node:assert/strict';
import { CERTIFICATION_BLUEPRINT, createCertificationAttempt, recordCertificationTask, certificationSummary, certificationReport, certificationReportJson, certificationReportCsv } from '../public/lib/academy-certification.js';

test('certification requires every weighted practical domain', () => {
  const attempt = createCertificationAttempt('Manmeet Learner', 'attempt-001');
  CERTIFICATION_BLUEPRINT.slice(0, 4).forEach((task) => recordCertificationTask(attempt, task.id, 100, 'verified test evidence'));
  assert.deepEqual(certificationSummary(attempt), { completed: 4, total: 5, completionPercent: 80, weightedScore: 80, minimumDomain: 0, passed: false, status: 'IN_PROGRESS' });
});

test('pass requires weighted 80 and no domain below 60', () => {
  const attempt = createCertificationAttempt('Qualified Learner', 'attempt-002');
  CERTIFICATION_BLUEPRINT.forEach((task) => recordCertificationTask(attempt, task.id, 88, `${task.id} evidence`));
  assert.equal(certificationSummary(attempt).status, 'PASSED');
  recordCertificationTask(attempt, 'governance', 59, 'denied-command audit evidence');
  assert.equal(certificationSummary(attempt).status, 'NOT_PASSED');
});

test('report embeds issuer, compatibility, audit evidence and stable exports', () => {
  const attempt = createCertificationAttempt('Report Learner', 'attempt-003');
  const context = { generatedAt: '2026-08-27T12:00:00.000Z', auditVerified: true, compatibilityProfiles: ['brocade-fos-9.2-learning'] };
  const report = certificationReport(attempt, context);
  assert.match(report.issuer, /Manmeet Nain \(@manmeetnain\)/);
  assert.equal(report.auditVerified, true);
  assert.equal(JSON.parse(certificationReportJson(attempt, context)).attemptId, 'attempt-003');
  assert.match(certificationReportCsv(attempt, context), /task_id.*weight.*score/);
});
