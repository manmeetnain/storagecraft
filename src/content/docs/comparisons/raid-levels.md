---
title: RAID Levels Compared
description: A rigorous guide to standard, nested, historical, and RAID-Z layouts.
lastUpdated: 2026-08-27
sidebar:
  order: 1
---

RAID levels are data-placement contracts. Each contract changes usable capacity, I/O behavior, recovery work, and the combinations of member failures that remain survivable.

Use the [Universal RAID Planner](/storagecraft/simulators/raid-planner/) to evaluate a specific disk count and capacity.

## At a glance

Assume `N` equal-sized members of capacity `S`. These formulas are simplified capacity ceilings before filesystems, metadata, spares, and vendor reservations.

| Layout | Minimum | Usable ceiling | Guaranteed member failures | Core trade-off |
|---|---:|---:|---:|---|
| JBOD | 1 | `N × S` | 0 | Capacity aggregation without RAID protection |
| RAID 0 | 2 | `N × S` | 0 | Maximum striping efficiency; no redundancy |
| RAID 1 | 2 | `1 × S` | `N − 1` | Complete copies on every mirror member |
| RAID 2 | 3 | Hamming-layout dependent | 1 | Historical bit-level error correction |
| RAID 3 | 3 | `(N − 1) × S` | 1 | Byte striping, dedicated parity bottleneck |
| RAID 4 | 3 | `(N − 1) × S` | 1 | Block striping, dedicated parity bottleneck |
| RAID 5 | 3 | `(N − 1) × S` | 1 | Efficient distributed single parity |
| RAID 6 | 4 | `(N − 2) × S` | 2 | Dual parity for greater rebuild protection |
| RAID 0+1 | 4, even | `(N / 2) × S` | 1 | Mirror of stripes; failures can disable a whole side |
| RAID 10 | 4, even | `(N / 2) × S` | 1 | Stripe of mirrors; strong random I/O behavior |
| RAID 50 | 6 | `(N − groups) × S` | 1 | Stripe across RAID 5 groups |
| RAID 60 | 8 | `(N − 2 × groups) × S` | 2 | Stripe across RAID 6 groups |
| RAID-Z1 | 3 | roughly `(N − 1) × S` | 1 | ZFS variable-stripe single parity |
| RAID-Z2 | 4 | roughly `(N − 2) × S` | 2 | ZFS variable-stripe dual parity |
| RAID-Z3 | 5 | roughly `(N − 3) × S` | 3 | ZFS variable-stripe triple parity |

## RAID 0: striping

Blocks are distributed across all members. Parallel access can increase throughput, but there is no redundant information. Any member loss can make the stripe set incomplete.

Use only where data can be regenerated or protection exists at another layer and the failure consequences are accepted explicitly.

## RAID 1: mirroring

Every mirror member contains the full logical dataset. An `N`-way RAID 1 therefore has the usable capacity of one member—not automatically half of raw capacity. Half capacity describes a two-way mirror or the paired mirrors inside RAID 10.

Reads may be serviced from multiple copies. Writes must reach every required copy according to the controller's completion policy.

## RAID 2, 3, and 4

These levels explain the evolution of array design but are rare in modern general-purpose deployments.

- **RAID 2** stripes at bit level and uses dedicated Hamming-code members.
- **RAID 3** stripes at byte level with one dedicated parity member.
- **RAID 4** stripes at block level with one dedicated parity member.

Dedicated parity concentrates write activity and can bottleneck small independent writes. RAID 5 distributes parity to reduce that concentration.

## RAID 5 and RAID 6

RAID 5 distributes one parity block per stripe. RAID 6 distributes two independent protection values per stripe.

For a small RAID 5 update, the classic read-modify-write path is:

1. Read old data.
2. Read old parity.
3. Compute the change.
4. Write new data.
5. Write new parity.

That creates a baseline four-I/O small-write penalty. RAID 6 commonly has a six-I/O baseline because two parity values must change. Full-stripe writes, caching, nonvolatile buffers, controller coalescing, and implementation details alter observed behavior.

## RAID 0+1 versus RAID 10

The names contain the construction order.

- **RAID 0+1:** build striped sets, then mirror those sets.
- **RAID 10 or 1+0:** build mirror pairs, then stripe across the pairs.

Both usually provide 50% capacity efficiency. RAID 10 isolates failures within mirror pairs and normally offers more flexible multi-failure survival. Neither guarantees survival beyond one arbitrary member loss: placement matters.

## RAID 50 and RAID 60

Nested parity arrays create multiple independent RAID groups and stripe across them.

For `G` equal groups:

```text
RAID 50 usable = (N − G) × S
RAID 60 usable = (N − 2G) × S
```

RAID 50 guarantees one arbitrary member failure. Additional failures survive only when no group loses more than one member. RAID 60 guarantees two arbitrary member failures; more survive only when each group remains within its two-member tolerance.

Group width affects efficiency, parallelism, rebuild exposure, and correlated-failure risk. Capacity alone cannot select it.

## RAID-Z is related, not identical

RAID-Z uses dynamic or variable-width stripes within ZFS's transactional, checksummed storage model. It avoids the traditional RAID 5 write hole through its consistency design, but usable capacity cannot be predicted perfectly by subtracting parity members alone.

Practical capacity depends on:

- pool metadata and slop space;
- `ashift` and sector alignment;
- record size and compression;
- padding and allocation shape;
- vdev topology;
- snapshots and copy-on-write behavior.

## Vendor names and nonstandard layouts

Some products expose names such as distributed RAID, declustered RAID, Dynamic Disk Pools, RAID-TEC, RAID-ADG, SHR, or proprietary erasure codes. Map these to their actual placement, parity, spare-capacity, and failure-domain rules before comparing them. A familiar marketing label does not make the standard formula authoritative.

## Selection checklist

1. Define the required failure domains—not only the disk count.
2. Establish rebuild or reconstruction time objectives under foreground load.
3. Measure read/write mix, I/O size, sequentiality, queue depth, and latency target.
4. Include hot or distributed spare capacity.
5. Model the smallest member size and real formatting units.
6. Assess uncorrectable read errors and latent-sector detection.
7. Verify controller cache and power-loss behavior.
8. Maintain isolated, restorable backups.
9. Test degraded performance and rebuild throttling.
10. Validate vendor-specific limits and implementation semantics.
