---
title: Universal RAID Planner
description: Compare standard, nested, historical, and RAID-Z capacity and failure models.
lastUpdated: 2026-08-27
sidebar:
  order: 1
---

The Universal RAID Planner compares capacity, overhead, guaranteed member-failure tolerance, layout-dependent maximum tolerance, and baseline small-write cost across major RAID families.

Choose a layout and array inputs first, then select **Calculate and compare**. Results remain hidden until requested; changing an input marks the prior calculation stale and hides it until you calculate again.

<a class="sl-link-button primary" href="/storagecraft/simulators/raid-planner/index.html">Launch Universal RAID Planner →</a>

## Supported layouts

| Family | Layouts |
|---|---|
| No redundancy | JBOD, RAID 0 |
| Mirroring | RAID 1 |
| Historical dedicated protection | RAID 2, RAID 3, RAID 4 |
| Distributed parity | RAID 5, RAID 6 |
| Nested RAID | RAID 0+1, RAID 10, RAID 50, RAID 60 |
| ZFS RAID-Z | RAID-Z1, RAID-Z2, RAID-Z3 |

RAID 2, 3, and 4 are included for completeness and education, not as default recommendations. RAID-Z capacity is presented as a simplified ceiling because real usable space depends on metadata, slop space, padding, `ashift`, record size, and allocation behavior.

## Failure tolerance requires two numbers

**Guaranteed tolerance** is the number of arbitrary member failures the layout is designed to survive. **Layout-dependent maximum** is the larger number that may survive only when failures land in different mirror pairs or parity groups.

For example, an eight-disk RAID 10 is guaranteed to survive one arbitrary disk failure. It can survive four failures only if no mirror pair loses both members.

## CLI equivalent

```bash
npm run craft -- raid --level 60 --disks 16 --size 8 --groups 2
npm run craft -- raid --compare --disks 12 --size 8 --groups 2
```

## Important boundary

RAID protects against a defined number and placement of member-device failures. It does not independently protect against deletion, application corruption, controller defects, compromised credentials, fire, flood, or loss of an entire failure domain. Maintain tested, isolated backups.
