---
title: Write Amplification
description: Understanding write amplification — the hidden cost multiplier in SSDs, LSM trees, and distributed storage.
sidebar:
  order: 1
  badge:
    text: Core
    variant: tip
lastUpdated: 2026-08-28
---

Write amplification (WA) is the ratio between work requested by an application and work actually written by the system. It is not one phenomenon: amplification can accumulate in a database, filesystem, protection layer, and flash device before the data becomes durable.

Operate the complete stack with the [Write Amplification Explorer](/storagecraft/simulators/write-amplification/).

## Mental model

```text
application write
  → WAL / journal
  → database compaction
  → filesystem metadata or CoW
  → RAID / replication / erasure coding
  → SSD garbage collection
```

Each layer can multiply the bytes received from the layer above. End-to-end amplification is therefore approximately multiplicative, not additive.

## Definition and units

```
WAF = Physical bytes written / Logical bytes written
```

A WAF of `1.0` means the measured layer wrote exactly one physical byte per logical byte. Always state the measurement boundary: device WAF, database WAF, or end-to-end WAF are different quantities.

## Why it happens

- **Flash translation:** NAND is programmed in pages but erased in larger blocks, so garbage collection may relocate valid pages before erasure.
- **Durability:** a WAL or journal writes intent before the final structure is updated.
- **Copy-on-Write:** changed data and metadata are written to new locations.
- **LSM compaction:** sorted runs are repeatedly merged across levels.
- **Protection:** mirrors, parity, replicas, or coding fragments add physical writes.
- **Small random writes:** poor locality and low device spare area increase relocation pressure.

```python
# Measure WAF from /proc/diskstats
def measure_waf(sectors_before, sectors_after, ops_before, ops_after):
    physical_kb = ((sectors_after - sectors_before) * 512) / 1024
    logical_ops = ops_after - ops_before
    return physical_kb / logical_ops if logical_ops > 0 else 0
```

## Worked stack example

```text
database compaction     4.0×
filesystem CoW          1.3×
mirrored protection     2.0×
device garbage collect  1.5×

estimated end-to-end = 4.0 × 1.3 × 2.0 × 1.5 = 15.6×
```

This is a capacity-and-endurance model, not a latency prediction. Some writes are buffered, combined, or performed asynchronously.

## Operational signals

| Boundary | Compare | Useful evidence |
|---|---|---|
| Application → database | logical mutation bytes vs bytes flushed/compacted | engine metrics and compaction statistics |
| Host → device | host bytes written vs NAND bytes written | SMART/vendor endurance counters |
| Dataset → protection | logical data vs replica/parity/coding writes | array or distributed-storage metrics |
| End to end | acknowledged logical bytes vs all persistent writes | coordinated telemetry over the same interval |

## Reducing WAF

| Technique | System | Effect |
|---|---|---|
| Batch and align writes | Full path | Better locality and fewer partial updates |
| Over-provisioning | SSD | Less GC pressure |
| Tiered compaction | LSM | Fewer rewrites |
| Snapshot lifecycle | CoW filesystem | Releases pinned extents and reduces fragmentation |
| Larger stripe-aware writes | RAID/parity | Avoids read-modify-write where feasible |

## Failure and design questions

- Does the measurement include background work after the client is acknowledged?
- Are counters collected over the same time window and expressed in bytes?
- Is amplification caused by workload shape, free-space pressure, protection policy, or compaction policy?
- Will a mitigation trade write cost for read amplification, space amplification, latency, or recovery time?

Operate the complete model in the [Write Amplification Explorer](/storagecraft/simulators/write-amplification/).
