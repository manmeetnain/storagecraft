---
title: GPU Memory Planner
description: Size LLM weights, KV cache, runtime workspace, tensor parallelism, and concurrency per GPU.
lastUpdated: 2026-08-27
sidebar:
  order: 5
---

The GPU Memory Planner tests whether an LLM inference configuration fits at the **per-GPU allocation boundary**.

<a class="sl-link-button primary" href="/storagecraft/simulators/gpu-memory/index.html">Launch GPU Memory Planner →</a>

## Model

```text
weight bytes = parameters × bits / 8 × metadata overhead
KV bytes/request = 2 × layers × KV heads × head dimension × tokens × bytes/element
required/GPU = sharded weights + sharded KV + activations + runtime workspace
usable/GPU = physical memory × (1 − operational reserve)
```

Grouped-query and multi-query attention use fewer KV heads than query heads. Enter the actual number of **KV heads**.

## CLI

```bash
npm run craft -- gpu-plan \
  --preset llama70 --weight-bits 4 \
  --gpus 1 --gpu-memory 80 \
  --tokens 8192 --concurrency 8 \
  --kv-bytes 2 --reserve 10
```

Presets are architectural examples, not promises that one named model or serving engine will have identical resident memory.

## Validate before deployment

Quantization scales and zero points, tied or duplicated embeddings, CUDA graphs, attention workspaces, communication buffers, allocator fragmentation, prefill peaks, framework reservations, and the tensor-parallel implementation all affect actual memory. Measure model-load residency and sustained serving peaks on the target stack.
