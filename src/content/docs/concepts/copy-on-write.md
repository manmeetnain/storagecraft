---
title: Copy-on-Write
description: How immutable updates enable snapshots—and create fragmentation and write amplification.
lastUpdated: 2026-08-27
sidebar:
  order: 3
---

Copy-on-Write (CoW) never overwrites a referenced block in place. An update is written elsewhere, then metadata is atomically redirected to the new version.

## The update path

1. Read the metadata path to the target block.
2. Allocate a new block and write the changed data.
3. Copy and update each affected metadata node toward the root.
4. Atomically publish the new root pointer.
5. Reclaim old blocks only when no snapshot references them.

If a crash happens before the new root is published, the old tree remains valid. After publication, the new tree is authoritative.

## Why snapshots are cheap

A snapshot initially needs only another reference to the existing root. Unchanged blocks remain shared. Space grows with later divergence, not with the original logical dataset size.

## The hidden cost

One small logical update may create:

- a new data block;
- several new metadata blocks;
- allocation and reference-count updates;
- additional garbage-collection or defragmentation work.

This is CoW write amplification. Long-lived snapshots can also pin old extents and make free space fragmented.

## CoW versus WAL

| Property | Copy-on-Write | Write-Ahead Log |
|---|---|---|
| Commit primitive | Publish new root | Persist log record |
| Old version | Naturally retained | Recovered from log/checkpoint |
| Snapshot fit | Excellent | Requires additional structure |
| Main pressure | Fragmentation and metadata writes | Log growth and checkpoint cost |

Many production systems combine the ideas: a log protects metadata transitions while CoW structures provide versioning or snapshots.

## Engineering questions

- What is the atomic publication unit?
- How are reference counts or reachability tracked?
- What happens when free space becomes fragmented?
- Can snapshots prevent space reclamation?
- Is sequential performance hiding random physical allocation?
