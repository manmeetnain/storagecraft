---
title: Write-Ahead Log (WAL)
description: How the Write-Ahead Log provides crash safety — and why every major database uses it.
sidebar:
  order: 2
  badge:
    text: Core
    variant: tip
lastUpdated: 2026-05-26
---

The WAL answers one question: how do you make a write **durable** without flushing your entire data structure on every operation?

**Answer:** write your *intent* first, then apply the change.

## The guarantee

> If a record exists in the WAL, it can always be replayed after a crash.

## Write path

1. Append log record to WAL
2. `fsync()` the log ← **the durability checkpoint**
3. Apply change in memory
4. Acknowledge to client

## Working Python simulation

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

## WAL in production systems

| System | WAL | Default fsync |
|---|---|---|
| PostgreSQL | pg_wal/ | every commit |
| MySQL InnoDB | ib_logfile | every commit |
| RocksDB | .log files | configurable |
| Kafka | log segments | configurable |
