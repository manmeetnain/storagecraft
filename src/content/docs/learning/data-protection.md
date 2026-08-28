---
title: 3. Data Protection and Recovery
description: Choose RAID, snapshots, replication, erasure coding and backup from failure, RPO and RTO requirements.
sidebar:
  order: 30
---

## Outcome

Separate availability, durability and recoverability, then choose protection mechanisms using failure domains, recovery point and recovery time.

**Level:** Foundation · **Time:** 45 minutes · **Prerequisite:** Storage Building Blocks

## Learn

| Mechanism | Primary purpose | Does not replace |
|---|---|---|
| RAID/mirroring | remain available through selected device failures | independent backup |
| Snapshot | preserve a point-in-time logical version | isolated off-system copy |
| Replication | maintain another copy, synchronously or asynchronously | versioned recovery from every corruption/operator error |
| Erasure coding | tolerate fragment loss with efficient capacity | correct placement and repair operations |
| Backup | recover independent historical copies | continuously available primary storage |

**RPO** bounds acceptable data loss in time. **RTO** bounds acceptable restoration time. Neither is proven by configuration alone; recovery must be tested.

## Practice

Use the [Universal RAID Planner](/storagecraft/simulators/raid-planner/) to compare RAID 6, RAID 10 and RAID-Z2. Then use the [Erasure Coding Lab](/storagecraft/simulators/erasure-coding/) to fail fragments at and beyond tolerance.

## Check your understanding

1. Why is a snapshot on the same failed array not an independent backup?
2. What can make a mathematically recoverable erasure-code layout operationally unsafe?
3. When might RAID 10 be preferred over a parity layout despite lower usable capacity?

## Production boundary

Capacity formulas do not predict rebuild time, correlated failure, latent corruption or workload impact. Validate vendor implementation and measured recovery behavior.

## Next step

Continue to [SAN Architecture](./san-fundamentals/).
