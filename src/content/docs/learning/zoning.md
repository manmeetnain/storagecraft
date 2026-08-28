---
title: 6. Zoning and Safe Change
description: Build, validate, activate, roll back and remove FC zoning without leaving unsafe references.
sidebar:
  order: 60
---

## Outcome

Execute the complete zoning lifecycle using dependency-aware configuration, verification and rollback evidence.

**Level:** Practitioner · **Time:** 55 minutes · **Prerequisite:** Fibre Channel Fabric Operations

## Learn

```text
identify initiator + target WWPNs
→ create aliases/device aliases
→ create single-initiator zone
→ add zone to configuration/zoneset
→ validate and activate
→ verify effective state and host paths
→ save evidence and rollback plan
```

Defined configuration is not necessarily effective configuration. Deletion must run in reverse dependency order: deactivate or remove references before deleting the referenced object.

## Practice

In the [Storage Network Academy](/storagecraft/simulators/network-academy/), complete one Brocade-style and one Cisco-style zoning workflow. Run the same intended state twice and confirm the second application produces no material change. Then use undo or checkpoint rollback.

## Check your understanding

1. Why should initiator and target identity be verified from two sources?
2. What is the difference between defined and effective zoning?
3. Why is single-initiator zoning a useful default?

## Production boundary

Naming, enhanced zoning, peer zones, smart zoning, lock behavior and activation semantics vary. Follow the change policy and exact platform documentation.

## Next step

Continue to [iSCSI and Multipathing](./iscsi-multipath/).
