---
title: AI Data Path Lab
description: Find bandwidth bottlenecks across training ingest, checkpoint writes, and model cold loads.
lastUpdated: 2026-08-27
sidebar:
  order: 7
---

The AI Data Path Lab connects storage performance to AI job behavior. It models three paths independently: steady-state training ingest, checkpoint persistence, and model cold loading.

<a class="sl-link-button primary" href="/storagecraft/simulators/ai-data-path/index.html">Launch AI Data Path Lab →</a>

## Training path

```text
effective throughput = min(object read, fabric, preprocessing, trainer ingest)
pass time = dataset × epochs / effective throughput
```

The stage with the lowest sustained throughput is highlighted as the bottleneck. Accelerating another stage does not reduce pass time until the bottleneck moves.

## Checkpoint and cold-load paths

```text
checkpoint bandwidth = min(checkpoint writer, fabric)
model-load bandwidth = min(model reader, fabric, GPU loader)
duration = payload / effective bandwidth
```

## CLI

```bash
npm run craft -- ai-path \
  --dataset 100 --epochs 1 \
  --object-read 5000 --fabric 12500 \
  --preprocess 8000 --trainer 6000 \
  --checkpoint-size 500 --checkpoint-write 4000 \
  --model-size 140 --model-read 7000 --gpu-load 12000
```

This is a deterministic bandwidth ceiling, not a benchmark. Validate with representative formats, file counts, cache state, concurrency, queue depth, topology, preprocessing code, and tail-latency objectives.
