---
title: Write-Ahead Log (WAL)
description: How the Write-Ahead Log provides crash safety — and why every major database uses it.
sidebar:
  order: 2
  badge:
    text: Core
    variant: tip
lastUpdated: 2026-08-28
---

The write-ahead log (WAL) is an ordered durability record. It lets a system make a small sequential record persistent before updating larger, scattered data structures.

**Core rule:** the log record describing a change must become durable before the data page or structure it protects is allowed to become durable.

## The guarantee

> After a successful durable commit, recovery must have enough valid log information to redo the committed change. Uncommitted work must be ignored or undone according to the recovery design.

## Write path

1. Assign an ordered log sequence number (LSN).
2. Append redo information, and sometimes undo information, to the WAL buffer.
3. Flush through the commit record to stable storage.
4. Acknowledge the durable commit.
5. Write dirty data pages later; their page LSN records which log state they contain.

Group commit can flush records for multiple transactions together, reducing sync overhead while preserving ordering.

## Recovery sequence

```text
last checkpoint
  → analyze log and transaction state
  → redo changes that may be missing from data pages
  → undo or ignore incomplete work, depending on the algorithm
  → establish a new consistent recovery point
```

A checkpoint does not necessarily flush every page. It establishes a bounded place from which recovery can reason about outstanding work.

## Minimal teaching simulation

```python
import json, os
from pathlib import Path
from dataclasses import dataclass, asdict

@dataclass
class WALRecord:
    lsn: int; operation: str; key: str; new_value: str

class WAL:
    def __init__(self, path="/tmp/wal.jsonl"):
        self.path = Path(path); self.lsn = 0

    def append(self, record: WALRecord) -> int:
        self.lsn += 1; record.lsn = self.lsn
        with open(self.path, "a") as f:
            f.write(json.dumps(asdict(record)) + "\n")
            f.flush()
            os.fsync(f.fileno())  # force to physical disk
        return self.lsn
```

The example demonstrates ordered append and a durability call. A production WAL also needs checksums, torn-write handling, segment management, transaction boundaries, replay idempotence, checkpoint coordination, and rules for log truncation.

## Production implementations

| System | WAL | Default fsync |
|---|---|---|
| PostgreSQL | pg_wal/ | every commit |
| MySQL InnoDB | ib_logfile | every commit |
| RocksDB | .log files | configurable |
| Kafka | log segments | configurable |

These systems use different recovery and acknowledgment models; the table identifies their durable-log family, not identical semantics.

## Failure modes and operational checks

| Risk | Why it matters | Check |
|---|---|---|
| Lost or reordered flush | acknowledged work may disappear | validate storage cache and flush semantics |
| Torn/corrupt record | replay cannot trust the log tail | checksums, record framing, redundant media |
| Log device saturation | commit latency rises for every writer | sync latency, queue depth, bandwidth headroom |
| Checkpoint lag | recovery time and retained log grow | checkpoint age and redo distance |
| Replica lag | local durability is not remote durability | commit policy and acknowledged replica position |

## Design questions

- What exact event makes a transaction durable?
- Is acknowledgment local, quorum-based, or asynchronous?
- How are partial records detected at the log tail?
- Can replay safely execute a record more than once?
- What bounds recovery time and retained log capacity?
