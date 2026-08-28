---
title: Storage incident triage
description: Evidence-first isolation for unavailable or slow storage paths.
---

## Outcome

Bound the problem to workload, host, fabric/network, target, array, or media while preserving evidence and service safety.

## First five minutes

1. Establish impact: who, what, when, scope, and whether service is unavailable or degraded.
2. Freeze unrelated changes and correlate the start time with deployments, maintenance, and alerts.
3. Confirm redundancy before touching a path.
4. Capture host paths/sessions, switch ports and events, target state, and array health with timestamps.
5. Name an incident lead, communications owner, and evidence location.

## Isolation tree

- One host affected: inspect host adapter/session, driver, queueing, multipath, and its edge ports.
- Multiple hosts on one fabric: inspect shared switch, ISL, zoning activation, or fabric service.
- One target/volume affected: inspect target port, mapping, controller, volume, and backend resources.
- Latency without errors: compare host, fabric, target, cache, and media latency; check queue depth and saturation.
- Intermittent failure: correlate counter deltas and event timestamps; do not rely on cumulative counters alone.

## Recovery discipline

Prefer the smallest reversible action supported by evidence. State the hypothesis, expected observation, abort condition, and rollback before execution. After service returns, validate every redundant path and monitor long enough to catch recurrence.

## Closeout

Record the timeline, blast radius, evidence, causal chain, restoration action, remaining risk, follow-up owner, and preventive test. Separate confirmed facts from hypotheses.

## Next step

Reproduce a comparable fault in the [SAN Failure-Domain Lab](/storagecraft/simulators/san-failure/) and complete the [operations module](/storagecraft/learning/operations/).
