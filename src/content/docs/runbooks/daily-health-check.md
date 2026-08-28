---
title: Daily SAN health check
description: A repeatable shift-start review for Fibre Channel and iSCSI paths.
---

## Outcome

Produce a short, comparable record of fabric, port, path, and event health without modifying state.

## Before you begin

Confirm the approved access method, site topology, expected redundant paths, maintenance calendar, and evidence location. All commands below are represented in the Academy; exact syntax and privileges vary by platform release.

## Procedure

1. Record time, site, operator, active maintenance, and management reachability.
2. Check switch/fabric identity, uptime, principal/domain state, and time synchronization.
3. Review switch, port, and environmental health; compare counters with the prior baseline rather than reading totals alone.
4. Confirm ISLs/trunks and expected edge ports are online at the intended speed.
5. Validate name-server logins and effective zoning for sampled critical paths.
6. Review recent events for flaps, authentication failures, credit starvation, CRC errors, and resource pressure.
7. On hosts, confirm expected FC or iSCSI sessions and healthy multipath state.
8. Classify findings: healthy, observe, investigate, or escalate. Attach command output and timestamps.

## Simulator command families

- Brocade-style: `switchshow`, `fabricshow`, `islshow`, `trunkshow`, `porterrshow`, `errdump`, `nsshow`, `zoneshow`, `cfgshow`
- Cisco-style: `show interface brief`, `show flogi database`, `show fcns database`, `show zoneset active`, `show logging log`, `show environment`
- iSCSI/host: `iscsiadm`, `multipath -ll`, session/path inspection, interface and route checks

Use the [Academy command reference](/storagecraft/simulators/academy-command-reference/) for simulated syntax.

## Stop and escalate

Escalate when redundancy is lost, error rates are increasing, a core/ISL is unstable, environmental alarms exist, or the observed topology differs from the approved design. Do not clear counters or logs before evidence is captured.

## Completion record

Record scope, commands, exceptions, trend versus baseline, ticket links, owner, and next review time.

## Next step

For an active problem, follow [incident triage](../incident-triage/). For a planned modification, use [change and rollback](../change-rollback/).
