---
title: 8. Operations and Incident Response
description: Run repeatable health checks, isolate failure domains, remediate safely and produce an evidence-rich handoff.
sidebar:
  order: 80
---

## Outcome

Move from symptom to scoped evidence, hypothesis, safe action, verification and handoff without destructive guessing.

**Level:** Practitioner · **Time:** 60 minutes · **Prerequisite:** modules 1–7

## Learn

```text
stabilize → define impact → establish timeline → inspect full path
→ compare healthy peer → form hypothesis → make smallest safe change
→ verify service + redundancy → preserve evidence → hand off
```

Always distinguish data-plane health, control-plane/configuration state and management-plane access. A management timeout does not prove I/O loss; a surviving I/O path does not prove redundancy.

## Practice

Complete the [daily health-check runbook](/storagecraft/runbooks/daily-health-check/), then use three Academy incidents: port shutdown, inactive zoning and iSCSI authentication. Record commands, observations, rejected hypotheses and final verification.

## Check your understanding

1. Why should you compare against a healthy peer or baseline?
2. What verification is required after service is restored?
3. When should an operator stop and escalate rather than continue changing state?

## Production boundary

Incident authority, evidence retention and change approval are organization-specific. Never copy lab remediation directly into production without scope, backups and rollback.

## Next step

Review the [incident triage](/storagecraft/runbooks/incident-triage/) and [change rollback](/storagecraft/runbooks/change-rollback/) runbooks, then attempt the [Practical Assessment](./assessment/).
