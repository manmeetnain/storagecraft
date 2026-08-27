import test from 'node:test';
import assert from 'node:assert/strict';
import { ACADEMY_PROGRESS_KEY, createLearningProgress, parseLearningProgress, recordStageVisit, recordLabProgress, recordIncidentProgress, recordCertificationProgress, learningProgressSummary, exportLearningProgress } from '../public/lib/academy-progress.js';

test('new learner starts at basics with a stable storage key', () => {
  const progress = createLearningProgress();
  assert.equal(ACADEMY_PROGRESS_KEY, 'storagecraft-academy-progress-v1');
  assert.equal(learningProgressSummary(progress).completedStages, 0);
  assert.equal(learningProgressSummary(progress).lastStage, 'basics');
});

test('records a resumable lab command and completed milestone', () => {
  const progress = createLearningProgress();
  recordLabProgress(progress, { profile: 'brocade', lab: 0, step: 3, total: 24, title: 'Complete fabric health check' }, '2026-08-27T10:00:00Z');
  assert.deepEqual(learningProgressSummary(progress).resume, { type: 'lab', stage: 'basics', profile: 'brocade', lab: 0, step: 3, label: 'Complete fabric health check · command 4/24' });
  recordLabProgress(progress, { profile: 'brocade', lab: 0, step: 24, total: 24, title: 'Complete fabric health check' });
  assert.equal(learningProgressSummary(progress).completedLabs, 1);
});

test('retains best incident score and certification status', () => {
  const progress = createLearningProgress();
  recordIncidentProgress(progress, 'fabric-a-loss', 84);
  recordIncidentProgress(progress, 'fabric-a-loss', 70);
  recordCertificationProgress(progress, { completed: 3, total: 5, status: 'IN_PROGRESS', weightedScore: 51 });
  const summary = learningProgressSummary(progress);
  assert.equal(progress.incidents['fabric-a-loss'].bestScore, 84);
  assert.equal(summary.completedIncidents, 1);
  assert.equal(summary.certificationCompleted, 3);
});

test('parsing recovers safely from invalid or future data', () => {
  assert.equal(parseLearningProgress('{bad').lastStage, 'basics');
  assert.equal(parseLearningProgress(JSON.stringify({ schemaVersion: 999, lastStage: 'certify' })).lastStage, 'basics');
  const progress = createLearningProgress(); recordStageVisit(progress, 'fabric', 'cisco-a2', '2026-08-27T11:00:00Z');
  assert.equal(JSON.parse(exportLearningProgress(progress)).summary.lastDevice, 'cisco-a2');
});
