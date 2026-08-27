const clone = (value) => JSON.parse(JSON.stringify(value));

export const ACADEMY_PROGRESS_KEY = 'storagecraft-academy-progress-v1';
export const ACADEMY_PROGRESS_SCHEMA = 1;
export const ACADEMY_MILESTONES = Object.freeze({ stages: 5, labs: 9, incidents: 9, certificationDomains: 5 });

export function createLearningProgress() {
  return { schemaVersion: ACADEMY_PROGRESS_SCHEMA, lastStage: 'basics', lastDevice: 'brocade-a1', lastActivity: null, stages: {}, labs: {}, incidents: {}, certification: { completed: 0, total: 5, status: 'IN_PROGRESS' } };
}

export function parseLearningProgress(serialized) {
  if (!serialized) return createLearningProgress();
  try {
    const parsed = JSON.parse(serialized);
    if (parsed.schemaVersion !== ACADEMY_PROGRESS_SCHEMA) return createLearningProgress();
    return { ...createLearningProgress(), ...parsed, stages: parsed.stages || {}, labs: parsed.labs || {}, incidents: parsed.incidents || {}, certification: { completed: 0, total: 5, status: 'IN_PROGRESS', ...(parsed.certification || {}) } };
  } catch { return createLearningProgress(); }
}

export function recordStageVisit(progress, stage, deviceId, timestamp = new Date().toISOString()) {
  progress.lastStage = stage;
  progress.lastDevice = deviceId || progress.lastDevice;
  progress.lastActivity = timestamp;
  progress.stages[stage] = true;
  return learningProgressSummary(progress);
}

export function recordLabProgress(progress, { profile, lab, step, total, title }, timestamp = new Date().toISOString()) {
  if (!profile || !Number.isInteger(lab) || !Number.isInteger(step) || !Number.isInteger(total) || total < 1) throw new Error('valid profile, lab, step, and total are required');
  const id = `${profile}:lab-${lab + 1}`;
  progress.labs[id] = { profile, lab, title, step: Math.min(step, total), total, completed: step >= total };
  progress.lastActivity = timestamp;
  return learningProgressSummary(progress);
}

export function recordIncidentProgress(progress, id, score, timestamp = new Date().toISOString()) {
  if (!id || !Number.isFinite(score) || score < 0 || score > 100) throw new Error('incident id and score from 0-100 are required');
  const prior = progress.incidents[id];
  if (!prior || score > prior.bestScore) progress.incidents[id] = { bestScore: Math.round(score), completed: true };
  progress.lastActivity = timestamp;
  return learningProgressSummary(progress);
}

export function recordCertificationProgress(progress, summary, timestamp = new Date().toISOString()) {
  progress.certification = { completed: summary.completed, total: summary.total, status: summary.status, weightedScore: summary.weightedScore };
  progress.lastActivity = timestamp;
  return learningProgressSummary(progress);
}

export function learningProgressSummary(progress) {
  const completedStages = Object.values(progress.stages).filter(Boolean).length;
  const completedLabs = Object.values(progress.labs).filter((item) => item.completed).length;
  const completedIncidents = Object.values(progress.incidents).filter((item) => item.completed).length;
  const certificationCompleted = Math.min(progress.certification.completed || 0, ACADEMY_MILESTONES.certificationDomains);
  const completed = completedStages + completedLabs + completedIncidents + certificationCompleted;
  const total = Object.values(ACADEMY_MILESTONES).reduce((sum, value) => sum + value, 0);
  const activeLab = Object.values(progress.labs).find((item) => !item.completed && item.step > 0);
  return { completed, total, percent: Math.round(completed / total * 100), completedStages, completedLabs, completedIncidents, certificationCompleted, lastStage: progress.lastStage, lastDevice: progress.lastDevice, lastActivity: progress.lastActivity, resume: activeLab ? { type: 'lab', stage: progress.lastStage, profile: activeLab.profile, lab: activeLab.lab, step: activeLab.step, label: `${activeLab.title} · command ${activeLab.step + 1}/${activeLab.total}` } : { type: 'stage', stage: progress.lastStage, label: `Continue ${progress.lastStage}` } };
}

export function exportLearningProgress(progress) { return JSON.stringify({ ...clone(progress), summary: learningProgressSummary(progress) }, null, 2); }
