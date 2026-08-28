---
title: SAN change and rollback
description: A safety contract for zoning, fabric, and path changes.
---

## Outcome

Execute a bounded, observable change with explicit validation and a rehearsed route back to the known-good state.

## Change contract

Document purpose, exact objects, dependency map, pre-check evidence, risk, window, approver, executor, observer, success gates, abort thresholds, rollback steps, and communications.

## Procedure

1. Capture configuration and health state; verify no conflicting incident or change is active.
2. Validate every identity and confirm the intended active configuration.
3. Simulate or peer-review the exact command sequence and rollback.
4. Apply the smallest atomic change to one fault domain first where architecture permits.
5. Validate effective policy, logins, paths, application I/O, and new error-counter deltas.
6. Continue only when success gates pass; otherwise stop and roll back.
7. Capture post-change state and monitor through the declared observation window.

## Rollback triggers

Unexpected visibility, path loss beyond the intended domain, new errors, application impact, configuration mismatch, monitoring blindness, or elapsed time exceeding the safe window.

## Production boundary

Deletion and activation commands are intentionally simulated in StorageCraft. Real changes require platform-specific backups, approvals, syntax, and operational authority.

## Next step

Practice create, activate, validate, delete, and restore workflows in the [Storage Network Academy](/storagecraft/simulators/network-academy/).
