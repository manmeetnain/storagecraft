---
title: Storage Concepts Index
description: A high-level map of durability, write paths, snapshots, capacity protection, and their operational trade-offs.
sidebar:
  order: 0
  label: Start here
---

## Storage concepts, connected

Use this index when you need the right mental model quickly, then open the deep dive or operate the related lab.

| Concept | The question it answers | Primary cost | Practice |
|---|---|---|---|
| [Write Amplification](./write-amplification/) | Why does one logical write become many physical writes? | endurance, bandwidth, latency | [pipeline explorer](/storagecraft/simulators/write-amplification/) |
| [Write-Ahead Log](./write-ahead-log/) | How can a mutation become durable before the main structure is updated? | sync latency, log capacity, recovery work | inspect the write path |
| [Copy-on-Write](./copy-on-write/) | How can a system publish a new version without destroying the old one? | fragmentation, metadata writes, pinned space | reason about snapshots |
| [Erasure Coding](./erasure-coding/) | How can data survive fragment loss with less capacity than replication? | fan-out, decode, repair traffic | [failure lab](/storagecraft/simulators/erasure-coding/) |
| [RAID levels](/storagecraft/comparisons/raid-levels/) | How do disk layouts trade capacity, fault tolerance, and rebuild behavior? | usable capacity and degraded risk | [universal planner](/storagecraft/simulators/raid-planner/) |

## One write through the stack

```text
application mutation
  → WAL establishes recoverable intent
  → database/filesystem updates structures
  → CoW may publish a new version
  → RAID, replication, or erasure coding protects data
  → device firmware places and eventually reclaims media
```

The layers solve different problems and may coexist. Their costs compound, which is why StorageCraft keeps the measurement boundary visible.

## Fast diagnostic route

1. **Durability unclear?** Start with the WAL acknowledgment and recovery contract.
2. **Physical writes unexpectedly high?** Trace amplification across every layer.
3. **Snapshots consuming capacity?** Inspect CoW reachability and fragmentation.
4. **Protection looks efficient but recovery is slow?** Model degraded reads and repair domains.
5. **Choosing a layout?** Compare usable capacity, tolerated failures, and rebuild exposure together.

> Redundancy is not a backup, mathematical tolerance is not a placement policy, and an acknowledged write is only as durable as the complete flush and recovery contract.
