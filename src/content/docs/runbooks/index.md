---
title: Operations runbooks
description: Safe, vendor-aware procedures for common storage and SAN work.
---

Runbooks turn concepts into repeatable work. Use the simulator first; use approved site procedures, maintenance windows, peer review, and vendor documentation in production.

| Runbook | Use it when | Primary output |
|---|---|---|
| [Daily health check](daily-health-check/) | Starting a shift or validating stability | Time-stamped health evidence |
| [Host provisioning](host-provisioning/) | Connecting a new host to storage | Validated redundant data path |
| [Incident triage](incident-triage/) | I/O is slow, missing, or unavailable | Bounded fault domain and timeline |
| [Change and rollback](change-rollback/) | Modifying zoning or connectivity | Reviewed change with tested reversal |

## Operating principles

1. Capture state before changing it.
2. Prove the fault domain layer by layer.
3. Change one controlled variable at a time.
4. Define success and rollback before execution.
5. Preserve evidence and record timestamps.

## Practice safely

Open the [Storage Network Academy](/storagecraft/simulators/network-academy/) and use Learn, Practice, Challenge, then Assess mode before applying a runbook to real infrastructure.
