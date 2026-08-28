---
title: 4. SAN Architecture
description: Trace a redundant host-to-storage path through initiators, switches, targets, controllers and LUN mappings.
sidebar:
  order: 40
---

## Outcome

Draw a host-to-LUN path, identify every component and distinguish connectivity from redundancy and application availability.

**Level:** Foundation · **Time:** 45 minutes · **Prerequisite:** Data Protection and Recovery

## Learn

```text
host HBA A → fabric A switch → target port/controller A ┐
                                                       ├→ mapped LUN
host HBA B → fabric B switch → target port/controller B ┘
                         ↑
                   multipath policy
```

An **initiator** starts I/O. A **target** receives it. A fabric transports frames but does not create a LUN mapping. Zoning controls fabric visibility; array masking/mapping controls which initiator may access which LUN. Both must be correct.

Dual fabrics should avoid shared switches and inter-fabric dependencies. A surviving path is not sufficient if failover exceeds the application's timeout.

## Practice

Open the [SAN Failure-Domain Lab](/storagecraft/simulators/san-failure/). Fail one component at a time, then fail correlated components. Record reachability, redundancy and recovery-time results separately.

## Check your understanding

1. Why can a host see a target port but not its LUN?
2. What is the difference between reachable and redundant?
3. Which shared component could defeat an apparently dual-path design?

## Production boundary

Real designs depend on host drivers, array ownership, ALUA behavior, timeouts, queueing, fabric policy and tested failover sequences.

## Next step

Continue to [Fibre Channel Fabric Operations](./fc-fabric/).
