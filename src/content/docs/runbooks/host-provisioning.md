---
title: Host-to-storage provisioning
description: Plan, implement, and validate a redundant SAN attachment.
---

## Outcome

Connect one host to the intended storage volume through independently verified paths with an auditable mapping.

## Inputs

Approved host name and owners, WWPNs or IQNs, array ports, fabric membership, volume and host-group names, capacity, operating-system multipath policy, change window, and rollback owner.

## Procedure

1. Validate identifiers from two sources; never copy an unverified WWPN or IQN into policy.
2. Draw the intended paths: host port → switch/fabric or IP network → target port → volume.
3. Create narrow single-initiator/single-target zones or the approved site equivalent on each independent fabric.
4. Activate according to site policy and confirm effective—not merely defined—membership.
5. Map/mask the volume on the array to the correct host identity.
6. Rescan the host, confirm one logical device, and verify the expected number and state of paths.
7. Test controlled path loss during the approved window, then restore and verify recovery.
8. Record identifiers, effective policies, array mapping, device identity, path count, and evidence.

## Validation gates

- No unrelated initiator gains visibility.
- Both fault domains work independently.
- The host sees one device rather than duplicate unmanaged devices.
- Capacity and immutable device identity match the approved request.
- A reversible path test produces no unexpected application error.

## Production boundary

The Academy models policy and state transitions; it does not reproduce every vendor parser, licensing rule, fabric service, host driver, or array workflow. Use vendor and site procedures for execution.

## Next step

Practice the lifecycle in the [zoning module](/storagecraft/learning/zoning/) and rehearse recovery with the [change-and-rollback runbook](../change-rollback/).
