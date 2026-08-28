---
title: Copy-on-Write
description: How immutable updates enable snapshots—and create fragmentation and write amplification.
lastUpdated: 2026-08-28
sidebar:
  order: 3
---

Copy-on-Write (CoW) never overwrites a referenced block in place. An update is written elsewhere, then metadata is atomically redirected to the new version.

## Mental model

```text
old root ──→ old metadata ──→ old data
new write → new data + copied metadata path
new root ───────────────────→ new version
```

Readers following the old root see a complete old version. Readers following the published new root see a complete new version. The critical operation is publishing the root or equivalent commit record atomically.

## The update path

1. Read the metadata path to the target block.
2. Allocate a new block and write the changed data.
3. Copy and update each affected metadata node toward the root.
4. Atomically publish the new root pointer.
5. Reclaim old blocks only when no snapshot references them.

If a crash happens before the new root is published, the old tree remains valid. After publication, the new tree is authoritative.

## Why snapshots are cheap

A snapshot initially needs only another reference to the existing root. Unchanged blocks remain shared. Space grows with later divergence, not with the original logical dataset size.

Snapshots are cheap to create, not free to retain. They keep old blocks reachable, which delays reclamation and can turn deletion into metadata-heavy work.

## The hidden cost

One small logical update may create:

- a new data block;
- several new metadata blocks;
- allocation and reference-count updates;
- additional garbage-collection or defragmentation work.

This is CoW write amplification. Long-lived snapshots can also pin old extents and make free space fragmented.

## Failure and recovery behavior

| Event | Expected behavior |
|---|---|
| Crash before new root publication | old root remains authoritative |
| Crash after durable publication | new tree must be reachable and internally consistent |
| Partial child write | checksum or structural validation must reject invalid content |
| Lost reference update | space may leak or stale reachability may remain |
| Low free space | allocation and metadata updates can stall or fail |

CoW provides an atomic-update pattern, but durability still depends on write ordering, flush semantics, checksums, and recovery metadata.

## Operational signals

- free space versus actually allocatable contiguous space;
- snapshot count, age, and exclusive referenced bytes;
- data and metadata fragmentation;
- metadata/data allocation balance;
- scrub errors, checksum failures, and repair status;
- write amplification and latency as the pool fills.

## CoW versus WAL

| Property | Copy-on-Write | Write-Ahead Log |
|---|---|---|
| Commit primitive | Publish new root | Persist log record |
| Old version | Naturally retained | Recovered from log/checkpoint |
| Snapshot fit | Excellent | Requires additional structure |
| Main pressure | Fragmentation and metadata writes | Log growth and checkpoint cost |

Many production systems combine the ideas: a log protects metadata transitions while CoW structures provide versioning or snapshots.

## Where CoW fits

CoW is used in snapshotting filesystems, persistent trees, virtual-disk images, and storage arrays. Redirect-on-write is a related snapshot technique that redirects later changes while preserving the original location; implementations differ, so treat product terminology carefully.

## Engineering questions

- What is the atomic publication unit?
- How are reference counts or reachability tracked?
- What happens when free space becomes fragmented?
- Can snapshots prevent space reclamation?
- Is sequential performance hiding random physical allocation?
