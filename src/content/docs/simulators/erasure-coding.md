---
title: Erasure Coding Lab
description: Configure k+m codes, fail fragments, model repair, and compare replication overhead.
lastUpdated: 2026-08-27
sidebar:
  order: 2
---

The Erasure Coding Lab models a vendor-neutral `k + m` code: `k` data fragments and `m` independent coding fragments.

<a class="sl-link-button primary" href="/storagecraft/simulators/erasure-coding/index.html">Launch Erasure Coding Lab →</a>

It shows:

- capacity efficiency and physical overhead;
- recoverability as fragments fail;
- stripe data and stored width;
- a transparent repair-read baseline;
- capacity saved compared with configurable replication.

## CLI equivalent

```bash
npm run craft -- erasure \
  --data 10 --parity 4 \
  --dataset 100 --failures 2 \
  --fragment-size 64 --replicas 3
```

## Interpretation boundary

Real reconstruction traffic depends on code family, fragment placement, locality, implementation, and whether multiple missing fragments are decoded together. Durability also depends on correlated failure domains, detection latency, and repair completion time.
