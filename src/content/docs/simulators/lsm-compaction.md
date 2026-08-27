---
title: LSM-Tree Compaction Lab
description: Compare leveled and tiered compaction across write, read, and space amplification.
lastUpdated: 2026-08-27
sidebar:
  order: 4
---

The LSM-Tree Compaction Lab exposes the central policy trade-off: leveled compaction generally reduces read and space amplification by rewriting more data, while tiered or universal compaction reduces write amplification at the cost of more runs and temporary space.

<a class="sl-link-button primary" href="/storagecraft/simulators/lsm-compaction/index.html">Launch LSM-Tree Compaction Lab →</a>

## CLI

```bash
npm run craft -- lsm \
  --policy leveled --dataset 500 \
  --memtable 512 --ratio 10 \
  --l0-files 4 --bandwidth 500
```

The educational leveled estimate follows the worked RocksDB model: L0 flush contributes one write, L0→L1 approximately two, and later levels can approach the size-ratio cost. Tiered compaction uses a one-write-per-level idealization.

## Sources and boundaries

- [RocksDB Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)
- [RocksDB Tuning Guide](https://github.com/facebook/rocksdb/wiki/RocksDB-Tuning-Guide)
- [RocksDB Universal Compaction](https://github.com/facebook/rocksdb/wiki/Universal-Compaction)
- [Monkey: Optimal Navigable Key-Value Store](https://nivdayan.github.io/monkeykeyvaluestore.pdf)

Observed amplification changes with key-range overlap, workload skew, updates and deletes, compression, trivial moves, compaction picking, subcompaction, stalls, and the database implementation. Treat the result as a transparent planning estimate and compare it with engine statistics.
