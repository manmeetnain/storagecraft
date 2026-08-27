---
title: Write Amplification Explorer
description: Trace cumulative write work through WAL, engines, CoW, RAID, replication, and SSD FTL.
lastUpdated: 2026-08-27
sidebar:
  order: 3
---

The Write Amplification Explorer models the multiplicative write path from an application to physical media.

<a class="sl-link-button primary" href="/storagecraft/simulators/write-amplification/index.html">Launch Write Amplification Explorer →</a>

## Layers

1. Durability log or WAL
2. Storage engine and compaction
3. Filesystem or Copy-on-Write behavior
4. RAID or erasure-protection writes
5. Replication copies
6. SSD FTL and garbage collection

The model uses **relative write-work multipliers**. That makes every assumption inspectable without falsely equating database log bytes, parity I/O operations, replica network traffic, and NAND programming.

## CLI equivalent

```bash
npm run craft -- write-path --preset lsm --logical 1
```

Available presets are `database`, `lsm`, `cow`, and `ai`. Override any factor:

```bash
npm run craft -- write-path \
  --preset database --logical 10 \
  --wal 2 --engine 1.4 --filesystem 1.2 \
  --protection 1.25 --replication 3 --ftl 1.6
```

## Measurement boundary

Preset factors are educational starting points, not universal constants. Measure logical application bytes, WAL bytes, compaction output, filesystem writes, replica traffic, block-device writes, and NAND writes at compatible time boundaries before drawing production conclusions.
